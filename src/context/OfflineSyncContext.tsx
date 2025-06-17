import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { EnhancedIndexedDBService } from '@/services/enhanced-indexeddb-service';
import { standardizeWorkoutPlan } from '@/utils/workout-normalizer';

interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  exercises?: any[];
  duration?: number;
  difficulty?: string;
  sport?: string;
}

interface OfflineSyncState {
  offlineWorkouts: WorkoutPlan[];
  selectedWorkoutId: string | null;
  isLoading: boolean;
  lastSyncTime: Date | null;
  pendingChanges: number;
}

interface OfflineSyncContextType {
  offlineWorkouts: WorkoutPlan[];
  selectedWorkoutId: string | null;
  isLoading: boolean;
  lastSyncTime: Date | null;
  pendingChanges: number;
  loadOfflineWorkouts: () => Promise<void>;
  clearAllOfflineData: () => Promise<void>;
  getCurrentWorkout: () => WorkoutPlan | null;
  setCurrentWorkout: (workout: WorkoutPlan | null) => void;
  deleteWorkout: (workoutId: string) => Promise<void>;
  clearAllWorkouts: () => Promise<void>;
  saveWorkout: (workout: WorkoutPlan) => Promise<void>;
  updateWorkout: (workout: WorkoutPlan) => Promise<void>;
}

type OfflineSyncAction =
  | { type: 'SET_WORKOUTS'; payload: WorkoutPlan[] }
  | { type: 'ADD_WORKOUT'; payload: WorkoutPlan }
  | { type: 'UPDATE_WORKOUT'; payload: WorkoutPlan }
  | { type: 'DELETE_WORKOUT'; payload: string }
  | { type: 'CLEAR_ALL_WORKOUTS' }
  | { type: 'SET_SELECTED_WORKOUT'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LAST_SYNC_TIME'; payload: Date | null }
  | { type: 'SET_PENDING_CHANGES'; payload: number }
  | { type: 'CLEAR_OFFLINE_DATA' };

const workoutObjectStores = [
  {
    name: 'workouts',
    keyPath: 'id',
    autoIncrement: false,
  }
];

const initialState: OfflineSyncState = {
  offlineWorkouts: [],
  selectedWorkoutId: null,
  isLoading: false,
  lastSyncTime: null,
  pendingChanges: 0,
};

const offlineSyncReducer = (state: OfflineSyncState, action: OfflineSyncAction): OfflineSyncState => {
  switch (action.type) {
    case 'SET_WORKOUTS':
      return { ...state, offlineWorkouts: action.payload };
    case 'ADD_WORKOUT':
      return { ...state, offlineWorkouts: [...state.offlineWorkouts, action.payload] };
    case 'UPDATE_WORKOUT':
      return {
        ...state,
        offlineWorkouts: state.offlineWorkouts.map(workout =>
          workout.id === action.payload.id ? action.payload : workout
        ),
      };
    case 'DELETE_WORKOUT':
      return {
        ...state,
        offlineWorkouts: state.offlineWorkouts.filter(workout => workout.id !== action.payload),
      };
    case 'CLEAR_ALL_WORKOUTS':
      return { ...state, offlineWorkouts: [] };
    case 'SET_SELECTED_WORKOUT':
      return { ...state, selectedWorkoutId: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_LAST_SYNC_TIME':
      return { ...state, lastSyncTime: action.payload };
    case 'SET_PENDING_CHANGES':
      return { ...state, pendingChanges: action.payload };
    case 'CLEAR_OFFLINE_DATA':
      return { ...state, offlineWorkouts: [] };
    default:
      return state;
  }
};

const enhancedIndexedDBService = new EnhancedIndexedDBService('WorkoutApp', workoutObjectStores);

const OfflineSyncContext = createContext<OfflineSyncContextType | undefined>(undefined);

export const OfflineSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(offlineSyncReducer, initialState);

  const isIndexedDBSupported = useCallback(() => {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  }, []);

  const clearAllOfflineData = useCallback(async () => {
    if (!isIndexedDBSupported()) {
      console.warn('IndexedDB not supported');
      return;
    }

    try {
      await enhancedIndexedDBService.clearAll('workouts');
      dispatch({ type: 'CLEAR_OFFLINE_DATA' });
    } catch (error: any) {
      console.error('Error clearing offline data:', error);
    }
  }, [isIndexedDBSupported]);

  const loadOfflineWorkouts = useCallback(async () => {
    try {
      const workouts = await enhancedIndexedDBService.getAll('workouts');
      const validWorkouts = workouts.filter((workout): workout is WorkoutPlan => {
        const standardizedPlan = standardizeWorkoutPlan(workout);
        return standardizedPlan !== null;
      });
      
      dispatch({ type: 'SET_WORKOUTS', payload: validWorkouts });
      
      validWorkouts.forEach(workout => {
        const standardized = standardizeWorkoutPlan(workout);
        if (standardized) {
          console.log('Loaded workout:', standardized.name);
        }
      });
    } catch (error) {
      console.error('Error loading offline workouts:', error);
    }
  }, []);

  const getCurrentWorkout = useCallback((): WorkoutPlan | null => {
    const plan = state.offlineWorkouts.find(w => w.id === state.selectedWorkoutId);
    return plan || null;
  }, [state.offlineWorkouts, state.selectedWorkoutId]);

  const setCurrentWorkout = useCallback((workout: WorkoutPlan | null) => {
    dispatch({ type: 'SET_SELECTED_WORKOUT', payload: workout?.id || null });
  }, []);

  const deleteWorkout = useCallback(async (workoutId: string) => {
    try {
      await enhancedIndexedDBService.delete('workouts', workoutId);
      dispatch({ type: 'DELETE_WORKOUT', payload: workoutId });
      console.log('Workout deleted successfully');
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  }, []);

  const clearAllWorkouts = useCallback(async () => {
    try {
      await enhancedIndexedDBService.clearAll('workouts');
      dispatch({ type: 'CLEAR_ALL_WORKOUTS' });
      console.log('All workouts cleared successfully');
    } catch (error) {
      console.error('Error clearing all workouts:', error);
    }
  }, []);

  const saveWorkout = useCallback(async (workout: WorkoutPlan) => {
    try {
      const plan = standardizeWorkoutPlan(workout);
      if (!plan) {
        throw new Error('Invalid workout plan format');
      }

      await enhancedIndexedDBService.add('workouts', plan);
      dispatch({ type: 'ADD_WORKOUT', payload: plan });
      console.log('Workout saved successfully:', plan.name);
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  }, []);

  const updateWorkout = useCallback(async (workout: WorkoutPlan) => {
    try {
      const standardizedPlan = standardizeWorkoutPlan(workout);
      if (!standardizedPlan) {
        throw new Error('Invalid workout plan format');
      }

      await enhancedIndexedDBService.update('workouts', standardizedPlan);
      dispatch({ type: 'UPDATE_WORKOUT', payload: standardizedPlan });
      console.log('Workout updated successfully:', standardizedPlan.name);
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  }, []);

  useEffect(() => {
    loadOfflineWorkouts();
  }, [loadOfflineWorkouts]);

  const value: OfflineSyncContextType = {
    offlineWorkouts: state.offlineWorkouts,
    selectedWorkoutId: state.selectedWorkoutId,
    isLoading: state.isLoading,
    lastSyncTime: state.lastSyncTime,
    pendingChanges: state.pendingChanges,
    loadOfflineWorkouts,
    clearAllOfflineData,
    getCurrentWorkout,
    setCurrentWorkout,
    deleteWorkout,
    clearAllWorkouts,
    saveWorkout,
    updateWorkout,
  };

  return (
    <OfflineSyncContext.Provider value={value}>
      {children}
    </OfflineSyncContext.Provider>
  );
};

export const useOfflineSync = () => {
  const context = useContext(OfflineSyncContext);
  if (context === undefined) {
    throw new Error('useOfflineSync must be used within an OfflineSyncProvider');
  }
  return context;
};
