/**
 * Enhanced IndexedDB service with robust error handling and data validation
 *
 * This service provides a wrapper around IndexedDB operations with:
 * - Specific error types and codes
 * - Recovery mechanisms for common errors
 * - User-friendly error messages
 * - Fallback strategies
 * - Data validation before saving
 *
 * Use this service for all IndexedDB operations to ensure consistent
 * error handling, data validation, and recovery strategies throughout the application.
 */

import { validateData, ValidationResult } from '@/utils/validation';

// Define specific error types
export enum IndexedDBErrorType {
  DATABASE_FAILED_TO_OPEN = 'database_failed_to_open',
  TRANSACTION_FAILED = 'transaction_failed',
  STORE_NOT_FOUND = 'store_not_found',
  ITEM_NOT_FOUND = 'item_not_found',
  QUOTA_EXCEEDED = 'quota_exceeded',
  VERSION_ERROR = 'version_error',
  MIGRATION_ERROR = 'migration_error',
  TRANSACTION_ALREADY_ACTIVE = 'transaction_already_active',
  VALIDATION_ERROR = 'validation_error',
  UNKNOWN_ERROR = 'unknown_error'
}

// Custom error class with additional context
export class IndexedDBError extends Error {
  type: IndexedDBErrorType;
  originalError?: Error | DOMException;
  recoverable: boolean;

  constructor(
    message: string,
    type: IndexedDBErrorType,
    originalError?: Error | DOMException,
    recoverable: boolean = false
  ) {
    super(message);
    this.name = 'IndexedDBError';
    this.type = type;
    this.originalError = originalError;
    this.recoverable = recoverable;
  }
}

/**
 * Database schema version history
 *
 * This defines the schema changes for each version of the database.
 * When updating the schema, add a new entry to this object with the
 * version number as the key and a function that performs the migration.
 *
 * The migration function receives the database and a transaction object
 * that can be used to create/modify object stores and indexes.
 *
 * The validateMigration function is optional and can be used to verify
 * that the migration was successful. It should return true if the migration
 * was successful, false otherwise.
 */
export interface DBMigration {
  version: number;
  migrate: (db: IDBDatabase, transaction: IDBTransaction) => void;
  description: string;
  validateMigration?: (db: IDBDatabase) => boolean;
}

/**
 * Type for transaction modes
 */
export type TransactionMode = 'readonly' | 'readwrite';

/**
 * Interface for transaction operations
 */
export interface TransactionOperations {
  getAll<T>(storeName: string): Promise<T[]>;
  getById<T>(storeName: string, id: string): Promise<T | null>;
  add<T>(storeName: string, item: T): Promise<void>;
  update<T>(storeName: string, item: T): Promise<void>;
  delete(storeName: string, id: string): Promise<void>;
  clear(storeName: string): Promise<void>;
}

// IndexedDB service with enhanced error handling, migration support, and transaction management
export class IndexedDBService {
  private dbName: string;
  private currentVersion: number;
  private migrations: DBMigration[];
  private db: IDBDatabase | null = null;
  private activeTransaction: {
    transaction: IDBTransaction;
    operations: TransactionOperations;
  } | null = null;

  /**
   * Create a new IndexedDBService
   * @param dbName The name of the database
   * @param migrations Array of migrations to apply, in order of version
   */
  constructor(dbName: string, migrations: DBMigration[]) {
    this.dbName = dbName;
    this.migrations = migrations.sort((a, b) => a.version - b.version);
    this.currentVersion = this.migrations.length > 0 ?
      this.migrations[this.migrations.length - 1].version : 1;
  }

  /**
   * Initialize the database connection
   * @returns Promise that resolves when the database is open
   */
  /**
   * Initialize the database with proper version management
   * @returns Promise that resolves when the database is open and migrated
   */
  async initDatabase(): Promise<void> {
    try {
      // Check if IndexedDB is supported
      if (!window.indexedDB) {
        throw new IndexedDBError(
          'IndexedDB is not supported in this browser',
          IndexedDBErrorType.DATABASE_FAILED_TO_OPEN,
          undefined,
          false
        );
      }

      return new Promise((resolve, reject) => {
        console.log(`Opening database ${this.dbName} with version ${this.currentVersion}`);
        const request = window.indexedDB.open(this.dbName, this.currentVersion);

        request.onerror = (event) => {
          const error = (event.target as IDBRequest).error;
          let errorType = IndexedDBErrorType.DATABASE_FAILED_TO_OPEN;
          let recoverable = false;

          // Determine specific error type
          if (error?.name === 'QuotaExceededError') {
            errorType = IndexedDBErrorType.QUOTA_EXCEEDED;
            recoverable = true; // User can free up space
          } else if (error?.name === 'VersionError') {
            errorType = IndexedDBErrorType.VERSION_ERROR;
            recoverable = false; // Requires code change
          }

          reject(new IndexedDBError(
            `Failed to open database: ${error?.message || 'Unknown error'}`,
            errorType,
            error as DOMException,
            recoverable
          ));
        };

        // This event is triggered when the database is being upgraded
        request.onupgradeneeded = (event) => {
          try {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = (event.target as IDBOpenDBRequest).transaction!;
            const oldVersion = event.oldVersion || 0;

            console.log(`Upgrading database from version ${oldVersion} to ${this.currentVersion}`);

            // Apply each migration that's newer than the current database version
            for (const migration of this.migrations) {
              if (migration.version > oldVersion) {
                console.log(`Applying migration to version ${migration.version}: ${migration.description}`);

                // Apply the migration
                migration.migrate(db, transaction);

                // Validate the migration if a validation function is provided
                if (migration.validateMigration && !migration.validateMigration(db)) {
                  throw new Error(`Migration validation failed for version ${migration.version}`);
                }

                console.log(`Successfully applied migration to version ${migration.version}`);
              }
            }
          } catch (migrationError) {
            console.error('Error during database migration:', migrationError);
            // We can't reject here because onupgradeneeded is synchronous
            // The error will be caught in the transaction's error handler
            throw new IndexedDBError(
              `Database migration failed: ${(migrationError as Error).message}`,
              IndexedDBErrorType.MIGRATION_ERROR,
              migrationError as Error,
              false
            );
          }
        };

        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;

          // Handle connection errors
          this.db.onerror = (event) => {
            console.error('Database error:', (event.target as IDBDatabase).error);
          };

          console.log(`Successfully opened database ${this.dbName} version ${this.db.version}`);
          resolve();
        };
      });
    } catch (error) {
      // Handle unexpected errors
      if (error instanceof IndexedDBError) {
        throw error;
      } else {
        throw new IndexedDBError(
          `Unexpected error initializing database: ${(error as Error).message}`,
          IndexedDBErrorType.UNKNOWN_ERROR,
          error as Error,
          false
        );
      }
    }
  }

  /**
   * Start a new transaction for multiple operations
   * @param storeNames Array of object store names to include in the transaction
   * @param mode Transaction mode ('readonly' or 'readwrite')
   * @returns Transaction operations object
   */
  async startTransaction(storeNames: string[], mode: TransactionMode = 'readonly'): Promise<TransactionOperations> {
    try {
      await this.ensureDatabaseOpen();

      if (this.activeTransaction) {
        throw new IndexedDBError(
          'A transaction is already active',
          IndexedDBErrorType.TRANSACTION_ALREADY_ACTIVE,
          undefined,
          false
        );
      }

      if (!this.db) {
        throw new IndexedDBError(
          'Database not initialized',
          IndexedDBErrorType.DATABASE_FAILED_TO_OPEN,
          undefined,
          true // Can retry
        );
      }

      // Check if all stores exist
      for (const storeName of storeNames) {
        if (!this.db.objectStoreNames.contains(storeName)) {
          throw new IndexedDBError(
            `Object store "${storeName}" not found`,
            IndexedDBErrorType.STORE_NOT_FOUND,
            undefined,
            false
          );
        }
      }

      // Create the transaction
      const transaction = this.db.transaction(storeNames, mode);

      // Create operations object
      const operations: TransactionOperations = {
        getAll: <T>(storeName: string): Promise<T[]> => {
          return new Promise((resolve, reject) => {
            try {
              const store = transaction.objectStore(storeName);
              const request = store.getAll();

              request.onsuccess = () => {
                resolve(request.result);
              };

              request.onerror = (event) => {
                reject(new IndexedDBError(
                  `Error getting items: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`,
                  IndexedDBErrorType.UNKNOWN_ERROR,
                  (event.target as IDBRequest).error as DOMException,
                  true
                ));
              };
            } catch (error) {
              reject(new IndexedDBError(
                `Error in getAll operation: ${(error as Error).message}`,
                IndexedDBErrorType.TRANSACTION_FAILED,
                error as Error,
                true
              ));
            }
          });
        },

        getById: <T>(storeName: string, id: string): Promise<T | null> => {
          return new Promise((resolve, reject) => {
            try {
              const store = transaction.objectStore(storeName);
              const request = store.get(id);

              request.onsuccess = () => {
                resolve(request.result || null);
              };

              request.onerror = (event) => {
                reject(new IndexedDBError(
                  `Error getting item: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`,
                  IndexedDBErrorType.UNKNOWN_ERROR,
                  (event.target as IDBRequest).error as DOMException,
                  true
                ));
              };
            } catch (error) {
              reject(new IndexedDBError(
                `Error in getById operation: ${(error as Error).message}`,
                IndexedDBErrorType.TRANSACTION_FAILED,
                error as Error,
                true
              ));
            }
          });
        },

        add: <T>(storeName: string, item: T): Promise<void> => {
          return new Promise((resolve, reject) => {
            try {
              // Validate data before saving
              let validationResult: ValidationResult = { valid: true, errors: [] };

              // Only validate workout and meal plans
              if (storeName === 'savedWorkouts') {
                validationResult = validateData(item, 'workout');
              } else if (storeName === 'savedMealPlans') {
                validationResult = validateData(item, 'meal');
              }

              // If validation fails, reject with validation error
              if (!validationResult.valid) {
                reject(new IndexedDBError(
                  `Validation error: ${validationResult.errors.join(', ')}`,
                  IndexedDBErrorType.VALIDATION_ERROR,
                  new Error('Data validation failed'),
                  false // Not recoverable without fixing the data
                ));
                return;
              }

              const store = transaction.objectStore(storeName);
              const request = store.add(item);

              request.onsuccess = () => {
                resolve();
              };

              request.onerror = (event) => {
                const error = (event.target as IDBRequest).error;
                let errorType = IndexedDBErrorType.UNKNOWN_ERROR;

                // Check for quota exceeded error
                if (error?.name === 'QuotaExceededError') {
                  errorType = IndexedDBErrorType.QUOTA_EXCEEDED;
                }

                reject(new IndexedDBError(
                  `Error adding item: ${error?.message || 'Unknown error'}`,
                  errorType,
                  error as DOMException,
                  true
                ));
              };
            } catch (error) {
              reject(new IndexedDBError(
                `Error in add operation: ${(error as Error).message}`,
                IndexedDBErrorType.TRANSACTION_FAILED,
                error as Error,
                true
              ));
            }
          });
        },

        update: <T>(storeName: string, item: T): Promise<void> => {
          return new Promise((resolve, reject) => {
            try {
              // Validate data before saving
              let validationResult: ValidationResult = { valid: true, errors: [] };

              // Only validate workout and meal plans
              if (storeName === 'savedWorkouts') {
                validationResult = validateData(item, 'workout');
              } else if (storeName === 'savedMealPlans') {
                validationResult = validateData(item, 'meal');
              }

              // If validation fails, reject with validation error
              if (!validationResult.valid) {
                reject(new IndexedDBError(
                  `Validation error: ${validationResult.errors.join(', ')}`,
                  IndexedDBErrorType.VALIDATION_ERROR,
                  new Error('Data validation failed'),
                  false // Not recoverable without fixing the data
                ));
                return;
              }

              const store = transaction.objectStore(storeName);
              const request = store.put(item);

              request.onsuccess = () => {
                resolve();
              };

              request.onerror = (event) => {
                const error = (event.target as IDBRequest).error;
                let errorType = IndexedDBErrorType.UNKNOWN_ERROR;

                // Check for quota exceeded error
                if (error?.name === 'QuotaExceededError') {
                  errorType = IndexedDBErrorType.QUOTA_EXCEEDED;
                }

                reject(new IndexedDBError(
                  `Error updating item: ${error?.message || 'Unknown error'}`,
                  errorType,
                  error as DOMException,
                  true
                ));
              };
            } catch (error) {
              reject(new IndexedDBError(
                `Error in update operation: ${(error as Error).message}`,
                IndexedDBErrorType.TRANSACTION_FAILED,
                error as Error,
                true
              ));
            }
          });
        },

        delete: (storeName: string, id: string): Promise<void> => {
          return new Promise((resolve, reject) => {
            try {
              const store = transaction.objectStore(storeName);
              const request = store.delete(id);

              request.onsuccess = () => {
                resolve();
              };

              request.onerror = (event) => {
                reject(new IndexedDBError(
                  `Error deleting item: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`,
                  IndexedDBErrorType.UNKNOWN_ERROR,
                  (event.target as IDBRequest).error as DOMException,
                  true
                ));
              };
            } catch (error) {
              reject(new IndexedDBError(
                `Error in delete operation: ${(error as Error).message}`,
                IndexedDBErrorType.TRANSACTION_FAILED,
                error as Error,
                true
              ));
            }
          });
        },

        clear: (storeName: string): Promise<void> => {
          return new Promise((resolve, reject) => {
            try {
              const store = transaction.objectStore(storeName);
              const request = store.clear();

              request.onsuccess = () => {
                resolve();
              };

              request.onerror = (event) => {
                reject(new IndexedDBError(
                  `Error clearing store: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`,
                  IndexedDBErrorType.UNKNOWN_ERROR,
                  (event.target as IDBRequest).error as DOMException,
                  true
                ));
              };
            } catch (error) {
              reject(new IndexedDBError(
                `Error in clear operation: ${(error as Error).message}`,
                IndexedDBErrorType.TRANSACTION_FAILED,
                error as Error,
                true
              ));
            }
          });
        }
      };

      // Set up transaction completion handlers
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
          this.activeTransaction = null;
          console.log('Transaction completed successfully');
        };

        transaction.onerror = (event) => {
          this.activeTransaction = null;
          console.error('Transaction failed:', (event.target as IDBTransaction).error);
        };

        transaction.onabort = (event) => {
          this.activeTransaction = null;
          console.warn('Transaction aborted:', (event.target as IDBTransaction).error);
        };

        // Store the active transaction
        this.activeTransaction = { transaction, operations };
        resolve(operations);
      });
    } catch (error) {
      // Handle unexpected errors
      if (error instanceof IndexedDBError) {
        throw error;
      } else {
        throw new IndexedDBError(
          `Unexpected error starting transaction: ${(error as Error).message}`,
          IndexedDBErrorType.UNKNOWN_ERROR,
          error as Error,
          false
        );
      }
    }
  }

  /**
   * Commit the current transaction
   * This is not strictly necessary as the transaction will automatically
   * commit when all operations are complete, but it can be used to
   * explicitly signal that all operations are done.
   */
  commitTransaction(): void {
    // The transaction will automatically commit when all operations are complete
    // This method exists mainly for semantic clarity in code
    if (this.activeTransaction) {
      console.log('Committing transaction');
      // We don't need to do anything here as the transaction will commit automatically
      // when the event loop completes and all operations are done
    }
  }

  /**
   * Abort the current transaction
   * This will roll back all changes made in the transaction
   */
  abortTransaction(): void {
    if (this.activeTransaction) {
      console.log('Aborting transaction');
      this.activeTransaction.transaction.abort();
      this.activeTransaction = null;
    }
  }

  /**
   * Check if a transaction is currently active
   * @returns True if a transaction is active
   */
  isTransactionActive(): boolean {
    return this.activeTransaction !== null;
  }

  /**
   * Get all items from a store
   * @param storeName The name of the object store
   * @returns Promise that resolves with all items
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    try {
      // If there's an active transaction, use it
      if (this.activeTransaction) {
        const store = this.activeTransaction.transaction.objectStore(storeName);
        if (store) {
          return this.activeTransaction.operations.getAll<T>(storeName);
        }
      }

      // Otherwise, create a new transaction
      await this.ensureDatabaseOpen();

      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject(new IndexedDBError(
            'Database not initialized',
            IndexedDBErrorType.DATABASE_FAILED_TO_OPEN,
            undefined,
            true // Can retry
          ));
          return;
        }

        // Check if store exists
        if (!this.db.objectStoreNames.contains(storeName)) {
          reject(new IndexedDBError(
            `Object store "${storeName}" not found`,
            IndexedDBErrorType.STORE_NOT_FOUND,
            undefined,
            false
          ));
          return;
        }

        try {
          const transaction = this.db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.getAll();

          transaction.onerror = (event) => {
            reject(new IndexedDBError(
              `Transaction error: ${(event.target as IDBTransaction).error?.message || 'Unknown error'}`,
              IndexedDBErrorType.TRANSACTION_FAILED,
              (event.target as IDBTransaction).error as DOMException,
              true // Can retry
            ));
          };

          request.onsuccess = () => {
            resolve(request.result);
          };

          request.onerror = (event) => {
            reject(new IndexedDBError(
              `Error getting items: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`,
              IndexedDBErrorType.UNKNOWN_ERROR,
              (event.target as IDBRequest).error as DOMException,
              true // Can retry
            ));
          };
        } catch (error) {
          reject(new IndexedDBError(
            `Error creating transaction: ${(error as Error).message}`,
            IndexedDBErrorType.TRANSACTION_FAILED,
            error as Error,
            true // Can retry
          ));
        }
      });
    } catch (error) {
      // Handle unexpected errors
      if (error instanceof IndexedDBError) {
        throw error;
      } else {
        throw new IndexedDBError(
          `Unexpected error getting items: ${(error as Error).message}`,
          IndexedDBErrorType.UNKNOWN_ERROR,
          error as Error,
          false
        );
      }
    }
  }

  /**
   * Get an item by ID from a store
   * @param storeName The name of the object store
   * @param id The ID of the item to get
   * @returns Promise that resolves with the item or null if not found
   */
  async getById<T>(storeName: string, id: string): Promise<T | null> {
    try {
      // If there's an active transaction, use it
      if (this.activeTransaction) {
        const store = this.activeTransaction.transaction.objectStore(storeName);
        if (store) {
          return this.activeTransaction.operations.getById<T>(storeName, id);
        }
      }

      // Otherwise, create a new transaction
      await this.ensureDatabaseOpen();

      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject(new IndexedDBError(
            'Database not initialized',
            IndexedDBErrorType.DATABASE_FAILED_TO_OPEN,
            undefined,
            true // Can retry
          ));
          return;
        }

        // Check if store exists
        if (!this.db.objectStoreNames.contains(storeName)) {
          reject(new IndexedDBError(
            `Object store "${storeName}" not found`,
            IndexedDBErrorType.STORE_NOT_FOUND,
            undefined,
            false
          ));
          return;
        }

        try {
          const transaction = this.db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.get(id);

          transaction.onerror = (event) => {
            reject(new IndexedDBError(
              `Transaction error: ${(event.target as IDBTransaction).error?.message || 'Unknown error'}`,
              IndexedDBErrorType.TRANSACTION_FAILED,
              (event.target as IDBTransaction).error as DOMException,
              true // Can retry
            ));
          };

          request.onsuccess = () => {
            resolve(request.result || null);
          };

          request.onerror = (event) => {
            reject(new IndexedDBError(
              `Error getting item: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`,
              IndexedDBErrorType.UNKNOWN_ERROR,
              (event.target as IDBRequest).error as DOMException,
              true // Can retry
            ));
          };
        } catch (error) {
          reject(new IndexedDBError(
            `Error creating transaction: ${(error as Error).message}`,
            IndexedDBErrorType.TRANSACTION_FAILED,
            error as Error,
            true // Can retry
          ));
        }
      });
    } catch (error) {
      // Handle unexpected errors
      if (error instanceof IndexedDBError) {
        throw error;
      } else {
        throw new IndexedDBError(
          `Unexpected error getting item: ${(error as Error).message}`,
          IndexedDBErrorType.UNKNOWN_ERROR,
          error as Error,
          false
        );
      }
    }
  }

  /**
   * Add an item to a store
   * @param storeName The name of the object store
   * @param item The item to add
   * @returns Promise that resolves when the item is added
   */
  async add<T>(storeName: string, item: T): Promise<void> {
    try {
      // If there's an active transaction, use it
      if (this.activeTransaction) {
        const store = this.activeTransaction.transaction.objectStore(storeName);
        if (store) {
          return this.activeTransaction.operations.add<T>(storeName, item);
        }
      }

      // Otherwise, create a new transaction
      await this.ensureDatabaseOpen();

      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject(new IndexedDBError(
            'Database not initialized',
            IndexedDBErrorType.DATABASE_FAILED_TO_OPEN,
            undefined,
            true // Can retry
          ));
          return;
        }

        // Check if store exists
        if (!this.db.objectStoreNames.contains(storeName)) {
          reject(new IndexedDBError(
            `Object store "${storeName}" not found`,
            IndexedDBErrorType.STORE_NOT_FOUND,
            undefined,
            false
          ));
          return;
        }

        try {
          const transaction = this.db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.add(item);

          transaction.onerror = (event) => {
            const error = (event.target as IDBTransaction).error;
            let errorType = IndexedDBErrorType.TRANSACTION_FAILED;
            let recoverable = true;

            // Check for quota exceeded error
            if (error?.name === 'QuotaExceededError') {
              errorType = IndexedDBErrorType.QUOTA_EXCEEDED;
              recoverable = true; // User can free up space
            }

            reject(new IndexedDBError(
              `Transaction error: ${error?.message || 'Unknown error'}`,
              errorType,
              error as DOMException,
              recoverable
            ));
          };

          request.onsuccess = () => {
            resolve();
          };

          request.onerror = (event) => {
            const error = (event.target as IDBRequest).error;
            reject(new IndexedDBError(
              `Error adding item: ${error?.message || 'Unknown error'}`,
              IndexedDBErrorType.UNKNOWN_ERROR,
              error as DOMException,
              true // Can retry
            ));
          };
        } catch (error) {
          reject(new IndexedDBError(
            `Error creating transaction: ${(error as Error).message}`,
            IndexedDBErrorType.TRANSACTION_FAILED,
            error as Error,
            true // Can retry
          ));
        }
      });
    } catch (error) {
      // Handle unexpected errors
      if (error instanceof IndexedDBError) {
        throw error;
      } else {
        throw new IndexedDBError(
          `Unexpected error adding item: ${(error as Error).message}`,
          IndexedDBErrorType.UNKNOWN_ERROR,
          error as Error,
          false
        );
      }
    }
  }

  /**
   * Update an item in a store
   * @param storeName The name of the object store
   * @param item The item to update
   * @returns Promise that resolves when the item is updated
   */
  async update<T>(storeName: string, item: T): Promise<void> {
    try {
      // If there's an active transaction, use it
      if (this.activeTransaction) {
        const store = this.activeTransaction.transaction.objectStore(storeName);
        if (store) {
          return this.activeTransaction.operations.update<T>(storeName, item);
        }
      }

      // Otherwise, create a new transaction
      await this.ensureDatabaseOpen();

      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject(new IndexedDBError(
            'Database not initialized',
            IndexedDBErrorType.DATABASE_FAILED_TO_OPEN,
            undefined,
            true // Can retry
          ));
          return;
        }

        // Check if store exists
        if (!this.db.objectStoreNames.contains(storeName)) {
          reject(new IndexedDBError(
            `Object store "${storeName}" not found`,
            IndexedDBErrorType.STORE_NOT_FOUND,
            undefined,
            false
          ));
          return;
        }

        try {
          const transaction = this.db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.put(item);

          transaction.onerror = (event) => {
            const error = (event.target as IDBTransaction).error;
            let errorType = IndexedDBErrorType.TRANSACTION_FAILED;
            let recoverable = true;

            // Check for quota exceeded error
            if (error?.name === 'QuotaExceededError') {
              errorType = IndexedDBErrorType.QUOTA_EXCEEDED;
              recoverable = true; // User can free up space
            }

            reject(new IndexedDBError(
              `Transaction error: ${error?.message || 'Unknown error'}`,
              errorType,
              error as DOMException,
              recoverable
            ));
          };

          request.onsuccess = () => {
            resolve();
          };

          request.onerror = (event) => {
            const error = (event.target as IDBRequest).error;
            reject(new IndexedDBError(
              `Error updating item: ${error?.message || 'Unknown error'}`,
              IndexedDBErrorType.UNKNOWN_ERROR,
              error as DOMException,
              true // Can retry
            ));
          };
        } catch (error) {
          reject(new IndexedDBError(
            `Error creating transaction: ${(error as Error).message}`,
            IndexedDBErrorType.TRANSACTION_FAILED,
            error as Error,
            true // Can retry
          ));
        }
      });
    } catch (error) {
      // Handle unexpected errors
      if (error instanceof IndexedDBError) {
        throw error;
      } else {
        throw new IndexedDBError(
          `Unexpected error updating item: ${(error as Error).message}`,
          IndexedDBErrorType.UNKNOWN_ERROR,
          error as Error,
          false
        );
      }
    }
  }

  /**
   * Delete an item from a store
   * @param storeName The name of the object store
   * @param id The ID of the item to delete
   * @returns Promise that resolves when the item is deleted
   */
  async delete(storeName: string, id: string): Promise<void> {
    try {
      // If there's an active transaction, use it
      if (this.activeTransaction) {
        const store = this.activeTransaction.transaction.objectStore(storeName);
        if (store) {
          return this.activeTransaction.operations.delete(storeName, id);
        }
      }

      // Otherwise, create a new transaction
      await this.ensureDatabaseOpen();

      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject(new IndexedDBError(
            'Database not initialized',
            IndexedDBErrorType.DATABASE_FAILED_TO_OPEN,
            undefined,
            true // Can retry
          ));
          return;
        }

        // Check if store exists
        if (!this.db.objectStoreNames.contains(storeName)) {
          reject(new IndexedDBError(
            `Object store "${storeName}" not found`,
            IndexedDBErrorType.STORE_NOT_FOUND,
            undefined,
            false
          ));
          return;
        }

        try {
          const transaction = this.db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.delete(id);

          transaction.onerror = (event) => {
            reject(new IndexedDBError(
              `Transaction error: ${(event.target as IDBTransaction).error?.message || 'Unknown error'}`,
              IndexedDBErrorType.TRANSACTION_FAILED,
              (event.target as IDBTransaction).error as DOMException,
              true // Can retry
            ));
          };

          request.onsuccess = () => {
            resolve();
          };

          request.onerror = (event) => {
            reject(new IndexedDBError(
              `Error deleting item: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`,
              IndexedDBErrorType.UNKNOWN_ERROR,
              (event.target as IDBRequest).error as DOMException,
              true // Can retry
            ));
          };
        } catch (error) {
          reject(new IndexedDBError(
            `Error creating transaction: ${(error as Error).message}`,
            IndexedDBErrorType.TRANSACTION_FAILED,
            error as Error,
            true // Can retry
          ));
        }
      });
    } catch (error) {
      // Handle unexpected errors
      if (error instanceof IndexedDBError) {
        throw error;
      } else {
        throw new IndexedDBError(
          `Unexpected error deleting item: ${(error as Error).message}`,
          IndexedDBErrorType.UNKNOWN_ERROR,
          error as Error,
          false
        );
      }
    }
  }

  /**
   * Clear all items from a store
   * @param storeName The name of the object store
   * @returns Promise that resolves when the store is cleared
   */
  async clear(storeName: string): Promise<void> {
    try {
      // If there's an active transaction, use it
      if (this.activeTransaction) {
        const store = this.activeTransaction.transaction.objectStore(storeName);
        if (store) {
          return this.activeTransaction.operations.clear(storeName);
        }
      }

      // Otherwise, create a new transaction
      await this.ensureDatabaseOpen();

      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject(new IndexedDBError(
            'Database not initialized',
            IndexedDBErrorType.DATABASE_FAILED_TO_OPEN,
            undefined,
            true // Can retry
          ));
          return;
        }

        // Check if store exists
        if (!this.db.objectStoreNames.contains(storeName)) {
          reject(new IndexedDBError(
            `Object store "${storeName}" not found`,
            IndexedDBErrorType.STORE_NOT_FOUND,
            undefined,
            false
          ));
          return;
        }

        try {
          const transaction = this.db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.clear();

          transaction.onerror = (event) => {
            reject(new IndexedDBError(
              `Transaction error: ${(event.target as IDBTransaction).error?.message || 'Unknown error'}`,
              IndexedDBErrorType.TRANSACTION_FAILED,
              (event.target as IDBTransaction).error as DOMException,
              true // Can retry
            ));
          };

          request.onsuccess = () => {
            resolve();
          };

          request.onerror = (event) => {
            reject(new IndexedDBError(
              `Error clearing store: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`,
              IndexedDBErrorType.UNKNOWN_ERROR,
              (event.target as IDBRequest).error as DOMException,
              true // Can retry
            ));
          };
        } catch (error) {
          reject(new IndexedDBError(
            `Error creating transaction: ${(error as Error).message}`,
            IndexedDBErrorType.TRANSACTION_FAILED,
            error as Error,
            true // Can retry
          ));
        }
      });
    } catch (error) {
      // Handle unexpected errors
      if (error instanceof IndexedDBError) {
        throw error;
      } else {
        throw new IndexedDBError(
          `Unexpected error clearing store: ${(error as Error).message}`,
          IndexedDBErrorType.UNKNOWN_ERROR,
          error as Error,
          false
        );
      }
    }
  }

  /**
   * Ensure the database is open
   * @returns Promise that resolves when the database is open
   */
  private async ensureDatabaseOpen(): Promise<void> {
    if (!this.db) {
      await this.initDatabase();
    }
  }

  /**
   * Close the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * Check if IndexedDB is supported in this browser
   * @returns True if IndexedDB is supported
   */
  static isSupported(): boolean {
    return !!window.indexedDB;
  }

  /**
   * Get the estimated size of the database
   * @returns Promise that resolves with the estimated size in bytes, or null if not supported
   */
  async getEstimatedSize(): Promise<number | null> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return estimate.usage || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting storage estimate:', error);
      return null;
    }
  }

  /**
   * Get the current database version
   * @returns The current database version or null if the database is not open
   */
  getDatabaseVersion(): number | null {
    return this.db ? this.db.version : null;
  }

  /**
   * Get information about the database
   * @returns Object with database information
   */
  async getDatabaseInfo(): Promise<{
    name: string;
    version: number | null;
    objectStores: string[];
    size: number | null;
  }> {
    await this.ensureDatabaseOpen();

    return {
      name: this.dbName,
      version: this.getDatabaseVersion(),
      objectStores: this.db ? Array.from(this.db.objectStoreNames) : [],
      size: await this.getEstimatedSize()
    };
  }
}

/**
 * Define database migrations
 * Each migration should include:
 * - version: The new version number (must be sequential)
 * - migrate: Function to perform the migration
 * - description: A description of the changes
 * - validateMigration: Optional function to validate the migration was successful
 */
const dbMigrations: DBMigration[] = [
  {
    version: 1,
    description: 'Initial database setup with savedWorkouts store',
    migrate: (db: IDBDatabase) => {
      // Create initial object stores
      if (!db.objectStoreNames.contains('savedWorkouts')) {
        db.createObjectStore('savedWorkouts', { keyPath: 'id' });
      }
    },
    validateMigration: (db: IDBDatabase): boolean => {
      return db.objectStoreNames.contains('savedWorkouts');
    }
  },
  {
    version: 2,
    description: 'Add indexes to savedWorkouts store',
    migrate: (db: IDBDatabase, transaction: IDBTransaction) => {
      // Get the existing store
      const store = transaction.objectStore('savedWorkouts');

      // Add indexes if they don't exist
      if (!store.indexNames.contains('level')) {
        store.createIndex('level', 'level', { unique: false });
      }

      if (!store.indexNames.contains('createdAt')) {
        // Add a createdAt field to all existing records
        store.openCursor().onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
          if (cursor) {
            const workout = cursor.value;
            if (!workout.createdAt) {
              workout.createdAt = new Date().toISOString();
              cursor.update(workout);
            }
            cursor.continue();
          }
        };

        // Create the index
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    },
    validateMigration: (db: IDBDatabase): boolean => {
      try {
        const transaction = db.transaction(['savedWorkouts'], 'readonly');
        const store = transaction.objectStore('savedWorkouts');
        return store.indexNames.contains('level') && store.indexNames.contains('createdAt');
      } catch (error) {
        console.error('Migration validation failed:', error);
        return false;
      }
    }
  },
  {
    version: 3,
    description: 'Add retryQueue store for offline operations',
    migrate: (db: IDBDatabase) => {
      if (!db.objectStoreNames.contains('retryQueue')) {
        const store = db.createObjectStore('retryQueue', { keyPath: 'id' });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('priority', 'priority', { unique: false });
      }
    },
    validateMigration: (db: IDBDatabase): boolean => {
      try {
        if (!db.objectStoreNames.contains('retryQueue')) {
          return false;
        }

        const transaction = db.transaction(['retryQueue'], 'readonly');
        const store = transaction.objectStore('retryQueue');
        return store.indexNames.contains('type') &&
               store.indexNames.contains('createdAt') &&
               store.indexNames.contains('priority');
      } catch (error) {
        console.error('Migration validation failed:', error);
        return false;
      }
    }
  },
  {
    version: 4,
    description: 'Add userPreferences store',
    migrate: (db: IDBDatabase) => {
      if (!db.objectStoreNames.contains('userPreferences')) {
        db.createObjectStore('userPreferences', { keyPath: 'id' });
      }
    },
    validateMigration: (db: IDBDatabase): boolean => {
      return db.objectStoreNames.contains('userPreferences');
    }
  },
  {
    version: 5,
    description: 'Add health data stores for health app integration',
    migrate: (db: IDBDatabase) => {
      // Create healthData store for storing health metrics
      if (!db.objectStoreNames.contains('healthData')) {
        db.createObjectStore('healthData', { keyPath: 'id' });
      }

      // Create connectionCodes store for QR code connection
      if (!db.objectStoreNames.contains('connectionCodes')) {
        const store = db.createObjectStore('connectionCodes', { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('expiresAt', 'expiresAt', { unique: false });
        store.createIndex('used', 'used', { unique: false });
      }
    },
    validateMigration: (db: IDBDatabase): boolean => {
      return db.objectStoreNames.contains('healthData') &&
             db.objectStoreNames.contains('connectionCodes');
    }
  }
];

// Create a singleton instance with migrations
export const dbService = new IndexedDBService('AthleteGenesisDB', dbMigrations);
