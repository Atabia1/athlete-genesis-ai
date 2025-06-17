
/**
 * SkipToContent Component
 * 
 * This component provides a skip link that allows keyboard users to bypass
 * navigation and jump directly to the main content. It's a crucial accessibility
 * feature for keyboard users who would otherwise have to tab through all
 * navigation items on every page.
 * 
 * The link is visually hidden until it receives focus, at which point it
 * becomes visible so the user can see it.
 */

import { cn } from '@/shared/utils/cn';

export interface SkipToContentProps {
  /** The ID of the main content element to skip to */
  contentId?: string;
  /** The text to display in the skip link */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

export function SkipToContent({
  contentId = 'main-content',
  label = 'Skip to content',
  className,
}: SkipToContentProps) {
  return (
    <a
      href={`#${contentId}`}
      className={cn(
        // Base styles
        'absolute left-0 top-0 z-50 flex items-center justify-center px-4 py-2 text-sm font-medium',
        // Visually hidden by default
        '-translate-y-full opacity-0 focus:translate-y-0 focus:opacity-100',
        // Visual styles when focused
        'bg-primary text-primary-foreground transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
    >
      {label}
    </a>
  );
}
