import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListingDto {
  @ApiProperty({ example: 'uuid-of-asset' })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ example: '0.5' })
  @IsString()
  @IsNotEmpty()
  priceETH: string;

  @ApiProperty({ example: 1500, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceUSD?: number;
}
