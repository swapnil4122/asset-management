import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto, UpdateUserDto, PaginationDto } from '../dto/user.dto';
import { PAGINATION_CONFIG } from '@asset-mgmt/config';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findByEmailWithPassword(email);
  }

  async findAll(pagination: PaginationDto): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const page = pagination.page ?? PAGINATION_CONFIG.defaultPage;
    const limit = Math.min(pagination.limit ?? PAGINATION_CONFIG.defaultLimit, PAGINATION_CONFIG.maxLimit);
    const skip = (page - 1) * limit;

    const [data, total] = await this.userRepository.findAll(skip, limit);
    return { data, total, page, limit };
  }

  async create(dto: CreateUserDto): Promise<User> {
    const emailExists = await this.userRepository.existsByEmail(dto.email);
    if (emailExists) throw new ConflictException('Email already registered');

    if (dto.walletAddress) {
      const walletExists = await this.userRepository.existsByWalletAddress(dto.walletAddress);
      if (walletExists) throw new ConflictException('Wallet address already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    return this.userRepository.create({
      email: dto.email,
      username: dto.username,
      passwordHash,
      walletAddress: dto.walletAddress ?? null,
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.findById(id); // throws if not found

    if (dto.walletAddress) {
      const exists = await this.userRepository.existsByWalletAddress(dto.walletAddress);
      if (exists) throw new ConflictException('Wallet address already taken');
    }

    const updated = await this.userRepository.update(id, dto);
    if (!updated) throw new NotFoundException(`User ${id} not found after update`);
    return updated;
  }

  async deactivate(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepository.update(id, { isActive: false });
  }
}
