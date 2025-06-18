
/**
 * Health Data Types
 */

export interface HealthData {
  id?: string;
  userId?: string;
  weight?: number;
  height?: number;
  age?: number;
  activityLevel?: string;
  sleepDuration?: number;
  stressLevel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutSession {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: Exercise[];
  userId?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
}

export interface NutritionLog {
  id: string;
  food: string;
  calories: number;
  date: string;
  userId?: string;
}

export interface VitalSigns {
  heartRate?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  temperature?: number;
  oxygenSaturation?: number;
}
