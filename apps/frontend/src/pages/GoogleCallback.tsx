import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/api';

import type { User } from '../types/auth';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const onboardingCompleted = searchParams.get('onboardingCompleted') === 'true';

      if (accessToken && refreshToken) {
        try {
          // Fetch user profile to ensure we have the full user object
          // We pass the token manually because the interceptor might not have it yet in storage
          const user = await api.get<User>('/auth/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }) as unknown as User;

          
          setAuth(user, accessToken, refreshToken);

          if (!onboardingCompleted) {
            navigate('/onboarding');
          } else {
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Failed to handle Google OAuth callback', error);
          navigate('/login?error=oauth_failed');
        }
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#3b82f6] border-t-transparent"></div>
        <p className="text-gray-400 font-medium animate-pulse">Authenticating with Google...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
