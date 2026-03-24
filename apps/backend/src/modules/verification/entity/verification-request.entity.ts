import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractBaseEntity } from '../../../common/entities/base.entity';
import { VerificationStatus } from '@asset-mgmt/shared-types';
import { Asset } from '../../asset/entity/asset.entity';
import { User } from '../../user/entity/user.entity';

@Entity('verification_requests')
@Index(['status'])
@Index(['assetId'])
@Index(['requestedById'])
export class VerificationRequest extends AbstractBaseEntity {
  @Column({ name: 'asset_id', type: 'varchar' })
  assetId: string;

  @ManyToOne(() => Asset, (asset) => asset.verificationRequests)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column({ name: 'requested_by_id', type: 'varchar' })
  requestedById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requested_by_id' })
  requestedBy: User;

  @Column({ name: 'reviewed_by_id', type: 'varchar', nullable: true })
  reviewedById: string | null;


  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewed_by_id' })
  reviewedBy: User | null;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null;

  @Column({ type: 'jsonb', default: [] })
  documents: string[];

  @Column({ name: 'reviewed_at', type: 'timestamptz', nullable: true })
  reviewedAt: Date | null;
}
