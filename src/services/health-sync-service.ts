
/**
 * Health Sync Service
 * 
 * This service handles synchronization of health data between
 * local storage and remote services.
 */

import { HealthData } from '@/integrations/health-apps/types';
import { dbService } from './indexeddb-service';
import { supabaseService } from './supabase';

interface SyncStatus {
  lastSync: Date;
  pendingSync: boolean;
  syncInProgress: boolean;
  errors: string[];
}

class HealthSyncService {
  private syncStatus: SyncStatus = {
    lastSync: new Date(0),
    pendingSync: false,
    syncInProgress: false,
    errors: []
  };

  /**
   * Initialize the health sync service
   */
  async initialize(): Promise<void> {
    try {
      // Initialize the database
      await dbService.initDatabase();
      console.log('Health sync service initialized');
    } catch (error) {
      console.error('Failed to initialize health sync service:', error);
      throw error;
    }
  }

  /**
   * Sync health data to local storage
   * @param data Health data to sync
   * @returns Promise that resolves when sync is complete
   */
  async syncToLocal(data: HealthData): Promise<void> {
    try {
      this.syncStatus.syncInProgress = true;

      // Validate health data
      if (!this.validateHealthData(data)) {
        throw new Error('Invalid health data');
      }

      // Store data locally
      await dbService.add('health_data', {
        id: `health_${Date.now()}`,
        data,
        timestamp: new Date(),
        synced: false
      });

      // Update sync status
      this.syncStatus.lastSync = new Date();
      this.syncStatus.pendingSync = true;
      this.syncStatus.errors = [];

      console.log('Health data synced to local storage');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.syncStatus.errors.push(errorMessage);
      console.error('Error syncing health data to local:', error);
      throw error;
    } finally {
      this.syncStatus.syncInProgress = false;
    }
  }

  /**
   * Validate health data
   * @param data Health data to validate
   * @returns True if valid, false otherwise
   */
  private validateHealthData(data: HealthData): boolean {
    // Basic validation
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Check for at least one valid field
    const hasValidField = (
      typeof data.steps === 'number' ||
      typeof data.calories === 'number' ||
      typeof data.distance === 'number' ||
      typeof data.weight === 'number' ||
      (data.heartRate && typeof data.heartRate === 'object') ||
      (data.sleep && typeof data.sleep === 'object') ||
      (data.workouts && Array.isArray(data.workouts))
    );

    return hasValidField;
  }

  /**
   * Sync pending data to remote services
   * @returns Promise that resolves when sync is complete
   */
  async syncToRemote(): Promise<void> {
    if (this.syncStatus.syncInProgress) {
      console.log('Sync already in progress, skipping');
      return;
    }

    try {
      this.syncStatus.syncInProgress = true;

      // Get all unsynced health data
      const unsyncedData = await dbService.getAll('health_data');
      const pendingData = unsyncedData.filter((item: any) => !item.synced);

      if (pendingData.length === 0) {
        console.log('No pending data to sync');
        this.syncStatus.pendingSync = false;
        return;
      }

      // Sync each item to remote service
      for (const item of pendingData) {
        try {
          // Sync to Supabase (example)
          await supabaseService.insertData('health_data', {
            data: item.data,
            timestamp: item.timestamp,
            user_id: 'current_user_id' // This should come from auth context
          });

          // Mark as synced locally
          await dbService.update('health_data', {
            ...item,
            synced: true
          });

          console.log(`Synced health data item: ${item.id}`);
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          // Continue with other items
        }
      }

      // Update sync status
      this.syncStatus.lastSync = new Date();
      this.syncStatus.pendingSync = false;
      this.syncStatus.errors = [];

      console.log('Health data sync to remote completed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.syncStatus.errors.push(errorMessage);
      console.error('Error syncing health data to remote:', error);
      throw error;
    } finally {
      this.syncStatus.syncInProgress = false;
    }
  }

  /**
   * Get sync status
   * @returns Current sync status
   */
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Force a full sync
   * @returns Promise that resolves when sync is complete
   */
  async forceSync(): Promise<void> {
    try {
      console.log('Starting forced sync');
      await this.syncToRemote();
    } catch (error) {
      console.error('Force sync failed:', error);
      throw error;
    }
  }

  /**
   * Clear all local health data
   * @returns Promise that resolves when clear is complete
   */
  async clearLocalData(): Promise<void> {
    try {
      await dbService.clear('health_data');
      this.syncStatus = {
        lastSync: new Date(0),
        pendingSync: false,
        syncInProgress: false,
        errors: []
      };
      console.log('Local health data cleared');
    } catch (error) {
      console.error('Error clearing local health data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const healthSyncService = new HealthSyncService();
export default healthSyncService;
