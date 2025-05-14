/**
 * useFocusTrap: Hook for trapping focus within a container
 * 
 * This hook traps focus within a container element, which is useful for modals,
 * dialogs, and other components that should capture and contain focus.
 * 
 * Features:
 * - Traps focus within a container
 * - Restores focus when the container is unmounted
 * - Supports initial focus element
 * - Handles nested focus traps
 */

import { useEffect, useRef, RefObject } from 'react';

export interface FocusTrapOptions {
  /** Whether the focus trap is active */
  active?: boolean;
  /** Element to focus when the trap is activated (defaults to the first focusable element) */
  initialFocus?: RefObject<HTMLElement> | null;
  /** Whether to restore focus when the trap is deactivated */
  restoreFocus?: boolean;
  /** Elements that should not be trapped (useful for nested traps) */
  excludeContainers?: RefObject<HTMLElement>[];
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  return Array.from(focusableElements);
}

/**
 * Hook for trapping focus within a container
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  options: FocusTrapOptions = {}
): void {
  const {
    active = true,
    initialFocus = null,
    restoreFocus = true,
    excludeContainers = [],
  } = options;

  // Keep track of the element that had focus before the trap was activated
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    
    // Store the currently focused element so we can restore focus later
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the initial element or the first focusable element in the container
    const focusInitialElement = () => {
      if (initialFocus && initialFocus.current) {
        initialFocus.current.focus();
      } else {
        const focusableElements = getFocusableElements(container);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          // If there are no focusable elements, focus the container itself
          container.setAttribute('tabindex', '-1');
          container.focus();
        }
      }
    };

    // Focus the initial element
    focusInitialElement();

    // Handle Tab key to trap focus
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle Tab key
      if (event.key !== 'Tab') return;

      // Check if the event target is within an excluded container
      const isInExcludedContainer = excludeContainers.some(
        ref => ref.current && ref.current.contains(event.target as Node)
      );
      if (isInExcludedContainer) return;

      // Get all focusable elements in the container
      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) return;

      // Get the first and last focusable elements
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Handle Tab and Shift+Tab
      if (event.shiftKey) {
        // If Shift+Tab on the first element, move to the last element
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // If Tab on the last element, move to the first element
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Add event listener for keydown
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // Remove event listener
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus when the trap is deactivated
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, containerRef, initialFocus, restoreFocus, excludeContainers]);
}

/**
 * Example usage:
 * 
 * function Modal({ isOpen, onClose }) {
 *   const modalRef = useRef(null);
 *   const closeButtonRef = useRef(null);
 *   
 *   useFocusTrap(modalRef, {
 *     active: isOpen,
 *     initialFocus: closeButtonRef,
 *   });
 *   
 *   if (!isOpen) return null;
 *   
 *   return (
 *     <div ref={modalRef} role="dialog" aria-modal="true">
 *       <h2>Modal Title</h2>
 *       <p>Modal content...</p>
 *       <button ref={closeButtonRef} onClick={onClose}>Close</button>
 *     </div>
 *   );
 * }
 */
