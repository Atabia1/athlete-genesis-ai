
export interface HealthData {
  steps?: number;
  distance?: number;
  calories?: number;
  heartRate?: {
    resting?: number;
    average?: number;
    max?: number;
  };
  sleep?: {
    duration?: number;
    quality?: 'poor' | 'fair' | 'good' | 'excellent';
  };
  weight?: number;
  height?: number;
  hydration?: number;
  timestamp?: string;
  lastSyncDate?: Date;
  workouts?: HealthWorkout[];
  source?: 'apple_health' | 'samsung_health' | 'google_fit' | 'manual';
}

export interface HealthWorkout {
  id?: string;
  name?: string;
  type: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  calories: number;
  distance?: number;
  heartRateAvg?: number;
  heartRateMax?: number;
  metrics?: Record<string, number>;
  source?: 'apple_health' | 'samsung_health' | 'google_fit' | 'manual';
}

export interface HealthAppConnection {
  isConnected: boolean;
  connectionCode?: string;
  connectedAt?: Date;
  appType?: 'apple_health' | 'samsung_health' | 'google_fit';
  deviceInfo?: {
    model?: string;
    os?: string;
    appVersion?: string;
  };
}

export interface HealthDevice {
  id: string;
  name: string;
  type: 'fitness_tracker' | 'smartwatch' | 'scale' | 'heart_rate_monitor';
  connected: boolean;
  lastSync?: string;
  batteryLevel?: number;
}

export interface HealthSync {
  userId: string;
  deviceId: string;
  data: HealthData;
  timestamp: string;
  syncStatus: 'pending' | 'completed' | 'failed';
}
