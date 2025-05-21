/**
 * Health Sync Service
 *
 * This service handles the synchronization of health data between mobile health apps
 * and the Athlete Genesis AI application.
 */

import type { HealthData } from '@/integrations/health-apps';
import { dbService } from '@/services/indexeddb-service';
import api from '@/services/api';

/**
 * Health data validation result
 */
interface HealthDataValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Connection code for health app pairing
 */
interface ConnectionCode {
  id: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
}

/**
 * Validate health data before saving
 */
const validateHealthData = (data: HealthData): HealthDataValidationResult => {
  const errors: string[] = [];

  // Basic validation
  if (data.steps !== undefined && (isNaN(data.steps) || data.steps < 0)) {
    errors.push('Steps must be a positive number');
  }

  if (data.distance !== undefined && (isNaN(data.distance) || data.distance < 0)) {
    errors.push('Distance must be a positive number');
  }

  if (data.calories !== undefined && (isNaN(data.calories) || data.calories < 0)) {
    errors.push('Calories must be a positive number');
  }

  if (data.weight !== undefined && (isNaN(data.weight) || data.weight <= 0 || data.weight > 500)) {
    errors.push('Weight must be a positive number between 0 and 500 kg');
  }

  if (data.height !== undefined && (isNaN(data.height) || data.height <= 0 || data.height > 300)) {
    errors.push('Height must be a positive number between 0 and 300 cm');
  }

  // Validate workouts if present
  if (data.workouts && Array.isArray(data.workouts)) {
    data.workouts.forEach((workout, index) => {
      if (!workout.type) {
        errors.push(`Workout ${index + 1} must have a type`);
      }

      if (!(workout.startDate instanceof Date) || isNaN(workout.startDate.getTime())) {
        errors.push(`Workout ${index + 1} must have a valid start date`);
      }

      if (!(workout.endDate instanceof Date) || isNaN(workout.endDate.getTime())) {
        errors.push(`Workout ${index + 1} must have a valid end date`);
      }

      if (workout.startDate && workout.endDate && workout.startDate > workout.endDate) {
        errors.push(`Workout ${index + 1} start date must be before end date`);
      }

      if (isNaN(workout.duration) || workout.duration < 0) {
        errors.push(`Workout ${index + 1} must have a valid duration`);
      }

      if (isNaN(workout.calories) || workout.calories < 0) {
        errors.push(`Workout ${index + 1} must have valid calories`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Health Sync Service
 */
export const healthSyncService = {
  /**
   * Initialize the health sync service
   * This adds the necessary object stores to IndexedDB if they don't exist
   */
  initialize: async (): Promise<void> => {
    try {
      // Check if the healthData store exists
      await dbService.startTransaction(['healthData'], 'readonly');
      await dbService.commitTransaction();
    } catch (error) {
      // If the store doesn't exist, we need to create it
      // This will be handled by the migration in the IndexedDB service
      console.log('Health data store not initialized yet');
    }
  },

  /**
   * Save health data to local storage and sync with server
   */
  saveHealthData: async (healthData: HealthData): Promise<void> => {
    try {
      // Validate health data
      const validationResult = validateHealthData(healthData);
      if (!validationResult.valid) {
        throw new Error(`Invalid health data: ${validationResult.errors.join(', ')}`);
      }

      // Add timestamp if not present
      if (!healthData.lastSyncDate) {
        healthData.lastSyncDate = new Date();
      }

      // Save to IndexedDB
      await dbService.startTransaction(['healthData'], 'readwrite');

      try {
        // Use a fixed ID for the health data to ensure we always update the same record
        const healthDataWithId = {
          id: 'current',
          ...healthData
        };

        // Check if health data already exists
        const existingData = await dbService.getById('healthData', 'current');

        if (existingData) {
          // Update existing data
          await dbService.update('healthData', healthDataWithId);
        } else {
          // Add new data
          await dbService.add('healthData', healthDataWithId);
        }

        // Commit the transaction
        await dbService.commitTransaction();

        // Sync with server if online
        if (navigator.onLine) {
          try {
            await api.post('/user/health-data', healthData);
          } catch (apiError) {
            console.error('Failed to sync health data with server:', apiError);
            // Add to retry queue
            await dbService.add('retryQueue', {
              id: `health-sync-${Date.now()}`,
              type: 'SYNC_HEALTH_DATA',
              data: healthData,
              createdAt: new Date().toISOString(),
              priority: 'HIGH',
              retryCount: 0
            });
          }
        }
      } catch (transactionError) {
        // If there's an error during the transaction, abort it
        await dbService.abortTransaction();
        throw transactionError;
      }
    } catch (error) {
      console.error('Failed to save health data:', error);
      throw error;
    }
  },

  /**
   * Get latest health data
   */
  getHealthData: async (): Promise<HealthData | null> => {
    try {
      // Try to get from server first if online
      if (navigator.onLine) {
        try {
          const data = await api.get<HealthData>('/user/health-data');
          return data;
        } catch (error) {
          console.warn('Failed to fetch health data from server, falling back to local data');
        }
      }

      // Fall back to local data
      const data = await dbService.getById<HealthData & { id: string }>('healthData', 'current');

      if (data) {
        // Remove the ID field as it's not part of the HealthData interface
        const { id, ...healthData } = data;
        return healthData;
      }

      return null;
    } catch (error) {
      console.error('Failed to get health data:', error);
      return null;
    }
  },

  /**
   * Save connection code for QR code
   */
  saveConnectionCode: async (code: string): Promise<void> => {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes expiration

      const connectionCode: ConnectionCode = {
        id: code,
        code,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        used: false
      };

      await dbService.add('connectionCodes', connectionCode);
    } catch (error) {
      console.error('Failed to save connection code:', error);
      throw error;
    }
  },

  /**
   * Verify connection code
   */
  verifyConnectionCode: async (code: string): Promise<boolean> => {
    try {
      const connectionCode = await dbService.getById<ConnectionCode>('connectionCodes', code);

      if (!connectionCode) {
        return false;
      }

      // Check if code is expired
      const now = new Date();
      const expiresAt = new Date(connectionCode.expiresAt);

      if (now > expiresAt || connectionCode.used) {
        return false;
      }

      // Mark code as used
      await dbService.update('connectionCodes', {
        ...connectionCode,
        used: true
      });

      return true;
    } catch (error) {
      console.error('Failed to verify connection code:', error);
      return false;
    }
  },

  /**
   * Generate connection QR code
   */
  generateConnectionQR: async (): Promise<string> => {
    // Generate a unique connection code
    const connectionCode = Math.random().toString(36).substring(2, 15);

    // Save the connection code
    await healthSyncService.saveConnectionCode(connectionCode);

    // Return a URL that can be encoded as QR
    return `athletegenesis://connect?code=${connectionCode}`;
  }
};
