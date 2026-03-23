import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  POSTGRES_HOST: string = 'localhost';

  @IsNumber()
  @IsOptional()
  POSTGRES_PORT: number = 5432;

  @IsString()
  POSTGRES_USER: string = 'asset_user';

  @IsString()
  POSTGRES_PASSWORD: string = 'asset_password';

  @IsString()
  POSTGRES_DB: string = 'asset_management';

  @IsString()
  REDIS_HOST: string = 'localhost';

  @IsNumber()
  @IsOptional()
  REDIS_PORT: number = 6379;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD: string = '';

  @IsString()
  JWT_SECRET: string = 'changeme';

  @IsString()
  JWT_REFRESH_SECRET: string = 'changeme-refresh';
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Configuration validation error: ${errors.toString()}`);
  }

  return validatedConfig;
}
