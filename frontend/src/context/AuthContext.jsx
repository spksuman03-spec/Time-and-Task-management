import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getMe();
          setUser(res.data);
        } catch (err) {
          console.error('[Auth Init Error]', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    if (res.data.defaultWorkspace) {
      localStorage.setItem('activeWorkspaceId', res.data.defaultWorkspace);
    }
    return res;
  };

  const register = async (name, email, password, role) => {
    const res = await authService.register({ name, email, password, role });
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    if (res.data.defaultWorkspace) {
      localStorage.setItem('activeWorkspaceId', res.data.defaultWorkspace);
    }
    return res;
  };

  const loginWithGoogle = async (googlePayload) => {
    const res = await authService.googleAuth(googlePayload);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    if (res.data.defaultWorkspace) {
      localStorage.setItem('activeWorkspaceId', res.data.defaultWorkspace);
    }
    return res;
  };

  const loginWithGithub = async (githubPayload) => {
    const res = await authService.githubAuth(githubPayload);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    if (res.data.defaultWorkspace) {
      localStorage.setItem('activeWorkspaceId', res.data.defaultWorkspace);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('activeWorkspaceId');
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, loginWithGithub, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
