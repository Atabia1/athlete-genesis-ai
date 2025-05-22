/**
 * Supabase Service
 *
 * This service provides a wrapper around the Supabase client for interacting
 * with the Supabase backend. It handles authentication, data fetching, and
 * error handling.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import { getSupabaseConfig } from '@/utils/env-config';

/**
 * Supabase service interface
 */
export interface SupabaseService {
  getClient(): SupabaseClient;
  getData<T>(table: string, query?: any): Promise<T[]>;
  insertData<T>(table: string, data: Partial<T>): Promise<T>;
  updateData<T>(table: string, id: string, data: Partial<T>): Promise<T>;
  deleteData(table: string, id: string): Promise<void>;
}

/**
 * Supabase service implementation
 */
export class SupabaseServiceImpl implements SupabaseService {
  private client: SupabaseClient;

  constructor() {
    try {
      // Get the Supabase configuration from environment variables
      const { url, anonKey } = getSupabaseConfig();

      // Check if the URL and anonymous key are available
      if (!url || !anonKey) {
        // Use placeholder values for development and log a warning
        console.warn('Supabase environment variables are not set. Using placeholder values for development. For production, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY or configure window.APP_CONFIG.');
        
        // Initialize with public placeholder values for development
        // These won't work for actual database operations but prevent runtime errors
        this.client = createClient(
          'https://placeholder-supabase-url.supabase.co', 
          'placeholder-anon-key'
        );
      } else {
        // Initialize with real credentials
        this.client = createClient(url, anonKey);
      }
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
      // Initialize with placeholder values if there's an error
      this.client = createClient(
        'https://placeholder-supabase-url.supabase.co', 
        'placeholder-anon-key'
      );
    }
  }

  /**
   * Get the Supabase client
   */
  getClient(): SupabaseClient {
    return this.client;
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<any> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: 'Sign In Failed',
        description: error.message || 'An error occurred during sign in',
        variant: 'destructive',
      });
      throw error;
    }
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(email: string, password: string): Promise<any> {
    try {
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: 'Sign Up Failed',
        description: error.message || 'An error occurred during sign up',
        variant: 'destructive',
      });
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      const { error } = await this.client.auth.signOut();

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Sign Out Failed',
        description: error.message || 'An error occurred during sign out',
        variant: 'destructive',
      });
      throw error;
    }
  }

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<any> {
    try {
      const { data, error } = await this.client.auth.getUser();

      if (error) {
        throw error;
      }

      return data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Get data from a table
   */
  async getData<T>(table: string, query?: any): Promise<T[]> {
    try {
      let queryBuilder = this.client.from(table).select('*');

      // Apply filters if provided
      if (query) {
        if (query.filters) {
          for (const [key, value] of Object.entries(query.filters)) {
            queryBuilder = queryBuilder.eq(key, value);
          }
        }

        if (query.limit) {
          queryBuilder = queryBuilder.limit(query.limit);
        }

        if (query.order) {
          queryBuilder = queryBuilder.order(query.order.column, {
            ascending: query.order.ascending,
          });
        }
      }

      const { data, error } = await queryBuilder;

      if (error) {
        throw error;
      }

      return data as T[];
    } catch (error) {
      console.error(`Error getting data from ${table}:`, error);
      toast({
        title: 'Data Fetch Failed',
        description: error.message || `An error occurred while fetching data from ${table}`,
        variant: 'destructive',
      });
      throw error;
    }
  }

  /**
   * Insert data into a table
   */
  async insertData<T>(table: string, data: Partial<T>): Promise<T> {
    try {
      const { data: insertedData, error } = await this.client
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return insertedData as T;
    } catch (error) {
      console.error(`Error inserting data into ${table}:`, error);
      toast({
        title: 'Data Insert Failed',
        description: error.message || `An error occurred while inserting data into ${table}`,
        variant: 'destructive',
      });
      throw error;
    }
  }

  /**
   * Update data in a table
   */
  async updateData<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    try {
      const { data: updatedData, error } = await this.client
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return updatedData as T;
    } catch (error) {
      console.error(`Error updating data in ${table}:`, error);
      toast({
        title: 'Data Update Failed',
        description: error.message || `An error occurred while updating data in ${table}`,
        variant: 'destructive',
      });
      throw error;
    }
  }

  /**
   * Delete data from a table
   */
  async deleteData(table: string, id: string): Promise<void> {
    try {
      const { error } = await this.client
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Error deleting data from ${table}:`, error);
      toast({
        title: 'Data Delete Failed',
        description: error.message || `An error occurred while deleting data from ${table}`,
        variant: 'destructive',
      });
      throw error;
    }
  }
}
