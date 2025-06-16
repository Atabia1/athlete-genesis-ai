import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRetryQueueContext } from '@/context/RetryQueueContext';

type SyncStatus = 'idle' | 'syncing' | 'error';

interface SyncContextType {
  syncStatus: SyncStatus;
  pendingCount: number;
  syncProgress: number;
  lastErrorMessage: string | null;
  lastSyncTime: Date | null;
  syncNow: () => Promise<void>;
  addPendingOperation: (operation: any) => void;
  clearErrors: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [pendingCount, setPendingCount] = useState(0);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const retryQueue = useRetryQueueContext();

  const syncNow = useCallback(async () => {
    if (syncStatus === 'syncing') return;

    setSyncStatus('syncing');
    setSyncProgress(0);
    setLastErrorMessage(null);

    try {
      // Simulate sync process
      const onProgress = () => {
        setSyncProgress(prev => Math.min(prev + 10, 90));
      };

      // Process pending operations
      if (retryQueue.processQueue) {
        await retryQueue.processQueue();
      }

      setSyncProgress(100);
      setSyncStatus('idle');
      setLastSyncTime(new Date());
      setPendingCount(0);
    } catch (error: any) {
      setSyncStatus('error');
      setLastErrorMessage(error instanceof Error ? error.message : 'Sync failed');
    }
  }, [syncStatus, retryQueue]);

  const addPendingOperation = useCallback((operation: any) => {
    setPendingCount(prev => prev + 1);
  }, []);

  const clearErrors = useCallback(() => {
    setLastErrorMessage(null);
    if (syncStatus === 'error') {
      setSyncStatus('idle');
    }
  }, [syncStatus]);

  useEffect(() => {
    // Update pending count based on retry queue
    setPendingCount(retryQueue.pendingCount);
  }, [retryQueue.pendingCount]);

  const value: SyncContextType = {
    syncStatus,
    pendingCount,
    syncProgress,
    lastErrorMessage,
    lastSyncTime,
    syncNow,
    addPendingOperation,
    clearErrors,
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
