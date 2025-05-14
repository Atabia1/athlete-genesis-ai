/**
 * useRetryQueue: Custom hook for interacting with the retry queue system
 * 
 * This hook provides a convenient way for components to:
 * 1. Add operations to the retry queue
 * 2. Monitor the status of pending operations
 * 3. Register handlers for specific operation types
 * 4. Get notified when operations succeed or fail
 * 
 * It's designed to work seamlessly with the RetryQueueService to provide
 * a robust retry mechanism for operations that fail due to network issues.
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  retryQueueService, 
  RetryOperation, 
  RetryOperationType, 
  RetryPriority,
  RetryStatus
} from '@/services/retry-queue-service';

interface UseRetryQueueResult {
  // Queue operations
  addToQueue: (type: RetryOperationType, payload: any, priority?: RetryPriority, maxAttempts?: number) => Promise<string>;
  registerHandler: (type: RetryOperationType, handler: (payload: any) => Promise<any>) => void;
  processQueue: () => Promise<void>;
  clearQueue: () => Promise<void>;
  
  // Queue state
  pendingOperations: RetryOperation[];
  pendingCount: number;
  isProcessing: boolean;
  
  // Helper functions
  getOperationsByType: (type: RetryOperationType) => RetryOperation[];
  getOperationsByStatus: (status: RetryStatus) => RetryOperation[];
}

/**
 * Custom hook for interacting with the retry queue
 */
export function useRetryQueue(): UseRetryQueueResult {
  const [pendingOperations, setPendingOperations] = useState<RetryOperation[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Subscribe to queue changes
  useEffect(() => {
    // Initialize the retry queue service if not already initialized
    retryQueueService.initialize();
    
    // Subscribe to queue changes
    const unsubscribe = retryQueueService.subscribeToQueueChanges((operations) => {
      setPendingOperations(operations);
      setIsProcessing(operations.some(op => op.status === RetryStatus.IN_PROGRESS));
    });
    
    // Clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Add an operation to the queue
  const addToQueue = useCallback(async (
    type: RetryOperationType,
    payload: any,
    priority: RetryPriority = RetryPriority.MEDIUM,
    maxAttempts?: number
  ): Promise<string> => {
    return retryQueueService.addToQueue(type, payload, priority, maxAttempts);
  }, []);
  
  // Register a handler for a specific operation type
  const registerHandler = useCallback((
    type: RetryOperationType,
    handler: (payload: any) => Promise<any>
  ): void => {
    retryQueueService.registerHandler(type, handler);
  }, []);
  
  // Process the queue manually
  const processQueue = useCallback(async (): Promise<void> => {
    return retryQueueService.processQueue();
  }, []);
  
  // Clear the queue
  const clearQueue = useCallback(async (): Promise<void> => {
    return retryQueueService.clearQueue();
  }, []);
  
  // Get operations by type
  const getOperationsByType = useCallback((type: RetryOperationType): RetryOperation[] => {
    return pendingOperations.filter(op => op.type === type);
  }, [pendingOperations]);
  
  // Get operations by status
  const getOperationsByStatus = useCallback((status: RetryStatus): RetryOperation[] => {
    return pendingOperations.filter(op => op.status === status);
  }, [pendingOperations]);
  
  return {
    // Queue operations
    addToQueue,
    registerHandler,
    processQueue,
    clearQueue,
    
    // Queue state
    pendingOperations,
    pendingCount: pendingOperations.length,
    isProcessing,
    
    // Helper functions
    getOperationsByType,
    getOperationsByStatus
  };
}
