
/**
 * Accessibility testing utilities
 * 
 * This file provides utilities for testing accessibility of components.
 */

import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';
import React from 'react';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Tests a component for accessibility violations
 * 
 * @param Component - The React component to test
 * @param props - Props to pass to the component
 * @returns Promise<void>
 */
export async function testA11y(
  Component: React.ComponentType<any>,
  props: Record<string, any> = {}
) {
  const { container } = render(<Component {...props} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

/**
 * Gets all accessibility attributes from an element
 * 
 * @param element - The DOM element to check
 * @returns Record<string, string> - Map of accessibility attributes
 */
export function getA11yAttributes(element: HTMLElement): Record<string, string> {
  const attrs: Record<string, string> = {};
  const a11yPattern = /^(aria-|role|tabIndex|title|alt|lang|data-focus)/;
  
  Array.from(element.attributes).forEach((attr) => {
    if (a11yPattern.test(attr.name)) {
      attrs[attr.name] = attr.value;
    }
  });
  
  return attrs;
}

/**
 * Checks if an element is accessible
 * 
 * @param element - The DOM element to check
 * @returns boolean - Whether the element is accessible
 */
export function isAccessible(element: HTMLElement): boolean {
  // Check for common accessibility issues
  if (element.tagName === 'IMG' && !element.hasAttribute('alt')) {
    return false;
  }
  
  if (element.tagName === 'BUTTON' && !element.hasAttribute('aria-label') && !element.textContent) {
    return false;
  }
  
  // Check for color contrast (simplified check)
  const style = window.getComputedStyle(element);
  const bgColor = style.backgroundColor;
  const color = style.color;
  
  // Very basic contrast check - proper check would use WCAG algorithms
  if (bgColor === color) {
    return false;
  }
  
  return true;
}

export default {
  testA11y,
  getA11yAttributes,
  isAccessible
};
