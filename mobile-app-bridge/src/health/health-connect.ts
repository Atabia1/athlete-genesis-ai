/**
 * Health Connect API Integration
 * 
 * This file provides integration with the Health Connect API on Android devices.
 * It uses the @kingstinct/react-native-health-connect package to access health data.
 */

import {
  initialize,
  requestPermission,
  readRecords,
  insertRecords,
  getGrantedPermissions,
  isAvailable,
  RecordType,
  TimeRangeFilter,
  AggregationType,
  readAggregatedData
} from '@kingstinct/react-native-health-connect';
import { HealthData, HealthWorkout } from '../types/health';

// Define the permissions we need
const PERMISSIONS = [
  { accessType: 'read', recordType: RecordType.STEPS },
  { accessType: 'read', recordType: RecordType.DISTANCE },
  { accessType: 'read', recordType: RecordType.TOTAL_CALORIES_BURNED },
  { accessType: 'read', recordType: RecordType.HEART_RATE },
  { accessType: 'read', recordType: RecordType.RESTING_HEART_RATE },
  { accessType: 'read', recordType: RecordType.SLEEP_SESSION },
  { accessType: 'read', recordType: RecordType.WEIGHT },
  { accessType: 'read', recordType: RecordType.HEIGHT },
  { accessType: 'read', recordType: RecordType.BLOOD_PRESSURE },
  { accessType: 'read', recordType: RecordType.BLOOD_GLUCOSE },
  { accessType: 'read', recordType: RecordType.OXYGEN_SATURATION },
  { accessType: 'read', recordType: RecordType.EXERCISE_SESSION },
  { accessType: 'write', recordType: RecordType.EXERCISE_SESSION },
  { accessType: 'write', recordType: RecordType.STEPS },
  { accessType: 'write', recordType: RecordType.DISTANCE },
  { accessType: 'write', recordType: RecordType.TOTAL_CALORIES_BURNED },
];

/**
 * Initialize Health Connect API
 * @returns Promise that resolves when Health Connect is initialized
 */
export const initHealthConnect = async (): Promise<void> => {
  try {
    // Initialize the Health Connect API
    await initialize();
    
    // Request permissions
    const granted = await requestPermission(PERMISSIONS);
    
    if (!granted) {
      throw new Error('Health Connect permissions not granted');
    }
  } catch (error) {
    console.error('Error initializing Health Connect:', error);
    throw error;
  }
};

/**
 * Check if Health Connect API is available on this device
 * @returns Promise that resolves with a boolean indicating if Health Connect is available
 */
export const isHealthConnectAvailable = async (): Promise<boolean> => {
  try {
    return await isAvailable();
  } catch (error) {
    console.error('Error checking Health Connect availability:', error);
    return false;
  }
};

/**
 * Fetch health data from Health Connect API
 * @param startDate Start date for the data range
 * @param endDate End date for the data range
 * @returns Promise that resolves with the health data
 */
export const fetchHealthData = async (
  startDate: Date,
  endDate: Date
): Promise<HealthData> => {
  try {
    // Initialize Health Connect if not already initialized
    await initHealthConnect();
    
    // Create time range filter
    const timeRangeFilter: TimeRangeFilter = {
      operator: 'between',
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    };
    
    // Fetch steps
    const steps = await fetchSteps(timeRangeFilter);
    
    // Fetch distance
    const distance = await fetchDistance(timeRangeFilter);
    
    // Fetch calories
    const calories = await fetchCalories(timeRangeFilter);
    
    // Fetch heart rate
    const heartRate = await fetchHeartRate(timeRangeFilter);
    
    // Fetch sleep
    const sleep = await fetchSleep(timeRangeFilter);
    
    // Fetch workouts
    const workouts = await fetchWorkouts(timeRangeFilter);
    
    // Fetch weight
    const weight = await fetchWeight();
    
    // Fetch height
    const height = await fetchHeight();
    
    // Fetch blood pressure
    const bloodPressure = await fetchBloodPressure(timeRangeFilter);
    
    // Fetch blood glucose
    const bloodGlucose = await fetchBloodGlucose(timeRangeFilter);
    
    // Fetch oxygen saturation
    const oxygenSaturation = await fetchOxygenSaturation(timeRangeFilter);
    
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
      source: 'samsung_health',
    };
  } catch (error) {
    console.error('Error fetching health data:', error);
    throw error;
  }
};

/**
 * Fetch steps from Health Connect API
 * @param timeRangeFilter Time range filter for the query
 * @returns Promise that resolves with the step count
 */
const fetchSteps = async (timeRangeFilter: TimeRangeFilter): Promise<number> => {
  try {
    // Use aggregated data for steps
    const result = await readAggregatedData({
      aggregationType: AggregationType.SUM,
      dataType: RecordType.STEPS,
      timeRangeFilter,
    });
    
    return result?.result || 0;
  } catch (error) {
    console.error('Error fetching steps:', error);
    return 0;
  }
};

// Additional fetch functions for other health metrics...
// These would be implemented similarly to fetchSteps

/**
 * Sync a workout to Health Connect API
 * @param workout The workout to sync
 * @returns Promise that resolves when the workout is synced
 */
export const syncWorkout = async (workout: HealthWorkout): Promise<boolean> => {
  try {
    // Initialize Health Connect if not already initialized
    await initHealthConnect();
    
    // Map workout type to Health Connect exercise type
    const exerciseType = mapWorkoutType(workout.type);
    
    // Create the exercise session record
    const exerciseSession = {
      recordType: RecordType.EXERCISE_SESSION,
      startTime: workout.startDate.toISOString(),
      endTime: workout.endDate.toISOString(),
      exerciseType,
      title: workout.name || workout.type,
      energy: {
        inCalories: workout.calories,
      },
      distance: workout.distance ? {
        inMeters: workout.distance,
      } : undefined,
      metadata: {
        id: workout.id || `workout-${Date.now()}`,
      },
    };
    
    // Insert the exercise session record
    await insertRecords([exerciseSession]);
    
    return true;
  } catch (error) {
    console.error('Error syncing workout:', error);
    return false;
  }
};

/**
 * Map workout type to Health Connect exercise type
 * @param type The workout type
 * @returns The Health Connect exercise type
 */
const mapWorkoutType = (type: string): string => {
  // Map workout types to Health Connect exercise types
  const workoutTypeMap: Record<string, string> = {
    running: 'running',
    cycling: 'biking',
    walking: 'walking',
    swimming: 'swimming',
    // Add more mappings as needed
  };
  
  // Return the mapped type or a default type
  return workoutTypeMap[type.toLowerCase()] || 'other';
};

// Export the Health Connect provider
export const healthConnectProvider = {
  name: 'Health Connect',
  isAvailable: isHealthConnectAvailable,
  requestPermissions: initHealthConnect,
  fetchHealthData,
  syncWorkout,
};
