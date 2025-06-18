
/**
 * UI Component Utilities
 * 
 * This file provides utilities specifically for UI components,
 * ensuring they work correctly even in environments where React
 * might not be fully available.
 */

import * as React from 'react';
import { safeForwardRef } from '@/shared/utils/react-utils';

/**
 * Type for component props with ref
 */
export type ComponentPropsWithRef<T extends React.ElementType> = 
  React.ComponentPropsWithoutRef<T> & { ref?: React.Ref<React.ElementRef<T>> };

/**
 * Creates a UI component with proper ref forwarding
 */
export function createUIComponent<E extends HTMLElement, P extends Record<string, any> = Record<string, any>>(
  displayName: string,
  render: (props: P & React.HTMLAttributes<E>, ref: React.Ref<E>) => JSX.Element
) {
  const Component = safeForwardRef<E, P & React.HTMLAttributes<E>>(render);
  Component.displayName = displayName;
  return Component;
}

/**
 * Creates a UI component that wraps a primitive element
 */
export function createPrimitiveComponent<E extends HTMLElement>(
  displayName: string,
  element: keyof JSX.IntrinsicElements
) {
  return createUIComponent<E, Record<string, any>>(
    displayName,
    (props, ref) => React.createElement(element, { ...props, ref })
  );
}

/**
 * Safe version of clsx for combining class names
 */
export function cn(...inputs: (string | undefined | null | false | 0)[]) {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Safely get a ref value, handling different ref types
 */
export function getRefValue<T>(ref: React.RefObject<T> | React.MutableRefObject<T> | null): T | null {
  if (!ref) return null;
  return 'current' in ref ? ref.current : null;
}

/**
 * Set a ref value, handling different ref types
 */
export function setRef<T>(
  ref: React.Ref<T> | undefined,
  value: T | null
): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref && 'current' in ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

/**
 * Merge multiple refs into one
 */
export function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (value: T | null): void => {
    refs.forEach((ref) => {
      if (ref) setRef(ref, value);
    });
  };
}

/**
 * Create a component that safely handles refs
 */
export function withSafeRef<P extends Record<string, any>, E extends HTMLElement>(
  Component: React.ComponentType<P & { ref?: React.Ref<E> }>
) {
  return safeForwardRef<E, P>((props, ref) => (
    <Component {...props} ref={ref} />
  ));
}

export default {
  createUIComponent,
  createPrimitiveComponent,
  cn,
  getRefValue,
  setRef,
  mergeRefs,
  withSafeRef,
};
