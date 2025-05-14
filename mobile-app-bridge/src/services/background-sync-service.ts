/**
 * Background Sync Service
 * 
 * This service handles background synchronization of health data.
 * It uses react-native-background-fetch to schedule periodic sync tasks.
 */

import BackgroundFetch from 'react-native-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { fetchHealthData } from '../health';
import { syncHealthData } from '../api/sync-service';
import { showNotification } from '../utils/notification-utils';

// Storage keys
const AUTO_SYNC_ENABLED_KEY = 'auto_sync_enabled';
const SYNC_FREQUENCY_KEY = 'sync_frequency';
const NOTIFICATIONS_ENABLED_KEY = 'notifications_enabled';
const LAST_SYNC_KEY = 'last_sync';

/**
 * Initialize background fetch
 */
export const initBackgroundFetch = async (): Promise<void> => {
  try {
    // Get sync settings
    const autoSyncEnabled = await getSyncSetting(AUTO_SYNC_ENABLED_KEY, true);
    const syncFrequency = await getSyncSetting(SYNC_FREQUENCY_KEY, 60); // Default: 1 hour
    
    if (!autoSyncEnabled) {
      console.log('Auto sync is disabled, skipping background fetch initialization');
      return;
    }
    
    // Configure background fetch
    const status = await BackgroundFetch.configure(
      {
        minimumFetchInterval: syncFrequency, // in minutes
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
        requiresBatteryNotLow: false,
        requiresCharging: false,
        requiresDeviceIdle: false,
        requiresStorageNotLow: false,
      },
      async (taskId) => {
        console.log('[BackgroundFetch] Task:', taskId);
        
        // Perform sync
        await performHealthDataSync();
        
        // Signal completion of the task
        BackgroundFetch.finish(taskId);
      },
      (error) => {
        console.error('[BackgroundFetch] Failed to initialize:', error);
      }
    );
    
    console.log('[BackgroundFetch] Status:', status);
  } catch (error) {
    console.error('Error initializing background fetch:', error);
  }
};

/**
 * Perform health data sync
 */
export const performHealthDataSync = async (): Promise<boolean> => {
  try {
    console.log('[BackgroundFetch] Performing health data sync');
    
    // Get the date range for the health data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Get data for the last 7 days
    
    // Fetch health data from the health app
    const healthData = await fetchHealthData(startDate, endDate);
    
    // Sync health data with the web app
    const success = await syncHealthData(false);
    
    if (success) {
      // Update last sync time
      const now = new Date();
      await AsyncStorage.setItem(LAST_SYNC_KEY, now.toISOString());
      
      // Show notification if enabled
      const notificationsEnabled = await getSyncSetting(NOTIFICATIONS_ENABLED_KEY, true);
      if (notificationsEnabled) {
        showNotification(
          'Health Data Synced',
          'Your health data has been synced successfully.'
        );
      }
      
      console.log('[BackgroundFetch] Health data sync completed successfully');
      return true;
    } else {
      console.error('[BackgroundFetch] Failed to sync health data');
      return false;
    }
  } catch (error) {
    console.error('[BackgroundFetch] Error syncing health data:', error);
    return false;
  }
};

/**
 * Update background fetch schedule
 * @param frequency Sync frequency in minutes
 */
export const updateBackgroundFetchSchedule = async (frequency: number): Promise<void> => {
  try {
    // Save the new frequency
    await AsyncStorage.setItem(SYNC_FREQUENCY_KEY, frequency.toString());
    
    // Update the background fetch schedule
    await BackgroundFetch.configure(
      {
        minimumFetchInterval: frequency,
      },
      async (taskId) => {
        console.log('[BackgroundFetch] Task:', taskId);
        
        // Perform sync
        await performHealthDataSync();
        
        // Signal completion of the task
        BackgroundFetch.finish(taskId);
      },
      (error) => {
        console.error('[BackgroundFetch] Failed to update schedule:', error);
      }
    );
    
    console.log('[BackgroundFetch] Schedule updated to', frequency, 'minutes');
  } catch (error) {
    console.error('Error updating background fetch schedule:', error);
  }
};

/**
 * Enable or disable auto sync
 * @param enabled Whether auto sync should be enabled
 */
export const setAutoSyncEnabled = async (enabled: boolean): Promise<void> => {
  try {
    // Save the setting
    await AsyncStorage.setItem(AUTO_SYNC_ENABLED_KEY, enabled.toString());
    
    if (enabled) {
      // Initialize background fetch
      await initBackgroundFetch();
    } else {
      // Disable background fetch
      await BackgroundFetch.stop();
      console.log('[BackgroundFetch] Background fetch stopped');
    }
  } catch (error) {
    console.error('Error setting auto sync enabled:', error);
  }
};

/**
 * Enable or disable notifications
 * @param enabled Whether notifications should be enabled
 */
export const setNotificationsEnabled = async (enabled: boolean): Promise<void> => {
  try {
    // Save the setting
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, enabled.toString());
  } catch (error) {
    console.error('Error setting notifications enabled:', error);
  }
};

/**
 * Get a sync setting from storage
 * @param key The setting key
 * @param defaultValue The default value if the setting is not found
 * @returns The setting value
 */
const getSyncSetting = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const value = await AsyncStorage.getItem(key);
    
    if (value === null) {
      return defaultValue;
    }
    
    if (typeof defaultValue === 'boolean') {
      return (value === 'true') as unknown as T;
    } else if (typeof defaultValue === 'number') {
      return parseInt(value, 10) as unknown as T;
    } else {
      return value as unknown as T;
    }
  } catch (error) {
    console.error(`Error getting sync setting ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Get the last sync time
 * @returns The last sync time or null if never synced
 */
export const getLastSyncTime = async (): Promise<Date | null> => {
  try {
    const lastSyncStr = await AsyncStorage.getItem(LAST_SYNC_KEY);
    
    if (lastSyncStr) {
      return new Date(lastSyncStr);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting last sync time:', error);
    return null;
  }
};
