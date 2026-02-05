'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isArtist?: boolean;
  isOnboarded?: boolean;
  musicTypes?: string[];
  license?: string;
  bio?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; isOnboarded?: boolean }>;
  register: (email: string, password: string, name: string, role?: 'buyer' | 'seller') => Promise<{ success: boolean; error?: string; isOnboarded?: boolean }>;
  loginWithGoogle: (role?: 'buyer' | 'seller') => Promise<{ success: boolean; error?: string; isOnboarded?: boolean }>;
  logout: () => void;
  completeOnboarding: (data: any) => Promise<void>;
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

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; isOnboarded?: boolean }> => {
    try {
      // In production, this would be an API call
      // For demo, we'll simulate authentication
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      // Demo: check tracking for specific user to simulate onboarding status persistence
      // In a real app, this comes from DB
      const trackingKey = `user_onboarding_${email}`;
      const hasOnboarded = localStorage.getItem(trackingKey) === 'true';

      const userData: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
        isOnboarded: hasOnboarded,
      };

      const payload = {
        user: userData,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      };

      const jwtToken = encodeJWT(payload, JWT_SECRET);
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('auth_token', jwtToken);

      return { success: true, isOnboarded: hasOnboarded };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (email: string, password: string, name: string, role: 'buyer' | 'seller' = 'buyer'): Promise<{ success: boolean; error?: string; isOnboarded?: boolean }> => {
    try {
      // In production, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      const userData: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        role,
        isOnboarded: role === 'buyer', // Buyers don't need artist onboarding
      };

      const payload = {
        user: userData,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      };

      const jwtToken = encodeJWT(payload, JWT_SECRET);
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('auth_token', jwtToken);

      return { success: true, isOnboarded: role === 'buyer' };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const loginWithGoogle = async (role: 'buyer' | 'seller' = 'buyer'): Promise<{ success: boolean; error?: string; isOnboarded?: boolean }> => {
    try {
      // PROD_TODO: Implement real Google OAuth here using Better-Auth or NextAuth
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

      // Mock user data from Google
      const googleUserEmail = 'user@gmail.com';
      const googleUserName = 'Google User';

      const trackingKey = `user_onboarding_${googleUserEmail}`;
      const hasOnboarded = localStorage.getItem(trackingKey) === 'true';

      const userData: User = {
        id: `google_user_${Date.now()}`,
        email: googleUserEmail,
        name: googleUserName,
        role,
        isOnboarded: hasOnboarded || role === 'buyer',
      };

      const payload = {
        user: userData,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
      };

      const jwtToken = encodeJWT(payload, JWT_SECRET);
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('auth_token', jwtToken);

      return { success: true, isOnboarded: hasOnboarded || role === 'buyer' };
    } catch (error) {
      return { success: false, error: 'Google Sign In failed.' };
    }
  };

  const completeOnboarding = async (data: any) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...data,
      name: data.artistName || user.name,
      isOnboarded: true,
      musicTypes: data.genres,
    };

    const payload = {
      user: updatedUser,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
    };

    const jwtToken = encodeJWT(payload, JWT_SECRET);
    setToken(jwtToken);
    setUser(updatedUser);
    localStorage.setItem('auth_token', jwtToken);

    // Save to tracking for demo persistence across logins
    if (user.email) {
      localStorage.setItem(`user_onboarding_${user.email}`, 'true');
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
        loginWithGoogle,
        logout,
        completeOnboarding,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
