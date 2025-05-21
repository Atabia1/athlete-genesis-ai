
/**
 * IndexedDB Error Types and Classes
 */

/**
 * IndexedDB Error Types
 */
export enum IndexedDBErrorType {
  INITIALIZATION_ERROR = 'initialization_error',
  NOT_INITIALIZED = 'not_initialized',
  TRANSACTION_ERROR = 'transaction_error',
  TRANSACTION_ABORTED = 'transaction_aborted',
  ADD_ERROR = 'add_error',
  UPDATE_ERROR = 'update_error',
  DELETE_ERROR = 'delete_error',
  GET_ERROR = 'get_error',
  QUOTA_EXCEEDED = 'quota_exceeded'
}

/**
 * Error options
 */
interface IndexedDBErrorOptions {
  recoverable?: boolean;
  userMessage?: string;
}

/**
 * Custom IndexedDB Error class
 */
export class IndexedDBError extends Error {
  type: IndexedDBErrorType;
  technical?: string;
  recoverable: boolean;
  userMessage: string;

  /**
   * Create a new IndexedDB Error
   * @param message User-friendly error message
   * @param type Error type
   * @param technical Technical error details
   * @param options Additional error options
   */
  constructor(
    message: string,
    type: IndexedDBErrorType,
    technical?: string,
    options: IndexedDBErrorOptions = {}
  ) {
    super(message);
    this.name = 'IndexedDBError';
    this.type = type;
    this.technical = technical;
    this.recoverable = options.recoverable ?? false;
    this.userMessage = options.userMessage || this.getUserMessage(type, message);
  }

  /**
   * Get a user-friendly error message based on the error type
   * @param type Error type
   * @param fallback Fallback message
   * @returns User-friendly error message
   */
  private getUserMessage(type: IndexedDBErrorType, fallback: string): string {
    switch (type) {
      case IndexedDBErrorType.INITIALIZATION_ERROR:
        return 'Failed to initialize the local database. Please reload the page and try again.';
      case IndexedDBErrorType.QUOTA_EXCEEDED:
        return 'Storage space is full. Please clear some data to continue.';
      case IndexedDBErrorType.TRANSACTION_ERROR:
      case IndexedDBErrorType.TRANSACTION_ABORTED:
        return 'Database operation failed. Please try again later.';
      default:
        return fallback;
    }
  }
}
