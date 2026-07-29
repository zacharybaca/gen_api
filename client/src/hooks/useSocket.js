import { useContext } from 'react';
import { SocketContext } from '../contexts/Socket/SocketContext';

/**
 * useSocket — convenience hook that returns the active socket.io Socket instance
 * provided by SocketProvider, or null when no user is authenticated.
 * Must be called inside a component that is a descendant of SocketProvider.
 */
export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return context;
};
