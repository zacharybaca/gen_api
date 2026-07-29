import { FetcherProvider } from './Fetcher/FetcherProvider';
import { AuthProvider } from './Auth/AuthProvider';
import { SocketProvider } from './Socket/SocketProvider';
import PropTypes from 'prop-types';

/**
 * AppProvider — composes FetcherProvider, AuthProvider, and SocketProvider
 * into a single wrapper so the rest of the app can access all three contexts
 * without nesting them manually in main.jsx.
 *
 * Order matters: FetcherProvider must be outermost because AuthProvider
 * depends on useFetcher, and SocketProvider depends on useAuth.
 */
export const AppProvider = ({ children }) => {
  return (
    <FetcherProvider>
      <AuthProvider>
        <SocketProvider>{children}</SocketProvider>
      </AuthProvider>
    </FetcherProvider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
