import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.types';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  const { user, token, isAuthenticated, isLoading, login, logout } =
    context;

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    isAdmin: user?.role === 'ADMIN',
    isVerifier: user?.role === 'VERIFIER',
  };
};
