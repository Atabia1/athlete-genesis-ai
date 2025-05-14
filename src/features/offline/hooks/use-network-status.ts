/**
 * useNetworkStatus: Enhanced custom hook for detecting network connectivity
 *
 * This hook provides a robust network status detection system that:
 * 1. Monitors browser's network connection status via navigator.onLine
 * 2. Performs active server connectivity checks via fetch requests
 * 3. Detects slow or unreliable connections
 * 4. Provides detailed connection state information
 *
 * Returns:
 * - isOnline: Boolean indicating if the user has actual internet connectivity
 * - wasOffline: Boolean indicating if the user was previously offline
 * - connectionQuality: String indicating the quality of the connection
 * - lastChecked: Date object indicating when the connection was last checked
 * - checkConnection: Function to manually trigger a connection check
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Define connection quality types
export type ConnectionQuality = 'unknown' | 'offline' | 'poor' | 'good' | 'excellent' | 'captive-portal';

// Define connection check result
interface ConnectionCheckResult {
  online: boolean;
  latency: number | null;
  quality: ConnectionQuality;
  timestamp: Date;
  isCaptivePortal?: boolean;
}

// Configuration options
interface NetworkStatusOptions {
  // URL to ping for connectivity check (should be lightweight and reliable)
  pingUrl?: string;
  // Secondary URL to check for captive portal detection (should be a different domain)
  secondaryPingUrl?: string;
  // How often to check connection in milliseconds
  checkInterval?: number;
  // Timeout for ping requests in milliseconds
  pingTimeout?: number;
  // Latency thresholds in milliseconds
  latencyThresholds?: {
    poor: number;    // Above this value is considered poor
    good: number;    // Above this value is considered good, below is excellent
  };
  // Expected response for captive portal detection
  expectedResponse?: {
    status?: number;  // Expected HTTP status code
    text?: string;    // Expected response text (or substring)
  };
}

// Default configuration
const defaultOptions: NetworkStatusOptions = {
  // Use a reliable endpoint that returns a small response
  // This should be updated to use your own API endpoint
  pingUrl: 'https://www.google.com/generate_204',
  // Use a different domain for secondary check to detect captive portals
  secondaryPingUrl: 'https://www.cloudflare.com/cdn-cgi/trace',
  checkInterval: 30000, // Check every 30 seconds
  pingTimeout: 5000,    // 5 second timeout for ping
  latencyThresholds: {
    poor: 1000,  // Above 1000ms is poor
    good: 300,   // Between 300-1000ms is good, below 300ms is excellent
  },
  // Expected response for captive portal detection
  expectedResponse: {
    status: 204,  // Google's generate_204 endpoint returns 204 No Content
    text: ''      // Empty response body
  }
};

export function useNetworkStatus(options: NetworkStatusOptions = {}) {
  // Merge default options with provided options
  const config = { ...defaultOptions, ...options };

  // State for connection status
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>('unknown');
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  // Ref for interval ID to avoid recreating the interval on each render
  const intervalRef = useRef<number | null>(null);
  // Ref to track if a check is in progress
  const checkInProgressRef = useRef<boolean>(false);

  /**
   * Check for captive portal by comparing responses from two different domains
   * This helps detect situations where a user is connected to a WiFi network
   * but needs to authenticate through a captive portal
   */
  const checkForCaptivePortal = useCallback(async (): Promise<boolean> => {
    try {
      // Use AbortController to implement timeout
      const controller1 = new AbortController();
      const controller2 = new AbortController();
      const timeoutId1 = setTimeout(() => controller1.abort(), config.pingTimeout);
      const timeoutId2 = setTimeout(() => controller2.abort(), config.pingTimeout);

      // Try to fetch from two different domains
      const [primaryResponse, secondaryResponse] = await Promise.all([
        fetch(config.pingUrl!, {
          method: 'GET',
          cache: 'no-store',
          signal: controller1.signal,
        }).catch(err => null),
        fetch(config.secondaryPingUrl!, {
          method: 'GET',
          cache: 'no-store',
          signal: controller2.signal,
        }).catch(err => null)
      ]);

      // Clear timeouts
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);

      // If both responses are null, we're offline
      if (!primaryResponse && !secondaryResponse) {
        return false;
      }

      // Check for unexpected responses that might indicate a captive portal
      if (primaryResponse) {
        // Check if status matches expected (204 for Google's generate_204)
        const expectedStatus = config.expectedResponse?.status || 204;
        if (primaryResponse.status !== expectedStatus) {
          console.log('Captive portal detected: Unexpected status code', primaryResponse.status);
          return true;
        }

        // For text-based checks, we need to read the response body
        if (config.expectedResponse?.text !== undefined) {
          const text = await primaryResponse.text();
          // If we expect empty response but got content, likely a captive portal
          if (config.expectedResponse.text === '' && text.length > 0) {
            console.log('Captive portal detected: Unexpected response body', text.substring(0, 100));
            return true;
          }
        }
      }

      // If primary works but secondary doesn't, might be selective blocking or a captive portal
      if (primaryResponse && !secondaryResponse) {
        console.log('Possible captive portal: Primary domain accessible but secondary is not');
        return true;
      }

      // If responses from both domains are successful but different from expected,
      // it might be a sophisticated captive portal that's intercepting all requests
      if (primaryResponse && secondaryResponse) {
        // Additional checks could be implemented here for specific captive portal behaviors
        // For example, comparing response headers or content for signs of interception
      }

      // No captive portal detected
      return false;
    } catch (error) {
      console.error('Error checking for captive portal:', error);
      return false; // Assume no captive portal on error
    }
  }, [config.pingUrl, config.secondaryPingUrl, config.pingTimeout, config.expectedResponse]);

  /**
   * Check connection by pinging the server
   * This provides a reliable way to check if we have actual internet connectivity
   * and can detect captive portals
   */
  const checkConnection = useCallback(async (): Promise<ConnectionCheckResult> => {
    // Don't run multiple checks simultaneously
    if (checkInProgressRef.current) {
      return {
        online: isOnline,
        latency: null,
        quality: connectionQuality,
        timestamp: lastChecked
      };
    }

    checkInProgressRef.current = true;
    const startTime = Date.now();
    const timestamp = new Date();

    try {
      // First check for captive portal
      const isCaptivePortal = await checkForCaptivePortal();

      if (isCaptivePortal) {
        checkInProgressRef.current = false;
        return {
          online: true, // Technically online but limited
          latency: null,
          quality: 'captive-portal',
          timestamp,
          isCaptivePortal: true
        };
      }

      // If no captive portal, proceed with normal connection check
      // Use AbortController to implement timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.pingTimeout);

      // Attempt to fetch a small resource from the server
      const response = await fetch(config.pingUrl!, {
        method: 'HEAD', // Use HEAD to minimize data transfer
        cache: 'no-store', // Don't use cache
        signal: controller.signal,
      });

      // Clear the timeout
      clearTimeout(timeoutId);

      // Calculate latency
      const latency = Date.now() - startTime;

      // Determine connection quality based on latency
      let quality: ConnectionQuality;
      if (latency > config.latencyThresholds!.poor) {
        quality = 'poor';
      } else if (latency > config.latencyThresholds!.good) {
        quality = 'good';
      } else {
        quality = 'excellent';
      }

      checkInProgressRef.current = false;
      return { online: true, latency, quality, timestamp, isCaptivePortal: false };
    } catch (error) {
      // If the fetch fails, we're offline or have a very poor connection
      console.log('Connection check failed:', error);
      checkInProgressRef.current = false;
      return { online: false, latency: null, quality: 'offline', timestamp, isCaptivePortal: false };
    }
  }, [config.pingUrl, config.pingTimeout, config.latencyThresholds, isOnline, connectionQuality, lastChecked, checkForCaptivePortal]);

  /**
   * Update connection status based on check result
   */
  const updateConnectionStatus = useCallback(async () => {
    try {
      const result = await checkConnection();

      // Update state based on check result
      setIsOnline(result.online);
      setConnectionQuality(result.quality);
      setLastChecked(result.timestamp);

      // If we were offline before and now we're online, set wasOffline to true
      if (!isOnline && result.online) {
        setWasOffline(true);
        // Reset wasOffline after 5 seconds
        setTimeout(() => setWasOffline(false), 5000);
      }

      return result;
    } catch (error) {
      console.error('Error checking connection:', error);
      return null;
    }
  }, [checkConnection, isOnline]);

  // Handle browser online/offline events
  useEffect(() => {
    // Function to handle browser online event
    const handleOnline = () => {
      // When browser reports online, verify with an actual connection check
      updateConnectionStatus();
    };

    // Function to handle browser offline event
    const handleOffline = () => {
      // When browser reports offline, update state immediately
      setIsOnline(false);
      setConnectionQuality('offline');
      setLastChecked(new Date());
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [updateConnectionStatus]);

  // Set up periodic connection checks
  useEffect(() => {
    // Initial connection check
    updateConnectionStatus();

    // Set up interval for periodic checks
    intervalRef.current = window.setInterval(() => {
      // Only perform check if navigator.onLine is true
      // This avoids unnecessary requests when we know we're offline
      if (navigator.onLine) {
        updateConnectionStatus();
      }
    }, config.checkInterval);

    // Clean up interval on unmount
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateConnectionStatus, config.checkInterval]);

  // Listen for network information changes if available
  useEffect(() => {
    // Check if the Network Information API is available
    interface NetworkInformation extends EventTarget {
      addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
      removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
      saveData?: boolean;
      type?: string;
    }

    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;

    if (connection) {
      const handleConnectionChange = () => {
        // When connection information changes, perform a check
        updateConnectionStatus();
      };

      // Add event listener
      connection.addEventListener('change', handleConnectionChange);

      // Clean up event listener
      return () => {
        connection.removeEventListener('change', handleConnectionChange);
      };
    }
  }, [updateConnectionStatus]);

  return {
    isOnline,
    wasOffline,
    connectionQuality,
    lastChecked,
    checkConnection: updateConnectionStatus // Expose function to manually trigger a check
  };
}
