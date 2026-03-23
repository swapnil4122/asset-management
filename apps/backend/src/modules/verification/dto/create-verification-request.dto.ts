import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVerificationRequestDto {
  @IsUUID()
  @IsNotEmpty()
  assetId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documentUrls?: string[];

  @IsString()
  @IsOptional()
  notes?: string;
}
