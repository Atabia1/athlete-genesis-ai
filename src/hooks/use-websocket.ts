
import { useState, useEffect, useRef, useCallback } from 'react';

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export interface UseWebSocketReturn {
  socket: WebSocket | null;
  connectionStatus: 'Connecting' | 'Open' | 'Closing' | 'Closed';
  lastMessage: MessageEvent | null;
  sendMessage: (message: string) => void;
  sendJsonMessage: (message: object) => void;
  reconnect: () => void;
  disconnect: () => void;
}

export function useWebSocket(config: WebSocketConfig): UseWebSocketReturn {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'Connecting' | 'Open' | 'Closing' | 'Closed'>('Closed');
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const socketRef = useRef<WebSocket | null>(null);

  const { url, protocols, reconnectAttempts = 5, reconnectInterval = 3000 } = config;

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url, protocols);
      socketRef.current = ws;
      setSocket(ws);
      setConnectionStatus('Connecting');

      ws.onopen = () => {
        setConnectionStatus('Open');
        reconnectAttemptsRef.current = 0;
      };

      ws.onclose = () => {
        setConnectionStatus('Closed');
        setSocket(null);
        socketRef.current = null;

        // Auto-reconnect logic
        if (reconnectAttemptsRef.current < reconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = () => {
        setConnectionStatus('Closed');
      };

      ws.onmessage = (event) => {
        setLastMessage(event);
      };
    } catch {
      setConnectionStatus('Closed');
    }
  }, [url, protocols, reconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(connect, 100);
  }, [disconnect, connect]);

  const sendMessage = useCallback((message: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  }, [socket]);

  const sendJsonMessage = useCallback((message: object) => {
    sendMessage(JSON.stringify(message));
  }, [sendMessage]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  return {
    socket,
    connectionStatus,
    lastMessage,
    sendMessage,
    sendJsonMessage,
    reconnect,
    disconnect,
  };
}
