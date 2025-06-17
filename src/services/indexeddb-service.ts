
/**
 * IndexedDB Service
 * 
 * Provides a centralized service for IndexedDB operations
 */

export interface ObjectStoreConfig {
  name: string;
  keyPath: string;
  autoIncrement?: boolean;
}

export enum TransactionModes {
  READONLY = 'readonly',
  READWRITE = 'readwrite'
}

export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private dbName: string;
  private version: number;
  private stores: string[];

  constructor(dbName: string = 'AthleteAppDB', stores: string[] = [], version: number = 1) {
    this.dbName = dbName;
    this.stores = stores;
    this.version = version;
  }

  async initialize(): Promise<void> {
    return this.initDatabase();
  }

  async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => {
        console.error('IndexedDB failed to open');
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores if they don't exist
        const defaultStores = ['workouts', 'nutrition', 'health_data', 'connection_codes'];
        const allStores = [...new Set([...this.stores, ...defaultStores])];
        
        for (const storeName of allStores) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
          }
        }
      };
    });
  }

  async shutdown(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  getDatabase(): IDBDatabase | null {
    return this.db;
  }

  async startTransaction(storeNames: string[], mode: 'readonly' | 'readwrite' = 'readonly'): Promise<{
    transaction: IDBTransaction;
    stores: Record<string, IDBObjectStore>;
    complete: () => Promise<void>;
  }> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

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
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      })
    };
  }

  async add<T>(storeName: string, item: T): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(item);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async update<T>(storeName: string, item: T): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getById<T>(storeName: string, id: string): Promise<T | null> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDBService = new IndexedDBService();
