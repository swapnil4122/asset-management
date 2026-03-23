// ============================================================
// Application Configuration Constants
// ============================================================

export const APP_CONFIG = {
  name: 'Asset Management Platform',
  version: '1.0.0',
  apiPrefix: 'api/v1',
} as const;

export const PAGINATION_CONFIG = {
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 100,
} as const;

export const JWT_CONFIG = {
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
} as const;

export const REDIS_CONFIG = {
  keyPrefix: 'asset_mgmt:',
  ttl: {
    assetList: 300,        // 5 minutes
    assetDetail: 600,      // 10 minutes
    listingList: 120,      // 2 minutes
    userSession: 86400,    // 24 hours
    walletChallenge: 300,  // 5 minutes
    rateLimit: 60,         // 1 minute
  },
} as const;

export const BLOCKCHAIN_CONFIG = {
  network: 'localhost',
  chainId: 31337,
  confirmations: 1,
} as const;

export const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000,     // 1 minute
  maxRequests: 100,
  authMaxRequests: 10,
} as const;

export const IPFS_CONFIG = {
  gateway: 'https://ipfs.io/ipfs',
  pinataGateway: 'https://gateway.pinata.cloud/ipfs',
} as const;

export const QUEUE_NAMES = {
  IPFS_UPLOAD: 'ipfs-upload',
  BLOCKCHAIN_SYNC: 'blockchain-sync',
  EMAIL: 'email',
  NOTIFICATION: 'notification',
} as const;

export const CACHE_KEYS = {
  ASSET_LIST: (page: number, limit: number) => `assets:list:${page}:${limit}`,
  ASSET_DETAIL: (id: string) => `assets:detail:${id}`,
  LISTING_LIST: (page: number, limit: number) => `listings:list:${page}:${limit}`,
  LISTING_DETAIL: (id: string) => `listings:detail:${id}`,
  USER_SESSION: (userId: string) => `session:${userId}`,
  WALLET_CHALLENGE: (address: string) => `wallet:challenge:${address}`,
  RATE_LIMIT: (ip: string) => `rate_limit:${ip}`,
} as const;
