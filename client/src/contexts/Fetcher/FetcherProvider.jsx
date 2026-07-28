import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FetcherContext } from './FetcherContext.jsx';

export const FetcherProvider = ({ children }) => {
  // Dynamic backend URL routing based on environment
  const backendUrl = import.meta.env.PROD
    ? import.meta.env.VITE_BACKEND_URL || '' // Production: Use env var, or fallback to relative path
    : import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'; // Local: Use env var, or fallback to localhost

  const fetcher = useCallback(
    async (url, options = {}, fallbackError = 'An error occurred.') => {
      // 1. Construct final URL
      const finalUrl = url.startsWith('/') ? `${backendUrl}${url}` : url;

      // 2. SMART HEADERS: Check if we are sending a file (FormData)
      const isFormData = options.body instanceof FormData;

      const headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers || {}),
      };

      // 3. Config (Ensuring credentials are sent for JWT cookies)
      const config = {
        credentials: 'include',
        ...options,
        headers,
      };

      try {
        let response = await fetch(finalUrl, config);

        // 1. Handle Rate Limiting (429)
        if (response.status === 429) {
          const data = await response.json().catch(() => null);
          return {
            success: false,
            error: data?.message || 'Whoa, slow down! Please wait a moment.',
            status: 429,
          };
        }

        // 2. Handle Unauthorized (401)
        if (response.status === 401) {
          return {
            success: false,
            error: 'Unauthorized',
            status: 401,
          };
        }

        // 3. Parse JSON safely
        const data = await response.json().catch(() => ({}));

        // 4. Handle other errors (400, 404, 500)
        if (!response.ok || data.success === false) {
          const errorMessage = data?.message || fallbackError;
          return {
            success: false,
            error: errorMessage,
            status: response.status,
            data: data,
          };
        }

        // 5. Success
        return { success: true, data };
      } catch (err) {
        console.error('Fetcher error:', err);
        return {
          success: false,
          error: 'Network error. Please check your connection.',
          status: null,
        };
      }
    },
    [backendUrl]
  );

  return (
    <FetcherContext.Provider value={{ fetcher }}>
      {children}
    </FetcherContext.Provider>
  );
};

FetcherProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
