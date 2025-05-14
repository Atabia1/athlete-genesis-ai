/**
 * AccessibilitySettings Accessibility Tests
 * 
 * This file contains accessibility tests for the AccessibilitySettings component.
 * It uses axe-core to perform automated accessibility testing.
 */

import React from 'react';
import { testA11y } from '@/shared/utils/test-a11y';
import { AccessibilitySettings, AccessibilitySettingsButton } from '@/shared/components/accessibility';
import { AccessibilityProvider } from '@/shared/context/AccessibilityContext';

// Mock the Dialog component to make it render its content directly
jest.mock('@/shared/components/ui/dialog', () => {
  return {
    Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogClose: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe('AccessibilitySettings Accessibility', () => {
  it('should have no accessibility violations for AccessibilitySettings', async () => {
    await testA11y(
      <AccessibilityProvider>
        <AccessibilitySettings open={true} />
      </AccessibilityProvider>
    );
  });

  it('should have no accessibility violations for AccessibilitySettingsButton', async () => {
    await testA11y(
      <AccessibilityProvider>
        <AccessibilitySettingsButton />
      </AccessibilityProvider>
    );
  });
});
