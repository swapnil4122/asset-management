import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  username: process.env.POSTGRES_USER ?? 'asset_user',
  password: process.env.POSTGRES_PASSWORD ?? 'asset_password',
  name: process.env.POSTGRES_DB ?? 'asset_management',
}));
