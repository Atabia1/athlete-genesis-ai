/**
 * i18n Configuration
 * 
 * This is a simplified mock implementation of i18n for the application.
 * It provides basic translation functionality without the full i18n library.
 */

// Mock i18n instance
const i18n = {
  // Current language
  language: 'en',

  // Change language
  changeLanguage: (language: string) => {
    i18n.language = language;
    return Promise.resolve();
  },

  // Translate a key
  t: (key: string, params?: Record<string, string | number>) => {
    // Simple mock implementation that just returns the key
    if (!key) return '';
    
    // If the key contains a namespace, strip it
    const actualKey = key.includes(':') ? key.split(':')[1] : key;
    
    // Return the key as the translation
    return actualKey;
  },

  // Check if a key exists
  exists: (key: string) => {
    return true;
  },

  // Get all languages
  languages: ['en'],

  // Add resource bundle
  addResourceBundle: (lng: string, ns: string, resources: any) => {
    return i18n;
  },

  // Get resource bundle
  getResourceBundle: (lng: string, ns: string) => {
    return {};
  },
};

export default i18n;
