/**
 * Internationalization Utility
 *
 * This is a simplified version of the i18n utility for testing purposes.
 */

/**
 * Available languages
 */
export type Language = 'en' | 'fr' | 'tw' | 'ee' | 'ga' | 'dag' | 'dga' | 'ha';

/**
 * Language information
 */
export interface LanguageInfo {
  /** Language code */
  code: Language;
  /** Language name in English */
  name: string;
  /** Language name in its native language */
  nativeName: string;
  /** Whether the language is right-to-left */
  isRtl: boolean;
  /** Region where the language is spoken */
  region?: string;
  /** Percentage of population that speaks the language */
  populationPercentage?: number;
}

/**
 * Available languages with their information
 */
export const languages: Record<Language, LanguageInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    isRtl: false,
    region: 'Official language',
    populationPercentage: 100
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    isRtl: false
  },
  tw: {
    code: 'tw',
    name: 'Twi',
    nativeName: 'Twi',
    isRtl: false,
    region: 'Ashanti, Eastern, Central Regions',
    populationPercentage: 44
  },
  ee: {
    code: 'ee',
    name: 'Ewe',
    nativeName: 'Eʋegbe',
    isRtl: false,
    region: 'Volta Region',
    populationPercentage: 13
  },
  ga: {
    code: 'ga',
    name: 'Ga',
    nativeName: 'Gã',
    isRtl: false,
    region: 'Greater Accra Region',
    populationPercentage: 8
  },
  dag: {
    code: 'dag',
    name: 'Dagbani',
    nativeName: 'Dagbani',
    isRtl: false,
    region: 'Northern Region',
    populationPercentage: 4
  },
  dga: {
    code: 'dga',
    name: 'Dagaare',
    nativeName: 'Dagaare',
    isRtl: false,
    region: 'Upper West Region',
    populationPercentage: 3
  },
  ha: {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Hausa',
    isRtl: false,
    region: 'Northern Ghana (trade language)',
    populationPercentage: 5
  }
};

/**
 * Default language
 */
export const defaultLanguage: Language = 'en';

/**
 * Get the current language from the browser
 * @returns The current language code
 */
export function getCurrentLanguage(): Language {
  if (typeof navigator === 'undefined') {
    return defaultLanguage;
  }

  // Get the browser language
  const browserLanguage = navigator.language.split('-')[0] as Language;

  // Check if the browser language is supported
  return languages[browserLanguage] ? browserLanguage : defaultLanguage;
}

/**
 * Get the direction (ltr or rtl) for a language
 * @param language - The language code
 * @returns The direction (ltr or rtl)
 */
export function getLanguageDirection(language: Language = getCurrentLanguage()): 'ltr' | 'rtl' {
  return languages[language]?.isRtl ? 'rtl' : 'ltr';
}

/**
 * Format a date according to the current language
 * @param date - The date to format
 * @param options - The formatting options
 * @param language - The language code
 * @returns The formatted date
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
  language: Language = getCurrentLanguage()
): string {
  return new Intl.DateTimeFormat(language, options).format(date);
}

/**
 * Format a number according to the current language
 * @param number - The number to format
 * @param options - The formatting options
 * @param language - The language code
 * @returns The formatted number
 */
export function formatNumber(
  number: number,
  options: Intl.NumberFormatOptions = {},
  language: Language = getCurrentLanguage()
): string {
  return new Intl.NumberFormat(language, options).format(number);
}

/**
 * Format a currency value according to the current language
 * @param number - The number to format
 * @param currency - The currency code
 * @param options - The formatting options
 * @param language - The language code
 * @returns The formatted currency value
 */
export function formatCurrency(
  number: number,
  currency: string = 'USD',
  options: Intl.NumberFormatOptions = {},
  language: Language = getCurrentLanguage()
): string {
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency,
    ...options,
  }).format(number);
}

/**
 * Format a relative time according to the current language
 * @param value - The value to format
 * @param unit - The unit of time
 * @param options - The formatting options
 * @param language - The language code
 * @returns The formatted relative time
 */
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  options: Intl.RelativeTimeFormatOptions = {},
  language: Language = getCurrentLanguage()
): string {
  return new Intl.RelativeTimeFormat(language, options).format(value, unit);
}

/**
 * Example usage:
 *
 * import { formatDate, formatCurrency, getLanguageDirection } from '@/shared/utils/i18n';
 *
 * // Format a date
 * const date = formatDate(new Date());
 *
 * // Format a currency value
 * const price = formatCurrency(19.99);
 *
 * // Get the text direction
 * const dir = getLanguageDirection();
 *
 * // Use in a component
 * function MyComponent() {
 *   return (
 *     <div dir={getLanguageDirection()}>
 *       <h1>Athlete Genesis AI</h1>
 *       <p>Personalized fitness and nutrition plans</p>
 *       <p>{formatDate(new Date())}</p>
 *       <p>{formatCurrency(19.99)}</p>
 *     </div>
 *   );
 * }
 */
