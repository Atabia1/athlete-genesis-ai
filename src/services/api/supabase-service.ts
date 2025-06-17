
import { SupabaseClient, createClient } from '@supabase/supabase-js';

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
    // Use direct URLs for now since config is not available
    const supabaseUrl = 'https://ykgceurbedpusquqepdq.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrZ2NldXJiZWRwdXNxdXFlcGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDIzMDMsImV4cCI6MjA2MDQ3ODMwM30.JrTGuh-KI9GPBIYgFHvcnVUB4fP4GKhj-wqCrXedtNU';
    
    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  getClient(): SupabaseClient {
    return this.client;
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

export default SupabaseService;
