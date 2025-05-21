
import React, { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Custom wrapper for test components
 */
export const TestWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <div data-testid="test-wrapper">{children}</div>
    </BrowserRouter>
  );
};

/**
 * Custom render function that wraps components in the test wrapper
 */
export const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: TestWrapper, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';
