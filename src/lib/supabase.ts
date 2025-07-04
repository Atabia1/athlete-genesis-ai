
/**
 * Supabase Client
 * 
 * This file provides a mock Supabase client for development purposes.
 * In a production environment, this would be replaced with a real Supabase client.
 */

// Mock data for translation contributions
const mockTranslationContributions = [
  {
    id: '1',
    key: 'app.title',
    language: 'tw',
    translation: 'Athlete Genesis AI',
    contributor_name: 'John Doe',
    contributor_email: 'john@example.com',
    notes: 'This is a test contribution',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock data for translation dialects
const mockTranslationDialects = [
  {
    id: '1',
    language: 'tw',
    dialect_code: 'as',
    dialect_name: 'Asante Twi',
    dialect_native_name: 'Asante Twi',
    region: 'Ashanti Region',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Simple mock client with basic functionality
export const supabaseClient = {
  from: (tableName: string) => ({
    select: () => ({
      eq: (_column: string, _value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        then: (callback: (result: any) => void) => {
          if (tableName === 'translation_dialects') {
            callback({ data: mockTranslationDialects, error: null });
          } else if (tableName === 'translation_contributions') {
            callback({ data: mockTranslationContributions, error: null });
          } else {
            callback({ data: [], error: null });
          }
        },
      }),
      then: (callback: (result: any) => void) => {
        if (tableName === 'translation_dialects') {
          callback({ data: mockTranslationDialects, error: null });
        } else if (tableName === 'translation_contributions') {
          callback({ data: mockTranslationContributions, error: null });
        } else {
          callback({ data: [], error: null });
        }
      },
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: { id: '1', ...data }, error: null }),
      }),
    }),
    update: (data: any) => ({
      eq: (_column: string, _value: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: { ...data }, error: null }),
        }),
      }),
    }),
  }),
};

// Mock data access methods
export const mockSupabase = {
  getData: async (tableName: string, _options?: any) => {
    if (tableName === 'translation_dialects') {
      return mockTranslationDialects;
    } else if (tableName === 'translation_contributions') {
      return mockTranslationContributions;
    }
    return [];
  },
  updateData: async (_tableName: string, id: string, data: any) => {
    return { id, ...data };
  },
};
