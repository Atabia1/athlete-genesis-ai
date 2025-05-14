/**
 * Environment Configuration Utility
 *
 * This utility provides a standardized way to access environment variables and
 * runtime configuration. It supports both development and production environments,
 * and can load configuration from different sources:
 *
 * 1. Vite environment variables (import.meta.env)
 * 2. Runtime configuration (window.APP_CONFIG)
 * 3. Local .env file (via Vite)
 *
 * The configuration is loaded in the following order of precedence:
 * 1. Runtime configuration (highest priority)
 * 2. Vite environment variables
 * 3. Default values (lowest priority)
 */

// Define the configuration interface
export interface AppConfig {
  // API configuration
  API_BASE_URL: string;

  // Authentication configuration
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;

  // Payment configuration
  PAYSTACK_PUBLIC_KEY: string;

  // External services
  OPENAI_API_KEY?: string;

  // Firebase configuration
  FIREBASE_API_KEY?: string;
  FIREBASE_AUTH_DOMAIN?: string;
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_STORAGE_BUCKET?: string;
  FIREBASE_MESSAGING_SENDER_ID?: string;
  FIREBASE_APP_ID?: string;
  FIREBASE_MEASUREMENT_ID?: string;

  // Feature flags
  ENABLE_OFFLINE_MODE?: boolean;
  ENABLE_ANALYTICS?: boolean;

  // Environment information
  NODE_ENV: 'development' | 'production' | 'test';
  IS_PRODUCTION: boolean;
  IS_DEVELOPMENT: boolean;
  IS_TEST: boolean;
}

// Declare the global APP_CONFIG variable
declare global {
  interface Window {
    APP_CONFIG?: Partial<AppConfig>;
  }
}

// Default configuration values
const defaultConfig: AppConfig = {
  // API configuration
  API_BASE_URL: 'https://api.athletegenesis.ai',

  // Authentication configuration
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',

  // Payment configuration
  PAYSTACK_PUBLIC_KEY: '',

  // Feature flags
  ENABLE_OFFLINE_MODE: true,
  ENABLE_ANALYTICS: true,

  // Environment information
  NODE_ENV: import.meta.env.MODE as 'development' | 'production' | 'test',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_TEST: import.meta.env.MODE === 'test',
};

// Load configuration from Vite environment variables
const viteConfig: Partial<AppConfig> = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  PAYSTACK_PUBLIC_KEY: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string,
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY as string,
  FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY as string,
  FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID as string,
  FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
  ENABLE_OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};

// Load runtime configuration from window.APP_CONFIG
const runtimeConfig: Partial<AppConfig> = typeof window !== 'undefined' ? window.APP_CONFIG || {} : {};

// Merge configurations with the correct precedence
export const config: AppConfig = {
  ...defaultConfig,
  ...Object.fromEntries(
    Object.entries(viteConfig).filter(([_, value]) => value !== undefined && value !== '')
  ),
  ...Object.fromEntries(
    Object.entries(runtimeConfig).filter(([_, value]) => value !== undefined && value !== '')
  ),
};

/**
 * Get a configuration value
 * @param key The configuration key
 * @returns The configuration value
 */
export function getConfig<K extends keyof AppConfig>(key: K): AppConfig[K] {
  return config[key];
}

/**
 * Check if a feature is enabled
 * @param feature The feature name
 * @returns Whether the feature is enabled
 */
export function isFeatureEnabled(feature: 'OFFLINE_MODE' | 'ANALYTICS'): boolean {
  switch (feature) {
    case 'OFFLINE_MODE':
      return !!config.ENABLE_OFFLINE_MODE;
    case 'ANALYTICS':
      return !!config.ENABLE_ANALYTICS;
    default:
      return false;
  }
}

/**
 * Get the API base URL
 * @returns The API base URL
 */
export function getApiBaseUrl(): string {
  return config.API_BASE_URL;
}

/**
 * Get the Supabase configuration
 * @returns The Supabase configuration
 */
export function getSupabaseConfig(): { url: string; anonKey: string } {
  return {
    url: config.SUPABASE_URL,
    anonKey: config.SUPABASE_ANON_KEY,
  };
}

/**
 * Get the Paystack public key
 * @returns The Paystack public key
 */
export function getPaystackPublicKey(): string {
  return config.PAYSTACK_PUBLIC_KEY;
}

/**
 * Get the Firebase configuration
 * @returns The Firebase configuration or null if not configured
 */
export function getFirebaseConfig(): Record<string, string> | null {
  if (!config.FIREBASE_API_KEY || !config.FIREBASE_PROJECT_ID) {
    return null;
  }

  return {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: config.FIREBASE_AUTH_DOMAIN || `${config.FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: config.FIREBASE_PROJECT_ID,
    storageBucket: config.FIREBASE_STORAGE_BUCKET || `${config.FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: config.FIREBASE_APP_ID || '',
    measurementId: config.FIREBASE_MEASUREMENT_ID || '',
  };
}

/**
 * Get the OpenAI configuration
 * @returns The OpenAI configuration
 */
export function getOpenAIConfig(): { apiKey: string | null } {
  return {
    apiKey: config.OPENAI_API_KEY || null,
  };
}

// Export the configuration
export default config;
