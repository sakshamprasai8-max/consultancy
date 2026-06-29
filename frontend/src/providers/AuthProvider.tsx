'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'CONSULTANT' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (email: string, firstName: string, lastName: string, googleId: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        // Verify token against /auth/me to refresh state
        try {
          const res = await api.get('/auth/me');
          const freshUser = res.data.data;
          setUser({
            id: freshUser.id,
            email: freshUser.email,
            firstName: freshUser.firstName,
            lastName: freshUser.lastName,
            role: freshUser.role,
          });
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (err) {
          console.error('Failed to sync auth session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Route Guading Logic
  useEffect(() => {
    if (loading) return;

    const isPortalRoute = pathname?.startsWith('/portal');
    const isAdminRoute = pathname?.startsWith('/admin');

    if (isPortalRoute && !user) {
      router.push('/contact?tab=login&redirect=' + encodeURIComponent(pathname));
    } else if (isAdminRoute) {
      if (!user) {
        router.push('/contact?tab=login&redirect=' + encodeURIComponent(pathname));
      } else if (user.role !== 'ADMIN' && user.role !== 'CONSULTANT') {
        router.push('/portal'); // Redirect regular students away from admin
      }
    }
  }, [user, pathname, loading, router]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: loggedUser, accessToken, refreshToken } = res.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      setUser(loggedUser);

      // Handle redirect if exists in query parameters
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect) {
        router.push(redirect);
      } else if (loggedUser.role === 'ADMIN' || loggedUser.role === 'CONSULTANT') {
        router.push('/admin');
      } else {
        router.push('/portal');
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (email: string, firstName: string, lastName: string, googleId: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google-login', { email, firstName, lastName, googleId });
      const { user: loggedUser, accessToken, refreshToken } = res.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      setUser(loggedUser);
      router.push('/portal');
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, phone?: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { email, password, firstName, lastName, phone });
      const { user: newUser, accessToken, refreshToken } = res.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      setUser(newUser);
      router.push('/portal');
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
