export type UserRole = 'user' | 'admin' | 'verifier';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  onboardingCompleted: boolean;
  kycStatus?: 'pending' | 'verified' | 'rejected';
  walletAddress?: string;
  googleId?: string;
}


export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
