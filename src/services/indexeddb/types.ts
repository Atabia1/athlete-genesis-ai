
/**
 * IndexedDB Types
 */

/**
 * Transaction modes
 */
export enum TransactionModes {
  READONLY = 'readonly',
  READWRITE = 'readwrite'
}

/**
 * Transaction mode type
 */
export type TransactionMode = 'readonly' | 'readwrite';

/**
 * Transaction operations
 */
export interface TransactionOperations {
  /**
   * The transaction object
   */
  transaction: IDBTransaction;
  
  /**
   * Object stores accessed in this transaction
   */
  stores: Record<string, IDBObjectStore>;
  
  /**
   * Wait for the transaction to complete
   */
  complete: () => Promise<void>;
}
