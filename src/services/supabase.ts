
/**
 * Supabase Service
 * 
 * This service provides a unified interface for interacting with Supabase
 * across the application.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
  filters?: Array<{ column: string; operator: string; value: any }>;
}

export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    // Use environment variables directly since config import is causing issues
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    
    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.client.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();

    if (error) {
      throw error;
    }
  }

  /**
   * Get workout plans for a user
   */
  async getWorkoutPlans<T = any>(userId: string): Promise<T[]> {
    const { data, error } = await this.client
      .from('workout_plans')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data as T[];
  }

  /**
   * Create a workout plan
   */
  async createWorkoutPlan<T = any>(workoutPlan: Partial<T>): Promise<T> {
    const { data, error } = await this.client
      .from('workout_plans')
      .insert(workoutPlan)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  /**
   * Update a workout plan
   */
  async updateWorkoutPlan<T = any>(id: string, updates: Partial<T>): Promise<T> {
    const { data, error } = await this.client
      .from('workout_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  /**
   * Delete a workout plan
   */
  async deleteWorkoutPlan<T = any>(id: string): Promise<void> {
    const { error } = await this.client
      .from('workout_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Get nutrition logs for a user
   */
  async getNutritionLogs<T = any>(userId: string): Promise<T[]> {
    const { data, error } = await this.client
      .from('nutrition_logs')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data as T[];
  }

  /**
   * Create a nutrition log entry
   */
  async createNutritionLog<T = any>(nutritionLog: Partial<T>): Promise<T> {
    const { data, error } = await this.client
      .from('nutrition_logs')
      .insert(nutritionLog)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  async fetchData<T>(table: string, options: SupabaseQueryOptions = {}): Promise<T[]> {
    try {
      let query = this.client
        .from(table)
        .select('*');

      // Apply filters
      if (options.filters) {
        options.filters.forEach(filter => {
          query = query.filter(filter.column, filter.operator, filter.value);
        });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []) as T[];
    } catch (error) {
      console.error(`Error fetching data from ${table}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(errorMessage);
    }
  }

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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(errorMessage);
    }
  }

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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(errorMessage);
    }
  }

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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(errorMessage);
    }
  }

  async query<T>(table: string, queryBuilder: (q: any) => any): Promise<T[]> {
    try {
      let query = this.client.from(table).select('*');
      query = queryBuilder(query);

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []) as T[];
    } catch (error) {
      console.error(`Error executing query on ${table}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(errorMessage);
    }
  }

  async executeFunction<T>(functionName: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const { data, error } = await this.client
        .rpc(functionName, params);

      if (error) {
        throw error;
      }

      return data as T;
    } catch (error) {
      console.error(`Error executing function ${functionName}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
export default supabaseService;
