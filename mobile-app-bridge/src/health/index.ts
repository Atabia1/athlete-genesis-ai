/**
 * Health App Integration
 *
 * This file exports the health app integration functionality.
 * It provides a unified interface for accessing health data from different health apps.
 */

import { Platform } from 'react-native';
import { appleHealthProvider } from './apple-health';
import { healthConnectProvider } from './health-connect';
import { googleFitProvider } from './google-fit';
import { HealthAppProvider, HealthData, HealthWorkout } from '../types/health';

/**
 * Get the appropriate health provider based on the platform and available services
 * @returns The health provider for the current platform
 */
export const getHealthProvider = async (): Promise<HealthAppProvider> => {
  if (Platform.OS === 'ios') {
    return appleHealthProvider;
  } else if (Platform.OS === 'android') {
    // Try Google Fit first
    if (await googleFitProvider.isAvailable()) {
      return googleFitProvider;
    }

    // Fall back to Health Connect API (for Samsung Health and others)
    if (await healthConnectProvider.isAvailable()) {
      return healthConnectProvider;
    }

    // If neither is available, default to Google Fit as it's more widely available
    return googleFitProvider;
  }

  throw new Error(`Unsupported platform: ${Platform.OS}`);
};

/**
 * Check if health app integration is available on this device
 * @returns Promise that resolves with a boolean indicating if health app integration is available
 */
export const isHealthAppAvailable = async (): Promise<boolean> => {
  try {
    // On iOS, check Apple Health
    if (Platform.OS === 'ios') {
      return await appleHealthProvider.isAvailable();
    }

    // On Android, check both Google Fit and Health Connect
    if (Platform.OS === 'android') {
      const isGoogleFitAvailable = await googleFitProvider.isAvailable();
      const isHealthConnectAvailable = await healthConnectProvider.isAvailable();

      return isGoogleFitAvailable || isHealthConnectAvailable;
    }

    return false;
  } catch (error) {
    console.error('Error checking health app availability:', error);
    return false;
  }
};

/**
 * Request permissions to access health data
 * @returns Promise that resolves when permissions are granted
 */
export const requestHealthPermissions = async (): Promise<void> => {
  try {
    const provider = await getHealthProvider();
    await provider.requestPermissions();
  } catch (error) {
    console.error('Error requesting health permissions:', error);
    throw error;
  }
};

/**
 * Fetch health data from the health app
 * @param startDate Start date for the data range
 * @param endDate End date for the data range
 * @returns Promise that resolves with the health data
 */
export const fetchHealthData = async (
  startDate: Date,
  endDate: Date
): Promise<HealthData> => {
  try {
    const provider = await getHealthProvider();
    return await provider.fetchHealthData(startDate, endDate);
  } catch (error) {
    console.error('Error fetching health data:', error);
    throw error;
  }
};

/**
 * Sync a workout to the health app
 * @param workout The workout to sync
 * @returns Promise that resolves when the workout is synced
 */
export const syncWorkout = async (workout: HealthWorkout): Promise<boolean> => {
  try {
    const provider = await getHealthProvider();
    return await provider.syncWorkout(workout);
  } catch (error) {
    console.error('Error syncing workout:', error);
    return false;
  }
};

export { HealthData, HealthWorkout, HealthAppProvider } from '../types/health';
