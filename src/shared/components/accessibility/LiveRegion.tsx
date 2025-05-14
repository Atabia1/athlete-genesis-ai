/**
 * LiveRegion Component
 * 
 * This component creates an ARIA live region that announces content changes
 * to screen readers. It's useful for dynamic content that updates without
 * a page reload, such as form validation messages, toast notifications,
 * and loading states.
 * 
 * The component supports different politeness levels:
 * - 'polite': Announces changes when the user is idle (default)
 * - 'assertive': Announces changes immediately, interrupting the current speech
 */

import React from 'react';
import { cn } from '@/shared/utils/cn';

export type LiveRegionPoliteness = 'polite' | 'assertive';

export interface LiveRegionProps {
  /** The content to announce */
  children?: React.ReactNode;
  /** How urgently the screen reader should announce the content */
  politeness?: LiveRegionPoliteness;
  /** Whether to hide the region visually */
  visuallyHidden?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Additional ARIA attributes */
  'aria-atomic'?: boolean;
  /** Additional ARIA attributes */
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';
}

export function LiveRegion({
  children,
  politeness = 'polite',
  visuallyHidden = true,
  className,
  'aria-atomic': ariaAtomic = true,
  'aria-relevant': ariaRelevant = 'additions text',
}: LiveRegionProps) {
  return (
    <div
      aria-live={politeness}
      aria-atomic={ariaAtomic}
      aria-relevant={ariaRelevant}
      className={cn(
        visuallyHidden && 'sr-only',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Example usage:
 * 
 * function FormWithValidation() {
 *   const [error, setError] = useState('');
 *   
 *   return (
 *     <form>
 *       <input
 *         type="email"
 *         onChange={(e) => {
 *           if (!e.target.value.includes('@')) {
 *             setError('Please enter a valid email address');
 *           } else {
 *             setError('');
 *           }
 *         }}
 *       />
 *       
 *       {error && (
 *         <div className="error">
 *           {error}
 *           <LiveRegion politeness="assertive">{error}</LiveRegion>
 *         </div>
 *       )}
 *     </form>
 *   );
 * }
 */
