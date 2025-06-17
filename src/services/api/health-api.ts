
/**
 * Health API Service
 * 
 * This service provides methods for interacting with the health-related API endpoints.
 * It handles health data synchronization, connection management, and workout syncing.
 */

import api from '@/services/api';
import { HealthData, HealthWorkout } from '@/integrations/health-apps/types';

/**
 * Health API service
 */
export const healthApi = {
  /**
   * Verify a connection code
   * @param code The connection code to verify
   * @param deviceInfo Information about the device
   * @returns Promise that resolves with the connection status
   */
  verifyConnectionCode: async (code: string, deviceInfo: any) => {
    return api.post<{ success: boolean; userId: string; deviceId: string }>('/health/connect', {
      code,
      deviceInfo,
    });
  },

  /**
   * Disconnect a device
   * @param deviceId The device ID to disconnect
   * @returns Promise that resolves when the device is disconnected
   */
  disconnectDevice: async (deviceId: string) => {
    return api.post<{ success: boolean }>('/health/disconnect', {
      deviceId,
    });
  },

  /**
   * Sync health data
   * @param healthData The health data to sync
   * @returns Promise that resolves when the health data is synced
   */
  syncHealthData: async (healthData: HealthData) => {
    return api.post<{ success: boolean }>('/health/sync', {
      healthData,
    });
  },

  /**
   * Get health data
   * @returns Promise that resolves with the health data
   */
  getHealthData: async () => {
    return api.get<HealthData>('/health/data');
  },

  /**
   * Get connected devices
   * @returns Promise that resolves with the list of connected devices
   */
  getConnectedDevices: async () => {
    return api.get<any[]>('/health/devices');
  },

  /**
   * Sync a workout to health apps
   * @param workout The workout to sync
   * @returns Promise that resolves when the workout is queued for syncing
   */
  syncWorkout: async (workout: HealthWorkout) => {
    return api.post<{ success: boolean }>('/health/workout/sync', {
      workout,
    });
  },

  /**
   * Get sync status
   * @returns Promise that resolves with the sync status
   */
  getSyncStatus: async () => {
    return api.get<{
      lastSync: string;
      syncInProgress: boolean;
      connectedDevices: number;
    }>('/health/status');
  },
};

export default healthApi;
