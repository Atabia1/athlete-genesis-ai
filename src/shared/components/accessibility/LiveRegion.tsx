
/**
 * LiveRegion Component
 * 
 * This component creates a live region that announces dynamic content changes
 * to screen readers. It's useful for providing feedback about user actions,
 * form validation errors, or other dynamic content updates.
 * 
 * The component uses the aria-live attribute to control how and when content
 * is announced by screen readers.
 */

import { useEffect, useRef } from 'react';

export interface LiveRegionProps {
  /** The content to announce to screen readers */
  children: React.ReactNode;
  /** How assertive the announcement should be */
  politeness?: 'off' | 'polite' | 'assertive';
  /** Whether the entire region content should be announced or just changes */
  atomic?: boolean;
  /** What types of changes should be announced */
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  /** Additional CSS classes */
  className?: string;
  /** Whether the region should be visible */
  visible?: boolean;
}

export function LiveRegion({
  children,
  politeness = 'polite',
  atomic = false,
  relevant = 'additions',
  className = '',
  visible = false,
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the region is properly set up for screen readers
    if (regionRef.current) {
      regionRef.current.setAttribute('aria-live', politeness);
      regionRef.current.setAttribute('aria-atomic', atomic.toString());
      regionRef.current.setAttribute('aria-relevant', relevant);
    }
  }, [politeness, atomic, relevant]);

  const regionStyles = visible 
    ? className 
    : `${className} sr-only absolute left-[-10000px] width-[1px] height-[1px] overflow-hidden`;

  return (
    <div
      ref={regionRef}
      className={regionStyles}
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
    >
      {children}
    </div>
  );
}

/**
 * Example usage:
 * 
 * function FormWithLiveRegion() {
 *   const [message, setMessage] = useState('');
 * 
 *   const handleSubmit = () => {
 *     setMessage('Form submitted successfully!');
 *   };
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input type="text" />
 *       <button type="submit">Submit</button>
 *       <LiveRegion politeness="assertive">
 *         {message}
 *       </LiveRegion>
 *     </form>
 *   );
 * }
 */
