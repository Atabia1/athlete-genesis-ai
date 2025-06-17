
/**
 * Runtime Configuration
 * 
 * This module provides access to runtime configuration values that are
 * injected during the build process or loaded from the window.APP_CONFIG
 * global object.
 */

// Define the shape of our configuration
interface AppConfig {
  API_BASE_URL: string;
  PAYSTACK_PUBLIC_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

// Declare the global APP_CONFIG property
declare global {
  interface Window {
    APP_CONFIG?: Partial<AppConfig>;
  }
}

// Default configuration (used during development)
const defaultConfig: AppConfig = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  PAYSTACK_PUBLIC_KEY: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

/**
 * Get the current application configuration
 */
export function getConfig(): AppConfig {
  if (typeof window !== 'undefined' && window.APP_CONFIG) {
    return {
      ...defaultConfig,
      ...window.APP_CONFIG,
    };
  }
  
  return defaultConfig;
}

// Export individual configuration values for convenience
export const API_BASE_URL = getConfig().API_BASE_URL;
export const PAYSTACK_PUBLIC_KEY = getConfig().PAYSTACK_PUBLIC_KEY;
export const SUPABASE_URL = getConfig().SUPABASE_URL;
export const SUPABASE_ANON_KEY = getConfig().SUPABASE_ANON_KEY;

export default getConfig();
