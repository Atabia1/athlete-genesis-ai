/**
 * Button Accessibility Tests
 * 
 * This file contains accessibility tests for the Button component.
 * It uses axe-core to perform automated accessibility testing.
 */

import React from 'react';
import { testA11y } from '@/shared/utils/test-a11y';
import { Button } from '@/shared/components/ui/button';
import { Mail } from 'lucide-react';

describe('Button Accessibility', () => {
  it('should have no accessibility violations for default button', async () => {
    await testA11y(<Button>Click me</Button>);
  });

  it('should have no accessibility violations for disabled button', async () => {
    await testA11y(<Button disabled>Disabled</Button>);
  });

  it('should have no accessibility violations for button with icon', async () => {
    await testA11y(
      <Button>
        <Mail className="mr-2 h-4 w-4" />
        Email
      </Button>
    );
  });

  it('should have no accessibility violations for icon-only button with aria-label', async () => {
    await testA11y(
      <Button size="icon" aria-label="Send email">
        <Mail className="h-4 w-4" />
      </Button>
    );
  });

  it('should have no accessibility violations for different variants', async () => {
    await testA11y(
      <>
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </>
    );
  });
});
