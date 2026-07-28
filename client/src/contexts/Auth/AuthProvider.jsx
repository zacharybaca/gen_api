import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useFetcher } from '../../hooks/useFetcher.js';
import { AuthContext } from './AuthContext.jsx';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher();

  /**
   * DERIVED STATE: isUserAdmin
   * Using useMemo ensures this value is re-calculated immediately
   * whenever the 'user' object changes (e.g., after login or checkUserAuth).
   */
  const isUserAdmin = useMemo(() => {
    return user?.role === 'admin';
  }, [user]);

  /**
   * Validates the session with the backend on mount.
   */
  const checkUserAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetcher('/api/users/profile');

      // Update depending on your exact backend payload structure
      if (response.success && response.data) {
        // If data is the user object itself
        setUser(response.data.user || response.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  /**
   * Triggers the backend logout and resets local user state.
   */
  const logout = useCallback(async () => {
    try {
      // Calls the backend logout function to clear the JWT cookie
      await fetcher('/api/auth/logout', { method: 'POST' });

      // Clear local state
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [fetcher]);

  // Run the auth check once when the provider mounts
  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        checkUserAuth,
        logout,
        isUserAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
