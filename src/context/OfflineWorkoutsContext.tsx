import { createContext, useContext, useReducer, useCallback } from 'react';
import { EnhancedIndexedDBService } from '@/services/enhanced-indexeddb-service';

interface WorkoutPlan {
  id: string;
  title: string;
  description?: string;
  exercises?: any[];
  duration?: number;
  difficulty?: string;
  sport?: string;
}

interface OfflineWorkoutsState {
  workouts: WorkoutPlan[];
  selectedWorkouts: WorkoutPlan[];
  isLoading: boolean;
  lastSyncTime: Date | null;
  pendingChanges: number;
}

interface OfflineWorkoutsContextType {
  workouts: WorkoutPlan[];
  selectedWorkouts: WorkoutPlan[];
  isLoading: boolean;
  lastSyncTime: Date | null;
  pendingChanges: number;
  addWorkout: (workout: WorkoutPlan) => Promise<void>;
  removeWorkout: (workoutId: string) => Promise<void>;
  updateWorkout: (workout: WorkoutPlan) => Promise<void>;
  clearAllWorkouts: () => Promise<void>;
  syncWorkouts: () => Promise<void>;
  loadWorkouts: () => Promise<void>;
}

const initialState: OfflineWorkoutsState = {
  workouts: [],
  selectedWorkouts: [],
  isLoading: false,
  lastSyncTime: null,
  pendingChanges: 0,
};

type OfflineWorkoutsAction =
  | { type: 'SET_WORKOUTS'; payload: WorkoutPlan[] }
  | { type: 'ADD_WORKOUT'; payload: WorkoutPlan }
  | { type: 'REMOVE_WORKOUT'; payload: string }
  | { type: 'UPDATE_WORKOUT'; payload: WorkoutPlan }
  | { type: 'CLEAR_ALL_WORKOUTS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LAST_SYNC_TIME'; payload: Date }
  | { type: 'INCREMENT_PENDING_CHANGES' }
  | { type: 'DECREMENT_PENDING_CHANGES' };

const offlineWorkoutsReducer = (
  state: OfflineWorkoutsState,
  action: OfflineWorkoutsAction
): OfflineWorkoutsState => {
  switch (action.type) {
    case 'SET_WORKOUTS':
      return { ...state, workouts: action.payload, isLoading: false };
    case 'ADD_WORKOUT':
      return { ...state, workouts: [...state.workouts, action.payload], pendingChanges: state.pendingChanges + 1 };
    case 'REMOVE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter((workout) => workout.id !== action.payload),
        pendingChanges: state.pendingChanges + 1,
      };
    case 'UPDATE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.map((workout) =>
          workout.id === action.payload.id ? action.payload : workout
        ),
        pendingChanges: state.pendingChanges + 1,
      };
    case 'CLEAR_ALL_WORKOUTS':
      return { ...state, workouts: [], pendingChanges: 0 };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_LAST_SYNC_TIME':
      return { ...state, lastSyncTime: action.payload };
    case 'INCREMENT_PENDING_CHANGES':
      return { ...state, pendingChanges: state.pendingChanges + 1 };
    case 'DECREMENT_PENDING_CHANGES':
      return { ...state, pendingChanges: Math.max(0, state.pendingChanges - 1) };
    default:
      return state;
  }
};

const enhancedIndexedDBService = new EnhancedIndexedDBService('WorkoutApp', 1);

const OfflineWorkoutsContext = createContext<OfflineWorkoutsContextType | undefined>(undefined);

export const OfflineWorkoutsProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatch] = useReducer(offlineWorkoutsReducer, initialState);

  // Check if IndexedDB is supported
  const isIndexedDBSupported = useCallback(() => {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  }, []);

  const loadWorkouts = useCallback(async () => {
    if (!isIndexedDBSupported()) {
      console.warn('IndexedDB not supported');
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const workouts = await enhancedIndexedDBService.getAll('workouts');
      dispatch({ type: 'SET_WORKOUTS', payload: workouts });
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [isIndexedDBSupported]);

  const removeWorkout = useCallback(async (workoutId: string) => {
    if (!isIndexedDBSupported()) {
      console.warn('IndexedDB not supported');
      return;
    }

    try {
      await enhancedIndexedDBService.delete('workouts', workoutId);
      dispatch({ type: 'REMOVE_WORKOUT', payload: workoutId });
    } catch (error) {
      console.error('Error removing workout:', error);
    }
  }, [isIndexedDBSupported]);

  const updateWorkout = useCallback(async (workout: WorkoutPlan) => {
    if (!isIndexedDBSupported()) {
      console.warn('IndexedDB not supported');
      return;
    }

    try {
      await enhancedIndexedDBService.put('workouts', workout);
      dispatch({ type: 'UPDATE_WORKOUT', payload: workout });
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  }, [isIndexedDBSupported]);

  const clearAllWorkouts = useCallback(async () => {
    if (!isIndexedDBSupported()) {
      console.warn('IndexedDB not supported');
      return;
    }

    try {
      await enhancedIndexedDBService.clearStore('workouts');
      dispatch({ type: 'CLEAR_ALL_WORKOUTS' });
    } catch (error) {
      console.error('Error clearing all workouts:', error);
    }
  }, [isIndexedDBSupported]);

  const syncWorkouts = useCallback(async () => {
    if (!isIndexedDBSupported()) {
      console.warn('IndexedDB not supported');
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch({ type: 'SET_LAST_SYNC_TIME', payload: new Date() });
    } catch (error) {
      console.error('Error syncing workouts:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [isIndexedDBSupported]);

  const addWorkout = useCallback(async (workout: WorkoutPlan) => {
    if (!isIndexedDBSupported()) {
      console.warn('IndexedDB not supported');
      return;
    }

    try {
      await enhancedIndexedDBService.add('workouts', workout);
      dispatch({ type: 'ADD_WORKOUT', payload: workout });
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  }, [isIndexedDBSupported]);

  const value: OfflineWorkoutsContextType = {
    workouts: state.workouts,
    selectedWorkouts: state.selectedWorkouts,
    isLoading: state.isLoading,
    lastSyncTime: state.lastSyncTime,
    pendingChanges: state.pendingChanges,
    addWorkout,
    removeWorkout,
    updateWorkout,
    clearAllWorkouts,
    syncWorkouts,
    loadWorkouts,
  };

  return (
    <OfflineWorkoutsContext.Provider value={value}>
      {children}
    </OfflineWorkoutsContext.Provider>
  );
};

export const useOfflineWorkouts = () => {
  const context = useContext(OfflineWorkoutsContext);
  if (context === undefined) {
    throw new Error('useOfflineWorkouts must be used within an OfflineWorkoutsProvider');
  }
  return context;
};
