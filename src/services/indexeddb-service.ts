
/**
 * IndexedDB Service
 * 
 * Provides a centralized service for IndexedDB operations
 */

class IndexedDBService {
  private db: IDBDatabase | null = null;
  private dbName = 'AthleteAppDB';
  private version = 1;

  async initialize(): Promise<void> {
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
        if (!db.objectStoreNames.contains('workouts')) {
          db.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true });
        }
        
        if (!db.objectStoreNames.contains('nutrition')) {
          db.createObjectStore('nutrition', { keyPath: 'id', autoIncrement: true });
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
}

export const indexedDBService = new IndexedDBService();
