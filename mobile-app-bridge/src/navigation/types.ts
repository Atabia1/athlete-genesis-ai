/**
 * Navigation Types
 * 
 * This file defines the types for the navigation stack.
 */

/**
 * Root Stack Param List
 * 
 * This type defines the parameters for each screen in the root stack.
 */
export type RootStackParamList = {
  /** Home screen */
  Home: undefined;
  
  /** QR Scanner screen */
  QRScanner: undefined;
  
  /** Settings screen */
  Settings: undefined;
  
  /** Health Data Details screen */
  HealthDataDetails: {
    /** Type of health data to display */
    type: 'steps' | 'heartRate' | 'sleep' | 'workouts';
  };
  
  /** Workout Details screen */
  WorkoutDetails: {
    /** ID of the workout to display */
    workoutId: string;
  };
};
