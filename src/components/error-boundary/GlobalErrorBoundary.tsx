/**
 * Global Error Boundary
 *
 * This component catches errors in the component tree and displays a fallback UI.
 * It should be used at the top level of the application to catch all errors.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';
import { logError } from '@/shared/utils/error-handling';

interface GlobalErrorBoundaryProps {
  children: ReactNode;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): GlobalErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our error handling service
    logError(error, 'GlobalErrorBoundary');
    console.error('Global error caught by error boundary:', error, errorInfo);
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Render fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={this.resetError}
          title="Application Error"
          showHomeButton={true}
          showResetButton={true}
        />
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}
