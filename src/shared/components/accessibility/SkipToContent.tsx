
/**
 * Skip to Content Component
 *
 * This component provides a "Skip to main content" link for keyboard navigation.
 * It's typically the first focusable element on a page and helps users bypass
 * navigation to get straight to the main content.
 */

import { cn } from '@/lib/utils';

interface SkipToContentProps {
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SkipToContent({ 
  href = '#main-content',
  className,
  children = 'Skip to main content'
}: SkipToContentProps) {
  return (
    <a
      href={href}
      className={cn(
        // Visually hidden by default
        'sr-only focus:not-sr-only',
        // When focused, show as a visible button
        'focus:absolute focus:top-4 focus:left-4 focus:z-50',
        'focus:bg-primary focus:text-primary-foreground',
        'focus:px-4 focus:py-2 focus:rounded-md',
        'focus:font-medium focus:text-sm',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'transition-all duration-200',
        className
      )}
    >
      {children}
    </a>
  );
}

export default SkipToContent;
