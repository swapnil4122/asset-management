import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationRequest } from './entity/verification-request.entity';
import { Asset } from '../asset/entity/asset.entity';
import { CreateVerificationRequestDto } from './dto/create-verification-request.dto';
import { AssetStatus, VerificationStatus } from '@asset-mgmt/shared-types';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(VerificationRequest)
    private readonly verificationRepository: Repository<VerificationRequest>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async create(
    createDto: CreateVerificationRequestDto,
    userId: string,
  ): Promise<VerificationRequest> {
    const asset = await this.assetRepository.findOne({
      where: { id: createDto.assetId },
    });

    if (!asset) {
      throw new NotFoundException(
        `Asset with ID ${createDto.assetId} not found`,
      );
    }

    if (asset.ownerId !== userId) {
      throw new ForbiddenException(
        'Only the asset owner can submit a verification request',
      );
    }

    if (asset.status !== AssetStatus.PENDING) {
      throw new BadRequestException(
        `Asset cannot be verified in current status: ${asset.status}`,
      );
    }

    // Create verification request
    const request = this.verificationRepository.create({
      assetId: asset.id,
      requestedById: userId,
      status: VerificationStatus.PENDING,
      notes: createDto.notes || null,
      documents: createDto.documentUrls || [],
    });

    // Update asset status
    asset.status = AssetStatus.IN_REVIEW;
    await this.assetRepository.save(asset);

    return this.verificationRepository.save(request);
  }

  async findAll(): Promise<VerificationRequest[]> {
    return this.verificationRepository.find({
      relations: ['asset', 'requestedBy'],
    });
  }

  async findByAssetId(assetId: string): Promise<VerificationRequest[]> {
    return this.verificationRepository.find({ where: { assetId } });
  }
}
