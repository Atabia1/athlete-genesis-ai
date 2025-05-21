/**
 * React Utilities
 *
 * This file provides essential React utilities and re-exports to ensure
 * consistent React usage throughout the application.
 */

import * as React from 'react';

// Re-export React essentials to ensure they're available
export const {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  forwardRef,
  memo,
  createContext,
  createElement,
  Fragment,
  isValidElement,
  cloneElement,
  Children,
} = React;

// Type exports
export type {
  ReactNode,
  ReactElement,
  FC,
  FunctionComponent,
  ComponentType,
  ComponentProps,
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  RefObject,
  Ref,
  ForwardRefExoticComponent,
  RefAttributes,
  PropsWithChildren,
  PropsWithRef,
  ClassAttributes,
  CSSProperties,
  ReactPortal,
  SyntheticEvent,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  FocusEvent,
  ReactEventHandler,
} from 'react';

/**
 * Safe forwardRef implementation that ensures the ref is properly handled
 * even if React.forwardRef is not available at runtime
 */
export function safeForwardRef<T, P = Record<string, unknown>>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>> {
  // First try to use the native forwardRef
  if (typeof React.forwardRef === 'function') {
    return React.forwardRef(render);
  }

  // Fallback implementation if forwardRef is not available
  const FallbackForwardRef = function FallbackForwardRef(
    props: P & { ref?: React.Ref<T> }
  ) {
    const { ref, ...rest } = props as any;
    return render(rest as P, ref);
  };

  // Set display name
  FallbackForwardRef.displayName = render.name
    ? `SafeForwardRef(${render.name})`
    : 'SafeForwardRef';

  return FallbackForwardRef as any;
}

/**
 * Safe component factory that handles refs properly
 */
export function createSafeComponent<P extends object, R = any>(
  Component: React.ComponentType<P>,
  options: {
    displayName: string;
    withRef?: boolean;
  }
): React.ComponentType<P> {
  const { displayName, withRef = false } = options;

  // Set display name
  Component.displayName = displayName;

  // Add forward ref if requested
  if (withRef) {
    return safeForwardRef<R, P>((props, ref) => (
      <Component {...props} ref={ref} />
    ));
  }

  return Component;
}

/**
 * Safe version of React.createElement that handles errors
 */
export function createSafeElement<P>(
  type: React.ElementType<P>,
  props?: React.Attributes & P | null,
  ...children: React.ReactNode[]
): React.ReactElement | null {
  try {
    return React.createElement(type, props, ...children);
  } catch (error) {
    console.error(`Error creating element of type ${String(type)}:`, error);
    return null;
  }
}

// Export React itself as a fallback
export default React;
