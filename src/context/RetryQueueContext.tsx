/**
 * RetryQueueContext: Context provider for the retry queue system
 * 
 * This context provides application-wide access to the retry queue functionality,
 * allowing components to:
 * 1. Add operations to the retry queue
 * 2. Monitor the status of pending operations
 * 3. Register handlers for specific operation types
 * 
 * It initializes the retry queue service and sets up global handlers for
 * common operation types, ensuring a consistent retry mechanism throughout the app.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  retryQueueService, 
  RetryOperation, 
  RetryOperationType, 
  RetryPriority,
  RetryStatus
} from '@/services/retry-queue-service';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { toast } from '@/components/ui/use-toast';

// Define the context type
interface RetryQueueContextType {
  // Queue operations
  addToQueue: (type: RetryOperationType, payload: any, priority?: RetryPriority, maxAttempts?: number) => Promise<string>;
  processQueue: () => Promise<void>;
  clearQueue: () => Promise<void>;
  
  // Queue state
  pendingOperations: RetryOperation[];
  pendingCount: number;
  isProcessing: boolean;
  
  // UI state
  showRetryBanner: boolean;
  setShowRetryBanner: (show: boolean) => void;
}

// Create the context
const RetryQueueContext = createContext<RetryQueueContextType | undefined>(undefined);

// Props for the provider component
interface RetryQueueProviderProps {
  children: React.ReactNode;
}

/**
 * RetryQueueProvider component
 */
export const RetryQueueProvider: React.FC<RetryQueueProviderProps> = ({ children }) => {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [pendingOperations, setPendingOperations] = useState<RetryOperation[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showRetryBanner, setShowRetryBanner] = useState<boolean>(false);
  
  // Initialize the retry queue service
  useEffect(() => {
    retryQueueService.initialize();
    
    // Subscribe to queue changes
    const unsubscribe = retryQueueService.subscribeToQueueChanges((operations) => {
      setPendingOperations(operations);
      setIsProcessing(operations.some(op => op.status === RetryStatus.IN_PROGRESS));
      
      // Show the banner if there are pending operations
      if (operations.length > 0) {
        setShowRetryBanner(true);
      } else {
        setShowRetryBanner(false);
      }
    });
    
    // Clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Handle online/offline status changes
  useEffect(() => {
    if (isOnline && wasOffline && pendingOperations.length > 0) {
      // We just came back online and have pending operations
      toast({
        title: "Connection restored",
        description: `Retrying ${pendingOperations.length} pending operation${pendingOperations.length === 1 ? '' : 's'}...`,
      });
      
      // Process the queue
      retryQueueService.processQueue();
    }
  }, [isOnline, wasOffline, pendingOperations.length]);
  
  // Context value
  const value: RetryQueueContextType = {
    // Queue operations
    addToQueue: async (type, payload, priority, maxAttempts) => {
      return retryQueueService.addToQueue(type, payload, priority, maxAttempts);
    },
    processQueue: async () => {
      return retryQueueService.processQueue();
    },
    clearQueue: async () => {
      return retryQueueService.clearQueue();
    },
    
    // Queue state
    pendingOperations,
    pendingCount: pendingOperations.length,
    isProcessing,
    
    // UI state
    showRetryBanner,
    setShowRetryBanner
  };
  
  return (
    <RetryQueueContext.Provider value={value}>
      {children}
    </RetryQueueContext.Provider>
  );
};

/**
 * Custom hook to access the RetryQueueContext
 */
export const useRetryQueue = (): RetryQueueContextType => {
  const context = useContext(RetryQueueContext);
  if (context === undefined) {
    throw new Error('useRetryQueue must be used within a RetryQueueProvider');
  }
  return context;
};

// Export the original hook name as well for backward compatibility
export const useRetryQueueContext = useRetryQueue;
