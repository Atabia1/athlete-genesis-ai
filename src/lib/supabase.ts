
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
  from: (table: string) => ({
    select: () => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        then: (callback: (result: any) => void) => {
          if (table === 'translation_dialects') {
            const dialects = mockTranslationDialects.filter(d => d[column as keyof typeof d] === value);
            callback({ data: dialects, error: null });
          } else if (table === 'translation_contributions') {
            const contributions = mockTranslationContributions.filter(c => c[column as keyof typeof c] === value);
            callback({ data: contributions, error: null });
          } else {
            callback({ data: [], error: null });
          }
        },
      }),
      then: (callback: (result: any) => void) => {
        if (table === 'translation_dialects') {
          callback({ data: mockTranslationDialects, error: null });
        } else if (table === 'translation_contributions') {
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
      eq: (column: string, value: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: { ...data }, error: null }),
        }),
      }),
    }),
  }),
};

// Mock data access methods
export const mockSupabase = {
  getData: async (table: string, options?: any) => {
    if (table === 'translation_dialects') {
      return mockTranslationDialects;
    } else if (table === 'translation_contributions') {
      return mockTranslationContributions;
    }
    return [];
  },
  updateData: async (table: string, id: string, data: any) => {
    return { id, ...data };
  },
};
