/**
 * Sync Service
 * 
 * This file provides functionality for syncing health data with the web application.
 * It handles QR code connection, data synchronization, and error handling.
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchHealthData, syncWorkout } from '../health';
import { HealthData, HealthWorkout } from '../types/health';

// API base URL
const API_BASE_URL = 'https://api.athletegenesis.ai';

// Storage keys
const CONNECTION_CODE_KEY = 'connection_code';
const CONNECTION_STATUS_KEY = 'connection_status';
const LAST_SYNC_KEY = 'last_sync';

/**
 * Connection status
 */
interface ConnectionStatus {
  isConnected: boolean;
  connectedAt?: string;
  userId?: string;
  deviceId?: string;
}

/**
 * Verify a connection code with the web application
 * @param code The connection code to verify
 * @returns Promise that resolves with a boolean indicating if the connection was successful
 */
export const verifyConnectionCode = async (code: string): Promise<boolean> => {
  try {
    // Get device information
    const deviceInfo = {
      model: Platform.OS === 'ios' ? 'iPhone' : 'Android',
      os: Platform.OS,
      osVersion: Platform.Version,
    };
    
    // Send the connection code to the server
    const response = await fetch(`${API_BASE_URL}/health/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        deviceInfo,
      }),
    });
    
    // Check if the connection was successful
    if (!response.ok) {
      throw new Error(`Failed to verify connection code: ${response.statusText}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Save the connection code and status
    await AsyncStorage.setItem(CONNECTION_CODE_KEY, code);
    await AsyncStorage.setItem(CONNECTION_STATUS_KEY, JSON.stringify({
      isConnected: true,
      connectedAt: new Date().toISOString(),
      userId: data.userId,
      deviceId: data.deviceId,
    }));
    
    return true;
  } catch (error) {
    console.error('Error verifying connection code:', error);
    return false;
  }
};

/**
 * Check if the app is connected to the web application
 * @returns Promise that resolves with the connection status
 */
export const getConnectionStatus = async (): Promise<ConnectionStatus> => {
  try {
    const status = await AsyncStorage.getItem(CONNECTION_STATUS_KEY);
    
    if (!status) {
      return { isConnected: false };
    }
    
    return JSON.parse(status);
  } catch (error) {
    console.error('Error getting connection status:', error);
    return { isConnected: false };
  }
};

/**
 * Disconnect from the web application
 * @returns Promise that resolves when the disconnection is complete
 */
export const disconnect = async (): Promise<void> => {
  try {
    // Get the connection status
    const status = await getConnectionStatus();
    
    // If connected, send a disconnect request to the server
    if (status.isConnected && status.userId && status.deviceId) {
      await fetch(`${API_BASE_URL}/health/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: status.userId,
          deviceId: status.deviceId,
        }),
      });
    }
    
    // Clear the connection code and status
    await AsyncStorage.removeItem(CONNECTION_CODE_KEY);
    await AsyncStorage.removeItem(CONNECTION_STATUS_KEY);
  } catch (error) {
    console.error('Error disconnecting:', error);
    throw error;
  }
};

/**
 * Sync health data with the web application
 * @param forceSync Force a sync even if the last sync was recent
 * @returns Promise that resolves with the synced health data
 */
export const syncHealthData = async (forceSync: boolean = false): Promise<HealthData | null> => {
  try {
    // Get the connection status
    const status = await getConnectionStatus();
    
    // If not connected, return null
    if (!status.isConnected || !status.userId) {
      return null;
    }
    
    // Get the last sync time
    const lastSyncStr = await AsyncStorage.getItem(LAST_SYNC_KEY);
    const lastSync = lastSyncStr ? new Date(lastSyncStr) : null;
    
    // If the last sync was less than 1 hour ago and not forcing a sync, return null
    if (lastSync && !forceSync) {
      const now = new Date();
      const hoursSinceLastSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastSync < 1) {
        return null;
      }
    }
    
    // Calculate the date range for the health data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Get data for the last 7 days
    
    // Fetch health data from the health app
    const healthData = await fetchHealthData(startDate, endDate);
    
    // Send the health data to the server
    const response = await fetch(`${API_BASE_URL}/health/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: status.userId,
        deviceId: status.deviceId,
        healthData,
      }),
    });
    
    // Check if the sync was successful
    if (!response.ok) {
      throw new Error(`Failed to sync health data: ${response.statusText}`);
    }
    
    // Update the last sync time
    await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    
    return healthData;
  } catch (error) {
    console.error('Error syncing health data:', error);
    return null;
  }
};

/**
 * Sync a workout from the web application to the health app
 * @param workout The workout to sync
 * @returns Promise that resolves with a boolean indicating if the sync was successful
 */
export const syncWorkoutToHealthApp = async (workout: HealthWorkout): Promise<boolean> => {
  try {
    // Sync the workout to the health app
    return await syncWorkout(workout);
  } catch (error) {
    console.error('Error syncing workout to health app:', error);
    return false;
  }
};
