import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './entity/listing.entity';
import { Asset } from '../asset/entity/asset.entity';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, Asset]), BlockchainModule],
  providers: [MarketplaceService],

  controllers: [MarketplaceController],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
