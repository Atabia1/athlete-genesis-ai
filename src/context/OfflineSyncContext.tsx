/**
 * OfflineSyncContext
 * 
 * This context consolidates offline functionality including:
 * - Network status tracking
 * - Retry queue for failed operations
 * - Synchronization between online and offline states
 * - Offline workouts management
 * 
 * It replaces the separate OfflineWorkoutsContext, RetryQueueContext, and SyncContext
 * to reduce context nesting and improve performance.
 */

import React, { useState, useEffect, useCallback, ReactNode, createContext, useContext } from 'react';
import { enhancedDbService } from '@/services/enhanced-indexeddb-service';
import { toast } from '@/components/ui/use-toast';
import { WorkoutPlan } from '@/types/workout';
import { standardizeWorkoutPlan } from '@/utils/workout-normalizer';

// Re-export the workout types for backward compatibility
export type { WorkoutPlan as WorkoutTemplate } from '@/types/workout';

// Retry operation types
export enum RetryOperationType {
  SAVE_WORKOUT = 'save_workout',
  DELETE_WORKOUT = 'delete_workout',
  UPDATE_WORKOUT = 'update_workout',
  SYNC_WORKOUTS = 'sync_workouts',
}

// Retry priority levels
export enum RetryPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

// Retry operation interface
export interface RetryOperation {
  id: string;
  type: RetryOperationType;
  payload: any;
  priority: RetryPriority;
  createdAt: number;
  retryCount: number;
  maxRetries: number;
}

// Retry handler type
export type RetryHandler = (payload: any) => Promise<{ success: boolean; result?: any }>;

// Sync status
export enum SyncStatus {
  IDLE = 'idle',
  SYNCING = 'syncing',
  SUCCESS = 'success',
  ERROR = 'error',
}

// Define the context state interface
interface OfflineSyncState {
  // Network status
  isOnline: boolean;
  
  // Retry queue
  retryQueue: RetryOperation[];
  isProcessingQueue: boolean;
  
  // Sync status
  syncStatus: SyncStatus;
  lastSyncTime: Date | null;
  
  // Offline workouts
  offlineWorkouts: WorkoutPlan[];
  savedWorkouts: WorkoutPlan[];
  currentOfflineWorkout: WorkoutPlan | null;
  isLoading: boolean;
  
  // Actions
  addToQueue: (operation: Omit<RetryOperation, 'id' | 'createdAt' | 'retryCount'>) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  processQueue: () => Promise<void>;
  registerHandler: (type: RetryOperationType, handler: RetryHandler) => void;
  syncNow: () => Promise<void>;
  saveCurrentPlanForOffline: (plan: WorkoutPlan) => Promise<void>;
  selectOfflineWorkout: (workoutId: string) => void;
  getSavedWorkoutById: (id: string) => WorkoutPlan | null;
  deleteSavedWorkout: (id: string) => Promise<void>;
  deleteMultipleSavedWorkouts: (ids: string[]) => Promise<void>;
  clearAllSavedWorkouts: () => Promise<void>;
  saveMultipleWorkouts: (workouts: WorkoutPlan[]) => Promise<void>;
}

// Create the context with proper default values
const OfflineSyncContext = createContext<OfflineSyncState | undefined>(undefined);

/**
 * OfflineSyncProvider component
 */
export function OfflineSyncProvider({ children }: { children: ReactNode }): JSX.Element {
  // Network status
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  // Retry queue
  const [retryQueue, setRetryQueue] = useState<RetryOperation[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState<boolean>(false);
  const [handlers, setHandlers] = useState<Record<RetryOperationType, RetryHandler>>({} as Record<RetryOperationType, RetryHandler>);
  
  // Sync status
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.IDLE);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  // Offline workouts
  const [offlineWorkouts, setOfflineWorkouts] = useState<WorkoutPlan[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutPlan[]>([]);
  const [currentOfflineWorkout, setCurrentOfflineWorkout] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Process queue when coming back online
      processQueue();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize database and load data
  useEffect(() => {
    const initializeDB = async () => {
      try {
        // Initialize database
        await enhancedDbService.initDatabase();
        
        // Load saved workouts
        const saved = await loadSavedWorkouts();
        setSavedWorkouts(saved);
        
        // Load workout templates
        const templates = await loadWorkoutTemplates();
        setOfflineWorkouts(templates);
        
        // Load retry queue
        const queue = await loadRetryQueue();
        setRetryQueue(queue);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing offline sync:', error);
        toast({
          title: "Error Loading Offline Data",
          description: "An error occurred while loading offline data. Some features may be unavailable.",
          variant: "destructive",
        });
        
        // Still try to load templates
        try {
          const templates = await loadWorkoutTemplates();
          setOfflineWorkouts(templates);
        } catch (templateError) {
          console.error('Error loading workout templates:', templateError);
        }
        
        setIsLoading(false);
      }
    };
    
    initializeDB();
  }, []);

  // Load saved workouts from IndexedDB
  const loadSavedWorkouts = async (): Promise<WorkoutPlan[]> => {
    try {
      return await enhancedDbService.getAll<WorkoutPlan>('savedWorkouts');
    } catch (error) {
      console.error('Error loading saved workouts:', error);
      return [];
    }
  };

  // Load workout templates
  const loadWorkoutTemplates = async (): Promise<WorkoutPlan[]> => {
    // In a real implementation, these could be loaded from a JSON file or API
    // For now, we'll return an empty array
    return [];
  };

  // Load retry queue from IndexedDB
  const loadRetryQueue = async (): Promise<RetryOperation[]> => {
    try {
      return await enhancedDbService.getAll<RetryOperation>('retryQueue');
    } catch (error) {
      console.error('Error loading retry queue:', error);
      return [];
    }
  };

  // Add operation to retry queue
  const addToQueue = useCallback((
    operation: Omit<RetryOperation, 'id' | 'createdAt' | 'retryCount'>
  ) => {
    const newOperation: RetryOperation = {
      ...operation,
      id: `${operation.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      retryCount: 0,
    };
    
    setRetryQueue(prev => [...prev, newOperation]);
    
    // Save to IndexedDB
    enhancedDbService.add('retryQueue', newOperation).catch(error => {
      console.error('Error saving retry operation:', error);
    });
    
    // Process queue if online
    if (isOnline) {
      processQueue();
    }
  }, [isOnline]);

  // Process retry queue
  const processQueue = useCallback(async () => {
    // If offline or already processing, return
    if (!isOnline || isProcessingQueue || retryQueue.length === 0) {
      return;
    }
    
    setIsProcessingQueue(true);
    
    try {
      // Sort queue by priority and creation time
      const sortedQueue = [...retryQueue].sort((a, b) => {
        // Sort by priority first
        const priorityOrder = { [RetryPriority.HIGH]: 0, [RetryPriority.MEDIUM]: 1, [RetryPriority.LOW]: 2 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        
        if (priorityDiff !== 0) {
          return priorityDiff;
        }
        
        // Then by creation time
        return a.createdAt - b.createdAt;
      });
      
      // Process each operation
      for (const operation of sortedQueue) {
        // Skip if no handler registered
        if (!handlers[operation.type]) {
          console.warn(`No handler registered for operation type: ${operation.type}`);
          removeFromQueue(operation.id);
          continue;
        }
        
        try {
          // Execute handler
          const result = await handlers[operation.type](operation.payload);
          
          if (result.success) {
            // Remove from queue if successful
            removeFromQueue(operation.id);
          } else {
            // Increment retry count
            const updatedOperation = {
              ...operation,
              retryCount: operation.retryCount + 1,
            };
            
            // Remove if max retries reached
            if (updatedOperation.retryCount >= updatedOperation.maxRetries) {
              removeFromQueue(operation.id);
              
              toast({
                title: "Operation Failed",
                description: `Failed to process operation after ${updatedOperation.maxRetries} attempts.`,
                variant: "destructive",
              });
            } else {
              // Update retry count
              setRetryQueue(prev => 
                prev.map(op => op.id === operation.id ? updatedOperation : op)
              );
              
              // Update in IndexedDB
              enhancedDbService.update('retryQueue', updatedOperation).catch(error => {
                console.error('Error updating retry operation:', error);
              });
            }
          }
        } catch (error) {
          console.error(`Error processing operation ${operation.id}:`, error);
          
          // Increment retry count
          const updatedOperation = {
            ...operation,
            retryCount: operation.retryCount + 1,
          };
          
          // Remove if max retries reached
          if (updatedOperation.retryCount >= updatedOperation.maxRetries) {
            removeFromQueue(operation.id);
            
            toast({
              title: "Operation Failed",
              description: `Failed to process operation after ${updatedOperation.maxRetries} attempts.`,
              variant: "destructive",
            });
          } else {
            // Update retry count
            setRetryQueue(prev => 
              prev.map(op => op.id === operation.id ? updatedOperation : op)
            );
            
            // Update in IndexedDB
            enhancedDbService.update('retryQueue', updatedOperation).catch(error => {
              console.error('Error updating retry operation:', error);
            });
          }
        }
      }
    } finally {
      setIsProcessingQueue(false);
    }
  }, [isOnline, isProcessingQueue, retryQueue, handlers]);

  // Remove operation from retry queue
  const removeFromQueue = useCallback((id: string) => {
    setRetryQueue(prev => prev.filter(op => op.id !== id));
    
    // Remove from IndexedDB
    enhancedDbService.delete('retryQueue', id).catch(error => {
      console.error('Error removing retry operation:', error);
    });
  }, []);

  // Clear retry queue
  const clearQueue = useCallback(() => {
    setRetryQueue([]);
    
    // Clear from IndexedDB
    enhancedDbService.clear('retryQueue').catch(error => {
      console.error('Error clearing retry queue:', error);
    });
  }, []);

  // Register handler for retry operations
  const registerHandler = useCallback((type: RetryOperationType, handler: RetryHandler) => {
    setHandlers(prev => ({
      ...prev,
      [type]: handler,
    }));
  }, []);

  // Sync now
  const syncNow = useCallback(async () => {
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "Cannot sync while offline. Please check your connection and try again.",
        variant: "destructive",
      });
      return;
    }
    
    setSyncStatus(SyncStatus.SYNCING);
    
    try {
      // Process retry queue
      await processQueue();
      
      // Update sync status
      setSyncStatus(SyncStatus.SUCCESS);
      setLastSyncTime(new Date());
      
      toast({
        title: "Sync Complete",
        description: "Your data has been successfully synchronized.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error syncing:', error);
      
      setSyncStatus(SyncStatus.ERROR);
      
      toast({
        title: "Sync Failed",
        description: "An error occurred while synchronizing your data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [isOnline, processQueue]);

  // Save current plan for offline
  const saveCurrentPlanForOffline = useCallback(async (plan: WorkoutPlan) => {
    try {
      // Standardize the workout plan
      const standardizedPlan = standardizeWorkoutPlan(plan);
      
      // Save to IndexedDB
      await enhancedDbService.add('savedWorkouts', standardizedPlan);
      
      // Update state
      setSavedWorkouts(prev => {
        // Check if workout already exists
        const exists = prev.some(w => w.id === standardizedPlan.id);
        if (exists) return prev;
        return [...prev, standardizedPlan];
      });
      
      toast({
        title: "Workout Saved",
        description: "Workout has been saved for offline use.",
        variant: "default",
      });
      
      return standardizedPlan;
    } catch (error) {
      console.error('Error saving workout for offline:', error);
      
      toast({
        title: "Save Failed",
        description: "An error occurred while saving the workout for offline use.",
        variant: "destructive",
      });
      
      throw error;
    }
  }, []);

  // Select offline workout
  const selectOfflineWorkout = useCallback((workoutId: string) => {
    // Look in saved workouts first
    let workout = savedWorkouts.find(w => w.id === workoutId);
    
    // If not found, look in offline workouts
    if (!workout) {
      workout = offlineWorkouts.find(w => w.id === workoutId) || null;
    }
    
    setCurrentOfflineWorkout(workout);
  }, [savedWorkouts, offlineWorkouts]);

  // Get saved workout by ID
  const getSavedWorkoutById = useCallback((id: string): WorkoutPlan | null => {
    return savedWorkouts.find(w => w.id === id) || null;
  }, [savedWorkouts]);

  // Delete saved workout
  const deleteSavedWorkout = useCallback(async (id: string) => {
    try {
      // Delete from IndexedDB
      await enhancedDbService.delete('savedWorkouts', id);
      
      // Update state
      setSavedWorkouts(prev => prev.filter(w => w.id !== id));
      
      // If the current offline workout is the one being deleted, clear it
      if (currentOfflineWorkout && currentOfflineWorkout.id === id) {
        setCurrentOfflineWorkout(null);
      }
      
      toast({
        title: "Workout Deleted",
        description: "Workout has been deleted from offline storage.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting saved workout:', error);
      
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting the workout.",
        variant: "destructive",
      });
      
      throw error;
    }
  }, [currentOfflineWorkout]);

  // Delete multiple saved workouts
  const deleteMultipleSavedWorkouts = useCallback(async (ids: string[]) => {
    try {
      // Start a transaction for all operations
      const transaction = await enhancedDbService.startTransaction(['savedWorkouts'], 'readwrite');
      
      // Delete each workout in the transaction
      for (const id of ids) {
        await transaction.delete('savedWorkouts', id);
      }
      
      // Update state
      setSavedWorkouts(prev => prev.filter(w => !ids.includes(w.id)));
      
      // If the current offline workout is one of the deleted ones, clear it
      if (currentOfflineWorkout && ids.includes(currentOfflineWorkout.id)) {
        setCurrentOfflineWorkout(null);
      }
      
      toast({
        title: "Workouts Deleted",
        description: `${ids.length} workouts have been deleted from offline storage.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting multiple saved workouts:', error);
      
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting the workouts.",
        variant: "destructive",
      });
      
      throw error;
    }
  }, [currentOfflineWorkout]);

  // Clear all saved workouts
  const clearAllSavedWorkouts = useCallback(async () => {
    try {
      // Clear from IndexedDB
      await enhancedDbService.clear('savedWorkouts');
      
      // Update state
      setSavedWorkouts([]);
      setCurrentOfflineWorkout(null);
      
      toast({
        title: "All Workouts Deleted",
        description: "All saved workouts have been deleted from offline storage.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error clearing all saved workouts:', error);
      
      toast({
        title: "Clear Failed",
        description: "An error occurred while clearing all saved workouts.",
        variant: "destructive",
      });
      
      throw error;
    }
  }, []);

  // Save multiple workouts
  const saveMultipleWorkouts = useCallback(async (workouts: WorkoutPlan[]) => {
    try {
      // Standardize all workout plans
      const standardizedPlans = workouts.map(standardizeWorkoutPlan);
      
      // Start a transaction for all operations
      const transaction = await enhancedDbService.startTransaction(['savedWorkouts'], 'readwrite');
      
      // Add each workout in the transaction
      for (const plan of standardizedPlans) {
        await transaction.add('savedWorkouts', plan);
      }
      
      // Update state
      setSavedWorkouts(prev => {
        const newWorkouts = standardizedPlans.filter(
          plan => !prev.some(w => w.id === plan.id)
        );
        return [...prev, ...newWorkouts];
      });
      
      toast({
        title: "Workouts Saved",
        description: `${standardizedPlans.length} workouts have been saved for offline use.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving multiple workouts:', error);
      
      toast({
        title: "Save Failed",
        description: "An error occurred while saving the workouts for offline use.",
        variant: "destructive",
      });
      
      throw error;
    }
  }, []);

  // Add workout plan
  const addWorkoutPlan = (plan: WorkoutPlan) => {
    try {
      // Standardize the workout plan
      const standardizedPlan = standardizeWorkoutPlan(plan);
      
      // Save to IndexedDB
      enhancedDbService.add('savedWorkouts', standardizedPlan).catch(error => {
        console.error('Error saving workout:', error);
      });
      
      // Update state
      setSavedWorkouts(prev => {
        // Check if workout already exists
        const exists = prev.some(w => w.id === standardizedPlan.id);
        if (exists) return prev;
        return [...prev, standardizedPlan];
      });
      
      toast({
        title: "Workout Saved",
        description: "Workout has been saved for offline use.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving workout:', error);
      
      toast({
        title: "Save Failed",
        description: "An error occurred while saving the workout.",
        variant: "destructive",
      });
    }
  };

  // Update workout plan
  const updateWorkoutPlan = (id: string, updates: Partial<WorkoutPlan>) => {
    try {
      // Standardize the updates
      const standardizedUpdates = standardizeWorkoutPlan(updates);
      
      // Update in IndexedDB
      enhancedDbService.update('savedWorkouts', { id, ...standardizedUpdates }).catch(error => {
        console.error('Error updating workout:', error);
      });
      
      // Update state
      setSavedWorkouts(prev => {
        // Find the workout to update
        const workout = prev.find(w => w.id === id);
        if (!workout) return prev;
        
        // Create a new workout with updated data
        const updatedWorkout = {
          ...workout,
          ...standardizedUpdates,
        };
        
        // Return the updated state
        return prev.map(w => w.id === id ? updatedWorkout : w);
      });
      
      toast({
        title: "Workout Updated",
        description: "Workout has been updated.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating workout:', error);
      
      toast({
        title: "Update Failed",
        description: "An error occurred while updating the workout.",
        variant: "destructive",
      });
    }
  };

  // Delete workout plan
  const deleteWorkoutPlan = (id: string) => {
    try {
      // Delete from IndexedDB
      enhancedDbService.delete('savedWorkouts', id).catch(error => {
        console.error('Error deleting workout:', error);
      });
      
      // Update state
      setSavedWorkouts(prev => prev.filter(w => w.id !== id));
      
      toast({
        title: "Workout Deleted",
        description: "Workout has been deleted from offline storage.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting workout:', error);
      
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting the workout.",
        variant: "destructive",
      });
    }
  };

  // Context value
  const value: OfflineSyncState = {
    // State
    isOnline,
    retryQueue,
    isProcessingQueue,
    syncStatus,
    lastSyncTime,
    offlineWorkouts,
    savedWorkouts,
    currentOfflineWorkout,
    isLoading,
    
    // Actions
    addToQueue,
    removeFromQueue,
    clearQueue,
    processQueue,
    registerHandler,
    syncNow,
    saveCurrentPlanForOffline,
    selectOfflineWorkout,
    getSavedWorkoutById,
    deleteSavedWorkout,
    deleteMultipleSavedWorkouts,
    clearAllSavedWorkouts,
    saveMultipleWorkouts,
    addWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
  };

  return <OfflineSyncContext.Provider value={value}>{children}</OfflineSyncContext.Provider>;
}

// Export the main hook to access the full context
export function useOfflineSync(): OfflineSyncState {
  const context = useContext(OfflineSyncContext);
  
  if (context === undefined) {
    throw new Error('useOfflineSync must be used within an OfflineSyncProvider');
  }
  
  return context;
}

// Selector hook for network status
export function useNetworkStatus() {
  const context = useOfflineSync();
  
  return {
    isOnline: context.isOnline,
  };
}

// Selector hook for retry queue
export function useRetryQueue() {
  const context = useOfflineSync();
  
  return {
    retryQueue: context.retryQueue,
    isProcessingQueue: context.isProcessingQueue,
    addToQueue: context.addToQueue,
    removeFromQueue: context.removeFromQueue,
    clearQueue: context.clearQueue,
    processQueue: context.processQueue,
    registerHandler: context.registerHandler,
  };
}

// Selector hook for sync status
export function useSync() {
  const context = useOfflineSync();
  
  return {
    syncStatus: context.syncStatus,
    lastSyncTime: context.lastSyncTime,
    syncNow: context.syncNow,
  };
}

// Selector hook for offline workouts
export function useOfflineWorkouts() {
  const context = useOfflineSync();
  
  return {
    offlineWorkouts: context.offlineWorkouts,
    savedWorkouts: context.savedWorkouts,
    currentOfflineWorkout: context.currentOfflineWorkout,
    isLoading: context.isLoading,
    saveCurrentPlanForOffline: context.saveCurrentPlanForOffline,
    selectOfflineWorkout: context.selectOfflineWorkout,
    getSavedWorkoutById: context.getSavedWorkoutById,
    deleteSavedWorkout: context.deleteSavedWorkout,
    deleteMultipleSavedWorkouts: context.deleteMultipleSavedWorkouts,
    clearAllSavedWorkouts: context.clearAllSavedWorkouts,
    saveMultipleWorkouts: context.saveMultipleWorkouts,
  };
}
