
/**
 * useNetworkStatus: A hook for detecting and monitoring network connectivity
 * 
 * This hook provides:
 * 1. Current online/offline status
 * 2. Detection of network transitions (e.g., was offline, now online)
 * 3. Network quality information
 */

import { useState, useEffect } from 'react';

interface NetworkStatusResult {
  isOnline: boolean;
  wasOffline: boolean;
  networkEffectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  lastOnlineAt: Date | null;
  lastOfflineAt: Date | null;
}

export function useNetworkStatus(): NetworkStatusResult {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(isOnline ? new Date() : null);
  const [lastOfflineAt, setLastOfflineAt] = useState<Date | null>(isOnline ? null : new Date());
  const [networkEffectiveType, setNetworkEffectiveType] = useState<'slow-2g' | '2g' | '3g' | '4g' | undefined>(undefined);
  
  useEffect(() => {
    // Handle online event
    const handleOnline = () => {
      setWasOffline(true);
      setIsOnline(true);
      setLastOnlineAt(new Date());
      
      // Reset wasOffline after a delay
      setTimeout(() => {
        setWasOffline(false);
      }, 5000);
    };
    
    // Handle offline event
    const handleOffline = () => {
      setIsOnline(false);
      setLastOfflineAt(new Date());
    };
    
    // Check network connection quality using the Network Information API
    const checkConnectionQuality = () => {
      if ('connection' in navigator && navigator.connection) {
        const connection = navigator.connection as any;
        if (connection.effectiveType) {
          setNetworkEffectiveType(connection.effectiveType);
        }
      }
    };
    
    // Register events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial check of connection quality
    checkConnectionQuality();
    
    // Set up periodic checks of connection quality
    const intervalId = setInterval(checkConnectionQuality, 10000);
    
    // Clean up event listeners and intervals
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);
  
  return {
    isOnline,
    wasOffline,
    networkEffectiveType,
    lastOnlineAt,
    lastOfflineAt,
  };
}

export default useNetworkStatus;
