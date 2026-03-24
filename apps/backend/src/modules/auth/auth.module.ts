import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthSession } from './entity/auth-session.entity';
import { PasswordReset } from './entity/password-reset.entity';
import { AuthRepository } from './repository/auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthSession, PasswordReset]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    UserModule,
  ],

  providers: [AuthService, JwtStrategy, GoogleStrategy, AuthRepository],
  controllers: [AuthController],

  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}

