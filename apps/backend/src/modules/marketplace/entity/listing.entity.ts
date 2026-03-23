import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractBaseEntity } from '../../../common/entities/base.entity';
import { ListingStatus } from '@asset-mgmt/shared-types';
import { Asset } from '../../asset/entity/asset.entity';
import { User } from '../../user/entity/user.entity';

@Entity('listings')
@Index(['status'])
@Index(['assetId'])
@Index(['sellerId'])
export class Listing extends AbstractBaseEntity {
  @Column({ name: 'asset_id' })
  assetId: string;

  @ManyToOne(() => Asset, (asset) => asset.listings)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column({ name: 'seller_id' })
  sellerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column({ name: 'price_eth', length: 50 })
  priceETH: string;

  @Column({
    name: 'price_usd',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  priceUSD: number;

  @Column({
    type: 'enum',
    enum: ListingStatus,
    default: ListingStatus.ACTIVE,
  })
  status: ListingStatus;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt: Date | null;

  @Column({ name: 'is_fractional', default: false })
  isFractional: boolean;

  @Column({ name: 'shares_available', nullable: true, type: 'int' })
  sharesAvailable: number | null;

  @Column({ name: 'share_price_eth', nullable: true, length: 50 })
  sharePriceETH: string | null;
}
