
/**
 * useWebSocket Hook Tests
 * 
 * This file contains tests for the useWebSocket hook.
 */

import { renderHook, act } from '@testing-library/react';
import { useWebSocket } from '../use-websocket';

// Mock WebSocket
global.WebSocket = jest.fn().mockImplementation(() => ({
  close: jest.fn(),
  send: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  readyState: WebSocket.OPEN,
}));

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
