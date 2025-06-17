
/**
 * IndexedDB Service
 *
 * This service provides a wrapper around IndexedDB for storing and retrieving data
 * in the browser's local database.
 */

export interface ObjectStoreConfig {
  name: string;
  keyPath: string;
  autoIncrement: boolean;
  indexes?: IndexConfig[];
}

export interface IndexConfig {
  name: string;
  keyPath: string;
  unique: boolean;
}

export enum TransactionModes {
  READONLY = 'readonly',
  READWRITE = 'readwrite',
}

export type TransactionMode = 'readonly' | 'readwrite';

export interface TransactionOperations {
  getStore(storeName: string): IDBObjectStore;
  commit(): Promise<void>;
  abort(): Promise<void>;
}

export interface IndexedDBError extends Error {
  type: IndexedDBErrorType;
  message: string;
  userMessage: string;
  recoverable: boolean;
}

export enum IndexedDBErrorType {
  DATABASE_ERROR = 'database_error',
  TRANSACTION_ERROR = 'transaction_error',
  QUOTA_EXCEEDED = 'quota_exceeded',
  NOT_FOUND = 'not_found',
  DATA_INTEGRITY = 'data_integrity',
  UNKNOWN = 'unknown',
}

export class IndexedDBService {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null = null;
  private stores: ObjectStoreConfig[];
  private initPromise: Promise<void> | null = null;

  constructor(dbName: string, stores: ObjectStoreConfig[]) {
    this.dbName = dbName;
    this.version = 1;
    this.stores = stores;
  }

  /**
   * Initialize the database
   */
  async initDatabase(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event: any) => {
        const db: IDBDatabase = event.target.result;

        // Create object stores
        this.stores.forEach((storeConfig) => {
          if (!db.objectStoreNames.contains(storeConfig.name)) {
            this.createObjectStore(db, storeConfig);
          }
        });
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        console.log('Database initialized successfully');
        resolve();
      };

      request.onerror = (event: any) => {
        const error = (event.target as IDBRequest).error;
        console.error('Database initialization error:', error);
        reject(new Error('Database initialization failed'));
      };

      request.onblocked = () => {
        console.warn('Database blocked, close other connections and try again');
      };
    });

    return this.initPromise;
  }

  private createObjectStore(db: IDBDatabase, storeConfig: ObjectStoreConfig): void {
    try {
      const store = db.createObjectStore(storeConfig.name, {
        keyPath: storeConfig.keyPath,
        autoIncrement: storeConfig.autoIncrement,
      });

      // Create indexes if specified
      if (storeConfig.indexes) {
        storeConfig.indexes.forEach((index) => {
          store.createIndex(index.name, index.keyPath, {
            unique: index.unique,
          });
        });
      }
    } catch (error) {
      console.error(`Error creating object store ${storeConfig.name}:`, error);
    }
  }

  /**
   * Start a new transaction
   */
  async startTransaction(storeNames: string[], mode: TransactionMode = TransactionModes.READONLY): Promise<TransactionOperations> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction(storeNames, mode);

    return {
      getStore: (storeName: string) => {
        return transaction.objectStore(storeName);
      },
      commit: () => {
        return new Promise((resolve, reject) => {
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(new Error('Transaction failed'));
          transaction.onabort = () => reject(new Error('Transaction aborted'));
        });
      },
      abort: () => {
        return new Promise<void>((resolve, reject) => {
          try {
            transaction.abort();
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      },
    };
  }

  /**
   * Add an item to a store
   */
  async add<T>(storeName: string, item: T): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.add(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to add item to ${storeName}`));
    });
  }

  /**
   * Get all items from a store
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.getAll();

      request.onsuccess = (event: any) => {
        resolve(event.target.result as T[]);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get all items from ${storeName}`));
      };
    });
  }

  /**
   * Get an item by ID
   */
  async getById<T>(storeName: string, id: string): Promise<T | null> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(id);

      request.onsuccess = (event: any) => {
        resolve(event.target.result || null);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get item with id ${id} from ${storeName}`));
      };
    });
  }

  /**
   * Update an item in a store
   */
  async update<T>(storeName: string, item: T): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to update item in ${storeName}`));
    });
  }

  /**
   * Delete an item from a store
   */
  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete item with id ${id} from ${storeName}`));
    });
  }

  /**
   * Clear all items from a store
   */
  async clear(storeName: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve) => {
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => resolve(); // Don't reject on clear errors
    });
  }

  /**
   * Get all items from an index
   */
  async getAllFromIndex<T>(storeName: string, indexName: string, query: IDBValidKey | IDBKeyRange): Promise<T[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);

    return new Promise((resolve, reject) => {
      const request = index.getAll(query);

      request.onsuccess = (event: any) => {
        resolve(event.target.result as T[]);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get all items from index ${indexName} in ${storeName}`));
      };
    });
  }
}

// Create and export a default instance
export const dbService = new IndexedDBService('AthleteGenesisDB', []);
