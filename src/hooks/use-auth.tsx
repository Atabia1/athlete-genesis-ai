
import { useState } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  user_type: string;
  displayName?: string;
  subscriptionTier?: string;
  refreshUser?: () => Promise<void>;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData?: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      // Mock login implementation
      const mockUser: AuthUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'user',
        user_type: 'individual',
        displayName: email.split('@')[0],
        subscriptionTier: 'free',
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string) => {
    setIsLoading(true);
    try {
      // Mock register implementation
      const mockUser: AuthUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'user',
        user_type: 'individual',
        displayName: email.split('@')[0],
        subscriptionTier: 'free',
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const refreshUser = async () => {
    // Mock refresh implementation
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    refreshUser,
  };
}
