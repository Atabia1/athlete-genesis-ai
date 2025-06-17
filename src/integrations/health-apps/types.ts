
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
  hydration?: number;
  timestamp?: string;
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
