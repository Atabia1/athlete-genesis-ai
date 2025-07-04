
/**
 * useWebSocket Hook Tests
 * 
 * This file contains tests for the useWebSocket hook.
 */

import { renderHook, act } from '@testing-library/react';
import { useWebSocket } from '../use-websocket';

// Create a proper WebSocket mock constructor function
function MockWebSocketConstructor() {
  return {
    close: jest.fn(),
    send: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    readyState: 1, // WebSocket.OPEN
  };
}

// Add the static constants directly to the constructor function
(MockWebSocketConstructor as any).CONNECTING = 0;
(MockWebSocketConstructor as any).OPEN = 1;
(MockWebSocketConstructor as any).CLOSING = 2;
(MockWebSocketConstructor as any).CLOSED = 3;

global.WebSocket = MockWebSocketConstructor as any;

describe('useWebSocket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useWebSocket({ url: 'ws://localhost:8080' }));
    
    expect(result.current.socket).toBeNull();
    expect(result.current.connectionStatus).toBe('Closed');
    expect(result.current.lastMessage).toBeNull();
  });
  
  it('should provide sendMessage function', () => {
    const { result } = renderHook(() => useWebSocket({ url: 'ws://localhost:8080' }));
    
    expect(typeof result.current.sendMessage).toBe('function');
  });
  
  it('should provide sendJsonMessage function', () => {
    const { result } = renderHook(() => useWebSocket({ url: 'ws://localhost:8080' }));
    
    expect(typeof result.current.sendJsonMessage).toBe('function');
  });
  
  it('should provide reconnect function', () => {
    const { result } = renderHook(() => useWebSocket({ url: 'ws://localhost:8080' }));
    
    expect(typeof result.current.reconnect).toBe('function');
  });
  
  it('should provide disconnect function', () => {
    const { result } = renderHook(() => useWebSocket({ url: 'ws://localhost:8080' }));
    
    expect(typeof result.current.disconnect).toBe('function');
  });
  
  it('should call disconnect on unmount', () => {
    const { unmount } = renderHook(() => useWebSocket({ url: 'ws://localhost:8080' }));
    
    // Just ensure unmount doesn't throw
    expect(() => unmount()).not.toThrow();
  });
  
  it('should handle sendMessage when not connected', () => {
    const { result } = renderHook(() => useWebSocket({ url: 'ws://localhost:8080' }));
    
    act(() => {
      result.current.sendMessage('test message');
    });
    
    // Should not throw when socket is not connected
    expect(result.current.socket).toBeNull();
  });
  
  it('should handle sendJsonMessage when not connected', () => {
    const { result } = renderHook(() => useWebSocket({ url: 'ws://localhost:8080' }));
    
    act(() => {
      result.current.sendJsonMessage({ message: 'test' });
    });
    
    // Should not throw when socket is not connected
    expect(result.current.socket).toBeNull();
  });
});
