import { useContext } from 'react';
import { FetcherContext } from '../contexts/Fetcher/FetcherContext';

/**
 * useFetcher — convenience hook that returns the FetcherContext value ({ fetcher }).
 * The fetcher function is a centralized fetch wrapper that handles credentials,
 * Content-Type headers, and normalizes error responses.
 * Must be called inside a component that is a descendant of FetcherProvider.
 */
export const useFetcher = () => {
  const context = useContext(FetcherContext);
  if (!context) {
    throw new Error('useFetcher must be used within a FetcherProvider');
  }
  return context;
};
