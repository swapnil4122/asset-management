import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, logout } =
    useAuthContext();

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
