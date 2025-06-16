
import { useCallback } from 'react';

interface AuthUser {
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
}

interface UseAuthReturn {
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
  const [isLoading, setIsLoading] = useState(false);

  const setAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
  };

  const removeAuthToken = () => {
    localStorage.removeItem('authToken');
  };

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const fetchUserProfile = async (token: string): Promise<any> => {
    const response = await fetch('https://api.example.com/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  };

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const profile = await fetchUserProfile(token);
        const authUser = await getUserProfile(profile);
        setUser(authUser);
      } catch (error) {
        console.error('Error refreshing user:', error);
        removeAuthToken();
        setUser(null);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.example.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setAuthToken(data.token);
      await refreshUser();
    } catch (error) {
      console.error('Login error:', error);
      removeAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData?: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.example.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, ...userData }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      setAuthToken(data.token);
      await refreshUser();
    } catch (error) {
      console.error('Registration error:', error);
      removeAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    removeAuthToken();
    setUser(null);
  };

  const getUserProfile = useCallback(async (user: any): Promise<AuthUser> => {
    return {
      id: user.id,
      email: user.email,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
      role: user.user_type || 'individual',
      avatar_url: user.avatar_url,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: user.user_type || 'individual',
      displayName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
      subscriptionTier: user.subscription_tier || 'free',
    };
  }, []);

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

export type { AuthUser, UseAuthReturn };
