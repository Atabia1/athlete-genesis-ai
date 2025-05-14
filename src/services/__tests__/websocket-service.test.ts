/**
 * WebSocket Service Tests
 * 
 * This file contains tests for the WebSocket service.
 */

import { 
  websocketService, 
  WebSocketEventType, 
  WebSocketStatus 
} from '../websocket-service';

// Mock WebSocket
class MockWebSocket {
  url: string;
  onopen: ((this: WebSocket, ev: Event) => any) | null = null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null = null;
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null = null;
  onerror: ((this: WebSocket, ev: Event) => any) | null = null;
  readyState: number = 0; // CONNECTING
  
  constructor(url: string) {
    this.url = url;
  }
  
  send(data: string): void {
    // Mock implementation
  }
  
  close(code?: number, reason?: string): void {
    // Mock implementation
    this.readyState = 3; // CLOSED
    if (this.onclose) {
      const closeEvent = { code: code || 1000, reason: reason || '' } as CloseEvent;
      this.onclose.call(this, closeEvent);
    }
  }
  
  // Helper methods for testing
  simulateOpen(): void {
    this.readyState = 1; // OPEN
    if (this.onopen) {
      this.onopen.call(this, {} as Event);
    }
  }
  
  simulateMessage(data: any): void {
    if (this.onmessage) {
      const messageEvent = { data: JSON.stringify(data) } as MessageEvent;
      this.onmessage.call(this, messageEvent);
    }
  }
  
  simulateError(): void {
    if (this.onerror) {
      this.onerror.call(this, {} as Event);
    }
  }
  
  simulateClose(code: number = 1000, reason: string = ''): void {
    this.readyState = 3; // CLOSED
    if (this.onclose) {
      const closeEvent = { code, reason } as CloseEvent;
      this.onclose.call(this, closeEvent);
    }
  }
}

// Mock global WebSocket
global.WebSocket = MockWebSocket as any;

describe('WebSocket Service', () => {
  let mockWebSocket: MockWebSocket;
  
  beforeEach(() => {
    // Reset the service before each test
    websocketService.disconnect();
    
    // Spy on WebSocket constructor
    jest.spyOn(global, 'WebSocket').mockImplementation((url: string) => {
      mockWebSocket = new MockWebSocket(url);
      return mockWebSocket as any;
    });
    
    // Spy on console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  describe('connect', () => {
    it('should create a WebSocket connection', () => {
      websocketService.connect();
      
      expect(global.WebSocket).toHaveBeenCalled();
      expect(mockWebSocket.url).toContain('/api/ws');
    });
    
    it('should add auth token to URL if provided', () => {
      const token = 'test-token';
      websocketService.setAuthToken(token);
      websocketService.connect();
      
      expect(mockWebSocket.url).toContain(`token=${token}`);
    });
    
    it('should update status to CONNECTING when connecting', () => {
      const statusListener = jest.fn();
      websocketService.addStatusListener(statusListener);
      
      websocketService.connect();
      
      expect(statusListener).toHaveBeenCalledWith(WebSocketStatus.CONNECTING);
    });
    
    it('should update status to CONNECTED when connection opens', () => {
      const statusListener = jest.fn();
      websocketService.addStatusListener(statusListener);
      
      websocketService.connect();
      mockWebSocket.simulateOpen();
      
      expect(statusListener).toHaveBeenCalledWith(WebSocketStatus.CONNECTED);
    });
    
    it('should not create a new connection if already connected', () => {
      websocketService.connect();
      mockWebSocket.simulateOpen();
      mockWebSocket.readyState = 1; // OPEN
      
      jest.clearAllMocks();
      websocketService.connect();
      
      expect(global.WebSocket).not.toHaveBeenCalled();
    });
  });
  
  describe('disconnect', () => {
    it('should close the WebSocket connection', () => {
      websocketService.connect();
      mockWebSocket.simulateOpen();
      
      const closeSpy = jest.spyOn(mockWebSocket, 'close');
      websocketService.disconnect();
      
      expect(closeSpy).toHaveBeenCalled();
    });
    
    it('should update status to DISCONNECTED', () => {
      const statusListener = jest.fn();
      websocketService.addStatusListener(statusListener);
      
      websocketService.connect();
      mockWebSocket.simulateOpen();
      
      jest.clearAllMocks();
      websocketService.disconnect();
      
      expect(statusListener).toHaveBeenCalledWith(WebSocketStatus.DISCONNECTED);
    });
  });
  
  describe('send', () => {
    it('should send a message when connected', () => {
      websocketService.connect();
      mockWebSocket.simulateOpen();
      
      const sendSpy = jest.spyOn(mockWebSocket, 'send');
      const type = WebSocketEventType.HEALTH_DATA_UPDATE;
      const data = { steps: 1000 };
      
      websocketService.send(type, data);
      
      expect(sendSpy).toHaveBeenCalled();
      const sentData = JSON.parse(sendSpy.mock.calls[0][0]);
      expect(sentData.type).toBe(type);
      expect(sentData.data).toEqual(data);
      expect(sentData.timestamp).toBeDefined();
    });
    
    it('should return false when not connected', () => {
      const result = websocketService.send(WebSocketEventType.HEALTH_DATA_UPDATE, {});
      expect(result).toBe(false);
    });
  });
  
  describe('event listeners', () => {
    it('should call event listeners when receiving a message', () => {
      const listener = jest.fn();
      const eventType = WebSocketEventType.HEALTH_DATA_UPDATE;
      const eventData = { steps: 1000 };
      
      websocketService.addEventListener(eventType, listener);
      websocketService.connect();
      mockWebSocket.simulateOpen();
      
      mockWebSocket.simulateMessage({
        type: eventType,
        data: eventData,
        timestamp: new Date().toISOString(),
      });
      
      expect(listener).toHaveBeenCalledWith(eventData);
    });
    
    it('should remove event listeners', () => {
      const listener = jest.fn();
      const eventType = WebSocketEventType.HEALTH_DATA_UPDATE;
      
      websocketService.addEventListener(eventType, listener);
      websocketService.removeEventListener(eventType, listener);
      
      websocketService.connect();
      mockWebSocket.simulateOpen();
      
      mockWebSocket.simulateMessage({
        type: eventType,
        data: {},
        timestamp: new Date().toISOString(),
      });
      
      expect(listener).not.toHaveBeenCalled();
    });
  });
  
  describe('status listeners', () => {
    it('should call status listeners when status changes', () => {
      const listener = jest.fn();
      
      websocketService.addStatusListener(listener);
      websocketService.connect();
      
      expect(listener).toHaveBeenCalledWith(WebSocketStatus.CONNECTING);
      
      mockWebSocket.simulateOpen();
      
      expect(listener).toHaveBeenCalledWith(WebSocketStatus.CONNECTED);
    });
    
    it('should remove status listeners', () => {
      const listener = jest.fn();
      
      websocketService.addStatusListener(listener);
      websocketService.removeStatusListener(listener);
      
      websocketService.connect();
      
      expect(listener).not.toHaveBeenCalled();
    });
  });
  
  describe('error handling', () => {
    it('should update status to ERROR on WebSocket error', () => {
      const statusListener = jest.fn();
      websocketService.addStatusListener(statusListener);
      
      websocketService.connect();
      mockWebSocket.simulateError();
      
      expect(statusListener).toHaveBeenCalledWith(WebSocketStatus.ERROR);
    });
    
    it('should attempt to reconnect after an error', () => {
      jest.useFakeTimers();
      
      websocketService.connect();
      mockWebSocket.simulateError();
      
      jest.clearAllMocks();
      jest.advanceTimersByTime(2000); // Default reconnect delay
      
      expect(global.WebSocket).toHaveBeenCalled();
      
      jest.useRealTimers();
    });
  });
  
  describe('reconnection', () => {
    it('should attempt to reconnect after connection closes unexpectedly', () => {
      jest.useFakeTimers();
      
      websocketService.connect();
      mockWebSocket.simulateOpen();
      mockWebSocket.simulateClose(1001); // Not a normal closure
      
      jest.clearAllMocks();
      jest.advanceTimersByTime(2000); // Default reconnect delay
      
      expect(global.WebSocket).toHaveBeenCalled();
      
      jest.useRealTimers();
    });
    
    it('should not attempt to reconnect after a normal closure', () => {
      jest.useFakeTimers();
      
      websocketService.connect();
      mockWebSocket.simulateOpen();
      mockWebSocket.simulateClose(1000); // Normal closure
      
      jest.clearAllMocks();
      jest.advanceTimersByTime(2000); // Default reconnect delay
      
      expect(global.WebSocket).not.toHaveBeenCalled();
      
      jest.useRealTimers();
    });
    
    it('should stop reconnecting after max attempts', () => {
      jest.useFakeTimers();
      
      // Set a small max reconnect attempts for testing
      (websocketService as any).maxReconnectAttempts = 2;
      
      websocketService.connect();
      mockWebSocket.simulateOpen();
      mockWebSocket.simulateClose(1001);
      
      // First reconnect attempt
      jest.clearAllMocks();
      jest.advanceTimersByTime(2000);
      expect(global.WebSocket).toHaveBeenCalled();
      mockWebSocket.simulateClose(1001);
      
      // Second reconnect attempt
      jest.clearAllMocks();
      jest.advanceTimersByTime(3000); // Increased delay due to exponential backoff
      expect(global.WebSocket).toHaveBeenCalled();
      mockWebSocket.simulateClose(1001);
      
      // Should not reconnect after max attempts
      jest.clearAllMocks();
      jest.advanceTimersByTime(5000);
      expect(global.WebSocket).not.toHaveBeenCalled();
      
      jest.useRealTimers();
    });
  });
});
