import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';


import { AuthService } from '../service/auth.service';
import { GoogleUser } from '../strategies/google.strategy';

import { CreateUserDto } from '../../user/dto/user.dto';
import { LoginDto, WalletAuthDto, WalletChallengeDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from '../dto/auth.dto';


import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../../user/entity/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user with email/password' })
  register(@Body() dto: CreateUserDto, @Req() req: Request) {
    const metadata = { ip: req.ip || '', userAgent: req.headers['user-agent'] || '' };
    return this.authService.register(dto, metadata);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  login(@Body() dto: LoginDto, @Req() req: Request) {
    const metadata = { ip: req.ip || '', userAgent: req.headers['user-agent'] || '' };
    return this.authService.login(dto, metadata);
  }

  @Post('wallet/challenge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a wallet authentication challenge message' })
  walletChallenge(@Body() dto: WalletChallengeDto) {
    return this.authService.getWalletChallenge(dto.walletAddress);
  }

  @Post('wallet/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate using a signed wallet message' })
  walletLogin(@Body() dto: WalletAuthDto, @Req() req: Request) {
    const metadata = { ip: req.ip || '', userAgent: req.headers['user-agent'] || '' };
    return this.authService.walletLogin(dto, metadata);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Login with Google' })
  async googleAuth(@Req() _req: Request) {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return { success: true, message: 'If account exists, reset link has been sent' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return { success: true, message: 'Password has been successfully reset' };
  }



  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const metadata = { ip: req.ip || '', userAgent: req.headers['user-agent'] || '' };
    const { user, tokens } = await this.authService.googleLogin(req.user as GoogleUser, metadata);

    const frontendUrl = this.authService.getFrontendUrl();
    const redirectUrl = new URL(`${frontendUrl}/auth/success`);
    redirectUrl.searchParams.append('accessToken', tokens.accessToken);
    redirectUrl.searchParams.append('refreshToken', tokens.refreshToken);
    redirectUrl.searchParams.append('onboardingCompleted', user.onboardingCompleted.toString());

    return res.redirect(redirectUrl.toString());
  }


  @Post('refresh')

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  refresh(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    const metadata = { ip: req.ip || '', userAgent: req.headers['user-agent'] || '' };
    return this.authService.refresh(dto, metadata);
  }


  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout — invalidate refresh token' })
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user from JWT token' })
  me(@CurrentUser() user: User) {
    return user;
  }
}

