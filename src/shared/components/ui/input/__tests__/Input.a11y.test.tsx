/**
 * Input Accessibility Tests
 * 
 * This file contains accessibility tests for the Input component.
 * It uses axe-core to perform automated accessibility testing.
 */

import React from 'react';
import { testA11y } from '@/shared/utils/test-a11y';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

describe('Input Accessibility', () => {
  it('should have no accessibility violations for default input', async () => {
    await testA11y(<Input />);
  });

  it('should have no accessibility violations for input with placeholder', async () => {
    await testA11y(<Input placeholder="Enter your name" />);
  });

  it('should have no accessibility violations for disabled input', async () => {
    await testA11y(<Input disabled />);
  });

  it('should have no accessibility violations for input with label', async () => {
    await testA11y(
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
    );
  });

  it('should have no accessibility violations for input with aria-label', async () => {
    await testA11y(
      <Input aria-label="Enter your email address" type="email" />
    );
  });

  it('should have no accessibility violations for input with aria-labelledby', async () => {
    await testA11y(
      <>
        <span id="email-label">Email Address</span>
        <Input aria-labelledby="email-label" type="email" />
      </>
    );
  });

  it('should have no accessibility violations for input with aria-describedby', async () => {
    await testA11y(
      <>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" aria-describedby="password-hint" />
        <p id="password-hint" className="text-sm text-gray-500">
          Password must be at least 8 characters long.
        </p>
      </>
    );
  });

  it('should have no accessibility violations for required input', async () => {
    await testA11y(
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="required-email">Email (required)</Label>
        <Input id="required-email" type="email" required />
      </div>
    );
  });
});
