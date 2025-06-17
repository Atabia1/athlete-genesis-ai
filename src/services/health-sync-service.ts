
/**
 * Health Sync Service
 * 
 * This service handles synchronization of health data between
 * local storage and remote services.
 */

import { HealthData } from '@/integrations/health-apps/types';
import { IndexedDBService } from './indexeddb-service';
import { supabaseService } from './supabase';
import { generateConnectionCode, createHealthAppDeepLink } from '@/integrations/health-apps';

interface SyncStatus {
  lastSync: Date;
  pendingSync: boolean;
  syncInProgress: boolean;
  errors: string[];
}

interface HealthDataItem {
  id: string;
  data: HealthData;
  timestamp: Date;
  synced: boolean;
}

class HealthSyncService {
  private syncStatus: SyncStatus = {
    lastSync: new Date(0),
    pendingSync: false,
    syncInProgress: false,
    errors: []
  };

  private dbService: IndexedDBService | null = null;

  /**
   * Initialize the health sync service
   */
  async initialize(dbService?: IndexedDBService): Promise<void> {
    try {
      if (dbService) {
        this.dbService = dbService;
      }
      console.log('Health sync service initialized');
    } catch (error) {
      console.error('Failed to initialize health sync service:', error);
      throw error;
    }
  }

  /**
   * Generate a QR code for connecting health apps
   * @returns Promise that resolves with the connection URL
   */
  async generateConnectionQR(): Promise<string> {
    try {
      const connectionCode = generateConnectionCode();
      const deepLinkUrl = createHealthAppDeepLink(connectionCode);
      
      // Store the connection code temporarily if database is available
      if (this.dbService) {
        await this.dbService.add('connection_codes', {
          id: connectionCode,
          code: connectionCode,
          timestamp: new Date(),
          expires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });
      }

      return deepLinkUrl;
    } catch (error) {
      console.error('Failed to generate connection QR:', error);
      throw error;
    }
  }

  /**
   * Get current health data
   * @returns Promise that resolves with the latest health data
   */
  async getHealthData(): Promise<HealthData | null> {
    try {
      if (!this.dbService) {
        return null;
      }

      const healthDataItems = await this.dbService.getAll<HealthDataItem>('health_data');
      
      if (healthDataItems.length === 0) {
        return null;
      }

      // Get the most recent health data with proper typing
      const latestItem = healthDataItems.sort((a: HealthDataItem, b: HealthDataItem) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];

      return latestItem?.data || null;
    } catch (error) {
      console.error('Failed to get health data:', error);
      return null;
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
      const isValid = this.validateHealthData(data);
      if (!isValid) {
        throw new Error('Invalid health data');
      }

      // Store data locally if database is available
      if (this.dbService) {
        await this.dbService.add('health_data', {
          id: `health_${Date.now()}`,
          data,
          timestamp: new Date(),
          synced: false
        });
      }

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
    const hasValidField = Boolean(
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

      if (!this.dbService) {
        console.log('No database service available for sync');
        return;
      }

      // Get all unsynced health data
      const unsyncedData = await this.dbService.getAll<HealthDataItem>('health_data');
      const pendingData = unsyncedData.filter((item: HealthDataItem) => !item.synced);

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
          await this.dbService.update('health_data', {
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
      if (this.dbService) {
        await this.dbService.clear('health_data');
      }
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
