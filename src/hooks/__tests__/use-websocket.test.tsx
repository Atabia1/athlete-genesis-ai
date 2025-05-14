/**
 * useWebSocket Hook Tests
 * 
 * This file contains tests for the useWebSocket hook.
 */

import { renderHook, act } from '@testing-library/react';
import { useWebSocket, useWebSocketEvent } from '../use-websocket';
import websocketService, { WebSocketEventType, WebSocketStatus } from '@/services/websocket-service';

// Mock the websocket service
jest.mock('@/services/websocket-service', () => {
  const originalModule = jest.requireActual('@/services/websocket-service');
  
  return {
    __esModule: true,
    ...originalModule,
    default: {
      connect: jest.fn(),
      disconnect: jest.fn(),
      send: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addStatusListener: jest.fn(),
      removeStatusListener: jest.fn(),
      getStatus: jest.fn().mockReturnValue(WebSocketStatus.DISCONNECTED),
      setAuthToken: jest.fn(),
    },
    WebSocketStatus: originalModule.WebSocketStatus,
    WebSocketEventType: originalModule.WebSocketEventType,
  };
});

describe('useWebSocket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should connect on mount when autoConnect is true', () => {
    renderHook(() => useWebSocket({ autoConnect: true }));
    expect(websocketService.connect).toHaveBeenCalled();
  });
  
  it('should not connect on mount when autoConnect is false', () => {
    renderHook(() => useWebSocket({ autoConnect: false }));
    expect(websocketService.connect).not.toHaveBeenCalled();
  });
  
  it('should set auth token when provided', () => {
    const authToken = 'test-token';
    renderHook(() => useWebSocket({ authToken }));
    expect(websocketService.setAuthToken).toHaveBeenCalledWith(authToken);
  });
  
  it('should add status listener on mount', () => {
    renderHook(() => useWebSocket());
    expect(websocketService.addStatusListener).toHaveBeenCalled();
  });
  
  it('should remove status listener on unmount', () => {
    const { unmount } = renderHook(() => useWebSocket());
    unmount();
    expect(websocketService.removeStatusListener).toHaveBeenCalled();
  });
  
  it('should disconnect on unmount when autoReconnect is false', () => {
    const { unmount } = renderHook(() => useWebSocket({ autoReconnect: false }));
    unmount();
    expect(websocketService.disconnect).toHaveBeenCalled();
  });
  
  it('should not disconnect on unmount when autoReconnect is true', () => {
    const { unmount } = renderHook(() => useWebSocket({ autoReconnect: true }));
    unmount();
    expect(websocketService.disconnect).not.toHaveBeenCalled();
  });
  
  it('should return the current status', () => {
    (websocketService.getStatus as jest.Mock).mockReturnValue(WebSocketStatus.CONNECTED);
    const { result } = renderHook(() => useWebSocket());
    expect(result.current.status).toBe(WebSocketStatus.CONNECTED);
  });
  
  it('should update status when status listener is called', () => {
    let statusListener: ((status: WebSocketStatus) => void) | null = null;
    
    (websocketService.addStatusListener as jest.Mock).mockImplementation((listener) => {
      statusListener = listener;
    });
    
    const { result } = renderHook(() => useWebSocket());
    
    act(() => {
      if (statusListener) {
        statusListener(WebSocketStatus.CONNECTED);
      }
    });
    
    expect(result.current.status).toBe(WebSocketStatus.CONNECTED);
  });
  
  it('should call connect method', () => {
    const { result } = renderHook(() => useWebSocket());
    
    act(() => {
      result.current.connect();
    });
    
    expect(websocketService.connect).toHaveBeenCalled();
  });
  
  it('should call disconnect method', () => {
    const { result } = renderHook(() => useWebSocket());
    
    act(() => {
      result.current.disconnect();
    });
    
    expect(websocketService.disconnect).toHaveBeenCalled();
  });
  
  it('should call send method', () => {
    (websocketService.send as jest.Mock).mockReturnValue(true);
    
    const { result } = renderHook(() => useWebSocket());
    
    const type = WebSocketEventType.HEALTH_DATA_UPDATE;
    const data = { steps: 1000 };
    
    let sendResult: boolean | undefined;
    
    act(() => {
      sendResult = result.current.send(type, data);
    });
    
    expect(websocketService.send).toHaveBeenCalledWith(type, data);
    expect(sendResult).toBe(true);
  });
  
  it('should call addEventListener method', () => {
    const { result } = renderHook(() => useWebSocket());
    
    const type = WebSocketEventType.HEALTH_DATA_UPDATE;
    const listener = jest.fn();
    
    act(() => {
      result.current.addEventListener(type, listener);
    });
    
    expect(websocketService.addEventListener).toHaveBeenCalledWith(type, listener);
  });
  
  it('should call removeEventListener method', () => {
    const { result } = renderHook(() => useWebSocket());
    
    const type = WebSocketEventType.HEALTH_DATA_UPDATE;
    const listener = jest.fn();
    
    act(() => {
      result.current.removeEventListener(type, listener);
    });
    
    expect(websocketService.removeEventListener).toHaveBeenCalledWith(type, listener);
  });
});

describe('useWebSocketEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should add event listener on mount', () => {
    const eventType = WebSocketEventType.HEALTH_DATA_UPDATE;
    const initialData = { steps: 0 };
    
    renderHook(() => useWebSocketEvent(eventType, initialData));
    
    expect(websocketService.addEventListener).toHaveBeenCalledWith(eventType, expect.any(Function));
  });
  
  it('should remove event listener on unmount', () => {
    const eventType = WebSocketEventType.HEALTH_DATA_UPDATE;
    const initialData = { steps: 0 };
    
    const { unmount } = renderHook(() => useWebSocketEvent(eventType, initialData));
    unmount();
    
    expect(websocketService.removeEventListener).toHaveBeenCalledWith(eventType, expect.any(Function));
  });
  
  it('should return initial data', () => {
    const eventType = WebSocketEventType.HEALTH_DATA_UPDATE;
    const initialData = { steps: 0 };
    
    const { result } = renderHook(() => useWebSocketEvent(eventType, initialData));
    
    expect(result.current).toEqual(initialData);
  });
  
  it('should update data when event listener is called', () => {
    const eventType = WebSocketEventType.HEALTH_DATA_UPDATE;
    const initialData = { steps: 0 };
    const newData = { steps: 1000 };
    
    let eventListener: ((data: any) => void) | null = null;
    
    (websocketService.addEventListener as jest.Mock).mockImplementation((type, listener) => {
      if (type === eventType) {
        eventListener = listener;
      }
    });
    
    const { result } = renderHook(() => useWebSocketEvent(eventType, initialData));
    
    act(() => {
      if (eventListener) {
        eventListener(newData);
      }
    });
    
    expect(result.current).toEqual(newData);
  });
});
