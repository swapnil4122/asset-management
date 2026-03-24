import { useAuthStore } from '../store/authStore';
import type { User } from '../types/auth';


export const useAuth = () => {
  const { user, accessToken, refreshToken, isAuthenticated, setAuth, clearAuth, updateUser } = useAuthStore();

  const login = (user: User, accessToken: string, refreshToken: string) => {
    setAuth(user, accessToken, refreshToken);
  };

  const logout = () => {
    clearAuth();
  };

  return {
    user,
    token: accessToken,
    refreshToken,
    isAuthenticated,
    isLoading: false,
    login,
    logout,
    updateUser: (data: Partial<User>) => updateUser(data),
    isAdmin: user?.role === 'admin',
    isVerifier: user?.role === 'verifier',
  };
};


