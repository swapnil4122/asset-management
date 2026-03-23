import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractBaseEntity } from '../../../common/entities/base.entity';
import { TransferStatus } from '@asset-mgmt/shared-types';
import { Asset } from './asset.entity';
import { User } from '../../user/entity/user.entity';

@Entity('asset_transfers')
@Index(['assetId'])
@Index(['fromUserId'])
@Index(['toUserId'])
export class AssetTransfer extends AbstractBaseEntity {
  @Column({ name: 'asset_id' })
  assetId: string;

  @ManyToOne(() => Asset, (asset) => asset.transfers)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column({ name: 'from_user_id', nullable: true })
  fromUserId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'from_user_id' })
  fromUser: User | null;

  @Column({ name: 'to_user_id' })
  toUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'to_user_id' })
  toUser: User;

  @Column({ name: 'transaction_hash', nullable: true })
  transactionHash: string | null;

  @Column({ name: 'block_number', nullable: true, type: 'bigint' })
  blockNumber: number | null;

  @Column({
    type: 'enum',
    enum: TransferStatus,
    default: TransferStatus.PENDING,
  })
  status: TransferStatus;

  @Column({ name: 'price_eth', nullable: true, length: 50 })
  priceETH: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;
}
