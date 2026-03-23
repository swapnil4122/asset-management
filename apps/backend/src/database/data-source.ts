import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modules/user/entity/user.entity';
import { Asset } from '../modules/asset/entity/asset.entity';
import { AssetTransfer } from '../modules/asset/entity/asset-transfer.entity';
import { Listing } from '../modules/marketplace/entity/listing.entity';
import { VerificationRequest } from '../modules/verification/entity/verification-request.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  username: process.env.POSTGRES_USER ?? 'asset_user',
  password: process.env.POSTGRES_PASSWORD ?? 'asset_password',
  database: process.env.POSTGRES_DB ?? 'asset_management',
  synchronize: false,
  logging: true,
  entities: [User, Asset, AssetTransfer, Listing, VerificationRequest],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});
