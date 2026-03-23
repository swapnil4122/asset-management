import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  name: process.env.APP_NAME ?? 'Asset Management Platform',
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiVersion: process.env.API_VERSION ?? 'v1',
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173').split(','),
  jwt: {
    secret: process.env.JWT_SECRET ?? 'changeme-jwt-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'changeme-refresh-secret',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY ?? '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY ?? '7d',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '60000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX ?? '100', 10),
  },
  ipfs: {
    pinataApiKey: process.env.PINATA_API_KEY ?? '',
    pinataSecretKey: process.env.PINATA_SECRET_KEY ?? '',
    gateway: process.env.IPFS_GATEWAY ?? 'https://gateway.pinata.cloud/ipfs',
  },
}));
