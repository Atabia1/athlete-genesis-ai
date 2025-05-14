/**
 * Authentication Hook
 *
 * This hook provides authentication functionality including:
 * - Login
 * - Logout
 * - Registration
 * - Password reset
 * - User management
 *
 * It supports both API-based authentication and Supabase authentication,
 * with Supabase as the primary method and API as a fallback.
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, setAuthToken, clearAuthToken } from '@/services/api';
import { useApiQuery, useApiMutation } from '@/hooks/use-api';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean;
  [key: string]: any;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  [key: string]: any;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset data
 */
export interface PasswordResetData {
  token: string;
  password: string;
}

/**
 * Authentication hook result
 */
export interface UseAuthResult {
  /**
   * Current user
   */
  user: User | null;

  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean;

  /**
   * Whether the authentication state is loading
   */
  isLoading: boolean;

  /**
   * Authentication error
   */
  error: Error | null;

  /**
   * Login with email and password
   */
  login: (credentials: LoginCredentials) => Promise<User>;

  /**
   * Logout the current user
   */
  logout: () => Promise<void>;

  /**
   * Register a new user
   */
  register: (data: RegistrationData) => Promise<User>;

  /**
   * Request a password reset
   */
  requestPasswordReset: (request: PasswordResetRequest) => Promise<void>;

  /**
   * Reset password with token
   */
  resetPassword: (data: PasswordResetData) => Promise<void>;

  /**
   * Refresh the current user
   */
  refreshUser: () => Promise<User>;
}

/**
 * Authentication hook
 */
export function useAuth(): UseAuthResult {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get current user
  const {
    data: user,
    isLoading,
    error,
    refetch: refreshUser,
  } = useApiQuery<User | null>(
    ['auth', 'user'],
    async () => {
      try {
        // First try to get user from Supabase
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error getting Supabase session:', sessionError);
          throw sessionError;
        }

        if (sessionData.session) {
          // Get user profile from Supabase
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error fetching profile:', profileError);
          }

          // Construct user object from Supabase data
          const user: User = {
            id: sessionData.session.user.id,
            email: sessionData.session.user.email || '',
            name: profileData?.name || sessionData.session.user.email?.split('@')[0] || 'User',
            role: profileData?.role || 'user',
            createdAt: sessionData.session.user.created_at || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...profileData,
          };

          return user;
        }

        // If no Supabase session, try API
        return await authApi.getCurrentUser();
      } catch (error) {
        // If the error is from Supabase, try the API
        try {
          return await authApi.getCurrentUser();
        } catch (apiError) {
          // If the API error is 401, clear the token and return null
          if (apiError instanceof Response && apiError.status === 401) {
            clearAuthToken();
            return null;
          }
          throw apiError;
        }
      }
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      showErrorToast: false,
    }
  );

  // Login mutation
  const loginMutation = useApiMutation<{ token: string; user: User }, LoginCredentials>(
    async (credentials) => {
      try {
        // First try Supabase authentication
        const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (supabaseError) {
          throw supabaseError;
        }

        if (supabaseData.session) {
          // Get user profile from Supabase
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseData.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

          // Construct user object from Supabase data
          const user: User = {
            id: supabaseData.user.id,
            email: supabaseData.user.email || '',
            name: profileData?.name || supabaseData.user.email?.split('@')[0] || 'User',
            role: profileData?.role || 'user',
            createdAt: supabaseData.user.created_at || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...profileData,
          };

          return {
            token: supabaseData.session.access_token,
            user,
          };
        }

        // Fallback to API authentication if Supabase fails
        return authApi.login(credentials.email, credentials.password);
      } catch (supabaseError) {
        console.error('Supabase authentication failed, falling back to API:', supabaseError);
        // Fallback to API authentication
        return authApi.login(credentials.email, credentials.password);
      }
    },
    {
      onSuccess: (data) => {
        // Set the auth token
        if (data.token) {
          setAuthToken(data.token);
        }

        // Update the user in the cache
        queryClient.setQueryData(['auth', 'user'], data.user);

        // Show success toast
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${data.user.name}!`,
          variant: 'default',
        });

        // Navigate to dashboard
        navigate('/dashboard');
      },
      onError: (error) => {
        // Show error toast
        toast({
          title: 'Login Failed',
          description: error instanceof Error ? error.message : 'An error occurred during login',
          variant: 'destructive',
        });
      },
    }
  );

  // Logout mutation
  const logoutMutation = useApiMutation<void, void>(
    async () => {
      try {
        // First try Supabase logout
        const { error: supabaseError } = await supabase.auth.signOut();

        if (supabaseError) {
          throw supabaseError;
        }

        // If successful, no need to call API logout
        return;
      } catch (supabaseError) {
        console.error('Supabase logout failed, falling back to API:', supabaseError);
        // Fallback to API logout
        return authApi.logout();
      }
    },
    {
      onSuccess: () => {
        // Clear the auth token
        clearAuthToken();

        // Clear the user from the cache
        queryClient.setQueryData(['auth', 'user'], null);

        // Invalidate all queries
        queryClient.invalidateQueries();

        // Show success toast
        toast({
          title: 'Logout Successful',
          description: 'You have been logged out',
          variant: 'default',
        });

        // Navigate to home
        navigate('/');
      },
      onError: (error) => {
        // Show error toast
        toast({
          title: 'Logout Failed',
          description: error instanceof Error ? error.message : 'An error occurred during logout',
          variant: 'destructive',
        });
      },
    }
  );

  // Register mutation
  const registerMutation = useApiMutation<{ token: string; user: User }, RegistrationData>(
    async (data) => {
      try {
        // First try Supabase registration
        const { data: supabaseData, error: supabaseError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
              ...data,
            },
          },
        });

        if (supabaseError) {
          throw supabaseError;
        }

        if (supabaseData.session) {
          // Create a profile in the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: supabaseData.user.id,
                name: data.name,
                email: data.email,
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          if (profileError) {
            console.error('Error creating profile:', profileError);
          }

          // Construct user object from Supabase data
          const user: User = {
            id: supabaseData.user.id,
            email: supabaseData.user.email || '',
            name: data.name,
            role: 'user',
            createdAt: supabaseData.user.created_at || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...profileData,
          };

          return {
            token: supabaseData.session.access_token,
            user,
          };
        }

        // Fallback to API registration if Supabase fails
        return authApi.register(data);
      } catch (supabaseError) {
        console.error('Supabase registration failed, falling back to API:', supabaseError);
        // Fallback to API registration
        return authApi.register(data);
      }
    },
    {
      onSuccess: (data) => {
        // Set the auth token
        if (data.token) {
          setAuthToken(data.token);
        }

        // Update the user in the cache
        queryClient.setQueryData(['auth', 'user'], data.user);

        // Show success toast
        toast({
          title: 'Registration Successful',
          description: `Welcome, ${data.user.name}!`,
          variant: 'default',
        });

        // Navigate to dashboard
        navigate('/dashboard');
      },
      onError: (error) => {
        // Show error toast
        toast({
          title: 'Registration Failed',
          description: error instanceof Error ? error.message : 'An error occurred during registration',
          variant: 'destructive',
        });
      },
    }
  );

  // Request password reset mutation
  const requestPasswordResetMutation = useApiMutation<{ message: string }, PasswordResetRequest>(
    async (request) => {
      try {
        // First try Supabase password reset
        const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(
          request.email,
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );

        if (supabaseError) {
          throw supabaseError;
        }

        return { message: 'Password reset instructions have been sent to your email' };
      } catch (supabaseError) {
        console.error('Supabase password reset failed, falling back to API:', supabaseError);
        // Fallback to API password reset
        return authApi.requestPasswordReset(request.email);
      }
    },
    {
      onSuccess: (data) => {
        // Show success toast
        toast({
          title: 'Password Reset Requested',
          description: data.message || 'Check your email for password reset instructions',
          variant: 'default',
        });
      },
      onError: (error) => {
        // Show error toast
        toast({
          title: 'Password Reset Request Failed',
          description: error instanceof Error ? error.message : 'An error occurred during password reset request',
          variant: 'destructive',
        });
      },
    }
  );

  // Reset password mutation
  const resetPasswordMutation = useApiMutation<{ message: string }, PasswordResetData>(
    async (data) => {
      try {
        // First try Supabase password reset
        const { error: supabaseError } = await supabase.auth.updateUser({
          password: data.password,
        });

        if (supabaseError) {
          throw supabaseError;
        }

        return { message: 'Your password has been successfully reset' };
      } catch (supabaseError) {
        console.error('Supabase password reset failed, falling back to API:', supabaseError);
        // Fallback to API password reset
        return authApi.resetPassword(data.token, data.password);
      }
    },
    {
      onSuccess: (data) => {
        // Show success toast
        toast({
          title: 'Password Reset Successful',
          description: data.message || 'Your password has been reset',
          variant: 'default',
        });

        // Navigate to login
        navigate('/login');
      },
      onError: (error) => {
        // Show error toast
        toast({
          title: 'Password Reset Failed',
          description: error instanceof Error ? error.message : 'An error occurred during password reset',
          variant: 'destructive',
        });
      },
    }
  );

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    const result = await loginMutation.mutateAsync(credentials);
    return result.user;
  }, [loginMutation]);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  // Register function
  const register = useCallback(async (data: RegistrationData): Promise<User> => {
    const result = await registerMutation.mutateAsync(data);
    return result.user;
  }, [registerMutation]);

  // Request password reset function
  const requestPasswordReset = useCallback(async (request: PasswordResetRequest): Promise<void> => {
    await requestPasswordResetMutation.mutateAsync(request);
  }, [requestPasswordResetMutation]);

  // Reset password function
  const resetPassword = useCallback(async (data: PasswordResetData): Promise<void> => {
    await resetPasswordMutation.mutateAsync(data);
  }, [resetPasswordMutation]);

  // Refresh user function
  const refreshUserFn = useCallback(async (): Promise<User> => {
    const result = await refreshUser();
    if (!result) {
      throw new Error('Failed to refresh user');
    }
    return result;
  }, [refreshUser]);

  return {
    user: user || null,
    isAuthenticated: !!user,
    isLoading,
    error: error instanceof Error ? error : null,
    login,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    refreshUser: refreshUserFn,
  };
}
