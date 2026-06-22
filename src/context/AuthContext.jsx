import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('pakride_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('pakride_token') || null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  // Persist user and token
  useEffect(() => {
    if (token) {
      localStorage.setItem('pakride_token', token);
    } else {
      localStorage.removeItem('pakride_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pakride_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pakride_user');
    }
  }, [user]);

  async function login(email, password) {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }

  async function register(formData) {
    setLoading(true);
    try {
      const data = await authService.register(formData);
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('pakride_token');
    localStorage.removeItem('pakride_user');
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
