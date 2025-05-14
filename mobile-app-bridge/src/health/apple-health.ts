/**
 * Apple HealthKit Integration
 * 
 * This file provides integration with Apple HealthKit on iOS devices.
 * It uses the react-native-health package to access health data.
 */

import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
  HealthUnit,
  HealthValue,
  HealthObserver
} from 'react-native-health';
import { HealthData, HealthWorkout } from '../types/health';

// Define the permissions we need
const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.DistanceWalking,
      AppleHealthKit.Constants.Permissions.DistanceRunning,
      AppleHealthKit.Constants.Permissions.DistanceCycling,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.RestingHeartRate,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.Weight,
      AppleHealthKit.Constants.Permissions.Height,
      AppleHealthKit.Constants.Permissions.BloodPressureDiastolic,
      AppleHealthKit.Constants.Permissions.BloodPressureSystolic,
      AppleHealthKit.Constants.Permissions.BloodGlucose,
      AppleHealthKit.Constants.Permissions.OxygenSaturation,
      AppleHealthKit.Constants.Permissions.Workout,
    ],
    write: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.DistanceWalking,
      AppleHealthKit.Constants.Permissions.DistanceRunning,
      AppleHealthKit.Constants.Permissions.DistanceCycling,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.Workout,
    ],
  },
};

/**
 * Initialize Apple HealthKit
 * @returns Promise that resolves when HealthKit is initialized
 */
export const initHealthKit = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (error) {
        reject(new Error(error));
        return;
      }
      resolve();
    });
  });
};

/**
 * Check if Apple HealthKit is available on this device
 * @returns Promise that resolves with a boolean indicating if HealthKit is available
 */
export const isHealthKitAvailable = (): Promise<boolean> => {
  return new Promise((resolve) => {
    AppleHealthKit.isAvailable((error: string, available: boolean) => {
      if (error) {
        resolve(false);
        return;
      }
      resolve(available);
    });
  });
};

/**
 * Fetch health data from Apple HealthKit
 * @param startDate Start date for the data range
 * @param endDate End date for the data range
 * @returns Promise that resolves with the health data
 */
export const fetchHealthData = async (
  startDate: Date,
  endDate: Date
): Promise<HealthData> => {
  try {
    // Initialize HealthKit if not already initialized
    await initHealthKit();
    
    // Create options for the date range
    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
    
    // Fetch steps
    const steps = await fetchSteps(options);
    
    // Fetch distance
    const distance = await fetchDistance(options);
    
    // Fetch calories
    const calories = await fetchCalories(options);
    
    // Fetch heart rate
    const heartRate = await fetchHeartRate(options);
    
    // Fetch sleep
    const sleep = await fetchSleep(options);
    
    // Fetch workouts
    const workouts = await fetchWorkouts(options);
    
    // Fetch weight
    const weight = await fetchWeight();
    
    // Fetch height
    const height = await fetchHeight();
    
    // Fetch blood pressure
    const bloodPressure = await fetchBloodPressure(options);
    
    // Fetch blood glucose
    const bloodGlucose = await fetchBloodGlucose(options);
    
    // Fetch oxygen saturation
    const oxygenSaturation = await fetchOxygenSaturation(options);
    
    // Return the combined health data
    return {
      steps,
      distance,
      calories,
      heartRate,
      sleep,
      workouts,
      weight,
      height,
      bloodPressure,
      bloodGlucose,
      oxygenSaturation,
      lastSyncDate: new Date(),
      source: 'apple_health',
    };
  } catch (error) {
    console.error('Error fetching health data:', error);
    throw error;
  }
};

/**
 * Fetch steps from Apple HealthKit
 * @param options Options for the query
 * @returns Promise that resolves with the step count
 */
const fetchSteps = (options: any): Promise<number> => {
  return new Promise((resolve) => {
    AppleHealthKit.getStepCount(
      options,
      (error: string, results: { value: number }) => {
        if (error) {
          console.error('Error fetching steps:', error);
          resolve(0);
          return;
        }
        resolve(results.value);
      }
    );
  });
};

// Additional fetch functions for other health metrics...
// These would be implemented similarly to fetchSteps

/**
 * Sync a workout to Apple HealthKit
 * @param workout The workout to sync
 * @returns Promise that resolves when the workout is synced
 */
export const syncWorkout = async (workout: HealthWorkout): Promise<boolean> => {
  try {
    // Initialize HealthKit if not already initialized
    await initHealthKit();
    
    // Map workout type to Apple HealthKit workout type
    const workoutType = mapWorkoutType(workout.type);
    
    // Create the workout options
    const options = {
      type: workoutType,
      startDate: workout.startDate.toISOString(),
      endDate: workout.endDate.toISOString(),
      energyBurned: workout.calories,
      distance: workout.distance || 0,
      metadata: {
        HKExternalUUID: workout.id || `workout-${Date.now()}`,
      },
    };
    
    // Save the workout to HealthKit
    return new Promise((resolve) => {
      AppleHealthKit.saveWorkout(options, (error: string) => {
        if (error) {
          console.error('Error saving workout:', error);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  } catch (error) {
    console.error('Error syncing workout:', error);
    return false;
  }
};

/**
 * Map workout type to Apple HealthKit workout type
 * @param type The workout type
 * @returns The Apple HealthKit workout type
 */
const mapWorkoutType = (type: string): number => {
  // Map workout types to Apple HealthKit workout types
  const workoutTypeMap: Record<string, number> = {
    running: AppleHealthKit.Constants.Activities.Running,
    cycling: AppleHealthKit.Constants.Activities.Cycling,
    walking: AppleHealthKit.Constants.Activities.Walking,
    swimming: AppleHealthKit.Constants.Activities.Swimming,
    // Add more mappings as needed
  };
  
  // Return the mapped type or a default type
  return workoutTypeMap[type.toLowerCase()] || AppleHealthKit.Constants.Activities.Other;
};

// Export the Apple HealthKit provider
export const appleHealthProvider = {
  name: 'Apple Health',
  isAvailable: isHealthKitAvailable,
  requestPermissions: initHealthKit,
  fetchHealthData,
  syncWorkout,
};
