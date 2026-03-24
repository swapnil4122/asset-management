import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthSession } from '../entity/auth-session.entity';
import { PasswordReset } from '../entity/password-reset.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(AuthSession)
    private readonly sessionRepo: Repository<AuthSession>,
    @InjectRepository(PasswordReset)
    private readonly resetRepo: Repository<PasswordReset>,
  ) {}

  async createSession(data: Partial<AuthSession>): Promise<AuthSession> {
    const session = this.sessionRepo.create(data);
    return this.sessionRepo.save(session);
  }

  async findByRefreshToken(refreshToken: string): Promise<AuthSession | null> {
    return this.sessionRepo.findOne({
      where: { refreshToken, isRevoked: false },
      relations: ['user'],
    });
  }

  async revokeSession(refreshToken: string): Promise<void> {
    await this.sessionRepo.update({ refreshToken }, { isRevoked: true });
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.sessionRepo.update({ userId }, { isRevoked: true });
  }

  async createPasswordReset(data: Partial<PasswordReset>): Promise<PasswordReset> {
    const reset = this.resetRepo.create(data);
    return this.resetRepo.save(reset);
  }

  async findPasswordResetByHash(tokenHash: string): Promise<PasswordReset | null> {
    return this.resetRepo.findOne({
      where: { tokenHash, used: false },
      relations: ['user'],
    });
  }

  async markPasswordResetAsUsed(id: string): Promise<void> {
    await this.resetRepo.update(id, { used: true });
  }
}

