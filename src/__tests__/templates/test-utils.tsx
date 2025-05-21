
import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';

/**
 * Custom wrapper for test components
 */
export const TestWrapper = ({ children }: { children: ReactNode }) => {
  return <div data-testid="test-wrapper">{children}</div>;
};

/**
 * Mock implementation of toBeInTheDocument
 */
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null;
    if (pass) {
      return {
        message: () => `expected ${received} not to be in the document`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be in the document`,
        pass: false,
      };
    }
  },
});

/**
 * Custom render function that wraps components in the test wrapper
 */
export const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: TestWrapper, ...options });
