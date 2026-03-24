import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-secret',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/v1/auth/google/callback',
  },
}));

