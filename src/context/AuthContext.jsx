import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'super_admin_token';
const DATA_KEY = 'super_admin_data';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [superAdmin, setSuperAdmin] = useState(() => {
    const raw = localStorage.getItem(DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (superAdmin) localStorage.setItem(DATA_KEY, JSON.stringify(superAdmin));
    else localStorage.removeItem(DATA_KEY);
  }, [superAdmin]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/super-admin/auth/login', { email, password });
      setToken(data.token);
      setSuperAdmin(data.superAdmin);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setSuperAdmin(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(DATA_KEY);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, superAdmin, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
