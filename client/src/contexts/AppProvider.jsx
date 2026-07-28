import { FetcherProvider } from './Fetcher/FetcherProvider';
import { AuthProvider } from './Auth/AuthProvider';
import { SocketProvider } from './Socket/SocketProvider';
import PropTypes from 'prop-types';

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
