
/**
 * Focus Visible Utilities
 *
 * This module provides utilities for managing focus visibility in the application.
 * It helps ensure that focus indicators are only shown when navigating with keyboard.
 */

let isKeyboardNavigation = false;

/**
 * Initialize focus visible behavior
 */
export function initializeFocusVisible(): void {
  if (typeof document === 'undefined') return;

  // Track keyboard navigation
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('pointerdown', handlePointerDown);

  // Apply initial class
  updateFocusVisibleClass();
}

/**
 * Handle keydown events
 */
function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') {
    isKeyboardNavigation = true;
    updateFocusVisibleClass();
  }
}

/**
 * Handle mousedown events
 */
function handleMouseDown(): void {
  isKeyboardNavigation = false;
  updateFocusVisibleClass();
}

/**
 * Handle pointerdown events
 */
function handlePointerDown(): void {
  isKeyboardNavigation = false;
  updateFocusVisibleClass();
}

/**
 * Update the focus visible class on the document
 */
function updateFocusVisibleClass(): void {
  if (typeof document === 'undefined') return;

  if (isKeyboardNavigation) {
    document.documentElement.classList.add('focus-visible');
  } else {
    document.documentElement.classList.remove('focus-visible');
  }
}

/**
 * Clean up focus visible event listeners
 */
export function cleanupFocusVisible(): void {
  if (typeof document === 'undefined') return;

  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('mousedown', handleMouseDown);
  document.removeEventListener('pointerdown', handlePointerDown);
}
