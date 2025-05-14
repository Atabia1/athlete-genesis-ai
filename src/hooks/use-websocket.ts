/**
 * useWebSocket Hook
 * 
 * This hook provides a convenient way to use the WebSocket service in React components.
 * It handles connection management, event listeners, and status updates.
 */

import { useState, useEffect, useCallback } from 'react';
import websocketService, { 
  WebSocketStatus, 
  WebSocketEventType,
  WebSocketMessage
} from '@/services/websocket-service';

interface UseWebSocketOptions {
  /** Connect automatically on mount */
  autoConnect?: boolean;
  /** Reconnect automatically when connection is lost */
  autoReconnect?: boolean;
  /** Authentication token */
  authToken?: string | null;
}

interface UseWebSocketResult {
  /** Current connection status */
  status: WebSocketStatus;
  /** Connect to the WebSocket server */
  connect: () => void;
  /** Disconnect from the WebSocket server */
  disconnect: () => void;
  /** Send a message to the WebSocket server */
  send: <T>(type: WebSocketEventType, data: T) => boolean;
  /** Add an event listener */
  addEventListener: <T>(type: WebSocketEventType, listener: (data: T) => void) => void;
  /** Remove an event listener */
  removeEventListener: <T>(type: WebSocketEventType, listener: (data: T) => void) => void;
}

/**
 * useWebSocket hook
 * @param options Hook options
 * @returns WebSocket utilities
 */
export function useWebSocket({
  autoConnect = true,
  autoReconnect = true,
  authToken = null,
}: UseWebSocketOptions = {}): UseWebSocketResult {
  const [status, setStatus] = useState<WebSocketStatus>(websocketService.getStatus());

  // Set auth token
  useEffect(() => {
    websocketService.setAuthToken(authToken);
  }, [authToken]);

  // Connect on mount if autoConnect is true
  useEffect(() => {
    if (autoConnect) {
      websocketService.connect();
    }

    // Add status listener
    const statusListener = (newStatus: WebSocketStatus) => {
      setStatus(newStatus);
    };
    websocketService.addStatusListener(statusListener);

    // Clean up on unmount
    return () => {
      websocketService.removeStatusListener(statusListener);
      
      // Only disconnect if autoReconnect is false
      if (!autoReconnect) {
        websocketService.disconnect();
      }
    };
  }, [autoConnect, autoReconnect]);

  // Connect method
  const connect = useCallback(() => {
    websocketService.connect();
  }, []);

  // Disconnect method
  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  // Send method
  const send = useCallback(<T,>(type: WebSocketEventType, data: T): boolean => {
    return websocketService.send(type, data);
  }, []);

  // Add event listener method
  const addEventListener = useCallback(<T,>(
    type: WebSocketEventType, 
    listener: (data: T) => void
  ) => {
    websocketService.addEventListener(type, listener);
  }, []);

  // Remove event listener method
  const removeEventListener = useCallback(<T,>(
    type: WebSocketEventType, 
    listener: (data: T) => void
  ) => {
    websocketService.removeEventListener(type, listener);
  }, []);

  return {
    status,
    connect,
    disconnect,
    send,
    addEventListener,
    removeEventListener,
  };
}

/**
 * useWebSocketEvent hook
 * 
 * This hook subscribes to a specific WebSocket event and provides the latest data.
 * 
 * @param eventType The event type to subscribe to
 * @param initialData Initial data value
 * @returns The latest event data
 */
export function useWebSocketEvent<T>(
  eventType: WebSocketEventType,
  initialData: T
): T {
  const [data, setData] = useState<T>(initialData);
  
  useEffect(() => {
    const handleEvent = (eventData: T) => {
      setData(eventData);
    };
    
    websocketService.addEventListener(eventType, handleEvent);
    
    return () => {
      websocketService.removeEventListener(eventType, handleEvent);
    };
  }, [eventType]);
  
  return data;
}

export default useWebSocket;
