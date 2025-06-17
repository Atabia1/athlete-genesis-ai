
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery, useApiMutation } from '@/hooks/use-api';
import { useOfflineSync } from '@/context/OfflineSyncContext';
import { toast } from '@/components/ui/use-toast';
import { WorkoutPlan } from '@/types/workout';

export interface UseWorkoutsResult {
  workouts: WorkoutPlan[];
  isLoading: boolean;
  error: Error | null;
  getWorkout: (id: string) => WorkoutPlan | null;
  createWorkout: (workout: Omit<WorkoutPlan, 'id'>) => Promise<WorkoutPlan>;
  updateWorkout: (id: string, workout: Partial<WorkoutPlan>) => Promise<WorkoutPlan>;
  deleteWorkout: (id: string) => Promise<void>;
  saveWorkoutForOffline: (workout: WorkoutPlan) => Promise<void>;
  refreshWorkouts: () => Promise<WorkoutPlan[]>;
}

export function useWorkouts(): UseWorkoutsResult {
  const queryClient = useQueryClient();
  const { saveWorkout: saveOfflineWorkout } = useOfflineSync();
  
  // Get all workouts
  const {
    data: workouts = [],
    isLoading,
    error,
    refetch: refreshWorkouts,
  } = useApiQuery<WorkoutPlan[]>(
    ['workouts'],
    async () => {
      // Mock API call
      return [];
    },
    {
      offlineSupport: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  );
  
  // Create workout mutation
  const createWorkoutMutation = useApiMutation<WorkoutPlan, Omit<WorkoutPlan, 'id'>>(
    async (workout) => {
      // Mock API call
      const newWorkout: WorkoutPlan = {
        ...workout,
        id: `workout-${Date.now()}`,
      };
      return newWorkout;
    },
    {
      offlineSupport: true,
      onSuccess: (data) => {
        queryClient.setQueryData<WorkoutPlan[]>(['workouts'], (old = []) => {
          return [...old, data];
        });
        
        toast({
          title: 'Workout Created',
          description: 'Your workout has been created successfully',
          variant: 'default',
        });
      },
      onError: (error) => {
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
      // Mock API call
      const updatedWorkout = { ...workout, id } as WorkoutPlan;
      return updatedWorkout;
    },
    {
      offlineSupport: true,
      onSuccess: (data) => {
        queryClient.setQueryData<WorkoutPlan[]>(['workouts'], (old = []) => {
          return old.map(w => w.id === data.id ? data : w);
        });
        
        toast({
          title: 'Workout Updated',
          description: 'Your workout has been updated successfully',
          variant: 'default',
        });
      },
      onError: (error) => {
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
      // Mock API call
      return;
    },
    {
      offlineSupport: true,
      onSuccess: (_, id) => {
        queryClient.setQueryData<WorkoutPlan[]>(['workouts'], (old = []) => {
          return old.filter(w => w.id !== id);
        });
        
        queryClient.removeQueries({ queryKey: ['workout', id] });
        
        toast({
          title: 'Workout Deleted',
          description: 'Your workout has been deleted successfully',
          variant: 'default',
        });
      },
      onError: (error) => {
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
      await saveOfflineWorkout(workout);
      
      toast({
        title: 'Workout Saved Offline',
        description: 'Your workout has been saved for offline use',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Save Offline Failed',
        description: error instanceof Error ? error.message : 'An error occurred while saving the workout for offline use',
        variant: 'destructive',
      });
      
      throw error;
    }
  }, [saveOfflineWorkout]);
  
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
