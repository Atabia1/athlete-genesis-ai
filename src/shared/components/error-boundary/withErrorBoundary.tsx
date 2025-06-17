
import { Component, ComponentType, ErrorInfo } from 'react';
import ErrorFallback from './ErrorFallback';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface WithErrorBoundaryProps {
  fallback?: ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithErrorBoundaryProps = {}
) {
  class ComponentErrorBoundary extends Component<P, ErrorBoundaryState> {
    static displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error("Caught an error: ", error, errorInfo);
      options?.onError?.(error, errorInfo);
    }

    resetError = () => {
      this.setState({ hasError: false, error: undefined });
    };

    render() {
      if (this.state.hasError) {
        // Custom fallback component or default ErrorFallback
        const FallbackComponent = options.fallback || ErrorFallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      // Normally, just render children
      return <WrappedComponent {...this.props} />;
    }
  }

  return ComponentErrorBoundary;
}

export default withErrorBoundary;
