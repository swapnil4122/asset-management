import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ethers } from 'ethers';
import { v4 as uuid } from 'uuid';

import { UserService } from '../../user/service/user.service';
import { UserRepository } from '../../user/repository/user.repository';
import { CreateUserDto } from '../../user/dto/user.dto';
import { User } from '../../user/entity/user.entity';
import { LoginDto, WalletAuthDto, RefreshTokenDto } from '../dto/auth.dto';
import { IAuthTokens } from '@asset-mgmt/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ---- Email/Password Auth ----
  async register(dto: CreateUserDto): Promise<{ user: User; tokens: IAuthTokens }> {
    const user = await this.userService.create(dto);
    const tokens = await this.generateTokens(user);
    await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  async login(dto: LoginDto): Promise<{ user: User; tokens: IAuthTokens }> {
    const user = await this.userRepository.findByEmailWithPassword(dto.email);
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user);
    await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);
    await this.userRepository.update(user.id, { lastLoginAt: new Date() });

    return { user, tokens };
  }

  // ---- Wallet (SIWE-like) Auth ----
  async getWalletChallenge(walletAddress: string): Promise<string> {
    const nonce = uuid();
    const message = `Sign this message to authenticate with Asset Management Platform.\n\nWallet: ${walletAddress}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;

    let user = await this.userRepository.findByWalletAddress(walletAddress);
    if (!user) {
      user = await this.userRepository.create({
        email: `${walletAddress.toLowerCase()}@wallet.local`,
        username: `wallet_${walletAddress.slice(2, 8).toLowerCase()}`,
        passwordHash: '',
        walletAddress,
        walletNonce: nonce,
      });
    } else {
      await this.userRepository.updateWalletNonce(user.id, nonce);
    }

    return message;
  }

  async walletLogin(dto: WalletAuthDto): Promise<{ user: User; tokens: IAuthTokens }> {
    const user = await this.userRepository.findByWalletAddress(dto.walletAddress);
    if (!user?.walletNonce) throw new UnauthorizedException('No challenge found. Request a challenge first.');

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(dto.message, dto.signature);
    if (recoveredAddress.toLowerCase() !== dto.walletAddress.toLowerCase()) {
      throw new UnauthorizedException('Invalid signature');
    }

    if (!dto.message.includes(user.walletNonce)) {
      throw new BadRequestException('Nonce mismatch');
    }

    // Invalidate nonce
    await this.userRepository.updateWalletNonce(user.id, null);

    const tokens = await this.generateTokens(user);
    await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  // ---- Token Refresh ----
  async refresh(dto: RefreshTokenDto): Promise<IAuthTokens> {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify<{ sub: string }>(dto.refreshToken, {
        secret: this.configService.get<string>('app.jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user?.refreshToken) throw new UnauthorizedException('Session expired');

    const tokens = await this.generateTokens(user);
    await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, null);
  }

  // ---- Helpers ----
  private async generateTokens(user: User): Promise<IAuthTokens> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('app.jwt.secret'),
        expiresIn: this.configService.get<string>('app.jwt.accessExpiry', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('app.jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('app.jwt.refreshExpiry', '7d'),
      }),
    ]);

    return { accessToken, refreshToken, expiresIn: 900 };
  }
}
