import { AssetStatus, AssetType, UserRole, ListingStatus } from '../enums';

// ============================================================
// Base Types
// ============================================================

export interface ITimestamped {
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface IApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

// ============================================================
// User Types
// ============================================================

export interface IUser extends ITimestamped {
  id: string;
  email: string;
  username: string;
  walletAddress?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
}

export interface IUserPublic {
  id: string;
  username: string;
  walletAddress?: string;
  role: UserRole;
}

// ============================================================
// Asset Types
// ============================================================

export interface IAssetMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
  external_url?: string;
  [key: string]: unknown;
}

export interface IAsset extends ITimestamped {
  id: string;
  name: string;
  description: string;
  assetType: AssetType;
  status: AssetStatus;
  ownerId: string;
  owner?: IUserPublic;
  tokenId?: string;
  contractAddress?: string;
  ipfsHash?: string;
  metadata?: IAssetMetadata;
  valuationUSD: number;
  isFractional: boolean;
  totalShares?: number;
  availableShares?: number;
  location?: string;
  documents: string[];
}

// ============================================================
// Listing Types
// ============================================================

export interface IListing extends ITimestamped {
  id: string;
  assetId: string;
  asset?: IAsset;
  sellerId: string;
  seller?: IUserPublic;
  priceETH: string;
  priceUSD: number;
  status: ListingStatus;
  expiresAt?: Date;
  isFractional: boolean;
  sharesAvailable?: number;
  sharePriceETH?: string;
}

// ============================================================
// Auth Types
// ============================================================

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IWalletAuthChallenge {
  message: string;
  nonce: string;
  expiresAt: Date;
}

// ============================================================
// Blockchain Types
// ============================================================

export interface IBlockchainEvent {
  transactionHash: string;
  blockNumber: number;
  contractAddress: string;
  eventName: string;
  args: Record<string, unknown>;
  timestamp: Date;
}

export interface IMintResult {
  tokenId: string;
  transactionHash: string;
  contractAddress: string;
  ownerAddress: string;
}

export interface ITransferResult {
  tokenId: string;
  fromAddress: string;
  toAddress: string;
  transactionHash: string;
}

// Re-export enums for convenience
export * from '../enums';
