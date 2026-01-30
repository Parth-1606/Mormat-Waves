'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isArtist?: boolean;
  musicTypes?: string[];
  license?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Simple JWT encoding/decoding (for demo - in production use a proper library)
const encodeJWT = (payload: any, secret: string): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(JSON.stringify({ ...payload, secret }));
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const decodeJWT = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const JWT_SECRET = 'your-secret-key-change-in-production';

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      const decoded = decodeJWT(storedToken);
      if (decoded && decoded.exp > Date.now() / 1000) {
        setToken(storedToken);
        setUser(decoded.user);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // In production, this would be an API call
      // For demo, we'll simulate authentication
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      // Demo: accept any email/password for testing
      // In production, verify against your backend
      const userData: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
      };

      const payload = {
        user: userData,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      };

      const jwtToken = encodeJWT(payload, JWT_SECRET);
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('auth_token', jwtToken);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // In production, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      const userData: User = {
        id: `user_${Date.now()}`,
        email,
        name,
      };

      const payload = {
        user: userData,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      };

      const jwtToken = encodeJWT(payload, JWT_SECRET);
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('auth_token', jwtToken);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
