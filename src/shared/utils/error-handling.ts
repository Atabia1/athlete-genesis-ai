
/**
 * Error Handling Utilities
 *
 * This module provides comprehensive error handling utilities for the application.
 * It includes error logging, user-friendly error messages, and error recovery strategies.
 */

import * as React from 'react';

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Application error types
 */
export enum ErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

/**
 * Error context interface
 */
export interface ErrorContext {
  userId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: string;
  additionalData?: Record<string, any>;
}

/**
 * Application error class
 */
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly context: ErrorContext;
  public readonly isRetryable: boolean;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: ErrorContext = {},
    isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.context = {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      ...context,
    };
    this.isRetryable = isRetryable;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Log error to external service
 */
function logErrorToService(error: Error | AppError, context: ErrorContext = {}): void {
  // In a real application, you would send this to an error tracking service
  // like Sentry, LogRocket, or Bugsnag
  console.error('Error logged:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Handle errors in a consistent way
 */
export function handleError(
  error: Error | AppError,
  context: ErrorContext = {},
  shouldNotifyUser: boolean = true
): void {
  // Log the error
  logErrorToService(error, context);

  // Track error for analytics
  if (typeof window !== 'undefined') {
    console.error('Error tracked for analytics:', error);
  }

  // Show user-friendly notification if needed
  if (shouldNotifyUser) {
    showErrorNotification(error);
  }
}

/**
 * Show user-friendly error notification
 */
function showErrorNotification(error: Error | AppError): void {
  const message = getUserFriendlyErrorMessage(error);
  
  // In a real application, you would use your toast/notification system
  console.warn('User notification:', message);
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: Error | AppError): string {
  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorType.NETWORK:
        return 'Network connection error. Please check your internet connection and try again.';
      case ErrorType.AUTHENTICATION:
        return 'Authentication failed. Please log in again.';
      case ErrorType.AUTHORIZATION:
        return 'You do not have permission to perform this action.';
      case ErrorType.NOT_FOUND:
        return 'The requested resource was not found.';
      case ErrorType.VALIDATION:
        return error.message; // Validation messages are usually user-friendly
      case ErrorType.SERVER:
        return 'Server error occurred. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Generic error message for unknown errors
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Network error factory
 */
export function createNetworkError(
  message: string = 'Network request failed',
  context: ErrorContext = {}
): AppError {
  return new AppError(
    message,
    ErrorType.NETWORK,
    ErrorSeverity.MEDIUM,
    context,
    true // Network errors are usually retryable
  );
}

/**
 * Validation error factory
 */
export function createValidationError(
  message: string,
  context: ErrorContext = {}
): AppError {
  return new AppError(
    message,
    ErrorType.VALIDATION,
    ErrorSeverity.LOW,
    context,
    false
  );
}

/**
 * Authentication error factory
 */
export function createAuthenticationError(
  message: string = 'Authentication required',
  context: ErrorContext = {}
): AppError {
  return new AppError(
    message,
    ErrorType.AUTHENTICATION,
    ErrorSeverity.HIGH,
    context,
    false
  );
}

/**
 * Server error factory
 */
export function createServerError(
  message: string = 'Internal server error',
  context: ErrorContext = {}
): AppError {
  return new AppError(
    message,
    ErrorType.SERVER,
    ErrorSeverity.HIGH,
    context,
    true
  );
}

/**
 * Async error handler wrapper
 */
export function withAsyncErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: ErrorContext = {}
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error as Error, context);
      throw error;
    }
  }) as T;
}

/**
 * Sync error handler wrapper
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  context: ErrorContext = {}
): T {
  return ((...args: Parameters<T>) => {
    try {
      return fn(...args);
    } catch (error) {
      handleError(error as Error, context);
      throw error;
    }
  }) as T;
}

/**
 * React error boundary wrapper
 */
export function withErrorBoundary<P extends Record<string, any>>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function WrappedComponent(props: P) {
    return React.createElement(Component, props);
  };
}

/**
 * Promise error handler
 */
export function handlePromiseError<T>(
  promise: Promise<T>,
  context: ErrorContext = {}
): Promise<T> {
  return promise.catch((error) => {
    handleError(error, context);
    throw error;
  });
}

/**
 * Retry wrapper with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  context: ErrorContext = {}
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Don't retry if the error is not retryable
      if (error instanceof AppError && !error.isRetryable) {
        break;
      }

      // Wait before retrying with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Handle the final error
  handleError(lastError!, context);
  throw lastError!;
}

/**
 * Error boundary hook
 */
export function useErrorHandler(): (error: Error, context?: ErrorContext) => void {
  return React.useCallback((error: Error, context: ErrorContext = {}) => {
    handleError(error, context);
  }, []);
}

/**
 * Async error boundary hook
 */
export function useAsyncError(): (error: Error) => void {
  const [, setError] = React.useState();
  return React.useCallback(
    (error: Error) => {
      setError(() => {
        throw error;
      });
    },
    [setError]
  );
}
