/**
 * Health Apps Integration
 * 
 * This file exports the health app integration functionality.
 * It serves as the main entry point for the health apps integration module.
 */

import { HealthData, HealthWorkout, HealthAppConnection } from './types';

/**
 * Detect if the current environment supports health app integration
 * (requires the companion mobile app)
 */
export const isHealthAppIntegrationSupported = (): boolean => {
  // Check if we're in a mobile environment that could have the companion app installed
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // Check if we have the custom protocol handler for deep linking
  const hasProtocolHandler = 'registerProtocolHandler' in navigator;
  
  return isMobile && hasProtocolHandler;
};

/**
 * Generate a unique connection code for QR code
 */
export const generateConnectionCode = (): string => {
  // Generate a random string for the connection code
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36);
  
  return `${randomPart}${timestamp}`;
};

/**
 * Create a deep link URL for the companion app
 */
export const createHealthAppDeepLink = (connectionCode: string): string => {
  return `athletegenesis://connect?code=${connectionCode}`;
};

/**
 * Parse health data from the companion app
 */
export const parseHealthData = (data: any): HealthData => {
  try {
    // Ensure dates are properly parsed
    const parsedData: HealthData = {
      ...data,
      lastSyncDate: data.lastSyncDate ? new Date(data.lastSyncDate) : undefined,
    };
    
    // Parse workout dates if present
    if (parsedData.workouts && Array.isArray(parsedData.workouts)) {
      parsedData.workouts = parsedData.workouts.map(workout => ({
        ...workout,
        startDate: new Date(workout.startDate),
        endDate: new Date(workout.endDate),
      }));
    }
    
    return parsedData;
  } catch (error) {
    console.error('Failed to parse health data:', error);
    throw new Error('Invalid health data format');
  }
};

/**
 * Format workout data for syncing to health apps
 */
export const formatWorkoutForHealthApp = (workout: any): HealthWorkout => {
  return {
    type: workout.type || 'other',
    startDate: new Date(workout.startDate),
    endDate: new Date(workout.endDate),
    duration: workout.duration || 0,
    calories: workout.calories || 0,
    distance: workout.distance,
    heartRateAvg: workout.heartRateAvg,
    heartRateMax: workout.heartRateMax,
    source: 'manual',
  };
};

export type { HealthData, HealthWorkout, HealthAppConnection };
