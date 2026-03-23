import {
  Controller,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@asset-mgmt/shared-types';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('blockchain')
@ApiBearerAuth()
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('mint/:assetId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mint an asset NFT (Admin only)' })
  async mint(@Param('assetId') assetId: string) {
    const txHash = await this.blockchainService.mintAsset(assetId);
    return {
      success: true,
      message: 'Tokenization transaction submitted',
      txHash,
    };
  }
}
