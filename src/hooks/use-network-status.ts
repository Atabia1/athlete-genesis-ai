
/**
 * useNetworkStatus
 * 
 * A hook that tracks the current network status (online/offline)
 * and provides utility functions for network-related operations.
 */

import { useState, useEffect, useCallback } from 'react';

interface NetworkStatusState {
  isOnline: boolean;
  wasOffline: boolean;
  lastOnline: Date | null;
  lastOffline: Date | null;
  connectionType: string | null;
  effectiveType: string | null;
}

export function useNetworkStatus() {
  const [networkState, setNetworkState] = useState<NetworkStatusState>({
    isOnline: navigator.onLine,
    wasOffline: false,
    lastOnline: navigator.onLine ? new Date() : null,
    lastOffline: navigator.onLine ? null : new Date(),
    connectionType: null,
    effectiveType: null
  });

  // Update connection details
  const updateConnectionDetails = useCallback(() => {
    // @ts-ignore - TS doesn't know about navigator.connection
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      setNetworkState(prev => ({
        ...prev,
        connectionType: connection.type || null,
        effectiveType: connection.effectiveType || null
      }));
    }
  }, []);

  // Handle going online
  const handleOnline = useCallback(() => {
    setNetworkState(prev => ({
      ...prev,
      isOnline: true,
      wasOffline: !prev.isOnline,
      lastOnline: new Date()
    }));
    updateConnectionDetails();
  }, [updateConnectionDetails]);

  // Handle going offline
  const handleOffline = useCallback(() => {
    setNetworkState(prev => ({
      ...prev,
      isOnline: false,
      lastOffline: new Date()
    }));
  }, []);

  // Check if the network is actually reachable
  const checkNetworkReachability = useCallback(async (): Promise<boolean> => {
    if (!navigator.onLine) return false;
    
    try {
      // Try to fetch a small resource to confirm connectivity
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Network reachability check failed:', error);
      return false;
    }
  }, []);

  // Set up event listeners for online/offline events
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial connection details check
    updateConnectionDetails();
    
    // Verify actual connectivity
    checkNetworkReachability().then(isReachable => {
      if (!isReachable && networkState.isOnline) {
        // We're technically "online" but can't reach the server
        setNetworkState(prev => ({
          ...prev,
          isOnline: false,
          lastOffline: new Date()
        }));
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline, updateConnectionDetails, checkNetworkReachability, networkState.isOnline]);

  // Listen for connection changes if available
  useEffect(() => {
    // @ts-ignore - TS doesn't know about navigator.connection
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      connection.addEventListener('change', updateConnectionDetails);
      
      return () => {
        connection.removeEventListener('change', updateConnectionDetails);
      };
    }
  }, [updateConnectionDetails]);

  return {
    isOnline: networkState.isOnline,
    wasOffline: networkState.wasOffline,
    lastOnline: networkState.lastOnline,
    lastOffline: networkState.lastOffline,
    connectionType: networkState.connectionType,
    effectiveType: networkState.effectiveType,
    checkNetworkReachability
  };
}
