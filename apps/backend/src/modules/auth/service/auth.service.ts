import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { ethers } from 'ethers';
import { v4 as uuid } from 'uuid';
import * as crypto from 'crypto';

import { UserService } from '../../user/service/user.service';
import { UserRepository } from '../../user/repository/user.repository';
import { AuthRepository } from '../repository/auth.repository';
import { RedisService } from '../../redis/redis.service';
import { GoogleUser } from '../strategies/google.strategy';
import { CreateUserDto } from '../../user/dto/user.dto';



import { User } from '../../user/entity/user.entity';



import { LoginDto, WalletAuthDto, RefreshTokenDto, ResetPasswordDto } from '../dto/auth.dto';


import { IAuthTokens } from '@asset-mgmt/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {}

  // ---- Email/Password Auth ----
  async register(
    dto: CreateUserDto, 
    metadata: { ip: string; userAgent: string }
  ): Promise<{ user: User; tokens: IAuthTokens }> {
    const user = await this.userService.create(dto);
    const tokens = await this.generateTokens(user);
    
    await this.authRepository.createSession({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress: metadata.ip,
      userAgent: metadata.userAgent,
    });

    return { user, tokens };
  }

  async login(
    dto: LoginDto,
    metadata: { ip: string; userAgent: string }
  ): Promise<{ user: User; tokens: IAuthTokens }> {
    const user = await this.userRepository.findByEmailWithPassword(dto.email);
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user);
    
    await this.authRepository.createSession({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: metadata.ip,
      userAgent: metadata.userAgent,
    });

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

  async walletLogin(
    dto: WalletAuthDto,
    metadata: { ip: string; userAgent: string }
  ): Promise<{ user: User; tokens: IAuthTokens }> {
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
    
    await this.authRepository.createSession({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: metadata.ip,
      userAgent: metadata.userAgent,
    });

    return { user, tokens };
  }

  // ---- Google OAuth ----
  async googleLogin(
    profile: GoogleUser,
    metadata: { ip: string; userAgent: string }
  ): Promise<{ user: User; tokens: IAuthTokens }> {
    let user = await this.userRepository.findByEmail(profile.email);

    if (!user) {
      user = await this.userService.create({
        email: profile.email,
        username: `google_${profile.googleId.slice(-6)}`,
        password: '', // Password is empty for Google users
      });
      
      await this.userRepository.update(user.id, { googleId: profile.googleId });
    } else if (!user.googleId) {
      await this.userRepository.update(user.id, { googleId: profile.googleId });
    }

    const tokens = await this.generateTokens(user);
    
    await this.authRepository.createSession({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: metadata.ip,
      userAgent: metadata.userAgent,
    });

    return { user, tokens };
  }

  // ---- Password Reset ----
  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    
    // Always return "done" to prevent user enumeration
    if (!user) {
      // eslint-disable-next-line no-console
      console.log(`[ForgotPassword] Request for non-existent email: ${email}`);
      return;
    }


    // Generate random 32-byte token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.authRepository.createPasswordReset({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    // Simulate sending email
    const frontendUrl = this.getFrontendUrl();
    // eslint-disable-next-line no-console
    console.log('\n----------------------------------------');
    // eslint-disable-next-line no-console
    console.log('📧 PASSWORD RESET EMAIL SIMULATION');
    // eslint-disable-next-line no-console
    console.log(`To: ${user.email}`);
    // eslint-disable-next-line no-console
    console.log(`Link: ${frontendUrl}/reset-password?token=${token}`);
    // eslint-disable-next-line no-console
    console.log('----------------------------------------\n');
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');
    
    const reset = await this.authRepository.findPasswordResetByHash(tokenHash);
    
    if (!reset || reset.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    if (reset.used) {
      throw new UnauthorizedException('Token already used');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(dto.newPassword, salt);

    // Update user
    await this.userRepository.update(reset.userId, { passwordHash });

    // Mark token as used
    await this.authRepository.markPasswordResetAsUsed(reset.id);

    // Revoke all existing sessions for security
    await this.authRepository.revokeAllUserSessions(reset.userId);
  }





  // ---- Token Refresh ----

  async refresh(
    dto: RefreshTokenDto,
    metadata: { ip: string; userAgent: string }
  ): Promise<IAuthTokens> {
    const session = await this.authRepository.findByRefreshToken(dto.refreshToken);
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    // Verify in Redis
    const isSessionActive = await this.redisService.exists(`auth:session:${dto.refreshToken}`);
    if (!isSessionActive) {
      throw new UnauthorizedException('Session revoked or invalid');
    }

    // Revoke old session
    await this.authRepository.revokeSession(dto.refreshToken);
    await this.redisService.del(`auth:session:${dto.refreshToken}`);

    const tokens = await this.generateTokens(session.user);
    
    // Create new session (token rotation)
    await this.authRepository.createSession({
      userId: session.user.id,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: metadata.ip,
      userAgent: metadata.userAgent,
    });

    return tokens;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.authRepository.revokeSession(refreshToken);
    await this.redisService.del(`auth:session:${refreshToken}`);
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

    // Store in Redis (7 days TTL)
    await this.redisService.set(`auth:session:${refreshToken}`, user.id, 7 * 24 * 60 * 60);

    return { accessToken, refreshToken, expiresIn: 900 };
  }

  getFrontendUrl(): string {
    return this.configService.get<string>('app.frontendUrl') || 'http://localhost:5173';
  }

}

