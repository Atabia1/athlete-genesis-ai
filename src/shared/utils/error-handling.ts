/**
 * Error Handling Utilities
 *
 * This module provides utilities for consistent error handling throughout the application.
 */

import { toast } from '@/components/ui/use-toast';

/**
 * Error types for categorizing errors
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  DATABASE = 'DATABASE',
  UNKNOWN = 'UNKNOWN',
  OFFLINE = 'OFFLINE',
  TIMEOUT = 'TIMEOUT',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  RATE_LIMIT = 'RATE_LIMIT',
  CONFLICT = 'CONFLICT',
  INVALID_STATE = 'INVALID_STATE',
  STORAGE = 'STORAGE',
}

/**
 * Base application error class
 */
export class AppError extends Error {
  code: string;
  type: ErrorType;
  context?: Record<string, unknown>;
  recoverable: boolean;

  constructor(
    message: string,
    code: string,
    type: ErrorType = ErrorType.UNKNOWN,
    context?: Record<string, unknown>,
    recoverable: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.type = type;
    this.context = context;
    this.recoverable = recoverable;

    // Ensure the prototype chain is properly set up
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * API error class for handling API-specific errors
 */
export class ApiError extends AppError {
  statusCode: number;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    context?: Record<string, unknown>,
    recoverable: boolean = true
  ) {
    super(message, code, mapStatusCodeToErrorType(statusCode), context, recoverable);
    this.name = 'ApiError';
    this.statusCode = statusCode;

    // Ensure the prototype chain is properly set up
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Map HTTP status code to error type
 */
function mapStatusCodeToErrorType(statusCode: number): ErrorType {
  switch (statusCode) {
    case 400:
      return ErrorType.VALIDATION;
    case 401:
      return ErrorType.AUTHENTICATION;
    case 403:
      return ErrorType.AUTHORIZATION;
    case 404:
      return ErrorType.NOT_FOUND;
    case 409:
      return ErrorType.CONFLICT;
    case 429:
      return ErrorType.RATE_LIMIT;
    case 500:
    case 502:
    case 503:
    case 504:
      return ErrorType.SERVER;
    default:
      return ErrorType.UNKNOWN;
  }
}

/**
 * Validation error class for handling validation-specific errors
 */
export class ValidationError extends AppError {
  errors: Record<string, string[]>;

  constructor(
    message: string,
    errors: Record<string, string[]>,
    context?: Record<string, unknown>,
    recoverable: boolean = true
  ) {
    super(message, 'VALIDATION_ERROR', ErrorType.VALIDATION, context, recoverable);
    this.name = 'ValidationError';
    this.errors = errors;

    // Ensure the prototype chain is properly set up
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Authentication error class for handling authentication-specific errors
 */
export class AuthError extends AppError {
  constructor(
    message: string,
    code: string = 'AUTH_ERROR',
    context?: Record<string, unknown>,
    recoverable: boolean = true
  ) {
    super(message, code, ErrorType.AUTHENTICATION, context, recoverable);
    this.name = 'AuthError';

    // Ensure the prototype chain is properly set up
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * Network error class for handling network-specific errors
 */
export class NetworkError extends AppError {
  constructor(
    message: string,
    context?: Record<string, unknown>,
    recoverable: boolean = true
  ) {
    super(message, 'NETWORK_ERROR', ErrorType.NETWORK, context, recoverable);
    this.name = 'NetworkError';

    // Ensure the prototype chain is properly set up
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Storage error class for handling storage-specific errors
 */
export class StorageError extends AppError {
  constructor(
    message: string,
    code: string = 'STORAGE_ERROR',
    context?: Record<string, unknown>,
    recoverable: boolean = true
  ) {
    super(message, code, ErrorType.STORAGE, context, recoverable);
    this.name = 'StorageError';

    // Ensure the prototype chain is properly set up
    Object.setPrototypeOf(this, StorageError.prototype);
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
 * Log an error to the console
 */
export function logError(error: unknown, componentName?: string): void {
  // Convert to Error object if it's not already
  const errorObj = error instanceof Error ? error : new Error(String(error));

  // Extract error details
  const errorMessage = errorObj.message || 'Unknown error';
  const errorName = errorObj.name || 'Error';
  const errorStack = errorObj.stack;

  // Create context object
  const context: Record<string, unknown> = {
    errorName,
    componentName,
  };

  if (errorStack) {
    context.stack = errorStack;
  }

  // Log the error
  console.error(`${errorName}: ${errorMessage}`, context);
}

/**
 * Get a user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  // Default message
  let message = 'An unexpected error occurred. Please try again.';

  if (error instanceof AppError) {
    // Handle based on error type
    switch (error.type) {
      case ErrorType.VALIDATION:
        if (error instanceof ValidationError) {
          message = error.message || 'Please check your input and try again.';
        } else {
          message = 'Please check your input and try again.';
        }
        break;
      case ErrorType.NETWORK:
        message = 'Network error. Please check your connection and try again.';
        break;
      case ErrorType.AUTHENTICATION:
        if (error instanceof AuthError) {
          message = getAuthErrorMessage(error);
        } else {
          message = 'Authentication error. Please log in and try again.';
        }
        break;
      case ErrorType.AUTHORIZATION:
        message = 'You do not have permission to perform this action.';
        break;
      case ErrorType.NOT_FOUND:
        message = 'The requested resource was not found.';
        break;
      case ErrorType.SERVER:
        message = 'Server error. Please try again later.';
        break;
      case ErrorType.DATABASE:
        message = 'Database error. Please try again later.';
        break;
      case ErrorType.OFFLINE:
        message = 'You are offline. Please check your connection and try again.';
        break;
      case ErrorType.TIMEOUT:
        message = 'The request timed out. Please try again.';
        break;
      case ErrorType.QUOTA_EXCEEDED:
        message = 'Storage quota exceeded. Please free up some space and try again.';
        break;
      case ErrorType.RATE_LIMIT:
        message = 'Rate limit exceeded. Please try again later.';
        break;
      case ErrorType.CONFLICT:
        message = 'Conflict error. Please refresh and try again.';
        break;
      case ErrorType.INVALID_STATE:
        message = 'Invalid state. Please refresh and try again.';
        break;
      case ErrorType.STORAGE:
        message = 'Storage error. Please try again later.';
        break;
      default:
        // Use the error message if it's available and not too technical
        message = error.message || message;
    }

    // For API errors, get more specific messages based on status code
    if (error instanceof ApiError) {
      message = getApiErrorMessage(error);
    }
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
      // Handle based on status code if no specific code message
      switch (error.statusCode) {
        case 400:
          return 'Invalid request. Please check your input and try again.';
        case 401:
          return 'You need to be logged in to perform this action.';
        case 403:
          return 'You do not have permission to access this resource.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'There was a conflict with the current state of the resource.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
        case 502:
        case 503:
        case 504:
          return 'Server error. Please try again later.';
        default:
          return error.message || 'An error occurred while communicating with the server.';
      }
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
    case 'INVALID_TOKEN':
      return 'Your authentication token is invalid. Please sign in again.';
    case 'TOKEN_EXPIRED':
      return 'Your authentication token has expired. Please sign in again.';
    case 'ACCOUNT_DISABLED':
      return 'Your account has been disabled. Please contact support.';
    default:
      return error.message || 'Authentication error. Please sign in again.';
  }
}

/**
 * Show an error toast with a user-friendly message
 */
export function showErrorToast(error: unknown, title: string = 'Error'): void {
  const message = error instanceof Error ? error.message : String(error);

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
 * Create a safe version of a function that catches errors
 */
export function createSafeFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorHandler?: (error: unknown) => void
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    try {
      return await fn(...args);
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
  };
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

    static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: { componentStack: string }): void {
      // Log the error
      logError(error, Component.displayName || Component.name);

      // Call the onError callback if provided
      if (onError) {
        onError(error, info);
      }
    }

    resetError = (): void => {
      this.setState({ hasError: false, error: null });
    };

    render(): React.ReactNode {
      if (this.state.hasError && this.state.error) {
        // Use a type assertion to avoid TypeScript errors with JSX in .ts files
        return React.createElement(FallbackComponent, {
          error: this.state.error,
          resetError: this.resetError
        });
      }

      return React.createElement(Component, this.props);
    }
  };
}

/**
 * Create a safe component that catches errors
 */
export function createSafeComponent<P>(
  Component: React.ComponentType<P>,
  errorHandler?: (error: unknown) => void
): React.ComponentType<P> {
  const SafeComponent = (props: P): React.ReactElement => {
    try {
      return React.createElement(Component, props);
    } catch (error) {
      if (errorHandler) {
        errorHandler(error);
      } else {
        // Default error handling
        logError(error, Component.displayName || Component.name);
        showErrorToast(error);
      }

      // Return a fallback UI
      return React.createElement(
        'div',
        { className: "p-4 border border-red-300 bg-red-50 rounded" },
        React.createElement('h3', { className: "text-red-800 font-medium" }, "Something went wrong"),
        React.createElement('p', { className: "text-red-600" }, "An error occurred while rendering this component.")
      );
    }
  };

  SafeComponent.displayName = `Safe(${Component.displayName || Component.name || 'Component'})`;

  return SafeComponent;
}
