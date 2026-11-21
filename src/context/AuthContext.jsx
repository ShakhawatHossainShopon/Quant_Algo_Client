import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('quant_token') || null);
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('quant_admin');
    return saved ? JSON.parse(saved) : null;
  });
  const [authLoading, setAuthLoading] = useState(true);
  const { post } = useApi();

  // Validate session on load
  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('quant_token');
    if (!savedToken) {
      setAuthLoading(false);
      return;
    }

    try {
      const res = await post('/api/auth/me', { token: savedToken });
      if (res.success && res.data) {
        setAdmin(res.data);
        localStorage.setItem('quant_admin', JSON.stringify(res.data));
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setAuthLoading(false);
    }
  }, [post]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    const res = await post('/api/auth/login', { username, password });
    if (res.success && res.data) {
      const { token: newToken, admin: adminData } = res.data;
      setToken(newToken);
      setAdmin(adminData);
      localStorage.setItem('quant_token', newToken);
      localStorage.setItem('quant_admin', JSON.stringify(adminData));
      return res.data;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = async () => {
    if (token) {
      try {
        await post('/api/auth/logout', { token });
      } catch (e) {
        // ignore logout network errors
      }
    }
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('quant_token');
    localStorage.removeItem('quant_admin');
  };

  return (
    <AuthContext.Provider value={{ token, admin, isAuthenticated: !!token, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
