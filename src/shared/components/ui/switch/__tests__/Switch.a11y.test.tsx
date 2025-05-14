/**
 * Switch Accessibility Tests
 * 
 * This file contains accessibility tests for the Switch component.
 * It uses axe-core to perform automated accessibility testing.
 */

import React from 'react';
import { testA11y } from '@/shared/utils/test-a11y';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';

describe('Switch Accessibility', () => {
  it('should have no accessibility violations for default switch', async () => {
    await testA11y(<Switch />);
  });

  it('should have no accessibility violations for checked switch', async () => {
    await testA11y(<Switch defaultChecked />);
  });

  it('should have no accessibility violations for disabled switch', async () => {
    await testA11y(<Switch disabled />);
  });

  it('should have no accessibility violations for switch with label', async () => {
    await testA11y(
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
      </div>
    );
  });

  it('should have no accessibility violations for switch with aria-label', async () => {
    await testA11y(
      <Switch aria-label="Toggle airplane mode" />
    );
  });

  it('should have no accessibility violations for switch with aria-labelledby', async () => {
    await testA11y(
      <>
        <span id="switch-label">Airplane Mode</span>
        <Switch aria-labelledby="switch-label" />
      </>
    );
  });
});
