import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '../asset/entity/asset.entity';
import { IpfsService } from './service/ipfs.service';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  providers: [IpfsService, BlockchainService],
  controllers: [BlockchainController],
  exports: [IpfsService, BlockchainService],
})
export class BlockchainModule {}
