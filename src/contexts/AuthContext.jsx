import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // API base URL - adjust if needed
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'; // Assuming backend runs on 8000

  useEffect(() => {
    // Check for stored auth data on app load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);

    // Add response interceptor to handle token expiration
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Prevent infinite loop: don't intercept logout requests
        if (error.response?.status === 401 && !originalRequest.url?.includes('/logout')) {
          // Token expired or invalid - clear auth without API call
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const getDevicePayload = () => {
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${window.screen.width}x${window.screen.height}`,
      platform: navigator.platform,
      ua: navigator.userAgent,
    };
  };

  const login = async (identifier, password) => {
    try {
      const devicePayload = getDevicePayload();
      const response = await axios.post(`${API_BASE}/login`, {
        identifier,
        password,
        devicePayload,
      });

      const { token: newToken, user: userData } = response.data.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      let errors = null;
      if (error.response?.status === 422 && (error.response?.data?.errors || error.response?.data?.messages)) {
        const errorData = error.response.data.errors || error.response.data.messages;
        errors = {};
        Object.keys(errorData).forEach(key => {
          errors[key] = errorData[key][0]; // Get first error message
        });
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        errors: errors,
      };
    }
  };

  const logout = async () => {
    // Prevent multiple logout calls
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      return; // Already logged out
    }

    try {
      // Clear storage and state BEFORE making API call to prevent interceptor loop
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      
      // Now make the API call (won't trigger interceptor since no auth header)
      await axios.post(`${API_BASE}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Ensure state is cleared
      setToken(null);
      setUser(null);
    }
  };

  const refreshToken = async () => {
    try {
      const devicePayload = getDevicePayload();
      const response = await axios.post(`${API_BASE}/refresh`, { devicePayload });
      const { token: newToken } = response.data.data;

      setToken(newToken);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      console.error('Refresh error:', error);
      // If refresh fails, logout
      logout();
      return { success: false };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};