import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractBaseEntity } from '../../../common/entities/base.entity';
import { AssetStatus, AssetType } from '@asset-mgmt/shared-types';
import { User } from '../../user/entity/user.entity';
import { Listing } from '../../marketplace/entity/listing.entity';
import { VerificationRequest } from '../../verification/entity/verification-request.entity';
import { AssetTransfer } from './asset-transfer.entity';

@Entity('assets')
@Index(['status'])
@Index(['assetType'])
@Index(['ownerId'])
export class Asset extends AbstractBaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    name: 'asset_type',
    type: 'enum',
    enum: AssetType,
  })
  assetType: AssetType;

  @Column({
    type: 'enum',
    enum: AssetStatus,
    default: AssetStatus.PENDING,
  })
  status: AssetStatus;

  @Column({ name: 'owner_id', type: 'varchar' })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.assets, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'token_id', type: 'varchar', nullable: true })
  tokenId: string | null;

  @Column({ name: 'contract_address', type: 'varchar', nullable: true, length: 42 })
  contractAddress: string | null;

  @Column({ name: 'ipfs_hash', type: 'varchar', nullable: true })
  ipfsHash: string | null;

  @Column({ name: 'metadata_uri', type: 'varchar', nullable: true })
  metadataUri: string | null;

  @Column({
    name: 'valuation_usd',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  valuationUSD: number;

  @Column({ name: 'is_fractional', default: false })
  isFractional: boolean;

  @Column({ name: 'total_shares', nullable: true, type: 'int' })
  totalShares: number | null;

  @Column({ name: 'available_shares', nullable: true, type: 'int' })
  availableShares: number | null;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  location: string | null;


  @Column({ type: 'jsonb', default: [] })
  documents: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  // ---- Relations ----
  @OneToMany(() => AssetTransfer, (transfer) => transfer.asset)
  transfers: AssetTransfer[];

  @OneToMany(() => Listing, (listing) => listing.asset)
  listings: Listing[];

  @OneToMany(() => VerificationRequest, (vr) => vr.asset)
  verificationRequests: VerificationRequest[];
}
