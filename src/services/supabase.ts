/**
 * Supabase Client
 * 
 * This module provides a Supabase client instance configured with
 * environment variables from the env-config utility.
 */

import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '@/utils/env-config';

// Get Supabase configuration from environment
const { url, anonKey } = getSupabaseConfig();

// Create Supabase client
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Authentication service using Supabase
 */
export const authService = {
  /**
   * Sign up with email and password
   */
  signUp: async (email: string, password: string, metadata?: Record<string, any>) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  },

  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  /**
   * Sign in with OAuth provider
   */
  signInWithOAuth: async (provider: 'google' | 'facebook' | 'twitter' | 'github') => {
    return supabase.auth.signInWithOAuth({
      provider,
    });
  },

  /**
   * Sign out
   */
  signOut: async () => {
    return supabase.auth.signOut();
  },

  /**
   * Get current session
   */
  getSession: async () => {
    return supabase.auth.getSession();
  },

  /**
   * Get current user
   */
  getUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  /**
   * Reset password
   */
  resetPassword: async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  /**
   * Update password
   */
  updatePassword: async (password: string) => {
    return supabase.auth.updateUser({
      password,
    });
  },

  /**
   * Update user metadata
   */
  updateUser: async (attributes: { email?: string; password?: string; data?: Record<string, any> }) => {
    return supabase.auth.updateUser(attributes);
  },
};

/**
 * Database service using Supabase
 */
export const dbService = {
  /**
   * Get all records from a table
   */
  getAll: async <T>(table: string) => {
    return supabase.from<T>(table).select('*');
  },

  /**
   * Get a record by ID
   */
  getById: async <T>(table: string, id: string) => {
    return supabase.from<T>(table).select('*').eq('id', id).single();
  },

  /**
   * Create a record
   */
  create: async <T>(table: string, data: Partial<T>) => {
    return supabase.from<T>(table).insert(data).select().single();
  },

  /**
   * Update a record
   */
  update: async <T>(table: string, id: string, data: Partial<T>) => {
    return supabase.from<T>(table).update(data).eq('id', id).select().single();
  },

  /**
   * Delete a record
   */
  delete: async <T>(table: string, id: string) => {
    return supabase.from<T>(table).delete().eq('id', id);
  },

  /**
   * Query records
   */
  query: async <T>(table: string) => {
    return supabase.from<T>(table).select();
  },
};

/**
 * Storage service using Supabase
 */
export const storageService = {
  /**
   * Upload a file
   */
  upload: async (bucket: string, path: string, file: File) => {
    return supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });
  },

  /**
   * Download a file
   */
  download: async (bucket: string, path: string) => {
    return supabase.storage.from(bucket).download(path);
  },

  /**
   * Get a public URL for a file
   */
  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage.from(bucket).getPublicUrl(path);
  },

  /**
   * Delete a file
   */
  delete: async (bucket: string, path: string) => {
    return supabase.storage.from(bucket).remove([path]);
  },

  /**
   * List files in a bucket
   */
  list: async (bucket: string, path?: string) => {
    return supabase.storage.from(bucket).list(path);
  },
};

export default supabase;
