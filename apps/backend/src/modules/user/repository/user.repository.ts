import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entity/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    return this.repo.findOne({ where: { walletAddress } });
  }

  async findAll(skip: number, take: number): Promise<[User[], number]> {
    return this.repo.findAndCount({ skip, take, order: { createdAt: 'DESC' } });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await this.repo.update(id, { refreshToken });
  }

  async updateWalletNonce(id: string, nonce: string | null): Promise<void> {
    await this.repo.update(id, { walletNonce: nonce });
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.repo.existsBy({ email });
  }

  async existsByWalletAddress(walletAddress: string): Promise<boolean> {
    return this.repo.existsBy({ walletAddress });
  }
}
