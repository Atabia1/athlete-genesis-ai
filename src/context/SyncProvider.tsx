
/**
 * SyncProvider
 * 
 * This provider manages data synchronization between local and remote data stores.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useRetryQueueContext } from './RetryQueueProvider';

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'success';

interface SyncContextType {
  syncStatus: SyncStatus;
  syncProgress: number;
  pendingCount: number;
  lastSyncTime: Date | null;
  lastErrorMessage: string | null;
  syncNow: () => Promise<void>;
  cancelSync: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

interface SyncProviderProps {
  children: ReactNode;
}

export function SyncProvider({ children }: SyncProviderProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncProgress, setSyncProgress] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);
  const { isOnline } = useNetworkStatus();
  const { queueItems } = useRetryQueueContext();

  // Mock function to represent checking for pending changes
  const checkPendingChanges = useCallback(() => {
    // In a real app, this would check for unsynchronized local changes
    // For this example, we'll use the retry queue length as a proxy
    return Promise.resolve(queueItems.length);
  }, [queueItems.length]);

  // Update pending count periodically
  useEffect(() => {
    const checkInterval = setInterval(async () => {
      const count = await checkPendingChanges();
      setPendingCount(count);
    }, 30000); // Check every 30 seconds
    
    // Initial check
    checkPendingChanges().then(setPendingCount);
    
    return () => clearInterval(checkInterval);
  }, [checkPendingChanges]);

  // Mock synchronization function
  const synchronize = useCallback(async () => {
    if (!isOnline || pendingCount === 0) {
      return;
    }
    
    try {
      setSyncStatus('syncing');
      setLastErrorMessage(null);
      
      // Simulate sync progress
      for (let i = 0; i <= 100; i += 10) {
        setSyncProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Set the sync status to success
      setSyncStatus('success');
      setLastSyncTime(new Date());
      setPendingCount(0);
      
    } catch (error) {
      setSyncStatus('error');
      setLastErrorMessage(error instanceof Error ? error.message : 'Unknown sync error');
      console.error('Sync error:', error);
    } finally {
      // Reset progress
      setSyncProgress(0);
      
      // Return to idle state after a delay
      setTimeout(() => {
        if (syncStatus === 'success' || syncStatus === 'error') {
          setSyncStatus('idle');
        }
      }, 3000);
    }
  }, [isOnline, pendingCount, syncStatus]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      synchronize();
    }
  }, [isOnline, pendingCount, synchronize]);

  // Function to manually trigger sync
  const syncNow = useCallback(async () => {
    if (syncStatus === 'syncing') return;
    await synchronize();
  }, [syncStatus, synchronize]);

  // Function to cancel ongoing sync
  const cancelSync = useCallback(() => {
    if (syncStatus === 'syncing') {
      setSyncStatus('idle');
      setSyncProgress(0);
    }
  }, [syncStatus]);

  return (
    <SyncContext.Provider value={{
      syncStatus,
      syncProgress,
      pendingCount,
      lastSyncTime,
      lastErrorMessage,
      syncNow,
      cancelSync
    }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  
  return context;
}
