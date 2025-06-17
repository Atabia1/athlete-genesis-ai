
/**
 * Component Factory Utilities
 *
 * This module provides utilities for creating reusable components with
 * consistent patterns for error boundaries, memoization, and composition.
 */

import * as React from 'react';
import { safeForwardRef } from './react-utils';

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
  return React.memo(Component);
}

/**
 * Create a component with ref forwarding
 */
function withRef<T, P extends Record<string, any>>(
  Component: React.ComponentType<P>
) {
  return safeForwardRef<T, P>((props, ref) => (
    <Component {...props} ref={ref} />
  ));
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
  
  // Add default props
  if (options.defaultProps && 'defaultProps' in Component) {
    (Component as any).defaultProps = options.defaultProps;
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
 * Create a compound component (component with sub-components)
 */
export function createCompoundComponent<
  P extends Record<string, any>,
  SubComponents extends Record<string, React.ComponentType<any>>
>(
  MainComponent: React.ComponentType<P>,
  subComponents: SubComponents,
  options: ComponentFactoryOptions<P> = {}
): React.ComponentType<P> & SubComponents {
  const Component = createComponent(MainComponent, options) as React.ComponentType<P> & SubComponents;
  
  // Attach sub-components
  Object.keys(subComponents).forEach((key) => {
    (Component as any)[key] = subComponents[key];
  });
  
  return Component;
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

/**
 * Create a layout component with slots
 */
export function createLayout<P extends Record<string, any>>(
  Layout: React.ComponentType<P & { children: React.ReactNode }>,
  slots: Record<string, React.ComponentType<any>>,
  options: ComponentFactoryOptions<P> = {}
): React.ComponentType<P> & { Slots: typeof slots } {
  const LayoutComponent = createComponent(Layout as React.ComponentType<any>, options) as React.ComponentType<P> & { Slots: typeof slots };
  LayoutComponent.Slots = slots;
  
  return LayoutComponent;
}

export default {
  createComponent,
  createFunctionalComponent,
  createCompoundComponent,
  createProvider,
  createConsumer,
  createLayout,
  withErrorBoundary,
  withMemo,
  withRef,
};
