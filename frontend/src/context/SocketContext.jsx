import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useWorkspace } from './WorkspaceContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    newSocket.on('connect', () => {
      console.log('[Socket.IO Connected]', newSocket.id);
      setIsConnected(true);
      newSocket.emit('join_user', user._id);
      if (activeWorkspace) {
        newSocket.emit('join_workspace', activeWorkspace._id);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket.IO Disconnected]');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket && isConnected && activeWorkspace) {
      socket.emit('join_workspace', activeWorkspace._id);
    }
  }, [activeWorkspace, socket, isConnected]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
