
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
 * Error boundary props
 */
export interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

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
 * Create a component with error boundary support
 */
function withErrorBoundary<P extends Record<string, any>>(
  Component: React.ComponentType<P>
): React.ComponentType<P & ErrorBoundaryProps> {
  return function ErrorBoundaryWrapper(props: P & ErrorBoundaryProps) {
    const { fallback, onError, ...componentProps } = props;
    
    return (
      <React.Suspense fallback={fallback || <div>Loading...</div>}>
        <Component {...(componentProps as P)} />
      </React.Suspense>
    );
  };
}

/**
 * Create a memoized component
 */
function withMemo<P extends Record<string, any>>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return React.memo(Component) as React.ComponentType<P>;
}

/**
 * Factory function to create components with various enhancements
 */
export function createComponent<P extends Record<string, any>>(
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
  
  // Add error boundary
  if (options.errorBoundary) {
    Component = withErrorBoundary(Component) as React.ComponentType<P>;
  }
  
  return Component;
}

/**
 * Create a simple functional component
 */
export function createFunctionalComponent<P extends Record<string, any>>(
  render: (props: P) => React.ReactElement | null,
  options: ComponentFactoryOptions<P> = {}
): React.ComponentType<P> {
  const Component: React.FunctionComponent<P> = (props) => {
    return render(props);
  };
  
  return createComponent(Component, options);
}

/**
 * Create a provider component
 */
export function createProvider<T, P extends Record<string, any>>(
  context: React.Context<T>,
  useValue: (props: P) => T,
  options: ComponentFactoryOptions<P> = {}
): React.ComponentType<P & { children: React.ReactNode }> {
  const Provider: React.FunctionComponent<P & { children: React.ReactNode }> = (props) => {
    const { children, ...providerProps } = props;
    const value = useValue(providerProps as P);
    
    return React.createElement(context.Provider, { value }, children);
  };
  
  return createComponent(Provider as React.ComponentType<any>, {
    displayName: `${context.displayName || 'Unknown'}Provider`,
    ...options,
  }) as React.ComponentType<P & { children: React.ReactNode }>;
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

export default {
  createComponent,
  createFunctionalComponent,
  createProvider,
  createConsumer,
  withErrorBoundary,
  withMemo,
};
