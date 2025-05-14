/**
 * Focus Visible Utility
 * 
 * This utility helps manage focus styles for keyboard navigation.
 * It adds a class to the document when the user is navigating with a keyboard,
 * which can be used to show focus outlines only when needed.
 */

/**
 * Initialize focus visible detection
 * 
 * This function adds event listeners to detect keyboard navigation
 * and adds/removes a class on the document body accordingly.
 */
export function initFocusVisible(): void {
  if (typeof window === 'undefined') return;

  // The class to add to the document when the user is navigating with a keyboard
  const className = 'focus-visible';
  
  // Track whether the user is navigating with a keyboard
  let usingKeyboard = false;

  // Add the class when the user presses Tab
  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      usingKeyboard = true;
      document.body.classList.add(className);
    }
  }

  // Remove the class when the user clicks with the mouse
  function handleMouseDown(): void {
    if (usingKeyboard) {
      usingKeyboard = false;
      document.body.classList.remove(className);
    }
  }

  // Add event listeners
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('mousedown', handleMouseDown);

  // Return a cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('mousedown', handleMouseDown);
  };
}

/**
 * Focus visible CSS
 * 
 * This CSS can be added to your global styles to show focus outlines
 * only when the user is navigating with a keyboard.
 * 
 * ```css
 * :focus {
 *   outline: none;
 * }
 * 
 * .focus-visible :focus-visible,
 * .focus-visible [data-focus-visible-added] {
 *   outline: 2px solid var(--ring);
 *   outline-offset: 2px;
 * }
 * ```
 */
