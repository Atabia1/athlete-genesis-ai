/**
 * RetryQueueService: A service for managing operation retries when connectivity is restored
 * 
 * This service provides a robust mechanism to:
 * 1. Queue operations that fail due to network issues
 * 2. Persist the queue in IndexedDB for resilience across page reloads
 * 3. Automatically retry operations when connectivity is restored
 * 4. Provide status updates and notifications about retry operations
 * 
 * The service uses a priority-based queue system and implements exponential backoff
 * for retries to avoid overwhelming the server when connectivity is unstable.
 */

import { dbService } from './indexeddb-service';
import { toast } from '@/components/ui/use-toast';

// Define retry operation types
export enum RetryOperationType {
  SAVE_WORKOUT = 'save_workout',
  DELETE_WORKOUT = 'delete_workout',
  UPDATE_WORKOUT = 'update_workout',
  SYNC_DATA = 'sync_data',
  API_REQUEST = 'api_request'
}

// Define retry operation priority levels
export enum RetryPriority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3
}

// Define retry operation status
export enum RetryStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Define retry operation interface
export interface RetryOperation {
  id: string;
  type: RetryOperationType;
  payload: any;
  priority: RetryPriority;
  status: RetryStatus;
  createdAt: string;
  lastAttempt?: string;
  attempts: number;
  maxAttempts: number;
  error?: string;
}

// Define retry queue configuration
interface RetryQueueConfig {
  maxRetries: number;
  initialBackoff: number; // in milliseconds
  maxBackoff: number; // in milliseconds
  backoffFactor: number;
  autoRetryOnReconnect: boolean;
  notifyUser: boolean;
}

/**
 * RetryQueueService class for managing operation retries
 */
class RetryQueueService {
  private isProcessing: boolean = false;
  private isOnline: boolean = navigator.onLine;
  private pendingOperations: RetryOperation[] = [];
  private config: RetryQueueConfig = {
    maxRetries: 5,
    initialBackoff: 1000, // 1 second
    maxBackoff: 60000, // 1 minute
    backoffFactor: 2,
    autoRetryOnReconnect: true,
    notifyUser: true
  };
  private retryHandlers: Map<RetryOperationType, (payload: any) => Promise<any>> = new Map();
  private onQueueChangeCallbacks: Array<(operations: RetryOperation[]) => void> = [];

  /**
   * Initialize the retry queue service
   */
  public async initialize(): Promise<void> {
    try {
      // Ensure the retry queue store exists in IndexedDB
      await this.setupDatabase();
      
      // Load any pending operations from IndexedDB
      await this.loadPendingOperations();
      
      // Set up online/offline event listeners
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      
      console.log('RetryQueueService initialized with', this.pendingOperations.length, 'pending operations');
    } catch (error) {
      console.error('Failed to initialize RetryQueueService:', error);
    }
  }

  /**
   * Set up the database for retry queue
   */
  private async setupDatabase(): Promise<void> {
    // Check if the retryQueue store exists, if not it will be created
    // during the database initialization process
    const stores = await dbService.getStoreNames();
    if (!stores.includes('retryQueue')) {
      console.log('Creating retryQueue store in IndexedDB');
      // The store will be created automatically when needed
    }
  }

  /**
   * Load pending operations from IndexedDB
   */
  private async loadPendingOperations(): Promise<void> {
    try {
      const operations = await dbService.getAll<RetryOperation>('retryQueue');
      this.pendingOperations = operations.filter(op => 
        op.status === RetryStatus.PENDING || op.status === RetryStatus.IN_PROGRESS
      );
      
      // Sort by priority (lower number = higher priority)
      this.pendingOperations.sort((a, b) => a.priority - b.priority);
      
      // Notify subscribers about queue changes
      this.notifyQueueChanged();
    } catch (error) {
      console.error('Failed to load pending operations:', error);
      this.pendingOperations = [];
    }
  }

  /**
   * Handle online event
   */
  private handleOnline = async (): Promise<void> => {
    this.isOnline = true;
    console.log('Device is online. Retry queue has', this.pendingOperations.length, 'operations');
    
    if (this.config.autoRetryOnReconnect && this.pendingOperations.length > 0) {
      // Notify the user if there are operations to retry
      if (this.config.notifyUser) {
        toast({
          title: "Connection restored",
          description: `Retrying ${this.pendingOperations.length} pending operation${this.pendingOperations.length === 1 ? '' : 's'}...`,
        });
      }
      
      // Start processing the queue
      await this.processQueue();
    }
  };

  /**
   * Handle offline event
   */
  private handleOffline = (): void => {
    this.isOnline = false;
    console.log('Device is offline. Pausing retry queue processing.');
    
    // If we're currently processing, we'll let the current operation finish
    // but won't start new ones until we're back online
  };

  /**
   * Add an operation to the retry queue
   */
  public async addToQueue(
    type: RetryOperationType,
    payload: any,
    priority: RetryPriority = RetryPriority.MEDIUM,
    maxAttempts: number = this.config.maxRetries
  ): Promise<string> {
    // Create a new retry operation
    const operation: RetryOperation = {
      id: `retry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      payload,
      priority,
      status: RetryStatus.PENDING,
      createdAt: new Date().toISOString(),
      attempts: 0,
      maxAttempts
    };
    
    try {
      // Save to IndexedDB
      await dbService.add('retryQueue', operation);
      
      // Add to in-memory queue
      this.pendingOperations.push(operation);
      
      // Sort by priority
      this.pendingOperations.sort((a, b) => a.priority - b.priority);
      
      console.log(`Added operation to retry queue: ${type}`, operation);
      
      // Notify subscribers about queue changes
      this.notifyQueueChanged();
      
      // If we're online, try to process the queue immediately
      if (this.isOnline && !this.isProcessing) {
        this.processQueue();
      }
      
      return operation.id;
    } catch (error) {
      console.error('Failed to add operation to retry queue:', error);
      throw error;
    }
  }

  /**
   * Register a handler for a specific operation type
   */
  public registerHandler(
    type: RetryOperationType,
    handler: (payload: any) => Promise<any>
  ): void {
    this.retryHandlers.set(type, handler);
    console.log(`Registered handler for operation type: ${type}`);
  }

  /**
   * Process the retry queue
   */
  public async processQueue(): Promise<void> {
    // If already processing or offline or no operations, do nothing
    if (this.isProcessing || !this.isOnline || this.pendingOperations.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    console.log('Starting to process retry queue with', this.pendingOperations.length, 'operations');
    
    try {
      // Process operations one by one
      while (this.pendingOperations.length > 0 && this.isOnline) {
        const operation = this.pendingOperations[0];
        
        // Skip operations that are already completed or failed
        if (operation.status === RetryStatus.COMPLETED || operation.status === RetryStatus.FAILED) {
          this.pendingOperations.shift();
          continue;
        }
        
        // Update operation status
        operation.status = RetryStatus.IN_PROGRESS;
        operation.lastAttempt = new Date().toISOString();
        operation.attempts += 1;
        
        // Update in IndexedDB
        await dbService.put('retryQueue', operation);
        
        // Notify subscribers about queue changes
        this.notifyQueueChanged();
        
        try {
          // Get the handler for this operation type
          const handler = this.retryHandlers.get(operation.type);
          
          if (!handler) {
            throw new Error(`No handler registered for operation type: ${operation.type}`);
          }
          
          // Execute the handler
          await handler(operation.payload);
          
          // Operation succeeded
          operation.status = RetryStatus.COMPLETED;
          await dbService.put('retryQueue', operation);
          
          console.log(`Successfully processed operation: ${operation.type}`, operation);
          
          // Remove from pending queue
          this.pendingOperations.shift();
          
          // Notify subscribers about queue changes
          this.notifyQueueChanged();
        } catch (error) {
          console.error(`Failed to process operation: ${operation.type}`, error);
          
          // Check if we've reached max attempts
          if (operation.attempts >= operation.maxAttempts) {
            operation.status = RetryStatus.FAILED;
            operation.error = error instanceof Error ? error.message : String(error);
            await dbService.put('retryQueue', operation);
            
            // Remove from pending queue
            this.pendingOperations.shift();
            
            // Notify the user about the failure
            if (this.config.notifyUser) {
              toast({
                title: "Operation failed",
                description: `Failed to ${this.getOperationDescription(operation.type)} after ${operation.attempts} attempts.`,
                variant: "destructive",
              });
            }
          } else {
            // Calculate backoff time using exponential backoff
            const backoffTime = Math.min(
              this.config.initialBackoff * Math.pow(this.config.backoffFactor, operation.attempts - 1),
              this.config.maxBackoff
            );
            
            console.log(`Retrying operation after ${backoffTime}ms backoff`, operation);
            
            // Set status back to pending for next attempt
            operation.status = RetryStatus.PENDING;
            await dbService.put('retryQueue', operation);
            
            // Move to the end of the queue (of same priority)
            this.pendingOperations.shift();
            
            // Find the position to insert based on priority
            const insertIndex = this.pendingOperations.findIndex(op => op.priority > operation.priority);
            if (insertIndex === -1) {
              this.pendingOperations.push(operation);
            } else {
              this.pendingOperations.splice(insertIndex, 0, operation);
            }
            
            // Wait for backoff time before continuing
            await new Promise(resolve => setTimeout(resolve, backoffTime));
          }
          
          // Notify subscribers about queue changes
          this.notifyQueueChanged();
        }
      }
    } finally {
      this.isProcessing = false;
      
      // If we still have pending operations and we're online, schedule another run
      if (this.pendingOperations.length > 0 && this.isOnline) {
        setTimeout(() => this.processQueue(), 1000);
      }
    }
  }

  /**
   * Get a user-friendly description of an operation type
   */
  private getOperationDescription(type: RetryOperationType): string {
    switch (type) {
      case RetryOperationType.SAVE_WORKOUT:
        return "save workout";
      case RetryOperationType.DELETE_WORKOUT:
        return "delete workout";
      case RetryOperationType.UPDATE_WORKOUT:
        return "update workout";
      case RetryOperationType.SYNC_DATA:
        return "sync data";
      case RetryOperationType.API_REQUEST:
        return "complete request";
      default:
        return "complete operation";
    }
  }

  /**
   * Get all operations in the queue
   */
  public getOperations(): RetryOperation[] {
    return [...this.pendingOperations];
  }

  /**
   * Get the count of pending operations
   */
  public getPendingCount(): number {
    return this.pendingOperations.filter(
      op => op.status === RetryStatus.PENDING || op.status === RetryStatus.IN_PROGRESS
    ).length;
  }

  /**
   * Clear all operations from the queue
   */
  public async clearQueue(): Promise<void> {
    try {
      await dbService.clear('retryQueue');
      this.pendingOperations = [];
      this.notifyQueueChanged();
      console.log('Retry queue cleared');
    } catch (error) {
      console.error('Failed to clear retry queue:', error);
      throw error;
    }
  }

  /**
   * Subscribe to queue changes
   */
  public subscribeToQueueChanges(callback: (operations: RetryOperation[]) => void): () => void {
    this.onQueueChangeCallbacks.push(callback);
    
    // Immediately call with current state
    callback([...this.pendingOperations]);
    
    // Return unsubscribe function
    return () => {
      const index = this.onQueueChangeCallbacks.indexOf(callback);
      if (index !== -1) {
        this.onQueueChangeCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify subscribers about queue changes
   */
  private notifyQueueChanged(): void {
    const operations = [...this.pendingOperations];
    for (const callback of this.onQueueChangeCallbacks) {
      try {
        callback(operations);
      } catch (error) {
        console.error('Error in queue change callback:', error);
      }
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<RetryQueueConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('RetryQueueService config updated:', this.config);
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.onQueueChangeCallbacks = [];
    console.log('RetryQueueService disposed');
  }
}

// Create and export a singleton instance
export const retryQueueService = new RetryQueueService();
