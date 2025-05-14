/**
 * Component Factory
 * 
 * This utility provides a standardized way to create React components with:
 * - Built-in error handling
 * - Performance optimizations
 * - Consistent API
 * - TypeScript type safety
 * 
 * Use this factory to create components that need error handling or performance optimizations.
 */

import React, { ComponentType, forwardRef, memo, useCallback, useState } from 'react';
import { logError, showErrorToast } from './error-handling';

/**
 * Options for creating a component
 */
interface CreateComponentOptions {
  /**
   * Name of the component for debugging
   */
  displayName: string;
  
  /**
   * Whether to wrap the component in React.memo
   * @default true
   */
  memo?: boolean;
  
  /**
   * Whether to add error handling to the component
   * @default true
   */
  withErrorHandling?: boolean;
  
  /**
   * Whether to forward refs to the component
   * @default false
   */
  forwardRef?: boolean;
}

/**
 * Error boundary props
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    logError(error, 'ErrorBoundary');
    
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded">
          <h3 className="text-red-800 font-medium">Something went wrong</h3>
          <p className="text-red-600">
            {this.state.error?.message || 'An unknown error occurred'}
          </p>
          <button
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Create a component with error handling
 */
function withErrorHandling<P extends object>(
  Component: ComponentType<P>,
  displayName: string
): ComponentType<P & { fallback?: React.ReactNode; onError?: (error: Error) => void }> {
  function WithErrorHandling(
    props: P & { fallback?: React.ReactNode; onError?: (error: Error) => void }
  ): JSX.Element {
    const { fallback, onError, ...componentProps } = props;
    
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...componentProps as P} />
      </ErrorBoundary>
    );
  }
  
  WithErrorHandling.displayName = `WithErrorHandling(${displayName})`;
  
  return WithErrorHandling;
}

/**
 * Create a component with try-catch error handling
 */
function withTryCatch<P extends object>(
  Component: ComponentType<P>,
  displayName: string
): ComponentType<P> {
  function WithTryCatch(props: P): JSX.Element {
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const resetError = useCallback(() => {
      setHasError(false);
      setError(null);
    }, []);
    
    if (hasError) {
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded">
          <h3 className="text-red-800 font-medium">Something went wrong</h3>
          <p className="text-red-600">
            {error?.message || 'An unknown error occurred'}
          </p>
          <button
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
            onClick={resetError}
          >
            Try again
          </button>
        </div>
      );
    }
    
    try {
      return <Component {...props} />;
    } catch (caughtError) {
      const error = caughtError instanceof Error ? caughtError : new Error(String(caughtError));
      logError(error, displayName);
      showErrorToast(error);
      setError(error);
      setHasError(true);
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded">
          <h3 className="text-red-800 font-medium">Something went wrong</h3>
          <p className="text-red-600">
            {error.message || 'An unknown error occurred'}
          </p>
          <button
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
            onClick={resetError}
          >
            Try again
          </button>
        </div>
      );
    }
  }
  
  WithTryCatch.displayName = `WithTryCatch(${displayName})`;
  
  return WithTryCatch;
}

/**
 * Create a component with standardized behavior
 */
export function createComponent<P extends object>(
  Component: ComponentType<P>,
  options: CreateComponentOptions
): ComponentType<P> {
  const {
    displayName,
    memo: shouldMemo = true,
    withErrorHandling: shouldAddErrorHandling = true,
    forwardRef: shouldForwardRef = false,
  } = options;
  
  // Set display name
  Component.displayName = displayName;
  
  // Add error handling if requested
  let EnhancedComponent = shouldAddErrorHandling
    ? withErrorHandling(Component, displayName)
    : Component;
  
  // Add memo if requested
  if (shouldMemo) {
    EnhancedComponent = memo(EnhancedComponent);
  }
  
  // Add forward ref if requested
  if (shouldForwardRef) {
    EnhancedComponent = forwardRef((props: P, ref) => (
      <EnhancedComponent {...props} ref={ref} />
    )) as unknown as ComponentType<P>;
    
    // Set display name for the forwarded ref component
    EnhancedComponent.displayName = `ForwardRef(${displayName})`;
  }
  
  return EnhancedComponent;
}

/**
 * Create a component with try-catch error handling
 */
export function createTryCatchComponent<P extends object>(
  Component: ComponentType<P>,
  options: CreateComponentOptions
): ComponentType<P> {
  const {
    displayName,
    memo: shouldMemo = true,
    forwardRef: shouldForwardRef = false,
  } = options;
  
  // Set display name
  Component.displayName = displayName;
  
  // Add try-catch error handling
  let EnhancedComponent = withTryCatch(Component, displayName);
  
  // Add memo if requested
  if (shouldMemo) {
    EnhancedComponent = memo(EnhancedComponent);
  }
  
  // Add forward ref if requested
  if (shouldForwardRef) {
    EnhancedComponent = forwardRef((props: P, ref) => (
      <EnhancedComponent {...props} ref={ref} />
    )) as unknown as ComponentType<P>;
    
    // Set display name for the forwarded ref component
    EnhancedComponent.displayName = `ForwardRef(${displayName})`;
  }
  
  return EnhancedComponent;
}

/**
 * Create a safe component that catches errors
 */
export function createSafeComponent<P extends object>(
  Component: ComponentType<P>,
  options: Omit<CreateComponentOptions, 'withErrorHandling'>
): ComponentType<P> {
  return createComponent(Component, {
    ...options,
    withErrorHandling: true,
  });
}
