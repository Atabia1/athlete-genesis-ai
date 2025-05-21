/**
 * Storage Manager
 * 
 * Manages storage quota and cleanup operations for IndexedDB
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
  percentUsed: number;
}

/**
 * Storage Manager Class
 */
class StorageManager {
  /**
   * Check storage status
   * @param detailed Whether to return detailed storage information
   * @returns Storage information or null if not available
   */
  async checkStorage(detailed = false): Promise<StorageInfo | null> {
    try {
      // Check if the Storage API is available
      if (!navigator.storage || !navigator.storage.estimate) {
        console.warn('Storage API not available');
        return null;
      }
      
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;
      
      // Consider storage low if over 80% full
      const isLow = percentUsed > 80;
      
      // Consider storage critical if over 90% full
      const isCritical = percentUsed > 90;
      
      console.log(`Storage: ${Math.round(percentUsed)}% used (${this.formatBytes(usage)} / ${this.formatBytes(quota)})`);
      
      return {
        isLow,
        isCritical,
        usage,
        quota,
        percentUsed
      };
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
  
  /**
   * Format bytes to a human-readable string
   * @param bytes Number of bytes
   * @returns Formatted string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const storageManager = new StorageManager();
