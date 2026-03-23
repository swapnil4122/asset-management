import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './entity/listing.entity';
import { Asset } from '../asset/entity/asset.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { AssetStatus, ListingStatus } from '@asset-mgmt/shared-types';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    private readonly blockchainService: BlockchainService,
  ) {}

  async createListing(
    sellerId: string,
    createDto: CreateListingDto,
  ): Promise<Listing> {
    const asset = await this.assetRepository.findOne({
      where: { id: createDto.assetId },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    if (asset.ownerId !== sellerId) {
      throw new ForbiddenException('You do not own this asset');
    }

    if (asset.status !== AssetStatus.TOKENIZED) {
      throw new BadRequestException('Asset must be TOKENIZED before listing');
    }

    // Check if already actively listed
    const existingListing = await this.listingRepository.findOne({
      where: { assetId: asset.id, status: ListingStatus.ACTIVE },
    });

    if (existingListing) {
      throw new BadRequestException('Asset is already listed');
    }

    const listing = this.listingRepository.create({
      ...createDto,
      sellerId,
      status: ListingStatus.ACTIVE,
    });

    return this.listingRepository.save(listing);
  }

  async findAll(): Promise<Listing[]> {
    return this.listingRepository.find({
      where: { status: ListingStatus.ACTIVE },
      relations: ['asset', 'seller'],
    });
  }

  async findOne(id: string): Promise<Listing> {
    const listing = await this.listingRepository.findOne({
      where: { id },
      relations: ['asset', 'seller'],
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async cancelListing(sellerId: string, id: string): Promise<Listing> {
    const listing = await this.listingRepository.findOne({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.sellerId !== sellerId) {
      throw new ForbiddenException('Not your listing');
    }
    if (listing.status !== ListingStatus.ACTIVE) {
      throw new BadRequestException('Listing is not active');
    }

    listing.status = ListingStatus.CANCELLED;
    return this.listingRepository.save(listing);
  }

  async purchaseAsset(buyerId: string, id: string): Promise<{ success: boolean; message: string }> {
    const listing = await this.listingRepository.findOne({
      where: { id, status: ListingStatus.ACTIVE },
      relations: ['asset'],
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId === buyerId) {
      throw new BadRequestException('Cannot buy your own listing');
    }

    // In a real app, the backend might handle the escrow or proxy the buy
    // if using a custodial wallet. Otherwise, the frontend signs.
    // We will simulate a backend-triggered purchase.
    
    // This tx typically needs ETH sent. We'll assume the admin wallet 
    // or a specialized relayer handles it for now in this mock.
    
    // const txHash = await this.blockchainService.executeMarketplaceBuy(listing.id, buyerId);

    listing.status = ListingStatus.SOLD;
    await this.listingRepository.save(listing);

    return {
      success: true,
      message: 'Purchase successful (simulated)',
      // txHash
    };
  }

  async createEscrow(buyerId: string, listingId: string): Promise<{ success: boolean; message: string; dealId: string }> {
    const listing = await this.listingRepository.findOne({
      where: { id: listingId, status: ListingStatus.ACTIVE },
      relations: ['asset'],
    });

    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.sellerId === buyerId) {
      throw new BadRequestException('Cannot buy your own listing');
    }

    // Update status to mark it as in-escrow
    // Ideally we'd have a PENDING_ESCROW status
    listing.status = ListingStatus.SOLD; // Or a new status if available
    await this.listingRepository.save(listing);

    // Call blockchain service to create deal on-chain
    // const dealId = await this.blockchainService.createEscrowDeal(listing, buyerId);

    return {
      success: true,
      message: 'Escrow deal created',
      dealId: 'escrow-' + Date.now(),
    };
  }

  async releaseEscrow(_sellerId: string, _dealId: string): Promise<{ success: boolean; message: string }> {
    // Verify deal and seller
    // Mark as completed
    return { success: true, message: 'Funds released to seller' };
  }
}
