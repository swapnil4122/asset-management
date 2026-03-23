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
import { ApproveVerificationDto } from './dto/approve-verification.dto';
import { RejectVerificationDto } from './dto/reject-verification.dto';
import { AssetStatus, VerificationStatus } from '@asset-mgmt/shared-types';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(VerificationRequest)
    private readonly verificationRepository: Repository<VerificationRequest>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    private readonly notificationService: NotificationService,
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

  async getPendingRequests(): Promise<VerificationRequest[]> {
    return this.verificationRepository.find({
      where: { status: VerificationStatus.PENDING },
      relations: ['asset', 'requestedBy'],
    });
  }

  async approveRequest(
    id: string,
    verifierId: string,
    approveDto: ApproveVerificationDto,
  ): Promise<VerificationRequest> {
    const request = await this.verificationRepository.findOne({
      where: { id },
      relations: ['asset'],
    });

    if (!request) {
      throw new NotFoundException(
        `Verification request with ID ${id} not found`,
      );
    }

    if (request.status !== VerificationStatus.PENDING) {
      throw new BadRequestException(
        `Request already in status: ${request.status}`,
      );
    }

    // Update request
    request.status = VerificationStatus.APPROVED;
    request.reviewedById = verifierId;
    request.reviewedAt = new Date();
    if (approveDto.notes) {
      request.notes = approveDto.notes;
    }

    // Update asset
    const asset = request.asset;
    asset.status = AssetStatus.VERIFIED;
    await this.assetRepository.save(asset);

    const savedRequest = await this.verificationRepository.save(request);

    // Notify user
    await this.notificationService.notify(
      request.requestedById,
      'Asset Verified',
      `Your asset "${asset.name}" has been successfully verified.`,
    );

    return savedRequest;
  }

  async rejectRequest(
    id: string,
    verifierId: string,
    rejectDto: RejectVerificationDto,
  ): Promise<VerificationRequest> {
    const request = await this.verificationRepository.findOne({
      where: { id },
      relations: ['asset'],
    });

    if (!request) {
      throw new NotFoundException(
        `Verification request with ID ${id} not found`,
      );
    }

    if (request.status !== VerificationStatus.PENDING) {
      throw new BadRequestException(
        `Request already in status: ${request.status}`,
      );
    }

    // Update request
    request.status = VerificationStatus.REJECTED;
    request.reviewedById = verifierId;
    request.reviewedAt = new Date();
    request.rejectionReason = rejectDto.reason;

    // Update asset
    const asset = request.asset;
    asset.status = AssetStatus.REJECTED;
    await this.assetRepository.save(asset);

    const savedRequest = await this.verificationRepository.save(request);

    // Notify user
    await this.notificationService.notify(
      request.requestedById,
      'Asset Verification Rejected',
      `Your asset "${asset.name}" verification was rejected. Reason: ${rejectDto.reason}`,
    );

    return savedRequest;
  }
}
