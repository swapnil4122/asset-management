import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractBaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entity/user.entity';

@Entity('auth_sessions')
export class AuthSession extends AbstractBaseEntity {
  @Column({ name: 'user_id', type: 'varchar' })
  userId: string;

  @Column({ name: 'refresh_token', type: 'varchar', unique: true })
  refreshToken: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'user_agent', type: 'varchar', nullable: true })
  userAgent: string;

  @Column({ name: 'ip_address', type: 'varchar', nullable: true })
  ipAddress: string;


  @Column({ name: 'is_revoked', default: false })
  isRevoked: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
