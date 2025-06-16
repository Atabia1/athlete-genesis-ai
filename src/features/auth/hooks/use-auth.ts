import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  user_type: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData?: any) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to store auth token in local storage
  const setAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
  };

  // Function to remove auth token from local storage
  const removeAuthToken = () => {
    localStorage.removeItem('authToken');
  };

  // Function to get auth token from local storage
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Function to fetch user profile
  const fetchUserProfile = async (token: string): Promise<any> => {
    // Replace with your actual API endpoint and token
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

  const { refetch: fetchProfile } = useQuery(
    'userProfile',
    async () => {
      const token = getAuthToken();
      if (!token) {
        return null;
      }

      const profile = await fetchUserProfile(token);
      return profile;
    },
    {
      enabled: false, // Disable automatic fetching
      retry: false,
      onSuccess: (profile) => {
        if (profile) {
          getUserProfile(profile).then(authUser => {
            setUser(authUser);
            setIsLoading(false);
          });
        } else {
          setUser(null);
          setIsLoading(false);
        }
      },
      onError: () => {
        setUser(null);
        setIsLoading(false);
        removeAuthToken();
      },
    }
  );

  // Login mutation
  const loginMutation = useMutation(
    async ({ email, password }: any) => {
      // Replace with your actual API endpoint
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

      return response.json();
    },
    {
      onSuccess: (data) => {
        setAuthToken(data.token);
        fetchProfile();
      },
      onError: (error: any) => {
        console.error('Login error:', error.message);
        removeAuthToken();
        setUser(null);
      },
    }
  );

  // Register mutation
  const registerMutation = useMutation(
    async ({ email, password, userData }: any) => {
      // Replace with your actual API endpoint
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

      return response.json();
    },
    {
      onSuccess: (data) => {
        setAuthToken(data.token);
        fetchProfile();
      },
      onError: (error: any) => {
        console.error('Registration error:', error.message);
        removeAuthToken();
        setUser(null);
      },
    }
  );

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await loginMutation.mutateAsync({ email, password });
  };

  // Register function
  const register = async (email: string, password: string, userData?: any) => {
    setIsLoading(true);
    await registerMutation.mutateAsync({ email, password, userData });
  };

  // Logout function
  const logout = async () => {
    removeAuthToken();
    setUser(null);
  };

  useEffect(() => {
    setIsLoading(true);
    const token = getAuthToken();
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const getUserProfile = useCallback(async (user: any): Promise<AuthUser> => {
    // Map profile data to AuthUser interface
    return {
      id: user.id,
      email: user.email,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
      role: user.user_type || 'individual',
      avatar_url: user.avatar_url,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: user.user_type || 'individual',
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };
}
