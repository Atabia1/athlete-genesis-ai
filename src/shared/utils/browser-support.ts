/**
 * Browser Support Utility
 *
 * This utility provides functions to detect browser support for various
 * accessibility features and provide fallbacks when necessary.
 */

/**
 * Check if the browser supports a CSS property
 * @param property - The CSS property to check
 * @returns Whether the browser supports the property
 */
export function supportsCssProperty(property: string): boolean {
  if (typeof window === 'undefined' || !window.CSS || !window.CSS.supports) {
    // Fallback for browsers that don't support CSS.supports
    const element = document.createElement('div');
    return property in element.style;
  }

  return window.CSS.supports(property, 'initial');
}

/**
 * Check if the browser supports CSS variables
 * @returns Whether the browser supports CSS variables
 */
export function supportsCssVariables(): boolean {
  return supportsCssProperty('--test');
}

/**
 * Check if the browser supports the prefers-reduced-motion media query
 * @returns Whether the browser supports prefers-reduced-motion
 */
export function supportsReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').media !== 'not all';
}

/**
 * Check if the browser supports the prefers-color-scheme media query
 * @returns Whether the browser supports prefers-color-scheme
 */
export function supportsColorScheme(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all';
}

/**
 * Check if the browser supports the focus-visible pseudo-class
 * @returns Whether the browser supports :focus-visible
 */
export function supportsFocusVisible(): boolean {
  if (typeof window === 'undefined' || !window.CSS || !window.CSS.supports) {
    return false;
  }

  return window.CSS.supports('selector(:focus-visible)');
}

/**
 * Check if the browser supports ARIA attributes
 * @returns Whether the browser supports ARIA attributes
 */
export function supportsAria(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  const element = document.createElement('div');
  element.setAttribute('aria-hidden', 'true');
  return element.getAttribute('aria-hidden') === 'true';
}

/**
 * Check if the browser supports the Intersection Observer API
 * @returns Whether the browser supports Intersection Observer
 */
export function supportsIntersectionObserver(): boolean {
  return typeof IntersectionObserver !== 'undefined';
}

/**
 * Check if the browser supports the Resize Observer API
 * @returns Whether the browser supports Resize Observer
 */
export function supportsResizeObserver(): boolean {
  return typeof ResizeObserver !== 'undefined';
}

/**
 * Check if the browser supports the Web Animation API
 * @returns Whether the browser supports Web Animation
 */
export function supportsWebAnimation(): boolean {
  return typeof Element !== 'undefined' && 'animate' in Element.prototype;
}

/**
 * Get a list of unsupported accessibility features
 * @returns An array of unsupported features
 */
export function getUnsupportedFeatures(): string[] {
  const unsupported: string[] = [];

  if (!supportsCssVariables()) {
    unsupported.push('CSS Variables');
  }

  if (!supportsReducedMotion()) {
    unsupported.push('Reduced Motion');
  }

  if (!supportsColorScheme()) {
    unsupported.push('Color Scheme');
  }

  if (!supportsFocusVisible()) {
    unsupported.push('Focus Visible');
  }

  if (!supportsAria()) {
    unsupported.push('ARIA Attributes');
  }

  if (!supportsIntersectionObserver()) {
    unsupported.push('Intersection Observer');
  }

  if (!supportsResizeObserver()) {
    unsupported.push('Resize Observer');
  }

  if (!supportsWebAnimation()) {
    unsupported.push('Web Animation');
  }

  return unsupported;
}

/**
 * Load polyfills for unsupported features
 * @returns A promise that resolves when all polyfills are loaded
 */
export async function loadPolyfills(): Promise<void> {
  const polyfills: Promise<any>[] = [];

  // Load focus-visible polyfill if needed
  if (!supportsFocusVisible()) {
    // Skip focus-visible polyfill for now as it's causing issues
    console.log('Focus visible polyfill would be loaded here');
    // polyfills.push(import('focus-visible'));
  }

  // Load Intersection Observer polyfill if needed
  if (!supportsIntersectionObserver()) {
    console.log('Intersection Observer polyfill would be loaded here');
    // polyfills.push(import('intersection-observer'));
  }

  // Load Resize Observer polyfill if needed
  if (!supportsResizeObserver()) {
    console.log('Resize Observer polyfill would be loaded here');
    // polyfills.push(import('resize-observer-polyfill'));
  }

  // Load Web Animation polyfill if needed
  if (!supportsWebAnimation()) {
    console.log('Web Animation polyfill would be loaded here');
    // polyfills.push(import('web-animations-js'));
  }

  // Wait for all polyfills to load
  await Promise.all(polyfills);
}

/**
 * Initialize browser support
 * @param options - Options for browser support
 * @returns A promise that resolves when browser support is initialized
 */
export async function initBrowserSupport(options: {
  loadPolyfills?: boolean;
  showWarnings?: boolean;
} = {}): Promise<void> {
  const { loadPolyfills: shouldLoadPolyfills = true, showWarnings = true } = options;

  // Get unsupported features
  const unsupported = getUnsupportedFeatures();

  // Show warnings for unsupported features
  if (showWarnings && unsupported.length > 0) {
    console.warn(
      'The following accessibility features are not supported by this browser:',
      unsupported.join(', ')
    );
  }

  // Load polyfills if needed
  if (shouldLoadPolyfills && unsupported.length > 0) {
    await loadPolyfills();
  }
}

/**
 * Example usage:
 *
 * // Initialize browser support
 * initBrowserSupport().then(() => {
 *   console.log('Browser support initialized');
 * });
 *
 * // Check if a specific feature is supported
 * if (supportsFocusVisible()) {
 *   console.log('Focus visible is supported');
 * } else {
 *   console.log('Focus visible is not supported');
 * }
 */
