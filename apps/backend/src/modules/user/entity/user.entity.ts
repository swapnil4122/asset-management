import { Column, Entity, Index, OneToMany } from 'typeorm';

import { AbstractBaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '@asset-mgmt/shared-types';
import { Asset } from '../../asset/entity/asset.entity';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['walletAddress'], { unique: true, where: '"wallet_address" IS NOT NULL' })
export class User extends AbstractBaseEntity {
  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 100 })
  username: string;

  @Column({ name: 'password_hash', type: 'varchar', select: false })
  passwordHash: string;

  @Column({ name: 'wallet_address', nullable: true, type: 'varchar', length: 42 })
  walletAddress: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ 
    name: 'kyc_status', 
    type: 'enum', 
    enum: ['PENDING', 'VERIFIED', 'REJECTED'], 
    default: 'PENDING' 
  })
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';

  @Column({ name: 'onboarding_completed', default: false })
  onboardingCompleted: boolean;

  @Column({ name: 'google_id', type: 'varchar', nullable: true, length: 100 })
  googleId: string | null;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true, select: false })
  refreshToken: string | null;

  @Column({ name: 'wallet_nonce', type: 'varchar', nullable: true })
  walletNonce: string | null;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null;



  // ---- Relations ----
  @OneToMany(() => Asset, (asset) => asset.owner)
  assets: Asset[];
}
