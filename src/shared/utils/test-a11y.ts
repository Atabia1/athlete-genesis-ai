/**
 * Accessibility Testing Utilities
 *
 * This file provides utilities for testing the accessibility of components.
 * It uses axe-core to perform automated accessibility testing and provides
 * additional utilities for testing keyboard navigation, focus management,
 * and screen reader announcements.
 */

import { axe, toHaveNoViolations, AxeResults } from 'jest-axe';
import { render, RenderOptions, RenderResult, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { ReactElement } from 'react';
import { AccessibilityProvider } from '@/shared/context/AccessibilityContext';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Define the wrapper component props
interface TestWrapperProps {
  children: React.ReactNode;
}

/**
 * Default wrapper component for accessibility tests
 * Provides the AccessibilityProvider context
 */
export function AccessibilityTestWrapper({ children }: TestWrapperProps) {
  return (
    <AccessibilityProvider>
      {children}
    </AccessibilityProvider>
  );
}

/**
 * Extended render options for accessibility tests
 */
export interface A11yRenderOptions extends RenderOptions {
  /** Options for axe-core */
  axeOptions?: axe.RunOptions;
  /** Whether to wrap the component in the AccessibilityProvider */
  withAccessibilityProvider?: boolean;
}

/**
 * Render a component for accessibility testing
 * @param ui - The component to render
 * @param options - Options for rendering the component
 * @returns The render result and axe results
 */
export async function renderForA11y(
  ui: ReactElement,
  options?: A11yRenderOptions
): Promise<{ renderResult: RenderResult; axeResults: AxeResults }> {
  const {
    axeOptions,
    withAccessibilityProvider = true,
    wrapper: CustomWrapper,
    ...renderOptions
  } = options || {};

  // Use the AccessibilityTestWrapper if withAccessibilityProvider is true
  // and no custom wrapper is provided
  const wrapper = withAccessibilityProvider && !CustomWrapper
    ? AccessibilityTestWrapper
    : CustomWrapper;

  // Render the component
  const renderResult = render(ui, { wrapper, ...renderOptions });

  // Run axe on the container
  const axeResults = await axe(renderResult.container, axeOptions);

  return { renderResult, axeResults };
}

/**
 * Test a component for accessibility violations
 * @param ui - The component to test
 * @param options - Options for rendering the component
 * @returns A promise that resolves when the test is complete
 */
export async function testA11y(
  ui: ReactElement,
  options?: A11yRenderOptions
): Promise<void> {
  const { axeResults } = await renderForA11y(ui, options);

  // Assert that there are no violations
  expect(axeResults).toHaveNoViolations();
}

/**
 * Test keyboard navigation within a component
 * @param ui - The component to test
 * @param keyboardActions - Array of keyboard actions to perform
 * @param options - Options for rendering the component
 * @returns A promise that resolves when the test is complete
 */
export async function testKeyboardNavigation(
  ui: ReactElement,
  keyboardActions: Array<{
    key: string;
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    selector?: string;
    expectedFocusSelector?: string;
  }>,
  options?: A11yRenderOptions
): Promise<void> {
  const { renderResult } = await renderForA11y(ui, options);
  const { container } = renderResult;

  // Perform each keyboard action
  for (const action of keyboardActions) {
    const {
      key,
      shiftKey = false,
      ctrlKey = false,
      altKey = false,
      metaKey = false,
      selector,
      expectedFocusSelector
    } = action;

    // Get the element to focus
    const element = selector
      ? container.querySelector(selector) as HTMLElement
      : document.activeElement as HTMLElement;

    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    // Focus the element
    element.focus();

    // Press the key
    fireEvent.keyDown(element, {
      key,
      shiftKey,
      ctrlKey,
      altKey,
      metaKey,
      bubbles: true,
      cancelable: true
    });

    // Check if the expected element is focused
    if (expectedFocusSelector) {
      const expectedElement = container.querySelector(expectedFocusSelector) as HTMLElement;
      if (!expectedElement) {
        throw new Error(`Expected focus element not found: ${expectedFocusSelector}`);
      }

      expect(document.activeElement).toBe(expectedElement);
    }
  }
}

/**
 * Test focus trap within a component
 * @param ui - The component to test
 * @param containerSelector - Selector for the container that should trap focus
 * @param options - Options for rendering the component
 * @returns A promise that resolves when the test is complete
 */
export async function testFocusTrap(
  ui: ReactElement,
  containerSelector: string,
  options?: A11yRenderOptions
): Promise<void> {
  const { renderResult } = await renderForA11y(ui, options);
  const { container } = renderResult;

  // Get the container element
  const trapContainer = container.querySelector(containerSelector) as HTMLElement;
  if (!trapContainer) {
    throw new Error(`Focus trap container not found: ${containerSelector}`);
  }

  // Get all focusable elements in the container
  const focusableElements = trapContainer.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  if (focusableElements.length === 0) {
    throw new Error(`No focusable elements found in container: ${containerSelector}`);
  }

  // Focus the first element
  focusableElements[0].focus();
  expect(document.activeElement).toBe(focusableElements[0]);

  // Press Tab to move to the next element
  fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Tab' });

  // If there's only one focusable element, it should remain focused
  if (focusableElements.length === 1) {
    expect(document.activeElement).toBe(focusableElements[0]);
    return;
  }

  // Otherwise, the next element should be focused
  expect(document.activeElement).toBe(focusableElements[1]);

  // Focus the last element
  const lastElement = focusableElements[focusableElements.length - 1];
  lastElement.focus();
  expect(document.activeElement).toBe(lastElement);

  // Press Tab to move to the first element (focus should wrap)
  fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Tab' });
  expect(document.activeElement).toBe(focusableElements[0]);

  // Press Shift+Tab to move to the last element
  fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(lastElement);
}

/**
 * Test screen reader announcements
 * @param ui - The component to test
 * @param actions - Actions to perform that should trigger announcements
 * @param expectedAnnouncements - Expected announcements
 * @param options - Options for rendering the component
 * @returns A promise that resolves when the test is complete
 */
export async function testScreenReaderAnnouncements(
  ui: ReactElement,
  actions: Array<() => void>,
  expectedAnnouncements: Array<{
    politeness?: 'polite' | 'assertive';
    text: string;
  }>,
  options?: A11yRenderOptions
): Promise<void> {
  const { renderResult } = await renderForA11y(ui, options);

  // Perform each action
  for (const action of actions) {
    action();
  }

  // Get all live regions
  const liveRegions = Array.from(document.querySelectorAll('[aria-live]'));

  // Check each expected announcement
  for (const expected of expectedAnnouncements) {
    const { politeness = 'polite', text } = expected;

    // Find a live region with the expected politeness
    const liveRegion = liveRegions.find(
      region => region.getAttribute('aria-live') === politeness
    );

    if (!liveRegion) {
      throw new Error(`No live region found with politeness: ${politeness}`);
    }

    // Check if the live region contains the expected text
    expect(liveRegion.textContent).toContain(text);
  }
}

/**
 * Example usage:
 *
 * import { testA11y, testKeyboardNavigation, testFocusTrap, testScreenReaderAnnouncements } from '@/shared/utils/test-a11y';
 *
 * describe('Button', () => {
 *   it('should have no accessibility violations', async () => {
 *     await testA11y(<Button>Click me</Button>);
 *   });
 *
 *   it('should be keyboard navigable', async () => {
 *     await testKeyboardNavigation(
 *       <Button>Click me</Button>,
 *       [{ key: 'Enter', expectedFocusSelector: 'button' }]
 *     );
 *   });
 * });
 *
 * describe('Dialog', () => {
 *   it('should trap focus', async () => {
 *     await testFocusTrap(
 *       <Dialog open><DialogContent>Content</DialogContent></Dialog>,
 *       '[role="dialog"]'
 *     );
 *   });
 *
 *   it('should announce to screen readers', async () => {
 *     await testScreenReaderAnnouncements(
 *       <Dialog open><DialogContent>Content</DialogContent></Dialog>,
 *       [() => {}], // No actions needed, dialog announces on mount
 *       [{ politeness: 'assertive', text: 'Dialog opened' }]
 *     );
 *   });
 * });
 */
