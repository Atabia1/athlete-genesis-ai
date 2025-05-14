/**
 * OfflineWorkoutsContext: Context provider for managing offline workouts
 *
 * This context provides functionality for:
 * 1. Storing pre-defined workout templates for offline use
 * 2. Saving and retrieving workouts from IndexedDB
 * 3. Managing the synchronization between online and offline states
 * 4. Providing access to offline workouts when the user has no internet connection
 *
 * The context is used throughout the application to ensure users always have
 * access to workout content, even when offline.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { usePlan } from './PlanContext';
import { dbService, IndexedDBError, IndexedDBErrorType } from '@/services/indexeddb-service';
import { toast } from '@/components/ui/use-toast';
import { useRetryQueue } from '@/hooks/use-retry-queue';
import { RetryOperationType, RetryPriority } from '@/services/retry-queue-service';
import { useSync } from '@/context/SyncContext';
import { WorkoutPlan } from '@/types/workout';
import { standardizeWorkoutPlan } from '@/utils/workout-normalizer';

// Re-export the workout types for backward compatibility
export type { Exercise as ExerciseTemplate } from '@/types/workout';
export type { WorkoutDay as WorkoutDayTemplate } from '@/types/workout';
export type { WorkoutPlan as WorkoutTemplate } from '@/types/workout';

// Define the context interface
interface OfflineWorkoutsContextType {
  offlineWorkouts: WorkoutTemplate[];
  savedWorkouts: WorkoutTemplate[];
  currentOfflineWorkout: WorkoutTemplate | null;
  isLoading: boolean;
  saveCurrentPlanForOffline: () => Promise<void>;
  selectOfflineWorkout: (workoutId: string) => void;
  getSavedWorkoutById: (id: string) => WorkoutTemplate | null;
  deleteSavedWorkout: (id: string) => Promise<void>;
  deleteMultipleSavedWorkouts: (ids: string[]) => Promise<void>;
  clearAllSavedWorkouts: () => Promise<void>;
  saveMultipleWorkouts: (workouts: WorkoutTemplate[]) => Promise<void>;
}

// Create the context
const OfflineWorkoutsContext = createContext<OfflineWorkoutsContextType | undefined>(undefined);

/**
 * OfflineWorkoutsProvider: Context provider component for offline workouts
 * @param children - Child components that will have access to the context
 */
export const OfflineWorkoutsProvider = ({ children }: { children: ReactNode }) => {
  const { isOnline } = useNetworkStatus();
  const { workoutPlan } = usePlan();
  const { addToQueue, registerHandler } = useRetryQueue();
  const { addToSyncQueue } = useSync();

  const [offlineWorkouts, setOfflineWorkouts] = useState<WorkoutTemplate[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutTemplate[]>([]);
  const [currentOfflineWorkout, setCurrentOfflineWorkout] = useState<WorkoutTemplate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Register handlers for retry operations
  useEffect(() => {
    // Register handler for saving workouts
    registerHandler(RetryOperationType.SAVE_WORKOUT, async (payload: WorkoutTemplate) => {
      // Start a transaction for the save operation
      const transaction = await dbService.startTransaction(['savedWorkouts'], 'readwrite');

      try {
        // Add the workout to IndexedDB within the transaction
        await transaction.add('savedWorkouts', payload);

        // Commit the transaction
        dbService.commitTransaction();

        // Update the state with the new saved workout
        setSavedWorkouts(prev => {
          // Check if workout already exists
          const exists = prev.some(w => w.id === payload.id);
          if (exists) return prev;
          return [...prev, payload];
        });

        return { success: true };
      } catch (error) {
        // If there's an error during the transaction, abort it
        dbService.abortTransaction();
        throw error;
      }
    });

    // Register handler for deleting workouts
    registerHandler(RetryOperationType.DELETE_WORKOUT, async (payload: { id: string }) => {
      // Start a transaction for the delete operation
      const transaction = await dbService.startTransaction(['savedWorkouts'], 'readwrite');

      try {
        // Delete the workout from IndexedDB within the transaction
        await transaction.delete('savedWorkouts', payload.id);

        // Commit the transaction
        dbService.commitTransaction();

        // Update the state by removing the deleted workout
        setSavedWorkouts(prev => prev.filter(w => w.id !== payload.id));

        // If the current offline workout is the one being deleted, clear it
        if (currentOfflineWorkout && currentOfflineWorkout.id === payload.id) {
          setCurrentOfflineWorkout(null);
        }

        return { success: true };
      } catch (error) {
        // If there's an error during the transaction, abort it
        dbService.abortTransaction();
        throw error;
      }
    });

    // Register handler for deleting multiple workouts
    registerHandler(RetryOperationType.DELETE_WORKOUT, async (payload: { ids: string[] }) => {
      // Start a transaction for all operations
      const transaction = await dbService.startTransaction(['savedWorkouts'], 'readwrite');

      try {
        // Delete each workout in the transaction
        for (const id of payload.ids) {
          await transaction.delete('savedWorkouts', id);
        }

        // Commit the transaction
        dbService.commitTransaction();

        // Update the state by removing the deleted workouts
        setSavedWorkouts(prev => prev.filter(w => !payload.ids.includes(w.id)));

        // If the current offline workout is one of the deleted ones, clear it
        if (currentOfflineWorkout && payload.ids.includes(currentOfflineWorkout.id)) {
          setCurrentOfflineWorkout(null);
        }

        return { success: true };
      } catch (error) {
        // If there's an error during the transaction, abort it
        dbService.abortTransaction();
        throw error;
      }
    });
  }, []);

  // Initialize IndexedDB and load workout data
  useEffect(() => {
    const initializeDB = async () => {
      try {
        // Check if IndexedDB is supported
        if (!dbService.constructor.isSupported()) {
          toast({
            title: "Offline Storage Not Supported",
            description: "Your browser doesn't support offline storage. Some features may be unavailable.",
            variant: "destructive",
          });
          // Still load pre-defined templates even if IndexedDB isn't supported
          const templates = await loadWorkoutTemplates();
          setOfflineWorkouts(templates);
          setIsLoading(false);
          return;
        }

        // Load pre-defined workout templates
        const templates = await loadWorkoutTemplates();
        setOfflineWorkouts(templates);

        // Load saved workouts from IndexedDB
        const saved = await loadSavedWorkouts();
        setSavedWorkouts(saved);

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing offline workouts:', error);

        // Handle specific errors
        if (error instanceof IndexedDBError) {
          handleIndexedDBError(error, 'loading saved workouts');
        } else {
          toast({
            title: "Error Loading Workouts",
            description: "An unexpected error occurred. Default workouts will still be available.",
            variant: "destructive",
          });
        }

        // Still set offline workouts to ensure users have access to templates
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

  /**
   * Load pre-defined workout templates
   * These are the default workouts available offline
   */
  const loadWorkoutTemplates = async (): Promise<WorkoutTemplate[]> => {
    // In a real implementation, these could be loaded from a JSON file or API
    // For now, we'll define them inline and standardize them
    const templates = [
      {
        id: 'bodyweight-beginner',
        name: 'Bodyweight Basics',
        description: 'A beginner-friendly workout plan using only bodyweight exercises',
        level: 'beginner',
        goals: ['strength', 'endurance'],
        equipment: ['bodyweight'],
        weeklyPlan: [
          {
            day: 'Day 1',
            focus: 'Full Body',
            duration: '30 min',
            warmup: 'Light cardio (jumping jacks, high knees) for 5 minutes',
            exercises: [
              {
                name: 'Push-ups',
                sets: '3',
                reps: '8-10',
                rest: '60 sec',
                notes: 'Modify on knees if needed'
              },
              {
                name: 'Bodyweight Squats',
                sets: '3',
                reps: '12-15',
                rest: '60 sec'
              },
              {
                name: 'Plank',
                sets: '3',
                reps: '30 sec hold',
                rest: '45 sec'
              },
              {
                name: 'Glute Bridges',
                sets: '3',
                reps: '12',
                rest: '45 sec'
              }
            ],
            cooldown: 'Static stretching for major muscle groups, 5 minutes'
          },
          {
            day: 'Day 2',
            focus: 'Rest or Light Activity',
            duration: '20-30 min',
            warmup: 'Light walking for 5 minutes',
            exercises: [
              {
                name: 'Walking',
                sets: '1',
                reps: '20 minutes',
                rest: 'None'
              }
            ],
            cooldown: 'Light stretching, 5 minutes'
          },
          {
            day: 'Day 3',
            focus: 'Full Body',
            duration: '30 min',
            warmup: 'Light cardio (jumping jacks, high knees) for 5 minutes',
            exercises: [
              {
                name: 'Lunges',
                sets: '3',
                reps: '10 each leg',
                rest: '60 sec'
              },
              {
                name: 'Incline Push-ups',
                sets: '3',
                reps: '10-12',
                rest: '60 sec',
                notes: 'Use a bench or sturdy chair'
              },
              {
                name: 'Superman Holds',
                sets: '3',
                reps: '15 sec hold',
                rest: '45 sec'
              },
              {
                name: 'Mountain Climbers',
                sets: '3',
                reps: '30 sec',
                rest: '45 sec'
              }
            ],
            cooldown: 'Static stretching for major muscle groups, 5 minutes'
          },
          {
            day: 'Day 4',
            focus: 'Rest or Light Activity',
            duration: '20-30 min',
            warmup: 'Light walking for 5 minutes',
            exercises: [
              {
                name: 'Walking',
                sets: '1',
                reps: '20 minutes',
                rest: 'None'
              }
            ],
            cooldown: 'Light stretching, 5 minutes'
          },
          {
            day: 'Day 5',
            focus: 'Full Body',
            duration: '30 min',
            warmup: 'Light cardio (jumping jacks, high knees) for 5 minutes',
            exercises: [
              {
                name: 'Bodyweight Squats',
                sets: '3',
                reps: '15',
                rest: '60 sec'
              },
              {
                name: 'Push-ups',
                sets: '3',
                reps: '10-12',
                rest: '60 sec',
                notes: 'Modify on knees if needed'
              },
              {
                name: 'Bird Dogs',
                sets: '3',
                reps: '10 each side',
                rest: '45 sec'
              },
              {
                name: 'Lying Leg Raises',
                sets: '3',
                reps: '12',
                rest: '45 sec'
              }
            ],
            cooldown: 'Static stretching for major muscle groups, 5 minutes'
          },
          {
            day: 'Day 6',
            focus: 'Active Recovery',
            duration: '30-45 min',
            warmup: 'Light walking for 5 minutes',
            exercises: [
              {
                name: 'Walking or Light Hiking',
                sets: '1',
                reps: '30 minutes',
                rest: 'None'
              }
            ],
            cooldown: 'Full body stretching routine, 10 minutes'
          },
          {
            day: 'Day 7',
            focus: 'Rest Day',
            duration: 'N/A',
            warmup: 'N/A',
            exercises: [],
            cooldown: 'N/A'
          }
        ]
      },
      {
        id: 'home-intermediate',
        name: 'Home Strength Builder',
        description: 'An intermediate workout plan for building strength with minimal equipment',
        level: 'intermediate',
        goals: ['strength', 'muscle'],
        equipment: ['basic-home'],
        weeklyPlan: [
          {
            day: 'Day 1',
            focus: 'Upper Body',
            duration: '45 min',
            warmup: 'Dynamic stretching and light cardio for 5-7 minutes',
            exercises: [
              {
                name: 'Push-ups',
                sets: '4',
                reps: '12-15',
                rest: '60 sec'
              },
              {
                name: 'Dumbbell Rows',
                sets: '4',
                reps: '10-12 each arm',
                rest: '60 sec',
                notes: 'Use water bottles or other household items if no dumbbells'
              },
              {
                name: 'Tricep Dips',
                sets: '3',
                reps: '12',
                rest: '60 sec',
                notes: 'Use a sturdy chair or couch'
              },
              {
                name: 'Lateral Raises',
                sets: '3',
                reps: '12-15',
                rest: '45 sec',
                notes: 'Use water bottles or other household items if no dumbbells'
              },
              {
                name: 'Plank',
                sets: '3',
                reps: '45 sec hold',
                rest: '45 sec'
              }
            ],
            cooldown: 'Static stretching for upper body, 5-7 minutes'
          },
          {
            day: 'Day 2',
            focus: 'Lower Body',
            duration: '45 min',
            warmup: 'Dynamic stretching and light cardio for 5-7 minutes',
            exercises: [
              {
                name: 'Goblet Squats',
                sets: '4',
                reps: '15',
                rest: '60 sec',
                notes: 'Use a heavy book, backpack, or other weighted item'
              },
              {
                name: 'Lunges',
                sets: '3',
                reps: '12 each leg',
                rest: '60 sec'
              },
              {
                name: 'Single-Leg Romanian Deadlifts',
                sets: '3',
                reps: '10 each leg',
                rest: '60 sec',
                notes: 'Use household items for weight if available'
              },
              {
                name: 'Calf Raises',
                sets: '3',
                reps: '20',
                rest: '45 sec'
              },
              {
                name: 'Glute Bridges',
                sets: '3',
                reps: '15',
                rest: '45 sec'
              }
            ],
            cooldown: 'Static stretching for lower body, 5-7 minutes'
          },
          {
            day: 'Day 3',
            focus: 'Rest or Light Activity',
            duration: '30 min',
            warmup: 'Light walking for 5 minutes',
            exercises: [
              {
                name: 'Walking or Light Cardio',
                sets: '1',
                reps: '20-30 minutes',
                rest: 'None'
              }
            ],
            cooldown: 'Light full body stretching, 5 minutes'
          },
          {
            day: 'Day 4',
            focus: 'Full Body HIIT',
            duration: '30-40 min',
            warmup: 'Dynamic stretching and light cardio for 5 minutes',
            exercises: [
              {
                name: 'Burpees',
                sets: '4',
                reps: '10',
                rest: '30 sec'
              },
              {
                name: 'Mountain Climbers',
                sets: '4',
                reps: '30 sec',
                rest: '30 sec'
              },
              {
                name: 'Squat Jumps',
                sets: '4',
                reps: '12',
                rest: '30 sec'
              },
              {
                name: 'Push-up to Side Plank',
                sets: '4',
                reps: '6 each side',
                rest: '30 sec'
              },
              {
                name: 'High Knees',
                sets: '4',
                reps: '30 sec',
                rest: '30 sec'
              }
            ],
            cooldown: 'Static stretching for full body, 5-7 minutes'
          },
          {
            day: 'Day 5',
            focus: 'Upper Body',
            duration: '45 min',
            warmup: 'Dynamic stretching and light cardio for 5-7 minutes',
            exercises: [
              {
                name: 'Decline Push-ups',
                sets: '4',
                reps: '10-12',
                rest: '60 sec',
                notes: 'Feet elevated on a chair or couch'
              },
              {
                name: 'Dumbbell Curls',
                sets: '3',
                reps: '12',
                rest: '45 sec',
                notes: 'Use water bottles or other household items if no dumbbells'
              },
              {
                name: 'Diamond Push-ups',
                sets: '3',
                reps: '10',
                rest: '60 sec'
              },
              {
                name: 'Superman Holds',
                sets: '3',
                reps: '30 sec hold',
                rest: '45 sec'
              },
              {
                name: 'Pike Push-ups',
                sets: '3',
                reps: '10',
                rest: '60 sec'
              }
            ],
            cooldown: 'Static stretching for upper body, 5-7 minutes'
          },
          {
            day: 'Day 6',
            focus: 'Lower Body',
            duration: '45 min',
            warmup: 'Dynamic stretching and light cardio for 5-7 minutes',
            exercises: [
              {
                name: 'Jump Squats',
                sets: '4',
                reps: '15',
                rest: '60 sec'
              },
              {
                name: 'Walking Lunges',
                sets: '3',
                reps: '10 each leg',
                rest: '60 sec'
              },
              {
                name: 'Wall Sit',
                sets: '3',
                reps: '45 sec hold',
                rest: '45 sec'
              },
              {
                name: 'Side Lunges',
                sets: '3',
                reps: '10 each side',
                rest: '60 sec'
              },
              {
                name: 'Single-Leg Glute Bridges',
                sets: '3',
                reps: '12 each leg',
                rest: '45 sec'
              }
            ],
            cooldown: 'Static stretching for lower body, 5-7 minutes'
          },
          {
            day: 'Day 7',
            focus: 'Rest Day',
            duration: 'N/A',
            warmup: 'N/A',
            exercises: [],
            cooldown: 'N/A'
          }
        ]
      }
    ];

    // Standardize all templates to ensure consistent structure
    return templates.map(template => standardizeWorkoutPlan(template)!).filter(Boolean);
  };

  /**
   * Load saved workouts from IndexedDB using the enhanced service
   * @returns Promise that resolves with saved workouts or empty array on error
   */
  const loadSavedWorkouts = async (): Promise<WorkoutTemplate[]> => {
    try {
      const savedWorkouts = await dbService.getAll<WorkoutTemplate>('savedWorkouts');
      // Standardize all saved workouts to ensure consistent structure
      return savedWorkouts.map(workout => standardizeWorkoutPlan(workout)!).filter(Boolean);
    } catch (error) {
      if (error instanceof IndexedDBError) {
        handleIndexedDBError(error, 'loading saved workouts');
      } else {
        console.error('Unexpected error loading saved workouts:', error);
        toast({
          title: "Error Loading Saved Workouts",
          description: "An unexpected error occurred. Default workouts will still be available.",
          variant: "destructive",
        });
      }
      return [];
    }
  };

  /**
   * Handle IndexedDB errors with appropriate user feedback
   * @param error The IndexedDB error
   * @param operation Description of the operation that failed
   */
  const handleIndexedDBError = (error: IndexedDBError, operation: string) => {
    console.error(`IndexedDB error (${operation}):`, error);

    // Handle specific error types with appropriate messages
    switch (error.type) {
      case IndexedDBErrorType.DATABASE_FAILED_TO_OPEN:
        toast({
          title: "Storage Access Error",
          description: "Could not access offline storage. Some features may be unavailable.",
          variant: "destructive",
        });
        break;

      case IndexedDBErrorType.QUOTA_EXCEEDED:
        toast({
          title: "Storage Full",
          description: "Your device storage is full. Please free up space to save workouts offline.",
          variant: "destructive",
        });
        break;

      case IndexedDBErrorType.STORE_NOT_FOUND:
        toast({
          title: "Storage Configuration Error",
          description: "There was an error with the storage configuration. Default workouts will still be available.",
          variant: "destructive",
        });
        break;

      case IndexedDBErrorType.VALIDATION_ERROR:
        toast({
          title: "Data Validation Error",
          description: error.message || "The workout data is invalid and cannot be saved.",
          variant: "destructive",
        });
        break;

      default:
        toast({
          title: `Error ${operation}`,
          description: error.message,
          variant: "destructive",
        });
    }
  };

  /**
   * Save the current workout plan for offline use
   * Uses the retry queue system to handle offline scenarios
   */
  const saveCurrentPlanForOffline = async (): Promise<void> => {
    if (!workoutPlan) {
      toast({
        title: "No Workout Plan",
        description: "There is no workout plan to save for offline use.",
        variant: "destructive",
      });
      return;
    }

    // Generate a unique ID and standardize the workout plan
    const savedWorkout = standardizeWorkoutPlan({
      ...workoutPlan,
      id: `saved-${Date.now()}`,
      name: workoutPlan.name || `Workout Plan ${savedWorkouts.length + 1}`,
      description: workoutPlan.description || 'Saved workout plan',
      createdAt: new Date().toISOString() // Add creation timestamp
    });

    try {
      if (isOnline) {
        // If online, try to save directly
        try {
          // Start a transaction for the save operation
          const transaction = await dbService.startTransaction(['savedWorkouts'], 'readwrite');

          try {
            // Add the workout to IndexedDB within the transaction
            await transaction.add('savedWorkouts', savedWorkout);

            // Commit the transaction
            dbService.commitTransaction();

            // Update the state with the new saved workout
            setSavedWorkouts([...savedWorkouts, savedWorkout]);

            // Show success message
            toast({
              title: "Workout Saved",
              description: "Your workout plan is now available offline",
            });
          } catch (transactionError) {
            // If there's an error during the transaction, abort it
            dbService.abortTransaction();
            throw transactionError; // Re-throw to be caught by the outer catch
          }
        } catch (error) {
          // If direct save fails, add to retry queue
          await addToQueue(
            RetryOperationType.SAVE_WORKOUT,
            savedWorkout,
            RetryPriority.HIGH
          );

          // Add to sync queue to show sync indicator
          addToSyncQueue(RetryOperationType.SAVE_WORKOUT, savedWorkout);

          // Show message about queuing
          toast({
            title: "Workout Queued",
            description: "Your workout will be saved when the connection improves.",
          });

          // Also handle specific errors
          if (error instanceof IndexedDBError) {
            handleIndexedDBError(error, 'saving workout');

            // For quota exceeded errors, offer to clear storage
            if (error.type === IndexedDBErrorType.QUOTA_EXCEEDED) {
              toast({
                title: "Storage Full",
                description: "Try deleting some saved workouts to free up space.",
                variant: "destructive",
              });
            }
          }
        }
      } else {
        // If offline, add to retry queue immediately
        await addToQueue(
          RetryOperationType.SAVE_WORKOUT,
          savedWorkout,
          RetryPriority.HIGH
        );

        // Add to sync queue to show sync indicator
        addToSyncQueue(RetryOperationType.SAVE_WORKOUT, savedWorkout);

        // Show message about queuing
        toast({
          title: "Workout Queued",
          description: "Your workout will be saved when you're back online.",
        });

        // Optimistically update the UI
        setSavedWorkouts([...savedWorkouts, savedWorkout]);
      }
    } catch (error) {
      console.error('Unexpected error saving workout:', error);
      toast({
        title: "Error Saving Workout",
        description: "An unexpected error occurred while saving your workout.",
        variant: "destructive",
      });
    }
  };

  /**
   * Select an offline workout to display
   */
  const selectOfflineWorkout = (workoutId: string) => {
    // First check saved workouts
    let workout = savedWorkouts.find(w => w.id === workoutId);

    // If not found in saved workouts, check pre-defined templates
    if (!workout) {
      workout = offlineWorkouts.find(w => w.id === workoutId) || null;
    }

    setCurrentOfflineWorkout(workout);
  };

  /**
   * Get a saved workout by ID
   */
  const getSavedWorkoutById = (id: string): WorkoutTemplate | null => {
    return savedWorkouts.find(w => w.id === id) || null;
  };

  /**
   * Delete a saved workout using the retry queue system
   * @param id The ID of the workout to delete
   */
  const deleteSavedWorkout = async (id: string): Promise<void> => {
    try {
      if (isOnline) {
        // If online, try to delete directly
        try {
          // Start a transaction for the delete operation
          const transaction = await dbService.startTransaction(['savedWorkouts'], 'readwrite');

          try {
            // Delete the workout from IndexedDB within the transaction
            await transaction.delete('savedWorkouts', id);

            // Commit the transaction
            dbService.commitTransaction();

            // Update the state by removing the deleted workout
            setSavedWorkouts(savedWorkouts.filter(w => w.id !== id));

            // If the current offline workout is the one being deleted, clear it
            if (currentOfflineWorkout && currentOfflineWorkout.id === id) {
              setCurrentOfflineWorkout(null);
            }

            // Show success message
            toast({
              title: "Workout Deleted",
              description: "The saved workout has been removed",
            });
          } catch (transactionError) {
            // If there's an error during the transaction, abort it
            dbService.abortTransaction();
            throw transactionError; // Re-throw to be caught by the outer catch
          }
        } catch (error) {
          // If direct delete fails, add to retry queue
          await addToQueue(
            RetryOperationType.DELETE_WORKOUT,
            { id },
            RetryPriority.MEDIUM
          );

          // Add to sync queue to show sync indicator
          addToSyncQueue(RetryOperationType.DELETE_WORKOUT, { id });

          // Show message about queuing
          toast({
            title: "Delete Operation Queued",
            description: "The workout will be deleted when the connection improves.",
          });

          // Also handle specific errors
          if (error instanceof IndexedDBError) {
            handleIndexedDBError(error, 'deleting workout');
          }

          // Optimistically update the UI
          setSavedWorkouts(savedWorkouts.filter(w => w.id !== id));

          // If the current offline workout is the one being deleted, clear it
          if (currentOfflineWorkout && currentOfflineWorkout.id === id) {
            setCurrentOfflineWorkout(null);
          }
        }
      } else {
        // If offline, add to retry queue immediately
        await addToQueue(
          RetryOperationType.DELETE_WORKOUT,
          { id },
          RetryPriority.MEDIUM
        );

        // Add to sync queue to show sync indicator
        addToSyncQueue(RetryOperationType.DELETE_WORKOUT, { id });

        // Show message about queuing
        toast({
          title: "Delete Operation Queued",
          description: "The workout will be deleted when you're back online.",
        });

        // Optimistically update the UI
        setSavedWorkouts(savedWorkouts.filter(w => w.id !== id));

        // If the current offline workout is the one being deleted, clear it
        if (currentOfflineWorkout && currentOfflineWorkout.id === id) {
          setCurrentOfflineWorkout(null);
        }
      }
    } catch (error) {
      console.error('Unexpected error deleting workout:', error);
      toast({
        title: "Error Deleting Workout",
        description: "An unexpected error occurred while deleting the workout.",
        variant: "destructive",
      });
    }
  };

  /**
   * Delete multiple saved workouts using the retry queue system
   * @param ids Array of workout IDs to delete
   */
  const deleteMultipleSavedWorkouts = async (ids: string[]): Promise<void> => {
    if (ids.length === 0) return;

    try {
      if (isOnline) {
        // If online, try to delete directly
        try {
          // Start a transaction for all operations
          const transaction = await dbService.startTransaction(['savedWorkouts'], 'readwrite');

          try {
            // Delete each workout in the transaction
            for (const id of ids) {
              await transaction.delete('savedWorkouts', id);
            }

            // Commit the transaction
            dbService.commitTransaction();

            // Update the state by removing the deleted workouts
            setSavedWorkouts(savedWorkouts.filter(w => !ids.includes(w.id)));

            // If the current offline workout is one of the deleted ones, clear it
            if (currentOfflineWorkout && ids.includes(currentOfflineWorkout.id)) {
              setCurrentOfflineWorkout(null);
            }

            // Show success message
            toast({
              title: "Workouts Deleted",
              description: `${ids.length} workouts have been removed`,
            });
          } catch (transactionError) {
            // If there's an error during the transaction, abort it
            dbService.abortTransaction();
            throw transactionError; // Re-throw to be caught by the outer catch
          }
        } catch (error) {
          // If direct delete fails, add to retry queue
          await addToQueue(
            RetryOperationType.DELETE_WORKOUT,
            { ids },
            RetryPriority.MEDIUM
          );

          // Add to sync queue to show sync indicator
          addToSyncQueue(RetryOperationType.DELETE_WORKOUT, { ids });

          // Show message about queuing
          toast({
            title: "Delete Operations Queued",
            description: `${ids.length} workouts will be deleted when the connection improves.`,
          });

          // Also handle specific errors
          if (error instanceof IndexedDBError) {
            handleIndexedDBError(error, 'deleting multiple workouts');
          }

          // Optimistically update the UI
          setSavedWorkouts(savedWorkouts.filter(w => !ids.includes(w.id)));

          // If the current offline workout is one of the deleted ones, clear it
          if (currentOfflineWorkout && ids.includes(currentOfflineWorkout.id)) {
            setCurrentOfflineWorkout(null);
          }
        }
      } else {
        // If offline, add to retry queue immediately
        await addToQueue(
          RetryOperationType.DELETE_WORKOUT,
          { ids },
          RetryPriority.MEDIUM
        );

        // Add to sync queue to show sync indicator
        addToSyncQueue(RetryOperationType.DELETE_WORKOUT, { ids });

        // Show message about queuing
        toast({
          title: "Delete Operations Queued",
          description: `${ids.length} workouts will be deleted when you're back online.`,
        });

        // Optimistically update the UI
        setSavedWorkouts(savedWorkouts.filter(w => !ids.includes(w.id)));

        // If the current offline workout is one of the deleted ones, clear it
        if (currentOfflineWorkout && ids.includes(currentOfflineWorkout.id)) {
          setCurrentOfflineWorkout(null);
        }

        // Clear selection
        setSelectedWorkouts([]);
      }
    } catch (error) {
      console.error('Unexpected error deleting workouts:', error);
      toast({
        title: "Error Deleting Workouts",
        description: "An unexpected error occurred while deleting the workouts.",
        variant: "destructive",
      });
    }
  };

  /**
   * Clear all saved workouts from storage
   * Useful when storage quota is exceeded
   */
  const clearAllSavedWorkouts = async (): Promise<void> => {
    try {
      // Start a transaction for the clear operation
      const transaction = await dbService.startTransaction(['savedWorkouts'], 'readwrite');

      try {
        // Clear all workouts from IndexedDB
        await transaction.clear('savedWorkouts');

        // Commit the transaction
        dbService.commitTransaction();

        // Update the state
        setSavedWorkouts([]);

        // If the current offline workout is a saved one, clear it
        if (currentOfflineWorkout && currentOfflineWorkout.id.startsWith('saved-')) {
          setCurrentOfflineWorkout(null);
        }

        // Show success message
        toast({
          title: "Storage Cleared",
          description: "All saved workouts have been removed from offline storage.",
        });
      } catch (transactionError) {
        // If there's an error during the transaction, abort it
        dbService.abortTransaction();
        throw transactionError; // Re-throw to be caught by the outer catch
      }
    } catch (error) {
      if (error instanceof IndexedDBError) {
        handleIndexedDBError(error, 'clearing storage');
      } else {
        console.error('Unexpected error clearing storage:', error);
        toast({
          title: "Error Clearing Storage",
          description: "An unexpected error occurred while clearing storage.",
          variant: "destructive",
        });
      }
    }
  };

  /**
   * Save multiple workout plans in a single transaction
   * @param workouts Array of workout plans to save
   */
  const saveMultipleWorkouts = async (workouts: WorkoutTemplate[]): Promise<void> => {
    if (workouts.length === 0) return;

    try {
      // Start a transaction for all operations
      const transaction = await dbService.startTransaction(['savedWorkouts'], 'readwrite');

      try {
        // Add each workout in the transaction
        for (const workout of workouts) {
          // Make sure each workout has a unique ID and creation timestamp
          // and standardize it to ensure consistent structure
          const workoutToSave = standardizeWorkoutPlan({
            ...workout,
            id: workout.id || `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: workout.createdAt || new Date().toISOString()
          });

          // Only add valid workouts
          if (workoutToSave) {
            await transaction.add('savedWorkouts', workoutToSave);
          } else {
            console.error('Invalid workout data, skipping:', workout);
          }
        }

        // Commit the transaction
        dbService.commitTransaction();

        // Update the state with the new saved workouts
        const updatedWorkouts = await dbService.getAll<WorkoutTemplate>('savedWorkouts');
        setSavedWorkouts(updatedWorkouts);

        // Show success message
        toast({
          title: "Workouts Saved",
          description: `${workouts.length} workouts have been saved for offline use`,
        });
      } catch (transactionError) {
        // If there's an error during the transaction, abort it
        dbService.abortTransaction();
        throw transactionError; // Re-throw to be caught by the outer catch
      }
    } catch (error) {
      if (error instanceof IndexedDBError) {
        handleIndexedDBError(error, 'saving multiple workouts');
      } else {
        console.error('Unexpected error saving workouts:', error);
        toast({
          title: "Error Saving Workouts",
          description: "An unexpected error occurred while saving the workouts.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <OfflineWorkoutsContext.Provider
      value={{
        offlineWorkouts,
        savedWorkouts,
        currentOfflineWorkout,
        isLoading,
        saveCurrentPlanForOffline,
        selectOfflineWorkout,
        getSavedWorkoutById,
        deleteSavedWorkout,
        deleteMultipleSavedWorkouts,
        clearAllSavedWorkouts,
        saveMultipleWorkouts
      }}
    >
      {children}
    </OfflineWorkoutsContext.Provider>
  );
};

/**
 * Custom hook to access the OfflineWorkoutsContext
 * @returns The complete OfflineWorkoutsContext object
 */
export const useOfflineWorkouts = (): OfflineWorkoutsContextType => {
  const context = useContext(OfflineWorkoutsContext);
  if (context === undefined) {
    throw new Error('useOfflineWorkouts must be used within an OfflineWorkoutsProvider');
  }
  return context;
};
