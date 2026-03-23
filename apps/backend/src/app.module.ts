import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';


import { databaseConfig } from './config/database.config';
import { redisConfig } from './config/redis.config';
import { appConfig } from './config/app.config';
import { validate } from './config/env.validation';

// Feature Modules
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AssetModule } from './modules/asset/asset.module';
// import { VerificationModule } from './modules/verification/verification.module';
// import { MarketplaceModule } from './modules/marketplace/marketplace.module';
// import { BlockchainModule } from './modules/blockchain/blockchain.module';
// import { HealthModule } from './modules/health/health.module';


@Module({
  imports: [
    // ---- Config ----
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig],
      validate,
      envFilePath: ['.env.local', '.env'],
    }),

    // ---- TypeORM ----
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: config.get<string>('NODE_ENV') === 'development',
        logging: config.get<string>('NODE_ENV') === 'development',
        ssl:
          config.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: true }
            : false,
      }),
    }),

    // ---- BullMQ + Redis ----
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host', 'localhost'),
          port: config.get<number>('redis.port', 6379),
          password: config.get<string>('redis.password'),
          db: config.get<number>('redis.db', 0),
        },
      }),
    }),

    // ---- Rate Limiting ----
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('RATE_LIMIT_WINDOW_MS', 60000),
            limit: config.get<number>('RATE_LIMIT_MAX', 100),
          },
        ],
      }),
    }),

    // ---- Event Emitter ----
    EventEmitterModule.forRoot({ wildcard: true, delimiter: '.' }),

    // ---- Feature Modules ----
    UserModule,
    AuthModule,
    AssetModule,
    // VerificationModule,
    // MarketplaceModule,
    // BlockchainModule,
    // HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
