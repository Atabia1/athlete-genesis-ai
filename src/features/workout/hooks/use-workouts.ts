/**
 * Workouts Hook
 * 
 * This hook provides workout management functionality including:
 * - Fetching workouts
 * - Creating workouts
 * - Updating workouts
 * - Deleting workouts
 * - Offline support
 */

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { workoutApi } from '@/services/api';
import { useApiQuery, useApiMutation } from '@/hooks/use-api';
import { useOfflineSync, RetryOperationType, RetryPriority } from '@/context/OfflineSyncContext';
import { toast } from '@/components/ui/use-toast';
import { WorkoutPlan } from '@/types/workout';

/**
 * Workouts hook result
 */
export interface UseWorkoutsResult {
  /**
   * All workouts
   */
  workouts: WorkoutPlan[];
  
  /**
   * Whether workouts are loading
   */
  isLoading: boolean;
  
  /**
   * Error fetching workouts
   */
  error: Error | null;
  
  /**
   * Get a workout by ID
   */
  getWorkout: (id: string) => WorkoutPlan | null;
  
  /**
   * Create a new workout
   */
  createWorkout: (workout: Omit<WorkoutPlan, 'id'>) => Promise<WorkoutPlan>;
  
  /**
   * Update a workout
   */
  updateWorkout: (id: string, workout: Partial<WorkoutPlan>) => Promise<WorkoutPlan>;
  
  /**
   * Delete a workout
   */
  deleteWorkout: (id: string) => Promise<void>;
  
  /**
   * Save a workout for offline use
   */
  saveWorkoutForOffline: (workout: WorkoutPlan) => Promise<void>;
  
  /**
   * Refresh workouts
   */
  refreshWorkouts: () => Promise<WorkoutPlan[]>;
}

/**
 * Workouts hook
 */
export function useWorkouts(): UseWorkoutsResult {
  const queryClient = useQueryClient();
  const { saveCurrentPlanForOffline, getSavedWorkoutById } = useOfflineSync();
  
  // Get all workouts
  const {
    data: workouts = [],
    isLoading,
    error,
    refetch: refreshWorkouts,
  } = useApiQuery<WorkoutPlan[]>(
    ['workouts'],
    async () => {
      return workoutApi.getWorkouts();
    },
    {
      offlineSupport: true,
      getOfflineData: async () => {
        // Get saved workouts from offline storage
        const savedWorkouts = await getSavedWorkoutById('all');
        return savedWorkouts ? [savedWorkouts] : [];
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
  
  // Create workout mutation
  const createWorkoutMutation = useApiMutation<WorkoutPlan, Omit<WorkoutPlan, 'id'>>(
    async (workout) => {
      return workoutApi.createWorkout(workout);
    },
    {
      offlineSupport: true,
      retryOperationType: RetryOperationType.SAVE_WORKOUT,
      retryPriority: RetryPriority.HIGH,
      onSuccess: (data) => {
        // Update the workouts in the cache
        queryClient.setQueryData<WorkoutPlan[]>(['workouts'], (old = []) => {
          return [...old, data];
        });
        
        // Show success toast
        toast({
          title: 'Workout Created',
          description: 'Your workout has been created successfully',
          variant: 'default',
        });
      },
      onError: (error) => {
        // Show error toast
        toast({
          title: 'Create Workout Failed',
          description: error instanceof Error ? error.message : 'An error occurred while creating the workout',
          variant: 'destructive',
        });
      },
    }
  );
  
  // Update workout mutation
  const updateWorkoutMutation = useApiMutation<WorkoutPlan, { id: string; workout: Partial<WorkoutPlan> }>(
    async ({ id, workout }) => {
      return workoutApi.updateWorkout(id, workout);
    },
    {
      offlineSupport: true,
      retryOperationType: RetryOperationType.UPDATE_WORKOUT,
      retryPriority: RetryPriority.HIGH,
      onSuccess: (data) => {
        // Update the workouts in the cache
        queryClient.setQueryData<WorkoutPlan[]>(['workouts'], (old = []) => {
          return old.map(w => w.id === data.id ? data : w);
        });
        
        // Update the workout in the cache
        queryClient.setQueryData<WorkoutPlan>(['workout', data.id], data);
        
        // Show success toast
        toast({
          title: 'Workout Updated',
          description: 'Your workout has been updated successfully',
          variant: 'default',
        });
      },
      onError: (error) => {
        // Show error toast
        toast({
          title: 'Update Workout Failed',
          description: error instanceof Error ? error.message : 'An error occurred while updating the workout',
          variant: 'destructive',
        });
      },
    }
  );
  
  // Delete workout mutation
  const deleteWorkoutMutation = useApiMutation<void, string>(
    async (id) => {
      return workoutApi.deleteWorkout(id);
    },
    {
      offlineSupport: true,
      retryOperationType: RetryOperationType.DELETE_WORKOUT,
      retryPriority: RetryPriority.MEDIUM,
      onSuccess: (_, id) => {
        // Update the workouts in the cache
        queryClient.setQueryData<WorkoutPlan[]>(['workouts'], (old = []) => {
          return old.filter(w => w.id !== id);
        });
        
        // Remove the workout from the cache
        queryClient.removeQueries(['workout', id]);
        
        // Show success toast
        toast({
          title: 'Workout Deleted',
          description: 'Your workout has been deleted successfully',
          variant: 'default',
        });
      },
      onError: (error) => {
        // Show error toast
        toast({
          title: 'Delete Workout Failed',
          description: error instanceof Error ? error.message : 'An error occurred while deleting the workout',
          variant: 'destructive',
        });
      },
    }
  );
  
  // Get workout by ID
  const getWorkout = useCallback((id: string): WorkoutPlan | null => {
    return workouts.find(w => w.id === id) || null;
  }, [workouts]);
  
  // Create workout
  const createWorkout = useCallback(async (workout: Omit<WorkoutPlan, 'id'>): Promise<WorkoutPlan> => {
    return createWorkoutMutation.mutateAsync(workout);
  }, [createWorkoutMutation]);
  
  // Update workout
  const updateWorkout = useCallback(async (id: string, workout: Partial<WorkoutPlan>): Promise<WorkoutPlan> => {
    return updateWorkoutMutation.mutateAsync({ id, workout });
  }, [updateWorkoutMutation]);
  
  // Delete workout
  const deleteWorkout = useCallback(async (id: string): Promise<void> => {
    return deleteWorkoutMutation.mutateAsync(id);
  }, [deleteWorkoutMutation]);
  
  // Save workout for offline use
  const saveWorkoutForOffline = useCallback(async (workout: WorkoutPlan): Promise<void> => {
    try {
      await saveCurrentPlanForOffline(workout);
      
      // Show success toast
      toast({
        title: 'Workout Saved Offline',
        description: 'Your workout has been saved for offline use',
        variant: 'default',
      });
    } catch (error) {
      // Show error toast
      toast({
        title: 'Save Offline Failed',
        description: error instanceof Error ? error.message : 'An error occurred while saving the workout for offline use',
        variant: 'destructive',
      });
      
      throw error;
    }
  }, [saveCurrentPlanForOffline]);
  
  // Refresh workouts
  const refreshWorkoutsFn = useCallback(async (): Promise<WorkoutPlan[]> => {
    const result = await refreshWorkouts();
    return result.data || [];
  }, [refreshWorkouts]);
  
  return {
    workouts,
    isLoading,
    error: error instanceof Error ? error : null,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    saveWorkoutForOffline,
    refreshWorkouts: refreshWorkoutsFn,
  };
}
