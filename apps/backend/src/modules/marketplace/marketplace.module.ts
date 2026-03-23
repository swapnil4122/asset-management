import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './entity/listing.entity';
import { Asset } from '../asset/entity/asset.entity';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, Asset])],
  providers: [MarketplaceService],
  controllers: [MarketplaceController],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
