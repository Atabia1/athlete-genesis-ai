
/**
 * Component Factory Utilities
 *
 * This module provides utilities for creating reusable components with
 * consistent patterns for error boundaries, memoization, and composition.
 */

import * as React from 'react';

/**
 * Generic component props type
 */
export type ComponentProps<T = Record<string, any>> = T & {
  children?: React.ReactNode;
  className?: string;
};

/**
 * Component factory options
 */
export interface ComponentFactoryOptions<P = Record<string, any>> {
  displayName?: string;
  memo?: boolean;
  errorBoundary?: boolean;
  defaultProps?: Partial<P>;
}

/**
 * Create a memoized component (simplified)
 */
function withMemo<P>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const MemoizedComponent = React.memo(Component as React.FC<P>);
  return MemoizedComponent as React.ComponentType<P>;
}

/**
 * Factory function to create components with various enhancements
 */
export function createComponent<P>(
  component: React.ComponentType<P>,
  options: ComponentFactoryOptions<P> = {}
): React.ComponentType<P> {
  let Component = component;
  
  // Set display name
  if (options.displayName) {
    Component.displayName = options.displayName;
  }
  
  // Add memoization
  if (options.memo) {
    Component = withMemo(Component);
  }
  
  return Component;
}

/**
 * Create a simple functional component
 */
export function createFunctionalComponent<P>(
  render: (props: P) => React.ReactElement | null,
  options: ComponentFactoryOptions<P> = {}
): React.ComponentType<P> {
  const Component: React.FunctionComponent<P> = (props) => {
    return render(props);
  };
  
  return createComponent(Component, options);
}

/**
 * Create a provider component (simplified)
 */
export function createProvider<T, P extends Record<string, any>>(
  context: React.Context<T>,
  useValue: (props: P) => T
): React.ComponentType<P & { children: React.ReactNode }> {
  const Provider: React.FC<P & { children: React.ReactNode }> = (props) => {
    const { children, ...providerProps } = props;
    const value = useValue(providerProps as P);
    
    return React.createElement(context.Provider, { value }, children);
  };
  
  return Provider;
}

/**
 * Create a consumer component
 */
export function createConsumer<T>(
  context: React.Context<T>,
  render: (value: T) => React.ReactElement | null,
  options: ComponentFactoryOptions = {}
): React.ComponentType {
  const Consumer: React.FunctionComponent = () => {
    const value = React.useContext(context);
    return render(value);
  };
  
  return createComponent(Consumer, {
    displayName: `${context.displayName || 'Unknown'}Consumer`,
    ...options,
  });
}

/**
 * Combine multiple providers into a single provider
 */
export function combineProviders(
  providers: Array<React.FC<{ children: React.ReactNode }>>
): React.FC<{ children: React.ReactNode }> {
  return ({ children }) => {
    return providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children as React.ReactElement
    );
  };
}

export default {
  createComponent,
  createFunctionalComponent,
  createProvider,
  createConsumer,
  withMemo,
};
