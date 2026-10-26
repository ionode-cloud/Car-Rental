import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('ridevista_token');
      // If there is no token stored, the visitor is a guest — skip request to avoid 401 in console
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          localStorage.removeItem('ridevista_token');
          setUser(null);
        }
      } catch (err) {
        localStorage.removeItem('ridevista_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    if (response.success && response.user) {
      if (response.token) {
        localStorage.setItem('ridevista_token', response.token);
      }
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Login failed');
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response.success && response.user) {
      if (response.token) {
        localStorage.setItem('ridevista_token', response.token);
      }
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout error:', err.message);
    } finally {
      localStorage.removeItem('ridevista_token');
      setUser(null);
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
