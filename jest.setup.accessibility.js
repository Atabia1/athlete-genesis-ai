/**
 * Jest setup for accessibility testing
 */
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import { configure } from '@testing-library/react';

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

// Configure testing library
configure({
  // Set a longer timeout for async tests
  asyncUtilTimeout: 5000,
  // Ensure that test IDs are used as selectors
  testIdAttribute: 'data-testid',
});

// Mock window.matchMedia for tests
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() {},
  };
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Create a helper for testing focus management
global.setFocus = (element) => {
  element.focus();
  // Dispatch a focus event
  const focusEvent = new FocusEvent('focus');
  element.dispatchEvent(focusEvent);
};

// Create a helper for testing keyboard events
global.fireKeyboardEvent = (element, key, options = {}) => {
  const keyboardEvent = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  element.dispatchEvent(keyboardEvent);
};

// Create a helper for testing screen reader announcements
global.getAnnouncements = () => {
  return Array.from(document.querySelectorAll('[aria-live]')).map(el => ({
    politeness: el.getAttribute('aria-live'),
    text: el.textContent,
  }));
};
