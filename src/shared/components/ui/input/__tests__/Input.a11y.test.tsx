
/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Input } from '../../../ui/input';

describe('Input Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Input placeholder="Test input" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be properly labeled when used with aria-label', () => {
    const { getByRole } = render(<Input aria-label="Test input field" />);
    const input = getByRole('textbox');
    
    expect(input).toHaveAttribute('aria-label', 'Test input field');
  });

  it('should support disabled state', () => {
    const { getByRole } = render(<Input disabled placeholder="Disabled input" />);
    const input = getByRole('textbox');
    
    expect(input).toBeDisabled();
  });
});
