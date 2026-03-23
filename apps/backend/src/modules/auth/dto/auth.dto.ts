import { IsEmail, IsEthereumAddress, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}

export class WalletChallengeDto {
  @ApiProperty({ example: '0xAbC...123' })
  @IsEthereumAddress()
  walletAddress: string;
}

export class WalletAuthDto {
  @ApiProperty()
  @IsEthereumAddress()
  walletAddress: string;

  @ApiProperty({ description: 'The challenge message returned from /auth/wallet/challenge' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Signature produced by signing "message" with the wallet' })
  @IsString()
  signature: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
