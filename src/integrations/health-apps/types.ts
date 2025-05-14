/**
 * Health App Integration Types
 * 
 * This file defines the common types and interfaces for health data
 * that can be imported from various health apps like Apple Health,
 * Samsung Health, and Google Fit.
 */

/**
 * Main health data interface that contains all health metrics
 */
export interface HealthData {
  /** Number of steps taken */
  steps?: number;
  
  /** Distance traveled in meters */
  distance?: number;
  
  /** Calories burned */
  calories?: number;
  
  /** Heart rate metrics */
  heartRate?: {
    /** Resting heart rate in BPM */
    resting?: number;
    
    /** Average heart rate in BPM */
    average?: number;
    
    /** Maximum heart rate in BPM */
    max?: number;
  };
  
  /** Sleep metrics */
  sleep?: {
    /** Sleep duration in minutes */
    duration?: number;
    
    /** Subjective sleep quality */
    quality?: 'poor' | 'fair' | 'good' | 'excellent';
  };
  
  /** List of recorded workouts */
  workouts?: HealthWorkout[];
  
  /** Weight in kilograms */
  weight?: number;
  
  /** Height in centimeters */
  height?: number;
  
  /** Blood pressure readings */
  bloodPressure?: {
    /** Systolic pressure in mmHg */
    systolic?: number;
    
    /** Diastolic pressure in mmHg */
    diastolic?: number;
  };
  
  /** Blood glucose level in mg/dL */
  bloodGlucose?: number;
  
  /** Oxygen saturation percentage */
  oxygenSaturation?: number;
  
  /** Last time the data was synced */
  lastSyncDate?: Date;
  
  /** Source of the health data */
  source?: 'apple_health' | 'samsung_health' | 'google_fit' | 'manual';
}

/**
 * Workout data from health apps
 */
export interface HealthWorkout {
  /** Type of workout (running, cycling, etc.) */
  type: string;
  
  /** When the workout started */
  startDate: Date;
  
  /** When the workout ended */
  endDate: Date;
  
  /** Duration in seconds */
  duration: number;
  
  /** Calories burned during workout */
  calories: number;
  
  /** Distance covered in meters (if applicable) */
  distance?: number;
  
  /** Average heart rate during workout */
  heartRateAvg?: number;
  
  /** Maximum heart rate during workout */
  heartRateMax?: number;
  
  /** Additional workout metrics */
  metrics?: Record<string, number>;
  
  /** Source of the workout data */
  source?: 'apple_health' | 'samsung_health' | 'google_fit' | 'manual';
}

/**
 * Interface for health app providers
 */
export interface HealthAppProvider {
  /** Name of the health app provider */
  name: string;
  
  /** Check if the health app is available on the device */
  isAvailable(): Promise<boolean>;
  
  /** Request permissions to access health data */
  requestPermissions(): Promise<boolean>;
  
  /** Fetch health data for a specific time range */
  fetchHealthData(startDate: Date, endDate: Date): Promise<HealthData>;
  
  /** Sync a workout to the health app */
  syncWorkout(workout: HealthWorkout): Promise<boolean>;
}

/**
 * Connection status between web app and mobile health app
 */
export interface HealthAppConnection {
  /** Whether the app is connected */
  isConnected: boolean;
  
  /** Connection code for QR */
  connectionCode?: string;
  
  /** When the connection was established */
  connectedAt?: Date;
  
  /** Type of health app connected */
  appType?: 'apple_health' | 'samsung_health' | 'google_fit';
  
  /** Device information */
  deviceInfo?: {
    /** Device model */
    model?: string;
    
    /** Operating system */
    os?: string;
    
    /** App version */
    appVersion?: string;
  };
}
