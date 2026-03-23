import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PAGINATION_CONFIG } from '@asset-mgmt/config';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = PAGINATION_CONFIG.defaultPage;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PAGINATION_CONFIG.maxLimit)
  limit?: number = PAGINATION_CONFIG.defaultLimit;
}
