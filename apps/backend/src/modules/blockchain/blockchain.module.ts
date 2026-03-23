import { Module } from '@nestjs/common';
import { IpfsService } from './service/ipfs.service';

@Module({
  providers: [IpfsService],
  exports: [IpfsService],
})
export class BlockchainModule {}
