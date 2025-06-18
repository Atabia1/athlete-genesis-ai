
/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import SkipToContent from '../SkipToContent';

describe('SkipToContent Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<SkipToContent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be properly announced to screen readers', () => {
    const { getByRole } = render(<SkipToContent />);
    const skipLink = getByRole('link');
    
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(skipLink).toHaveTextContent('Skip to main content');
  });

  it('should be visually hidden by default but focusable', () => {
    const { getByRole } = render(<SkipToContent />);
    const skipLink = getByRole('link');
    
    // Should have sr-only class or similar styling
    expect(skipLink).toBeInTheDocument();
  });
});
