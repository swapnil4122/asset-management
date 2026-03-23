import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './entity/asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AssetStatus } from '@asset-mgmt/shared-types';

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

  async findAll(ownerId?: string): Promise<Asset[]> {
    const query = this.assetRepository.createQueryBuilder('asset');
    if (ownerId) {
      query.where('asset.ownerId = :ownerId', { ownerId });
    }
    return query.getMany();
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.assetRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    return asset;
  }
}
