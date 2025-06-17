/**
 * Storage Manager Service
 *
 * This service manages browser storage quotas and provides utilities for
 * checking storage usage, cleaning up old data, and handling storage-related errors.
 */

/**
 * Storage information
 */
interface StorageInfo {
  /**
   * Whether storage usage is low
   */
  isLow: boolean;
  
  /**
   * Whether storage usage is critical
   */
  isCritical: boolean;
  
  /**
   * Used storage in bytes
   */
  usage: number;
  
  /**
   * Total storage quota in bytes
   */
  quota: number;
  
  /**
   * Percentage of storage used
   */
  usagePercentage: number;
  
  /**
   * Available storage in bytes
   */
  available: number;
}

/**
 * Storage Manager Class
 */
class StorageManager {
  private readonly STORAGE_QUOTA_THRESHOLD = 0.8; // 80% usage threshold
  private readonly CRITICAL_STORAGE_THRESHOLD = 0.95; // 95% usage threshold

  /**
   * Check storage status
   * @param showDetails Whether to include detailed information (optional parameter)
   * @returns Storage information or null if not available
   */
  async checkStorage(showDetails?: boolean): Promise<StorageInfo | null> {
    try {
      if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
        return null;
      }

      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;

      if (quota === 0) {
        return null;
      }

      const usagePercentage = usage / quota;
      const isLow = usagePercentage > this.STORAGE_QUOTA_THRESHOLD;
      const isCritical = usagePercentage > this.CRITICAL_STORAGE_THRESHOLD;

      const storageInfo: StorageInfo = {
        usage,
        quota,
        usagePercentage,
        isLow,
        isCritical,
        available: quota - usage,
      };

      // Log details if requested
      if (showDetails) {
        console.log('Storage info:', storageInfo);
      }

      return storageInfo;
    } catch (error) {
      console.error('Error checking storage:', error);
      return null;
    }
  }
  
  /**
   * Clean up old data to free space
   * @returns Whether cleanup was successful
   */
  async cleanupOldData(): Promise<boolean> {
    try {
      console.log('Cleaning up old data...');
      // Implementation would clean up old data from IndexedDB
      // This is a placeholder implementation
      
      return true;
    } catch (error) {
      console.error('Error cleaning up data:', error);
      return false;
    }
  }
  
  /**
   * Handle quota exceeded error
   * @returns Whether handling was successful
   */
  async handleQuotaExceeded(): Promise<boolean> {
    try {
      console.log('Handling quota exceeded...');
      
      // Try to free up space
      const cleaned = await this.cleanupOldData();
      
      // Check storage again
      const storageInfo = await this.checkStorage();
      
      // If still critical, we couldn't free enough space
      if (storageInfo?.isCritical) {
        return false;
      }
      
      return cleaned;
    } catch (error) {
      console.error('Error handling quota exceeded:', error);
      return false;
    }
  }
  
  /**
   * Get storage information
   * @returns Storage information or null if not available
   */
  async getStorageInfo(): Promise<StorageInfo | null> {
    return this.checkStorage(true);
  }
}

// Export singleton instance
export const storageManager = new StorageManager();
