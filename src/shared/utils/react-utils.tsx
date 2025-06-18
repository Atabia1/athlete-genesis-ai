
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
 */
export function safeForwardRef<T, P extends Record<string, unknown>>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>> {
  return React.forwardRef((props: React.PropsWithoutRef<P>, ref: React.Ref<T>) => {
    return render(props as P, ref);
  });
}

/**
 * Safe component factory that handles refs properly
 */
export function createSafeComponent<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  options: {
    displayName: string;
  }
): React.ComponentType<P> {
  const { displayName } = options;

  // Set display name
  Component.displayName = displayName;

  return Component;
}

/**
 * Safe version of React.createElement that handles errors
 */
export function createSafeElement<P extends Record<string, unknown>>(
  type: React.ElementType<P>,
  props?: React.Attributes & P | null,
  ...children: React.ReactNode[]
): React.ReactElement | null {
  try {
    return React.createElement(type as any, props, ...children);
  } catch (error) {
    console.error(`Error creating element of type ${String(type)}:`, error);
    return null;
  }
}

// Export React itself as a fallback
export default React;
