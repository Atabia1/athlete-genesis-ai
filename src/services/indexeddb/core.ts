
/**
 * Core IndexedDB Service
 * 
 * Provides base functionality for interacting with IndexedDB.
 */

import { IndexedDBError, IndexedDBErrorType } from './errors';
import { TransactionModes, type TransactionMode, type TransactionOperations } from './types';

/**
 * Base IndexedDB Service
 */
export class IndexedDBService {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null = null;
  private stores: string[];
  private isInitialized: boolean = false;

  /**
   * Create a new IndexedDB Service
   * @param dbName The name of the database
   * @param stores Array of store names to create if they don't exist
   * @param version The database version
   */
  constructor(dbName: string, stores: string[], version: number = 1) {
    this.dbName = dbName;
    this.stores = stores;
    this.version = version;
  }

  /**
   * Initialize the database and create object stores
   * @returns Promise that resolves when the database is initialized
   */
  async initDatabase(): Promise<void> {
    if (this.isInitialized) return;
    
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(this.dbName, this.version);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Create stores if they don't exist
          for (const storeName of this.stores) {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName, { keyPath: 'id' });
            }
          }
        };

        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          this.isInitialized = true;
          resolve();
        };

        request.onerror = (event) => {
          const error = new IndexedDBError(
            'Failed to initialize database',
            IndexedDBErrorType.INITIALIZATION_ERROR,
            (event.target as IDBOpenDBRequest).error?.message
          );
          reject(error);
        };
      } catch (error) {
        reject(new IndexedDBError(
          'Error opening database',
          IndexedDBErrorType.INITIALIZATION_ERROR,
          error instanceof Error ? error.message : String(error)
        ));
      }
    });
  }

  /**
   * Ensure the database is initialized
   * @returns Promise that resolves when the database is ready to use
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initDatabase();
    }
  }

  /**
   * Start a transaction on one or more object stores
   * @param storeNames Array of object store names to include in the transaction
   * @param mode Transaction mode ('readonly' or 'readwrite')
   * @returns Transaction operations object
   */
  async startTransaction(storeNames: string[], mode: TransactionMode = TransactionModes.READONLY): Promise<TransactionOperations> {
    await this.ensureInitialized();

    if (!this.db) {
      throw new IndexedDBError(
        'Database is not initialized',
        IndexedDBErrorType.NOT_INITIALIZED
      );
    }

    try {
      const transaction = this.db.transaction(storeNames, mode);
      const stores: Record<string, IDBObjectStore> = {};

      for (const storeName of storeNames) {
        stores[storeName] = transaction.objectStore(storeName);
      }

      return {
        transaction,
        stores,
        complete: () => new Promise<void>((resolve, reject) => {
          transaction.oncomplete = () => resolve();
          transaction.onerror = (event) => reject(new IndexedDBError(
            'Transaction failed',
            IndexedDBErrorType.TRANSACTION_ERROR,
            (event.target as IDBTransaction).error?.message
          ));
          transaction.onabort = (event) => reject(new IndexedDBError(
            'Transaction aborted',
            IndexedDBErrorType.TRANSACTION_ABORTED,
            (event.target as IDBTransaction).error?.message
          ));
        }),
      };
    } catch (error) {
      throw new IndexedDBError(
        'Failed to start transaction',
        IndexedDBErrorType.TRANSACTION_ERROR,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Add an item to a store
   * @param storeName The name of the object store
   * @param item The item to add
   * @returns Promise that resolves when the item is added
   */
  async add<T>(storeName: string, item: T): Promise<void> {
    const { stores, complete } = await this.startTransaction([storeName], TransactionModes.READWRITE);
    
    return new Promise((resolve, reject) => {
      try {
        const request = stores[storeName].add(item);
        
        request.onsuccess = () => resolve();
        
        request.onerror = (event) => {
          let errorType = IndexedDBErrorType.ADD_ERROR;
          
          // Check for quota exceeded error
          if ((event.target as IDBRequest).error?.name === 'QuotaExceededError') {
            errorType = IndexedDBErrorType.QUOTA_EXCEEDED;
          }
          
          reject(new IndexedDBError(
            'Failed to add item to store',
            errorType,
            (event.target as IDBRequest).error?.message,
            { recoverable: errorType === IndexedDBErrorType.QUOTA_EXCEEDED }
          ));
        };
        
        // Wait for transaction to complete
        complete().then(() => resolve()).catch(reject);
      } catch (error) {
        reject(new IndexedDBError(
          'Error adding item to store',
          IndexedDBErrorType.ADD_ERROR,
          error instanceof Error ? error.message : String(error)
        ));
      }
    });
  }

  /**
   * Update an item in a store
   * @param storeName The name of the object store
   * @param item The item to update
   * @returns Promise that resolves when the item is updated
   */
  async update<T>(storeName: string, item: T): Promise<void> {
    const { stores, complete } = await this.startTransaction([storeName], TransactionModes.READWRITE);
    
    return new Promise((resolve, reject) => {
      try {
        const request = stores[storeName].put(item);
        
        request.onsuccess = () => resolve();
        
        request.onerror = (event) => {
          let errorType = IndexedDBErrorType.UPDATE_ERROR;
          
          // Check for quota exceeded error
          if ((event.target as IDBRequest).error?.name === 'QuotaExceededError') {
            errorType = IndexedDBErrorType.QUOTA_EXCEEDED;
          }
          
          reject(new IndexedDBError(
            'Failed to update item in store',
            errorType,
            (event.target as IDBRequest).error?.message,
            { recoverable: errorType === IndexedDBErrorType.QUOTA_EXCEEDED }
          ));
        };
        
        // Wait for transaction to complete
        complete().then(() => resolve()).catch(reject);
      } catch (error) {
        reject(new IndexedDBError(
          'Error updating item in store',
          IndexedDBErrorType.UPDATE_ERROR,
          error instanceof Error ? error.message : String(error)
        ));
      }
    });
  }

  /**
   * Delete an item from a store
   * @param storeName The name of the object store
   * @param id The ID of the item to delete
   * @returns Promise that resolves when the item is deleted
   */
  async delete(storeName: string, id: string): Promise<void> {
    const { stores, complete } = await this.startTransaction([storeName], TransactionModes.READWRITE);
    
    return new Promise((resolve, reject) => {
      try {
        const request = stores[storeName].delete(id);
        
        request.onsuccess = () => resolve();
        
        request.onerror = (event) => {
          reject(new IndexedDBError(
            'Failed to delete item from store',
            IndexedDBErrorType.DELETE_ERROR,
            (event.target as IDBRequest).error?.message
          ));
        };
        
        // Wait for transaction to complete
        complete().then(() => resolve()).catch(reject);
      } catch (error) {
        reject(new IndexedDBError(
          'Error deleting item from store',
          IndexedDBErrorType.DELETE_ERROR,
          error instanceof Error ? error.message : String(error)
        ));
      }
    });
  }

  /**
   * Get all items from a store
   * @param storeName The name of the object store
   * @returns Promise that resolves with all items in the store
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    const { stores } = await this.startTransaction([storeName], TransactionModes.READONLY);
    
    return new Promise((resolve, reject) => {
      try {
        const request = stores[storeName].getAll();
        
        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest<T[]>).result);
        };
        
        request.onerror = (event) => {
          reject(new IndexedDBError(
            'Failed to get all items from store',
            IndexedDBErrorType.GET_ERROR,
            (event.target as IDBRequest).error?.message
          ));
        };
      } catch (error) {
        reject(new IndexedDBError(
          'Error getting all items from store',
          IndexedDBErrorType.GET_ERROR,
          error instanceof Error ? error.message : String(error)
        ));
      }
    });
  }

  /**
   * Get an item by ID
   * @param storeName The name of the object store
   * @param id The ID of the item to get
   * @returns Promise that resolves with the item or null if not found
   */
  async getById<T>(storeName: string, id: string): Promise<T | null> {
    const { stores } = await this.startTransaction([storeName], TransactionModes.READONLY);
    
    return new Promise((resolve, reject) => {
      try {
        const request = stores[storeName].get(id);
        
        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest<T>).result || null);
        };
        
        request.onerror = (event) => {
          reject(new IndexedDBError(
            'Failed to get item by ID',
            IndexedDBErrorType.GET_ERROR,
            (event.target as IDBRequest).error?.message
          ));
        };
      } catch (error) {
        reject(new IndexedDBError(
          'Error getting item by ID',
          IndexedDBErrorType.GET_ERROR,
          error instanceof Error ? error.message : String(error)
        ));
      }
    });
  }

  /**
   * Close the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
    }
  }
}
