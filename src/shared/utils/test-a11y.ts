
/**
 * Accessibility Testing Utilities
 */

import { configureAxe } from 'jest-axe';

interface AxeOptions {
  rules?: Record<string, { enabled: boolean }>;
  tags?: string[];
}

/**
 * Configure axe for accessibility testing
 */
export const configureA11yTesting = (options: AxeOptions = {}) => {
  const defaultOptions = {
    rules: {
      // Disable specific rules that might be too strict for development
      'color-contrast': { enabled: true },
      'landmark-one-main': { enabled: true },
    },
    tags: ['wcag2a', 'wcag2aa'],
    ...options,
  };

  return configureAxe(defaultOptions);
};

/**
 * Common accessibility test options
 */
export const commonA11yTestOptions: AxeOptions = {
  rules: {
    'color-contrast': { enabled: true },
    'landmark-one-main': { enabled: false }, // Often not needed in component tests
  },
  tags: ['wcag2a', 'wcag2aa'],
};

/**
 * Strict accessibility test options
 */
export const strictA11yTestOptions: AxeOptions = {
  rules: {
    'color-contrast': { enabled: true },
    'landmark-one-main': { enabled: true },
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
};
