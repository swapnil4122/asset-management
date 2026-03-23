import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './entity/asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetStatus } from '@asset-mgmt/shared-types';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto, ownerId: string): Promise<Asset> {
    const asset = this.assetRepository.create({
      ...createAssetDto,
      ownerId,
      status: AssetStatus.PENDING,
    });
    return this.assetRepository.save(asset);
  }

  async findAll(
    pagination: PaginationDto,
    ownerId?: string,
  ): Promise<{ items: Asset[]; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const query = this.assetRepository.createQueryBuilder('asset');

    if (ownerId) {
      query.where('asset.ownerId = :ownerId', { ownerId });
    } else {
      query.where('asset.status NOT IN (:...statuses)', {
        statuses: [AssetStatus.PENDING, AssetStatus.REJECTED],
      });
    }

    const [items, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('asset.createdAt', 'DESC')
      .getManyAndCount();

    return { items, total };
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    return asset;
  }

  async update(
    id: string,
    updateAssetDto: UpdateAssetDto,
    ownerId: string,
  ): Promise<Asset> {
    const asset = await this.findOne(id);

    if (asset.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to update this asset',
      );
    }

    if (asset.status !== AssetStatus.PENDING) {
      throw new BadRequestException(
        'Asset can only be updated while in PENDING status',
      );
    }

    Object.assign(asset, updateAssetDto);
    return this.assetRepository.save(asset);
  }
}
