/**
 * Error Handling Utilities
 *
 * This module provides utilities for consistent error handling throughout the application.
 * It includes error classes, error handling functions, and error reporting.
 */

import * as React from 'react';
import { toast } from '@/components/ui/use-toast';
import { serviceRegistry } from '@/services/service-registry';

/**
 * Base application error class
 */
export class AppError extends Error {
  code: string;
  context?: Record<string, unknown>;

  constructor(message: string, code: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
  }
}

/**
 * API error class
 */
export class ApiError extends AppError {
  statusCode?: number;

  constructor(message: string, code: string, statusCode?: number, context?: Record<string, unknown>) {
    super(message, code, context);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Validation error class
 */
export class ValidationError extends AppError {
  errors: string[];

  constructor(message: string, errors: string[], context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Authentication error class
 */
export class AuthError extends AppError {
  constructor(message: string, code: string = 'AUTH_ERROR', context?: Record<string, unknown>) {
    super(message, code, context);
    this.name = 'AuthError';
  }
}

/**
 * Network error class
 */
export class NetworkError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'NETWORK_ERROR', context);
    this.name = 'NetworkError';
  }
}

/**
 * Storage error class
 */
export class StorageError extends AppError {
  constructor(message: string, code: string = 'STORAGE_ERROR', context?: Record<string, unknown>) {
    super(message, code, context);
    this.name = 'StorageError';
  }
}

/**
 * Handle an error and return a user-friendly message
 */
export function handleError(error: unknown, componentName?: string): string {
  // Log the error
  logError(error, componentName);

  // Return a user-friendly message
  return getUserFriendlyMessage(error);
}

/**
 * Log an error to the logging service
 */
export function logError(error: unknown, componentName?: string): void {
  // Convert to Error object if it's not already
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const logger = serviceRegistry.logging;

  // Extract error details
  const errorMessage = errorObj.message || 'Unknown error';
  const errorCode = (error as AppError)?.code || 'UNKNOWN_ERROR';
  const errorName = errorObj.name || 'Error';
  const errorStack = errorObj.stack;

  // Create context object
  const context: Record<string, unknown> = {
    errorName,
    errorCode,
    componentName,
  };

  // Add additional context if available
  if ((error as AppError)?.context) {
    context.errorContext = (error as AppError).context;
  }

  if ((error as ApiError)?.statusCode) {
    context.statusCode = (error as ApiError).statusCode;
  }

  if (errorStack) {
    context.stack = errorStack;
  }

  // Log the error
  logger.error(`${errorName}: ${errorMessage}`, context);

  // Track the error in analytics
  serviceRegistry.analytics.trackError(errorMessage, errorCode, componentName);
}

/**
 * Get a user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  // Default message
  let message = 'An unexpected error occurred. Please try again.';

  // Handle specific error types
  if (error instanceof ValidationError) {
    message = error.message || 'Please check your input and try again.';
  } else if (error instanceof ApiError) {
    message = getApiErrorMessage(error);
  } else if (error instanceof AuthError) {
    message = getAuthErrorMessage(error);
  } else if (error instanceof NetworkError) {
    message = 'Network error. Please check your connection and try again.';
  } else if (error instanceof StorageError) {
    message = 'Storage error. Please try again later.';
  } else if (error instanceof Error) {
    // Generic Error object
    message = error.message || message;
  }

  return message;
}

/**
 * Get a user-friendly message for API errors
 */
function getApiErrorMessage(error: ApiError): string {
  // Handle specific API error codes
  switch (error.code) {
    case 'RESOURCE_NOT_FOUND':
      return 'The requested resource was not found.';
    case 'INVALID_REQUEST':
      return 'Invalid request. Please check your input and try again.';
    case 'UNAUTHORIZED':
      return 'You are not authorized to perform this action.';
    case 'FORBIDDEN':
      return 'You do not have permission to access this resource.';
    case 'SERVER_ERROR':
      return 'Server error. Please try again later.';
    default:
      return error.message || 'An error occurred while communicating with the server.';
  }
}

/**
 * Get a user-friendly message for authentication errors
 */
function getAuthErrorMessage(error: AuthError): string {
  // Handle specific authentication error codes
  switch (error.code) {
    case 'INVALID_CREDENTIALS':
      return 'Invalid email or password. Please try again.';
    case 'ACCOUNT_LOCKED':
      return 'Your account has been locked. Please contact support.';
    case 'SESSION_EXPIRED':
      return 'Your session has expired. Please sign in again.';
    case 'EMAIL_NOT_VERIFIED':
      return 'Please verify your email address before signing in.';
    default:
      return error.message || 'Authentication error. Please sign in again.';
  }
}

/**
 * Show an error toast with a user-friendly message
 */
export function showErrorToast(error: unknown, title: string = 'Error'): void {
  const message = getUserFriendlyMessage(error);

  toast({
    title,
    description: message,
    variant: 'destructive',
  });
}

/**
 * Try to execute a function and handle any errors
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: unknown) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      // Default error handling
      logError(error);
      showErrorToast(error);
    }
    return null;
  }
}

/**
 * Create an error boundary component
 */
export function withErrorBoundary<P>(
  Component: React.ComponentType<P>,
  FallbackComponent: React.ComponentType<{ error: Error; resetError: () => void }>,
  onError?: (error: Error, info: { componentStack: string }) => void
): React.ComponentType<P> {
  return class ErrorBoundary extends React.Component<P, { hasError: boolean; error: Error | null }> {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: { componentStack: string }) {
      // Log the error
      logError(error, Component.displayName || Component.name);

      // Call the onError callback if provided
      if (onError) {
        onError(error, info);
      }
    }

    resetError = () => {
      this.setState({ hasError: false, error: null });
    };

    render() {
      if (this.state.hasError && this.state.error) {
        return React.createElement(FallbackComponent, {
          error: this.state.error,
          resetError: this.resetError
        });
      }

      return React.createElement(Component, this.props);
    }
  };
}
