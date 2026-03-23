import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../../user/dto/user.dto';
import { LoginDto, WalletAuthDto, WalletChallengeDto, RefreshTokenDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../../user/entity/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user with email/password' })
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
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
  walletLogin(@Body() dto: WalletAuthDto) {
    return this.authService.walletLogin(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout — invalidate refresh token' })
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user from JWT token' })
  me(@CurrentUser() user: User) {
    return user;
  }
}
