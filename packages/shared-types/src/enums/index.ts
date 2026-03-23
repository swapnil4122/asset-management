// ============================================================
// Enums
// ============================================================

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VERIFIER = 'verifier',
}

export enum AssetStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  TOKENIZED = 'tokenized',
  LISTED = 'listed',
  SOLD = 'sold',
}

export enum AssetType {
  REAL_ESTATE = 'real_estate',
  ART = 'art',
  COMMODITY = 'commodity',
  VEHICLE = 'vehicle',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  OTHER = 'other',
}

export enum ListingStatus {
  ACTIVE = 'active',
  SOLD = 'sold',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum VerificationStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum TransferStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum EscrowStatus {
  CREATED = 'created',
  FUNDED = 'funded',
  RELEASED = 'released',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed',
}
