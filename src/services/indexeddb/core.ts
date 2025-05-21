/**
 * IndexedDB Core Functionality
 *
 * This file contains the core functionality for the IndexedDB service.
 */

import { IndexedDBError } from './errors';
import { IndexedDBErrorType, DBMigration, ActiveTransaction, DatabaseInfo } from './types';

/**
 * Core IndexedDB service class
 */
export class IndexedDBCore {
  private dbName: string;
  private currentVersion: number;
  private migrations: DBMigration[];
  private db: IDBDatabase | null = null;
  private activeTransaction: ActiveTransaction | null = null;

  /**
   * Create a new IndexedDBCore
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
            const transaction = (event.target as IDBOpenDBRequest).transaction;
            if (!transaction) {
              throw new Error('Transaction not available during upgrade');
            }
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
   * Ensure the database is open
   * @returns Promise that resolves when the database is open
   */
  async ensureDatabaseOpen(): Promise<void> {
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
   * Get the database instance
   * @returns The database instance or null if not initialized
   */
  getDatabase(): IDBDatabase | null {
    return this.db;
  }

  /**
   * Set the active transaction
   * @param transaction The active transaction
   */
  setActiveTransaction(transaction: ActiveTransaction | null): void {
    this.activeTransaction = transaction;
  }

  /**
   * Get the active transaction
   * @returns The active transaction or null if none is active
   */
  getActiveTransaction(): ActiveTransaction | null {
    return this.activeTransaction;
  }

  /**
   * Check if a transaction is currently active
   * @returns True if a transaction is active
   */
  isTransactionActive(): boolean {
    return this.activeTransaction !== null;
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
  async getDatabaseInfo(): Promise<DatabaseInfo> {
    await this.ensureDatabaseOpen();

    return {
      name: this.dbName,
      version: this.getDatabaseVersion(),
      objectStores: this.db ? Array.from(this.db.objectStoreNames) : [],
      size: await this.getEstimatedSize()
    };
  }
}
