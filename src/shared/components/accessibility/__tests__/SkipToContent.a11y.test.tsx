/**
 * SkipToContent Accessibility Tests
 * 
 * This file contains accessibility tests for the SkipToContent component.
 * It uses axe-core to perform automated accessibility testing.
 */

import React from 'react';
import { testA11y } from '@/shared/utils/test-a11y';
import { SkipToContent } from '@/shared/components/accessibility';

describe('SkipToContent Accessibility', () => {
  it('should have no accessibility violations for default SkipToContent', async () => {
    await testA11y(<SkipToContent />);
  });

  it('should have no accessibility violations for SkipToContent with custom contentId', async () => {
    await testA11y(<SkipToContent contentId="custom-content" />);
  });

  it('should have no accessibility violations for SkipToContent with custom label', async () => {
    await testA11y(<SkipToContent label="Skip to main content" />);
  });

  it('should have no accessibility violations for SkipToContent with custom className', async () => {
    await testA11y(<SkipToContent className="custom-class" />);
  });
});
