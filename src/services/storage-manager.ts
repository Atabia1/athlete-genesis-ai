/**
 * Storage Manager Service
 *
 * This service provides storage quota management for IndexedDB:
 * - Monitors storage usage
 * - Implements data cleanup strategies
 * - Prioritizes important data when storage is limited
 * - Provides warnings when approaching storage limits
 */

import { dbService, IndexedDBError, IndexedDBErrorType } from './indexeddb/index';
import { toast } from '@/components/ui/use-toast';

// Storage thresholds in bytes
const STORAGE_WARNING_THRESHOLD = 0.8; // 80% of quota
const STORAGE_CRITICAL_THRESHOLD = 0.9; // 90% of quota

// Data retention policies (in days)
const RETENTION_POLICIES = {
  savedWorkouts: 365, // Keep saved workouts for 1 year
  healthData: 90,     // Keep health data for 90 days
  retryQueue: 30,     // Keep retry queue items for 30 days
  logs: 7,            // Keep logs for 7 days
};

// Data priority (higher number = higher priority)
const DATA_PRIORITIES = {
  savedWorkouts: 100,
  userPreferences: 90,
  healthData: 80,
  retryQueue: 70,
  logs: 10,
};

/**
 * Storage information
 */
export interface StorageInfo {
  usage: number;       // Current usage in bytes
  quota: number;       // Total quota in bytes
  percent: number;     // Usage as percentage of quota
  available: number;   // Available space in bytes
  isLow: boolean;      // True if storage is low
  isCritical: boolean; // True if storage is critically low
}

/**
 * Storage Manager Service
 */
class StorageManager {
  private lastCheck: Date | null = null;
  private storageInfo: StorageInfo | null = null;

  /**
   * Get storage information
   * @returns Promise that resolves with storage information
   */
  async getStorageInfo(): Promise<StorageInfo | null> {
    try {
      // Use the Storage API if available
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();

        if (estimate.usage !== undefined && estimate.quota !== undefined) {
          const usage = estimate.usage;
          const quota = estimate.quota;
          const percent = quota > 0 ? (usage / quota) : 0;
          const available = Math.max(0, quota - usage);

          this.storageInfo = {
            usage,
            quota,
            percent,
            available,
            isLow: percent >= STORAGE_WARNING_THRESHOLD,
            isCritical: percent >= STORAGE_CRITICAL_THRESHOLD
          };

          this.lastCheck = new Date();
          return this.storageInfo;
        }
      }

      // Fallback to IndexedDB size estimation
      const dbSize = await dbService.getEstimatedSize();
      if (dbSize !== null) {
        // We don't know the quota, so we can't calculate percentage
        // Just return what we know
        this.storageInfo = {
          usage: dbSize,
          quota: -1,
          percent: -1,
          available: -1,
          isLow: false,
          isCritical: false
        };

        this.lastCheck = new Date();
        return this.storageInfo;
      }

      return null;
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }

  /**
   * Check if storage is running low and show warnings if needed
   * @param silent If true, don't show toast notifications
   * @returns Promise that resolves with storage information
   */
  async checkStorage(silent: boolean = false): Promise<StorageInfo | null> {
    const info = await this.getStorageInfo();

    if (info) {
      // Show warnings if needed
      if (!silent) {
        if (info.isCritical) {
          toast({
            title: "Storage Almost Full",
            description: "Your device storage is almost full. Some data may be automatically removed to free up space.",
            variant: "destructive",
          });
        } else if (info.isLow) {
          toast({
            title: "Storage Running Low",
            description: "Your device storage is running low. Consider removing unused data.",
            variant: "warning",
          });
        }
      }
    }

    return info;
  }

  /**
   * Clean up old data based on retention policies
   * @returns Promise that resolves when cleanup is complete
   */
  async cleanupOldData(): Promise<void> {
    try {
      const now = new Date();

      // Clean up each store based on retention policy
      for (const [storeName, retentionDays] of Object.entries(RETENTION_POLICIES)) {
        // Skip if store doesn't exist
        try {
          await dbService.startTransaction([storeName], 'readonly');
          await dbService.commitTransaction();
        } catch (error) {
          if (error instanceof IndexedDBError && error.type === IndexedDBErrorType.STORE_NOT_FOUND) {
            continue;
          }
          throw error;
        }

        // Calculate cutoff date
        const cutoffDate = new Date(now);
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

        // Get all items
        const items = await dbService.getAll(storeName);

        // Find items older than cutoff date
        const itemsToDelete = items.filter(item => {
          const itemDate = item.updatedAt || item.createdAt || item.timestamp || item.date;
          if (!itemDate) return false;

          const date = new Date(itemDate);
          return date < cutoffDate;
        });

        // Delete old items
        if (itemsToDelete.length > 0) {
          const transaction = await dbService.startTransaction([storeName], 'readwrite');

          for (const item of itemsToDelete) {
            await transaction.delete(storeName, item.id);
          }

          dbService.commitTransaction();
          console.log(`Cleaned up ${itemsToDelete.length} old items from ${storeName}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old data:', error);
      throw error;
    }
  }

  /**
   * Free up space when storage is critically low
   * @param targetBytes Number of bytes to free up
   * @returns Promise that resolves with the number of bytes freed
   */
  async freeUpSpace(targetBytes: number): Promise<number> {
    try {
      // Get all store names
      const dbInfo = await dbService.getDatabaseInfo();
      const storeNames = dbInfo.objectStores;

      // Track how much space we've freed
      let freedBytes = 0;

      // Sort stores by priority (lowest first)
      const storesByPriority = storeNames
        .filter(store => store in DATA_PRIORITIES)
        .sort((a, b) => (DATA_PRIORITIES[a as keyof typeof DATA_PRIORITIES] || 0) -
                        (DATA_PRIORITIES[b as keyof typeof DATA_PRIORITIES] || 0));

      // Process each store in priority order
      for (const storeName of storesByPriority) {
        // Skip if we've already freed enough space
        if (freedBytes >= targetBytes) break;

        // Get all items
        const items = await dbService.getAll(storeName);

        // Skip if store is empty
        if (items.length === 0) continue;

        // Sort items by date (oldest first)
        items.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || a.timestamp || a.date || 0);
          const dateB = new Date(b.updatedAt || b.createdAt || b.timestamp || b.date || 0);
          return dateA.getTime() - dateB.getTime();
        });

        // Calculate approximate size per item
        const totalSize = JSON.stringify(items).length;
        const sizePerItem = totalSize / items.length;

        // Calculate how many items we need to delete
        const itemsToDelete = Math.min(
          items.length,
          Math.ceil((targetBytes - freedBytes) / sizePerItem)
        );

        if (itemsToDelete > 0) {
          // Delete oldest items
          const transaction = await dbService.startTransaction([storeName], 'readwrite');

          for (let i = 0; i < itemsToDelete; i++) {
            await transaction.delete(storeName, items[i].id);
          }

          dbService.commitTransaction();

          // Update freed bytes
          freedBytes += itemsToDelete * sizePerItem;

          console.log(`Freed approximately ${Math.round(itemsToDelete * sizePerItem / 1024)} KB by removing ${itemsToDelete} items from ${storeName}`);
        }
      }

      return freedBytes;
    } catch (error) {
      console.error('Error freeing up space:', error);
      return 0;
    }
  }

  /**
   * Handle quota exceeded error by freeing up space
   * @returns Promise that resolves when space has been freed
   */
  async handleQuotaExceeded(): Promise<boolean> {
    try {
      // Check current storage
      const info = await this.getStorageInfo();
      if (!info || info.quota <= 0) return false;

      // Calculate how much space to free (10% of quota)
      const targetBytes = Math.ceil(info.quota * 0.1);

      // Try to free up space
      const freedBytes = await this.freeUpSpace(targetBytes);

      // Return success if we freed any space
      return freedBytes > 0;
    } catch (error) {
      console.error('Error handling quota exceeded:', error);
      return false;
    }
  }
}

// Export singleton instance
export const storageManager = new StorageManager();
