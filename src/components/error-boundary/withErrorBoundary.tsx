/**
 * withErrorBoundary Higher-Order Component
 * 
 * This HOC wraps a component with an error boundary to catch and handle errors.
 * It provides a customizable fallback UI and error handling options.
 */

import React, { Component, ComponentType, ErrorInfo } from 'react';
import { ErrorFallback } from './ErrorFallback';
import { logError } from '@/utils/error-handling';

interface ErrorBoundaryProps {
  FallbackComponent?: ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  title?: string;
  showHomeButton?: boolean;
  showResetButton?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Higher-order component that wraps a component with an error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: ErrorBoundaryProps = {}
): ComponentType<P> {
  const {
    FallbackComponent = ErrorFallback,
    onError,
    title = 'Component Error',
    showHomeButton = true,
    showResetButton = true,
  } = options;

  class ComponentErrorBoundary extends Component<P, ErrorBoundaryState> {
    constructor(props: P) {
      super(props);
      this.state = {
        hasError: false,
        error: null,
      };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return {
        hasError: true,
        error,
      };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
      // Log the error
      const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
      logError(error, componentName);
      
      // Call the onError callback if provided
      if (onError) {
        onError(error, errorInfo);
      }
    }

    resetError = (): void => {
      this.setState({
        hasError: false,
        error: null,
      });
    };

    render() {
      const { hasError, error } = this.state;

      if (hasError && error) {
        return (
          <FallbackComponent
            error={error}
            resetError={this.resetError}
            title={title}
            showHomeButton={showHomeButton}
            showResetButton={showResetButton}
          />
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  }

  // Set display name for debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ComponentErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return ComponentErrorBoundary;
}

/**
 * Example usage:
 * 
 * const MyComponentWithErrorBoundary = withErrorBoundary(MyComponent, {
 *   title: 'My Component Error',
 *   showHomeButton: false,
 *   onError: (error, errorInfo) => {
 *     // Custom error handling
 *   }
 * });
 */
