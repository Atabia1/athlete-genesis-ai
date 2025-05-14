/**
 * SyncContext: Manages data synchronization between local storage and server
 * 
 * This context provides:
 * 1. Tracking of pending sync operations
 * 2. Automatic synchronization when coming back online
 * 3. Manual synchronization trigger
 * 4. Visual indicators of sync status
 * 5. Sync history and error tracking
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useRetryQueue } from '@/hooks/use-retry-queue';
import { RetryOperationType } from '@/services/retry-queue-service';
import { toast } from '@/components/ui/use-toast';
import { SyncStatus } from '@/components/ui/sync-indicator';

interface SyncContextType {
  /** Current synchronization status */
  syncStatus: SyncStatus;
  /** Number of items pending synchronization */
  pendingCount: number;
  /** Progress percentage (0-100) */
  syncProgress: number;
  /** Last error message if sync failed */
  lastErrorMessage: string | null;
  /** Manually trigger synchronization */
  syncNow: () => Promise<void>;
  /** Last successful sync time */
  lastSyncTime: Date | null;
  /** Add an item to the sync queue */
  addToSyncQueue: (type: RetryOperationType, data: any) => void;
  /** Clear all pending sync items */
  clearSyncQueue: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

interface SyncProviderProps {
  children: ReactNode;
}

export const SyncProvider = ({ children }: SyncProviderProps) => {
  const { isOnline, wasOffline } = useNetworkStatus();
  const { 
    pendingOperations, 
    processAllPendingOperations, 
    addOperation,
    clearAllOperations
  } = useRetryQueue();
  
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncInProgress, setSyncInProgress] = useState(false);
  
  // Calculate pending count from retry queue
  const pendingCount = pendingOperations.length;
  
  /**
   * Perform synchronization of all pending operations
   */
  const syncNow = async () => {
    if (syncInProgress || !isOnline) return;
    
    try {
      setSyncInProgress(true);
      setSyncStatus('syncing');
      setSyncProgress(0);
      setLastErrorMessage(null);
      
      // Process all pending operations
      const totalOperations = pendingOperations.length;
      if (totalOperations === 0) {
        // Nothing to sync
        setSyncStatus('completed');
        setLastSyncTime(new Date());
        toast({
          title: "Already in sync",
          description: "All your data is already synchronized.",
        });
        return;
      }
      
      // Process operations with progress tracking
      let completedOperations = 0;
      
      await processAllPendingOperations((progress) => {
        completedOperations++;
        const progressPercentage = Math.round((completedOperations / totalOperations) * 100);
        setSyncProgress(progressPercentage);
      });
      
      // Update status on completion
      setSyncStatus('completed');
      setLastSyncTime(new Date());
      
      // Show success toast
      toast({
        title: "Sync Completed",
        description: `Successfully synchronized ${totalOperations} ${totalOperations === 1 ? 'item' : 'items'}.`,
      });
      
      // Reset to idle after a delay
      setTimeout(() => {
        if (pendingOperations.length === 0) {
          setSyncStatus('idle');
        }
      }, 3000);
      
    } catch (error) {
      // Handle sync failure
      setSyncStatus('failed');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during synchronization';
      setLastErrorMessage(errorMessage);
      
      toast({
        title: "Sync Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSyncInProgress(false);
    }
  };
  
  /**
   * Add an item to the sync queue
   */
  const addToSyncQueue = (type: RetryOperationType, data: any) => {
    addOperation(type, data);
    
    // Update sync status if we have pending items
    if (syncStatus === 'idle' || syncStatus === 'completed') {
      setSyncStatus('pending');
    }
  };
  
  /**
   * Clear all pending sync items
   */
  const clearSyncQueue = () => {
    clearAllOperations();
    setSyncStatus('idle');
  };
  
  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && wasOffline && pendingCount > 0) {
      // Small delay to ensure network is stable
      const timer = setTimeout(() => {
        syncNow();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline, pendingCount]);
  
  // Update sync status based on pending operations
  useEffect(() => {
    if (syncStatus !== 'syncing' && syncStatus !== 'failed') {
      if (pendingCount > 0) {
        setSyncStatus('pending');
      } else {
        setSyncStatus('idle');
      }
    }
  }, [pendingCount, syncStatus]);
  
  const value = {
    syncStatus,
    pendingCount,
    syncProgress,
    lastErrorMessage,
    syncNow,
    lastSyncTime,
    addToSyncQueue,
    clearSyncQueue
  };
  
  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
