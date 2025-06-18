
/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Switch } from '../../../ui/switch';

describe('Switch Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Switch />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    const { getByRole } = render(<Switch aria-label="Toggle setting" />);
    const switchElement = getByRole('switch');
    
    expect(switchElement).toHaveAttribute('aria-label', 'Toggle setting');
    expect(switchElement).toHaveAttribute('aria-checked');
  });

  it('should support disabled state', () => {
    const { getByRole } = render(<Switch disabled aria-label="Disabled switch" />);
    const switchElement = getByRole('switch');
    
    expect(switchElement).toBeDisabled();
  });
});
