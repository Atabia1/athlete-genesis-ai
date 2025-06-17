
/**
 * Supabase Client
 * 
 * This file provides a mock Supabase client for development purposes.
 * In a production environment, this would be replaced with a real Supabase client.
 */

// Mock Supabase client for development
// In a real application, you would use your actual Supabase URL and anon key
const supabaseUrl = 'https://example.supabase.co';
const supabaseAnonKey = 'your-anon-key';

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
  {
    id: '2',
    language: 'tw',
    dialect_code: 'ak',
    dialect_name: 'Akuapem Twi',
    dialect_native_name: 'Akuapem Twi',
    region: 'Eastern Region',
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    language: 'tw',
    dialect_code: 'fa',
    dialect_name: 'Fante',
    dialect_native_name: 'Fante',
    region: 'Central Region',
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Simple mock client with basic functionality
export const supabaseClient = {
  from: (table: string) => ({
    select: () => ({
      eq: (column: string, value: any) => ({
        single: () => {
          if (table === 'translation_contributions') {
            const contribution = mockTranslationContributions.find(c => c[column as keyof typeof c] === value);
            return Promise.resolve({ data: contribution, error: null });
          }
          return Promise.resolve({ data: null, error: null });
        },
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
      match: (filters: Record<string, any>) => ({
        then: (callback: (result: any) => void) => {
          if (table === 'translation_contributions') {
            const contributions = mockTranslationContributions.filter(c => {
              return Object.entries(filters).every(([key, value]) => c[key as keyof typeof c] === value);
            });
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
        single: () => {
          if (table === 'translation_contributions') {
            const newContribution = {
              id: String(mockTranslationContributions.length + 1),
              ...data,
            };
            mockTranslationContributions.push(newContribution);
            return Promise.resolve({ data: newContribution, error: null });
          } else if (table === 'translation_dialects') {
            const newDialect = {
              id: String(mockTranslationDialects.length + 1),
              ...data,
            };
            mockTranslationDialects.push(newDialect);
            return Promise.resolve({ data: newDialect, error: null });
          }
          return Promise.resolve({ data: null, error: null });
        },
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: () => {
            if (table === 'translation_contributions') {
              const index = mockTranslationContributions.findIndex(c => c[column as keyof typeof c] === value);
              if (index !== -1) {
                mockTranslationContributions[index] = {
                  ...mockTranslationContributions[index],
                  ...data,
                };
                return Promise.resolve({ data: mockTranslationContributions[index], error: null });
              }
            } else if (table === 'translation_dialects') {
              const index = mockTranslationDialects.findIndex(d => d[column as keyof typeof d] === value);
              if (index !== -1) {
                mockTranslationDialects[index] = {
                  ...mockTranslationDialects[index],
                  ...data,
                };
                return Promise.resolve({ data: mockTranslationDialects[index], error: null });
              }
            }
            return Promise.resolve({ data: null, error: null });
          },
        }),
      }),
    }),
  }),
};

// Mock data access methods
export const mockSupabase = {
  getData: async (table: string, options?: any) => {
    if (table === 'translation_dialects') {
      if (options?.filters) {
        return mockTranslationDialects.filter(d => {
          return Object.entries(options.filters).every(([key, value]) => d[key as keyof typeof d] === value);
        });
      }
      return mockTranslationDialects;
    } else if (table === 'translation_contributions') {
      if (options?.filters) {
        return mockTranslationContributions.filter(c => {
          return Object.entries(options.filters).every(([key, value]) => c[key as keyof typeof c] === value);
        });
      }
      return mockTranslationContributions;
    }
    return [];
  },
  updateData: async (table: string, id: string, data: any) => {
    if (table === 'translation_contributions') {
      const index = mockTranslationContributions.findIndex(c => c.id === id);
      if (index !== -1) {
        mockTranslationContributions[index] = {
          ...mockTranslationContributions[index],
          ...data,
        };
        return mockTranslationContributions[index];
      }
    } else if (table === 'translation_dialects') {
      const index = mockTranslationDialects.findIndex(d => d.id === id);
      if (index !== -1) {
        mockTranslationDialects[index] = {
          ...mockTranslationDialects[index],
          ...data,
        };
        return mockTranslationDialects[index];
      }
    }
    return null;
  },
};
