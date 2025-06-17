
/**
 * useKeyboard: Hook for keyboard navigation and shortcuts
 * 
 * This hook provides a way to handle keyboard events and shortcuts in a consistent way.
 * It supports:
 * - Key combinations (e.g., Shift+A)
 * - Key sequences (e.g., g then h)
 * - Modifier keys (Ctrl, Alt, Shift, Meta)
 * - Preventing default browser behavior
 * - Conditional activation
 */

import { useEffect, useCallback, useRef } from 'react';

export type KeyHandler = (event: KeyboardEvent) => void;

export interface KeyboardOptions {
  /** Whether the handler should be active */
  enabled?: boolean;
  /** Whether to prevent default browser behavior */
  preventDefault?: boolean;
  /** Whether to stop event propagation */
  stopPropagation?: boolean;
  /** Target element to attach the event listener to (defaults to document) */
  target?: HTMLElement | null | undefined;
}

export interface KeyCombo {
  /** The key to listen for (e.g., 'a', 'Enter', 'Escape') */
  key: string;
  /** Whether the Ctrl key must be pressed */
  ctrl?: boolean;
  /** Whether the Alt key must be pressed */
  alt?: boolean;
  /** Whether the Shift key must be pressed */
  shift?: boolean;
  /** Whether the Meta key (Command on Mac, Windows key on Windows) must be pressed */
  meta?: boolean;
}

/**
 * Check if a keyboard event matches a key combo
 */
function matchesKeyCombo(event: KeyboardEvent, combo: KeyCombo): boolean {
  // Check if the key matches
  if (event.key.toLowerCase() !== combo.key.toLowerCase()) {
    return false;
  }

  // Check modifier keys
  if (combo.ctrl && !event.ctrlKey) return false;
  if (combo.alt && !event.altKey) return false;
  if (combo.shift && !event.shiftKey) return false;
  if (combo.meta && !event.metaKey) return false;

  // If we specified any modifier in the combo, make sure the event has the same modifiers
  if (
    (combo.ctrl !== undefined || combo.alt !== undefined || combo.shift !== undefined || combo.meta !== undefined) &&
    (
      (combo.ctrl === undefined && event.ctrlKey) ||
      (combo.alt === undefined && event.altKey) ||
      (combo.shift === undefined && event.shiftKey) ||
      (combo.meta === undefined && event.metaKey)
    )
  ) {
    return false;
  }

  return true;
}

/**
 * Format a key combo for display
 */
export function formatKeyCombo(combo: KeyCombo): string {
  const parts: string[] = [];

  if (combo.ctrl) parts.push('Ctrl');
  if (combo.alt) parts.push('Alt');
  if (combo.shift) parts.push('Shift');
  if (combo.meta) parts.push(navigator.platform.includes('Mac') ? '⌘' : 'Win');

  parts.push(combo.key.length === 1 ? combo.key.toUpperCase() : combo.key);

  return parts.join('+');
}

/**
 * Hook for handling keyboard shortcuts
 */
export function useKeyboard(
  keyCombo: KeyCombo | KeyCombo[],
  handler: KeyHandler,
  options: KeyboardOptions = {}
): void {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = false,
    target = typeof document !== 'undefined' ? document : undefined,
  } = options;

  // Use a ref for the handler to avoid re-attaching the event listener
  const handlerRef = useRef<KeyHandler>(handler);
  handlerRef.current = handler;

  // Convert single key combo to array
  const keyCombos = Array.isArray(keyCombo) ? keyCombo : [keyCombo];

  // Handle keyboard events with proper event type
  const handleKeyDown = useCallback(
    (event: Event) => {
      if (!enabled) return;
      
      // Type guard to ensure this is a KeyboardEvent
      if (!(event instanceof KeyboardEvent)) return;

      // Check if any key combo matches
      const matchedCombo = keyCombos.find(combo => matchesKeyCombo(event, combo));
      if (!matchedCombo) return;

      // Prevent default browser behavior if requested
      if (preventDefault) {
        event.preventDefault();
      }

      // Stop event propagation if requested
      if (stopPropagation) {
        event.stopPropagation();
      }

      // Call the handler
      handlerRef.current(event);
    },
    [enabled, preventDefault, stopPropagation, keyCombos]
  );

  // Attach and detach the event listener
  useEffect(() => {
    if (!target) return;

    target.addEventListener('keydown', handleKeyDown);

    return () => {
      target.removeEventListener('keydown', handleKeyDown);
    };
  }, [target, handleKeyDown]);
}

/**
 * Hook for handling key sequences (e.g., g then h)
 */
export function useKeySequence(
  sequence: string[],
  handler: KeyHandler,
  options: KeyboardOptions = {}
): void {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = false,
    target = typeof document !== 'undefined' ? document : undefined,
  } = options;

  // Use refs to avoid re-attaching the event listener
  const handlerRef = useRef<KeyHandler>(handler);
  handlerRef.current = handler;
  const sequenceRef = useRef<string[]>(sequence);
  sequenceRef.current = sequence;
  const currentSequenceRef = useRef<string[]>([]);
  const timeoutRef = useRef<number | null>(null);

  // Reset the sequence after a delay
  const resetSequence = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      currentSequenceRef.current = [];
    }, 1000);
  }, []);

  // Handle keyboard events with proper event type
  const handleKeyDown = useCallback(
    (event: Event) => {
      if (!enabled) return;
      
      // Type guard to ensure this is a KeyboardEvent
      if (!(event instanceof KeyboardEvent)) return;

      // Add the key to the current sequence
      currentSequenceRef.current.push(event.key.toLowerCase());

      // Reset the sequence after a delay
      resetSequence();

      // Check if the sequence matches
      const currentSequence = currentSequenceRef.current;
      const targetSequence = sequenceRef.current;
      const isMatch = currentSequence.length === targetSequence.length &&
        currentSequence.every((key, i) => key === targetSequence[i].toLowerCase());

      if (isMatch) {
        // Prevent default browser behavior if requested
        if (preventDefault) {
          event.preventDefault();
        }

        // Stop event propagation if requested
        if (stopPropagation) {
          event.stopPropagation();
        }

        // Call the handler
        handlerRef.current(event);

        // Reset the sequence
        currentSequenceRef.current = [];
      }
    },
    [enabled, preventDefault, stopPropagation, resetSequence]
  );

  // Attach and detach the event listener
  useEffect(() => {
    if (!target) return;

    target.addEventListener('keydown', handleKeyDown);

    return () => {
      target.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [target, handleKeyDown]);
}

/**
 * Example usage:
 * 
 * // Single key
 * useKeyboard({ key: 'Escape' }, handleEscape);
 * 
 * // Key with modifiers
 * useKeyboard({ key: 's', ctrl: true }, handleSave);
 * 
 * // Multiple key combinations
 * useKeyboard(
 *   [
 *     { key: 'ArrowUp' },
 *     { key: 'k' },
 *   ],
 *   handleMoveUp
 * );
 * 
 * // Key sequence
 * useKeySequence(['g', 'h'], () => navigate('/home'));
 */
