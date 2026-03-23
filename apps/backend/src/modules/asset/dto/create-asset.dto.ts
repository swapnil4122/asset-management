import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { AssetType } from '@asset-mgmt/shared-types';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(AssetType)
  @IsNotEmpty()
  assetType: AssetType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  valuationUSD?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
