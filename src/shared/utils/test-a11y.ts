
import { axe } from 'jest-axe';
import { render, RenderResult } from '@testing-library/react';
import React, { ReactElement } from 'react';

/**
 * Tests a component for accessibility violations
 * @param ui - The React element to test
 * @returns A promise that resolves when the test is complete
 */
export async function testA11y(
  ui: ReactElement,
  options?: {
    axeOptions?: jest.AxeOptions;
  }
): Promise<void> {
  const { container } = render(ui);
  const results = await axe(container, options?.axeOptions);
  
  expect(results).toHaveNoViolations();
}

/**
 * Tests a rendered component for accessibility violations
 * @param renderResult - The result of calling render() on a component
 * @returns A promise that resolves when the test is complete
 */
export async function testRenderedA11y(
  renderResult: RenderResult,
  options?: {
    axeOptions?: jest.AxeOptions;
  }
): Promise<void> {
  const results = await axe(renderResult.container, options?.axeOptions);
  
  expect(results).toHaveNoViolations();
}
