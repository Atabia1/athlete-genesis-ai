
/**
 * RetryQueueProvider
 * 
 * This provider manages the retry queue for failed network requests.
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useNetworkStatus } from '@/hooks/use-network-status';

interface RetryQueueItem {
  id: string;
  action: () => Promise<void>;
  description: string;
  createdAt: Date;
  retryCount: number;
}

interface RetryQueueContextType {
  queueItems: RetryQueueItem[];
  addToQueue: (item: Omit<RetryQueueItem, 'id' | 'createdAt' | 'retryCount'>) => void;
  removeFromQueue: (id: string) => void;
  retryItem: (id: string) => void;
  retryAll: () => void;
  clearQueue: () => void;
  isProcessing: boolean;
}

const RetryQueueContext = createContext<RetryQueueContextType | undefined>(undefined);

interface RetryQueueProviderProps {
  children: ReactNode;
}

export function RetryQueueProvider({ children }: RetryQueueProviderProps) {
  const [queueItems, setQueueItems] = useState<RetryQueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isOnline } = useNetworkStatus();

  // Generate unique ID for queue items
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }, []);

  // Add item to retry queue
  const addToQueue = useCallback(({ action, description }: Omit<RetryQueueItem, 'id' | 'createdAt' | 'retryCount'>) => {
    setQueueItems((prevItems) => [
      ...prevItems,
      {
        id: generateId(),
        action,
        description,
        createdAt: new Date(),
        retryCount: 0
      }
    ]);
  }, [generateId]);

  // Remove item from retry queue
  const removeFromQueue = useCallback((id: string) => {
    setQueueItems((prevItems) => prevItems.filter(item => item.id !== id));
  }, []);

  // Retry a specific item
  const retryItem = useCallback(async (id: string) => {
    if (!isOnline) return;

    setIsProcessing(true);
    
    try {
      const item = queueItems.find(item => item.id === id);
      
      if (item) {
        await item.action();
        removeFromQueue(id);
      }
    } catch (error) {
      console.error('Failed to retry item:', error);
      
      setQueueItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, retryCount: item.retryCount + 1 } 
            : item
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, [isOnline, queueItems, removeFromQueue]);

  // Retry all items in the queue
  const retryAll = useCallback(async () => {
    if (!isOnline || queueItems.length === 0) return;
    
    setIsProcessing(true);
    
    const successfulItems: string[] = [];
    
    for (const item of queueItems) {
      try {
        await item.action();
        successfulItems.push(item.id);
      } catch (error) {
        console.error(`Failed to retry item ${item.id}:`, error);
        
        setQueueItems(prevItems => 
          prevItems.map(qItem => 
            qItem.id === item.id 
              ? { ...qItem, retryCount: qItem.retryCount + 1 } 
              : qItem
          )
        );
      }
    }
    
    // Remove successful items
    setQueueItems(prevItems => 
      prevItems.filter(item => !successfulItems.includes(item.id))
    );
    
    setIsProcessing(false);
  }, [isOnline, queueItems]);

  // Clear the entire queue
  const clearQueue = useCallback(() => {
    setQueueItems([]);
  }, []);

  // Auto-retry when coming back online
  useEffect(() => {
    if (isOnline && queueItems.length > 0) {
      retryAll();
    }
  }, [isOnline, queueItems.length, retryAll]);

  return (
    <RetryQueueContext.Provider value={{
      queueItems,
      addToQueue,
      removeFromQueue,
      retryItem,
      retryAll,
      clearQueue,
      isProcessing
    }}>
      {children}
    </RetryQueueContext.Provider>
  );
}

export function useRetryQueueContext() {
  const context = useContext(RetryQueueContext);
  
  if (context === undefined) {
    throw new Error('useRetryQueueContext must be used within a RetryQueueProvider');
  }
  
  return context;
}
