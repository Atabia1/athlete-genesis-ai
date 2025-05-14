/**
 * VisuallyHidden Component
 * 
 * This component visually hides content while keeping it accessible to screen readers.
 * It's useful for providing additional context to screen reader users without
 * affecting the visual layout.
 * 
 * The content is positioned off-screen using CSS, but remains in the DOM and
 * is announced by screen readers.
 */

import React from 'react';

export interface VisuallyHiddenProps {
  /** The content to hide visually but keep accessible to screen readers */
  children: React.ReactNode;
  /** Whether the content should be hidden (useful for conditional hiding) */
  hidden?: boolean;
}

export function VisuallyHidden({
  children,
  hidden = false,
}: VisuallyHiddenProps) {
  if (hidden) {
    return null;
  }

  return (
    <span
      style={{
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        width: '1px',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
      }}
    >
      {children}
    </span>
  );
}

/**
 * Example usage:
 * 
 * function SortButton({ direction }) {
 *   return (
 *     <button>
 *       Sort
 *       {direction === 'asc' ? (
 *         <>
 *           <UpIcon />
 *           <VisuallyHidden>in ascending order</VisuallyHidden>
 *         </>
 *       ) : (
 *         <>
 *           <DownIcon />
 *           <VisuallyHidden>in descending order</VisuallyHidden>
 *         </>
 *       )}
 *     </button>
 *   );
 * }
 */
