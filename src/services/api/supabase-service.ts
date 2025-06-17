import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { getConfig } from '@/lib/config';

interface SupabaseQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
}

export class SupabaseService {
  private client: SupabaseClient<Database>;

  constructor() {
    const config = getConfig();
    this.client = createClient<Database>(
      config.supabaseUrl,
      config.supabaseAnonKey
    );
  }

  getClient(): SupabaseClient<Database> {
    return this.client;
  }

  async fetchData<T>(table: string, options: SupabaseQueryOptions = {}): Promise<T[]> {
    try {
      let query = this.client
        .from(table)
        .select('*');

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.offset(options.offset);
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
      throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
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
      throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
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
      throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
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
      throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }

  async query<T>(table: string, query: (queryBuilder: any) => any): Promise<T[]> {
    try {
      let queryBuilder = this.client.from(table).select('*');
      queryBuilder = query(queryBuilder);

      const { data, error } = await queryBuilder;

      if (error) {
        throw error;
      }

      return (data || []) as T[];
    } catch (error) {
      console.error(`Error executing query on ${table}:`, error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
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
      throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
}

export default SupabaseService;
