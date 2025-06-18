
/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from '../../../ui/button';

describe('Button Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Button>Test Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be properly labeled', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    const button = getByRole('button');
    
    expect(button).toHaveTextContent('Click me');
    expect(button).toBeInTheDocument();
  });

  it('should support disabled state', () => {
    const { getByRole } = render(<Button disabled>Disabled Button</Button>);
    const button = getByRole('button');
    
    expect(button).toBeDisabled();
  });
});
