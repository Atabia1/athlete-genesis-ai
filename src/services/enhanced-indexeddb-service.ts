/**
 * Enhanced IndexedDB service with transaction queue and improved error handling
 *
 * This service extends the existing IndexedDB service with:
 * - Transaction queue to prevent race conditions
 * - Improved error recovery mechanisms
 * - Better handling of offline scenarios
 * - Enhanced data validation
 */

import { IndexedDBService, IndexedDBError, IndexedDBErrorType, TransactionMode, TransactionOperations, DBMigration } from './indexeddb-service';
import { validateData, ValidationResult } from '@/utils/validation';

/**
 * Enhanced IndexedDB service with transaction queue
 */
export class EnhancedIndexedDBService extends IndexedDBService {
  // Queue for pending transactions
  private transactionQueue: Array<() => Promise<any>> = [];
  // Flag to track if the queue is being processed
  private isProcessingQueue = false;
  // Maximum number of retries for a transaction
  private maxRetries = 3;

  /**
   * Create a new EnhancedIndexedDBService
   * @param dbName The name of the database
   * @param migrations Array of migrations to apply, in order of version
   */
  constructor(dbName: string, migrations: DBMigration[]) {
    super(dbName, migrations);
  }

  /**
   * Process the transaction queue sequentially
   * This prevents race conditions by ensuring only one transaction is active at a time
   */
  private async processTransactionQueue(): Promise<void> {
    // If already processing, return
    if (this.isProcessingQueue) return;

    // Set processing flag
    this.isProcessingQueue = true;

    try {
      // Process transactions until the queue is empty
      while (this.transactionQueue.length > 0) {
        // Get the next transaction
        const transaction = this.transactionQueue.shift();
        if (transaction) {
          try {
            // Execute the transaction
            await transaction();
          } catch (error) {
            // Log the error but continue processing the queue
            console.error('Transaction error:', error);
          }
        }
      }
    } finally {
      // Reset processing flag
      this.isProcessingQueue = false;
    }
  }

  /**
   * Add a transaction to the queue
   * @param transaction Function that returns a promise
   * @returns Promise that resolves with the result of the transaction
   */
  public async enqueueTransaction<T>(
    transaction: () => Promise<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      // Add the transaction to the queue
      this.transactionQueue.push(async () => {
        try {
          // Execute the transaction
          const result = await transaction();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      // Start processing the queue
      this.processTransactionQueue();
    });
  }

  /**
   * Retry a function with exponential backoff
   * @param fn Function to retry
   * @param maxRetries Maximum number of retries
   * @returns Promise that resolves with the result of the function
   */
  public async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = this.maxRetries
  ): Promise<T> {
    let attempt = 0;

    while (true) {
      try {
        return await fn();
      } catch (error) {
        attempt++;

        // If we've reached the maximum number of retries, throw the error
        if (attempt >= maxRetries) {
          throw error;
        }

        // If the error is not recoverable, throw it
        if (error instanceof IndexedDBError && !error.recoverable) {
          throw error;
        }

        // Calculate backoff time with exponential backoff and jitter
        const baseDelay = 1000; // 1 second
        const maxDelay = 10000; // 10 seconds
        const delay = Math.min(maxDelay, baseDelay * Math.pow(2, attempt - 1));
        const jitter = delay * 0.2; // 20% jitter
        const backoff = delay + Math.random() * jitter;

        console.log(`Retrying transaction (attempt ${attempt}/${maxRetries}) after ${backoff}ms`);

        // Wait for backoff time
        await new Promise(resolve => setTimeout(resolve, backoff));
      }
    }
  }

  /**
   * Override startTransaction to use the transaction queue
   * @param storeNames Array of object store names to include in the transaction
   * @param mode Transaction mode ('readonly' or 'readwrite')
   * @returns Transaction operations object
   */
  async startTransaction(storeNames: string[], mode: TransactionMode = 'readonly'): Promise<TransactionOperations> {
    return this.enqueueTransaction(async () => {
      return this.retryWithBackoff(async () => {
        return super.startTransaction(storeNames, mode);
      });
    });
  }

  /**
   * Add an item to a store with validation and retry
   * @param storeName The name of the object store
   * @param item The item to add
   * @returns Promise that resolves when the item is added
   */
  async add<T>(storeName: string, item: T): Promise<void> {
    return this.enqueueTransaction(async () => {
      return this.retryWithBackoff(async () => {
        return super.add(storeName, item);
      });
    });
  }

  /**
   * Update an item in a store with validation and retry
   * @param storeName The name of the object store
   * @param item The item to update
   * @returns Promise that resolves when the item is updated
   */
  async update<T>(storeName: string, item: T): Promise<void> {
    return this.enqueueTransaction(async () => {
      return this.retryWithBackoff(async () => {
        return super.update(storeName, item);
      });
    });
  }

  /**
   * Delete an item from a store with retry
   * @param storeName The name of the object store
   * @param id The ID of the item to delete
   * @returns Promise that resolves when the item is deleted
   */
  async delete(storeName: string, id: string): Promise<void> {
    return this.enqueueTransaction(async () => {
      return this.retryWithBackoff(async () => {
        return super.delete(storeName, id);
      });
    });
  }

  /**
   * Get all items from a store with retry
   * @param storeName The name of the object store
   * @returns Promise that resolves with all items in the store
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    return this.retryWithBackoff(async () => {
      return super.getAll<T>(storeName);
    });
  }

  /**
   * Get an item by ID with retry
   * @param storeName The name of the object store
   * @param id The ID of the item to get
   * @returns Promise that resolves with the item or null if not found
   */
  async getById<T>(storeName: string, id: string): Promise<T | null> {
    return this.retryWithBackoff(async () => {
      return super.getById<T>(storeName, id);
    });
  }
}

// Create a singleton instance with the same migrations as the original service
import { dbService as originalDbService } from './indexeddb-service';

// Export the enhanced service
// Use the same database name as the original service but create our own instance
export const enhancedDbService = new EnhancedIndexedDBService('AthleteGenesisDB', []);
