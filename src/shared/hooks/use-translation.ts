
/**
 * useTranslation: Hook for internationalization and localization
 * 
 * This hook provides a way to translate text in components using i18next.
 * It handles loading translations, language switching, and provides
 * utilities for formatting messages with parameters.
 */

import { useTranslation as useI18nTranslation } from 'react-i18next';

/**
 * Translation function type
 */
export type TFunction = (key: string, options?: Record<string, any>) => string;

/**
 * Enhanced translation hook that integrates with our language preference system
 */
export function useTranslation() {
  // Use i18next's useTranslation hook
  const translation = useI18nTranslation();
  
  return translation;
}

/**
 * Get a translation function for use outside of React components
 */
export function getTranslation(): TFunction {
  // Simple fallback implementation
  return (key: string) => {
    // Simple fallback implementation
    return key;
  };
}

/**
 * Hook for translating with interpolation support
 */
export function useTranslationWithInterpolation() {
  const { t } = useTranslation();
  
  const translate = (key: string, variables?: Record<string, string | number>) => {
    return t(key, variables);
  };
  
  return { t: translate };
}

/**
 * Format a message with parameters
 */
export function formatMessage(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return String(params[key] || match);
  });
}
