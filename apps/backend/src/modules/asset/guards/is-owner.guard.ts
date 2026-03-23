import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AssetService } from '../asset.service';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(private readonly assetService: AssetService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const assetId = request.params.id;

    if (!user || !assetId) {
      return false;
    }

    const asset = await this.assetService.findOne(assetId);
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${assetId} not found`);
    }

    if (asset.ownerId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to access this asset',
      );
    }

    // Attach asset to request to avoid re-querying in the controller/service
    request.asset = asset;
    return true;
  }
}
