import { createContext, useContext, useState, useCallback } from 'react';

export enum RetryStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum RetryOperationType {
  SAVE_WORKOUT = 'save_workout',
  DELETE_WORKOUT = 'delete_workout',
  UPDATE_WORKOUT = 'update_workout',
  SYNC_DATA = 'sync_data',
  API_REQUEST = 'api_request',
}

export interface RetryOperation {
  id: string;
  type: RetryOperationType;
  payload: any;
  status: RetryStatus;
  attempts: number;
  maxAttempts: number;
  error?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface RetryQueueContextType {
  pendingOperations: RetryOperation[];
  pendingCount: number;
  isProcessing: boolean;
  showRetryBanner: boolean;
  setShowRetryBanner: (show: boolean) => void;
  processQueue: () => Promise<void>;
  clearQueue: () => Promise<void>;
  addOperation: (operation: Omit<RetryOperation, 'id' | 'status' | 'attempts' | 'createdAt' | 'updatedAt'>> => void;
  updateOperationStatus: (id: string, status: RetryStatus, error?: any) => void;
}

const RetryQueueContext = createContext<RetryQueueContextType | undefined>(undefined);

export const RetryQueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingOperations, setPendingOperations] = useState<RetryOperation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRetryBanner, setShowRetryBanner] = useState(true);
  
  const pendingCount = pendingOperations.filter(op => op.status === RetryStatus.PENDING).length;
  
  const addOperation = useCallback((operation: Omit<RetryOperation, 'id' | 'status' | 'attempts' | 'createdAt' | 'updatedAt'>>) => {
    const newOperation: RetryOperation = {
      id: Date.now().toString(),
      status: RetryStatus.PENDING,
      attempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...operation,
      maxAttempts: operation.maxAttempts || 3,
    };
    setPendingOperations(prev => [...prev, newOperation]);
  }, []);
  
  const updateOperationStatus = useCallback((id: string, status: RetryStatus, error?: any) => {
    setPendingOperations(prev =>
      prev.map(op =>
        op.id === id ? { ...op, status, error, updatedAt: new Date() } : op
      )
    );
  }, []);
  
  const processQueue = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    let currentOperations = [...pendingOperations];
    
    for (const operation of currentOperations) {
      if (operation.status !== RetryStatus.PENDING) continue;
      
      updateOperationStatus(operation.id, RetryStatus.IN_PROGRESS);
      
      try {
        operation.attempts++;
        await operation.payload();
        updateOperationStatus(operation.id, RetryStatus.COMPLETED);
      } catch (error: any) {
        console.error(`Operation ${operation.type} failed:`, error);
        updateOperationStatus(operation.id, RetryStatus.FAILED, error);
      }
    }
    
    setIsProcessing(false);
  }, [isProcessing, pendingOperations, updateOperationStatus]);
  
  const clearQueue = useCallback(async () => {
    setPendingOperations([]);
  }, []);
  
  const value: RetryQueueContextType = {
    pendingOperations,
    pendingCount,
    isProcessing,
    showRetryBanner,
    setShowRetryBanner,
    processQueue,
    clearQueue,
    addOperation,
    updateOperationStatus,
  };
  
  return (
    <RetryQueueContext.Provider value={value}>
      {children}
    </RetryQueueContext.Provider>
  );
};

export const useRetryQueue = () => {
  const context = useContext(RetryQueueContext);
  if (context === undefined) {
    throw new Error('useRetryQueue must be used within a RetryQueueProvider');
  }
  return context;
};
