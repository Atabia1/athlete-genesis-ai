/**
 * Google Fit Integration
 *
 * This file provides integration with Google Fit on Android devices.
 * It uses the react-native-google-fit package to access health data.
 */

import GoogleFit, {
  Scopes,
  BucketUnit,
  ActivityType,
  HealthDataTypes,
  HealthDataConfig
} from 'react-native-google-fit';
import { HealthData, HealthWorkout } from '../types/health';

// Define the permissions needed for Google Fit
const permissions = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_ACTIVITY_WRITE,
    Scopes.FITNESS_BODY_READ,
    Scopes.FITNESS_BODY_WRITE,
    Scopes.FITNESS_BLOOD_PRESSURE_READ,
    Scopes.FITNESS_BLOOD_PRESSURE_WRITE,
    Scopes.FITNESS_BLOOD_GLUCOSE_READ,
    Scopes.FITNESS_BLOOD_GLUCOSE_WRITE,
    Scopes.FITNESS_NUTRITION_READ,
    Scopes.FITNESS_NUTRITION_WRITE,
    Scopes.FITNESS_HEART_RATE_READ,
    Scopes.FITNESS_HEART_RATE_WRITE,
    Scopes.FITNESS_SLEEP_READ,
    Scopes.FITNESS_OXYGEN_SATURATION_READ,
    Scopes.FITNESS_OXYGEN_SATURATION_WRITE
  ]
};

/**
 * Check if Google Fit is available on this device
 * @returns Promise that resolves with a boolean indicating if Google Fit is available
 */
export const isGoogleFitAvailable = async (): Promise<boolean> => {
  try {
    const result = await GoogleFit.checkIsAuthorized();
    return result.isAuth;
  } catch (error) {
    console.error('Error checking Google Fit availability:', error);
    return false;
  }
};

/**
 * Initialize Google Fit and request permissions
 * @returns Promise that resolves when Google Fit is initialized
 */
export const initGoogleFit = async (): Promise<void> => {
  try {
    const authResult = await GoogleFit.authorize(permissions);

    if (!authResult.success) {
      throw new Error('Failed to authorize Google Fit');
    }

    // Initialize Google Fit
    await GoogleFit.startRecording({
      dataTypes: [
        'step_count',
        'distance',
        'calories',
        'heart_rate',
        'activity'
      ]
    });
  } catch (error) {
    console.error('Error initializing Google Fit:', error);
    throw error;
  }
};

/**
 * Fetch health data from Google Fit
 * @param startDate Start date for the data range
 * @param endDate End date for the data range
 * @returns Promise that resolves with the health data
 */
export const fetchHealthData = async (
  startDate: Date,
  endDate: Date
): Promise<HealthData> => {
  try {
    // Initialize Google Fit if not already initialized
    if (!(await isGoogleFitAvailable())) {
      await initGoogleFit();
    }

    // Create options for the date range
    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      bucketUnit: BucketUnit.DAY,
      bucketInterval: 1
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
      source: 'google_fit',
    };
  } catch (error) {
    console.error('Error fetching health data:', error);
    throw error;
  }
};

/**
 * Fetch steps from Google Fit
 * @param options Options for the query
 * @returns Promise that resolves with the step count
 */
const fetchSteps = async (options: any): Promise<number> => {
  try {
    const result = await GoogleFit.getDailyStepCountSamples(options);

    // Find the steps from Google Fit
    const googleFitSteps = result.find(
      (source) => source.source === 'com.google.android.gms:estimated_steps'
    );

    if (googleFitSteps && googleFitSteps.steps.length > 0) {
      // Sum up all steps in the date range
      return googleFitSteps.steps.reduce(
        (total, day) => total + day.value,
        0
      );
    }

    return 0;
  } catch (error) {
    console.error('Error fetching steps:', error);
    return 0;
  }
};

/**
 * Fetch distance from Google Fit
 * @param options Options for the query
 * @returns Promise that resolves with the distance in meters
 */
const fetchDistance = async (options: any): Promise<number> => {
  try {
    const result = await GoogleFit.getDailyDistanceSamples(options);

    if (result && result.length > 0) {
      // Sum up all distances in the date range
      return result.reduce(
        (total, day) => total + day.distance,
        0
      );
    }

    return 0;
  } catch (error) {
    console.error('Error fetching distance:', error);
    return 0;
  }
};

/**
 * Fetch calories from Google Fit
 * @param options Options for the query
 * @returns Promise that resolves with the calories burned
 */
const fetchCalories = async (options: any): Promise<number> => {
  try {
    const result = await GoogleFit.getDailyCalorieSamples(options);

    if (result && result.length > 0) {
      // Sum up all calories in the date range
      return result.reduce(
        (total, day) => total + day.calorie,
        0
      );
    }

    return 0;
  } catch (error) {
    console.error('Error fetching calories:', error);
    return 0;
  }
};

/**
 * Fetch heart rate from Google Fit
 * @param options Options for the query
 * @returns Promise that resolves with heart rate metrics
 */
const fetchHeartRate = async (options: any): Promise<{
  resting?: number;
  average?: number;
  max?: number;
}> => {
  try {
    const result = await GoogleFit.getHeartRateSamples(options);

    if (result && result.length > 0) {
      // Calculate average and max heart rate
      let sum = 0;
      let max = 0;

      for (const sample of result) {
        sum += sample.value;
        max = Math.max(max, sample.value);
      }

      const average = Math.round(sum / result.length);

      return {
        average,
        max,
      };
    }

    return {};
  } catch (error) {
    console.error('Error fetching heart rate:', error);
    return {};
  }
};

/**
 * Fetch sleep data from Google Fit
 * @param options Options for the query
 * @returns Promise that resolves with sleep metrics
 */
const fetchSleep = async (options: any): Promise<{
  duration?: number;
  quality?: 'poor' | 'fair' | 'good' | 'excellent';
}> => {
  try {
    const result = await GoogleFit.getSleepSamples(options);

    if (result && result.length > 0) {
      // Calculate total sleep duration in minutes
      let totalDuration = 0;

      for (const sample of result) {
        const startTime = new Date(sample.startDate).getTime();
        const endTime = new Date(sample.endDate).getTime();
        const duration = (endTime - startTime) / (1000 * 60); // Convert to minutes

        totalDuration += duration;
      }

      // Determine sleep quality based on duration
      let quality: 'poor' | 'fair' | 'good' | 'excellent' = 'fair';

      if (totalDuration < 360) { // Less than 6 hours
        quality = 'poor';
      } else if (totalDuration < 420) { // 6-7 hours
        quality = 'fair';
      } else if (totalDuration < 540) { // 7-9 hours
        quality = 'good';
      } else { // More than 9 hours
        quality = 'excellent';
      }

      return {
        duration: totalDuration,
        quality,
      };
    }

    return {};
  } catch (error) {
    console.error('Error fetching sleep data:', error);
    return {};
  }
};

/**
 * Fetch workouts from Google Fit
 * @param options Options for the query
 * @returns Promise that resolves with the workouts
 */
const fetchWorkouts = async (options: any): Promise<HealthWorkout[]> => {
  try {
    const result = await GoogleFit.getActivitySamples(options);

    if (result && result.length > 0) {
      // Convert Google Fit activities to HealthWorkout format
      return result.map((activity) => {
        const startDate = new Date(activity.start);
        const endDate = new Date(activity.end);
        const duration = (endDate.getTime() - startDate.getTime()) / 1000; // Convert to seconds

        return {
          type: mapActivityTypeToWorkoutType(activity.activityType),
          startDate,
          endDate,
          duration,
          calories: activity.calories || 0,
          distance: activity.distance || 0,
          source: 'google_fit',
        };
      });
    }

    return [];
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
};

/**
 * Map Google Fit activity type to workout type
 * @param activityType The Google Fit activity type
 * @returns The workout type
 */
const mapActivityTypeToWorkoutType = (activityType: number): string => {
  // Map Google Fit activity types to workout types
  const activityTypeMap: Record<number, string> = {
    [ActivityType.RUNNING]: 'running',
    [ActivityType.BIKING]: 'cycling',
    [ActivityType.WALKING]: 'walking',
    [ActivityType.SWIMMING]: 'swimming',
    [ActivityType.STRENGTH_TRAINING]: 'strength',
    [ActivityType.AEROBICS]: 'aerobics',
    [ActivityType.YOGA]: 'yoga',
    // Add more mappings as needed
  };

  // Return the mapped type or a default type
  return activityTypeMap[activityType] || 'other';
};

/**
 * Fetch weight from Google Fit
 * @returns Promise that resolves with the weight in kilograms
 */
const fetchWeight = async (): Promise<number | undefined> => {
  try {
    const options = {
      unit: 'kg', // kg or pound
      startDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      endDate: new Date().toISOString(),
      ascending: false,
    };

    const result = await GoogleFit.getWeightSamples(options);

    if (result && result.length > 0) {
      // Return the most recent weight
      return result[0].value;
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching weight:', error);
    return undefined;
  }
};

/**
 * Fetch height from Google Fit
 * @returns Promise that resolves with the height in centimeters
 */
const fetchHeight = async (): Promise<number | undefined> => {
  try {
    const options = {
      startDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      endDate: new Date().toISOString(),
    };

    const result = await GoogleFit.getHeightSamples(options);

    if (result && result.length > 0) {
      // Return the most recent height in centimeters
      return result[0].value * 100; // Convert meters to centimeters
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching height:', error);
    return undefined;
  }
};

/**
 * Fetch blood pressure from Google Fit
 * @param options Options for the query
 * @returns Promise that resolves with blood pressure readings
 */
const fetchBloodPressure = async (options: any): Promise<{
  systolic?: number;
  diastolic?: number;
} | undefined> => {
  try {
    const result = await GoogleFit.getBloodPressureSamples(options);

    if (result && result.length > 0) {
      // Return the most recent blood pressure reading
      const latestReading = result[0];

      return {
        systolic: latestReading.systolic,
        diastolic: latestReading.diastolic,
      };
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching blood pressure:', error);
    return undefined;
  }
};

/**
 * Fetch blood glucose from Google Fit
 * @param options Options for the query
 * @returns Promise that resolves with the blood glucose level in mg/dL
 */
const fetchBloodGlucose = async (options: any): Promise<number | undefined> => {
  try {
    const result = await GoogleFit.getBloodGlucoseSamples(options);

    if (result && result.length > 0) {
      // Return the most recent blood glucose reading
      return result[0].value;
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching blood glucose:', error);
    return undefined;
  }
};

/**
 * Fetch oxygen saturation from Google Fit
 * @param options Options for the query
 * @returns Promise that resolves with the oxygen saturation percentage
 */
const fetchOxygenSaturation = async (options: any): Promise<number | undefined> => {
  try {
    const result = await GoogleFit.getOxygenSaturationSamples(options);

    if (result && result.length > 0) {
      // Return the most recent oxygen saturation reading
      return result[0].value * 100; // Convert to percentage
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching oxygen saturation:', error);
    return undefined;
  }
};

/**
 * Sync a workout to Google Fit
 * @param workout The workout to sync
 * @returns Promise that resolves when the workout is synced
 */
export const syncWorkout = async (workout: HealthWorkout): Promise<boolean> => {
  try {
    // Initialize Google Fit if not already initialized
    if (!(await isGoogleFitAvailable())) {
      await initGoogleFit();
    }

    // Map workout type to Google Fit activity type
    const activityType = mapWorkoutType(workout.type);

    // Create the workout options
    const options = {
      activityType,
      startDate: workout.startDate.toISOString(),
      endDate: workout.endDate.toISOString(),
      calories: workout.calories,
      distance: workout.distance || 0,
    };

    // Save the workout to Google Fit
    await GoogleFit.saveWorkout(options);

    return true;
  } catch (error) {
    console.error('Error syncing workout to Google Fit:', error);
    return false;
  }
};

/**
 * Map workout type to Google Fit activity type
 * @param type The workout type
 * @returns The Google Fit activity type
 */
const mapWorkoutType = (type: string): number => {
  // Map workout types to Google Fit activity types
  const workoutTypeMap: Record<string, number> = {
    running: ActivityType.RUNNING,
    cycling: ActivityType.BIKING,
    walking: ActivityType.WALKING,
    swimming: ActivityType.SWIMMING,
    // Add more mappings as needed
  };

  // Return the mapped type or a default type
  return workoutTypeMap[type.toLowerCase()] || ActivityType.OTHER;
};

// Export the Google Fit provider
export const googleFitProvider = {
  name: 'Google Fit',
  isAvailable: isGoogleFitAvailable,
  requestPermissions: initGoogleFit,
  fetchHealthData,
  syncWorkout,
};
