import { useContext } from 'react';
import { AuthContext } from '../contexts/Auth/AuthContext.jsx';

/**
 * useAuth — convenience hook that returns the AuthContext value
 * (user, setUser, loading, checkUserAuth, logout, isUserAdmin).
 * Must be called inside a component that is a descendant of AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
