
/**
 * SyncProvider: Manages data synchronization between local storage and server
 * 
 * This provider handles:
 * 1. Tracking of pending sync operations
 * 2. Automatic synchronization when coming back online
 * 3. Manual synchronization trigger
 * 4. Visual indicators of sync status
 * 5. Sync history and error tracking
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { RetryOperationType } from '@/services/retry-queue-service';
import { toast } from 'sonner';
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
  
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [pendingCount, setPendingCount] = useState(0);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncInProgress, setSyncInProgress] = useState(false);
  
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
      
      // Simulate sync process
      const totalSteps = 5;
      for (let step = 1; step <= totalSteps; step++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setSyncProgress(Math.floor((step / totalSteps) * 100));
      }
      
      // Update status on completion
      setSyncStatus('completed');
      setLastSyncTime(new Date());
      setPendingCount(0);
      
      // Show success toast
      toast("Sync Completed", {
        description: `Successfully synchronized all items.`,
      });
      
      // Reset to idle after a delay
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);
      
    } catch (error) {
      // Handle sync failure
      setSyncStatus('failed');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during synchronization';
      setLastErrorMessage(errorMessage);
      
      toast("Sync Failed", {
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
    // Simulate adding to queue
    setPendingCount(prev => prev + 1);
    
    // Update sync status if we have pending items
    if (syncStatus === 'idle' || syncStatus === 'completed') {
      setSyncStatus('pending');
    }
    
    console.log(`Added ${type} to sync queue`, data);
  };
  
  /**
   * Clear all pending sync items
   */
  const clearSyncQueue = () => {
    setPendingCount(0);
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
