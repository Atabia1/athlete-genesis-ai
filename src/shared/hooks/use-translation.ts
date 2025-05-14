/**
 * useTranslation Hook
 *
 * This is a simplified mock implementation of the translation hook for testing.
 */

import { useCallback } from 'react';
import i18n from '@/i18n';

// Define the Language type
export type Language = 'en' | 'fr' | 'tw' | 'ee' | 'ga' | 'dag' | 'dga' | 'ha';

/**
 * Simplified translation hook for testing
 * @param ns - The namespace(s) to use (ignored in this mock)
 * @returns Simplified translation utilities
 */
export function useTranslation(ns?: string | string[]) {
  // Simple translation function
  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const translation = i18n.t(key, params);
    return translation || key;
  }, []);

  // Simple date formatter
  const formatDate = useCallback((
    date: Date,
    options?: Intl.DateTimeFormatOptions
  ) => {
    return date.toLocaleDateString(i18n.language, options);
  }, []);

  // Simple number formatter
  const formatNumber = useCallback((
    number: number,
    options?: Intl.NumberFormatOptions
  ) => {
    return number.toLocaleString(i18n.language, options);
  }, []);

  // Simple currency formatter
  const formatCurrency = useCallback((
    number: number,
    currency: string = 'USD',
    options?: Intl.NumberFormatOptions
  ) => {
    return number.toLocaleString(i18n.language, {
      style: 'currency',
      currency,
      ...options
    });
  }, []);

  // Simple relative time formatter
  const formatRelativeTime = useCallback((
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions
  ) => {
    // Very simple implementation for testing
    return `${value} ${unit}${Math.abs(value) !== 1 ? 's' : ''} ${value < 0 ? 'ago' : 'from now'}`;
  }, []);

  // Get text direction (always ltr for testing)
  const getDirection = useCallback(() => 'ltr', []);

  // Check if RTL (always false for testing)
  const isRtl = useCallback(() => false, []);

  return {
    t,
    i18n,
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTime,
    getDirection,
    isRtl,
  };
}

/**
 * Example usage:
 *
 * ```tsx
 * import { useTranslation } from '@/shared/hooks/use-translation';
 *
 * function MyComponent() {
 *   const { t, formatDate, formatCurrency, isRtl } = useTranslation();
 *
 *   return (
 *     <div dir={isRtl() ? 'rtl' : 'ltr'}>
 *       <h1>{t('app.title')}</h1>
 *       <p>{t('app.description')}</p>
 *       <p>{formatDate(new Date())}</p>
 *       <p>{formatCurrency(19.99, 'USD')}</p>
 *     </div>
 *   );
 * }
 * ```
 */
