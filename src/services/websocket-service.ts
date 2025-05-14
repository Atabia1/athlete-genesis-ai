/**
 * WebSocket Service
 * 
 * This service provides a WebSocket connection for real-time data updates.
 * It handles connection management, reconnection, and message handling.
 */

// Event types for WebSocket messages
export enum WebSocketEventType {
  HEALTH_DATA_UPDATE = 'health_data_update',
  SYNC_STATUS_UPDATE = 'sync_status_update',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  COACH_MESSAGE = 'coach_message',
  ERROR = 'error',
}

// WebSocket connection status
export enum WebSocketStatus {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

// WebSocket message interface
export interface WebSocketMessage<T = any> {
  type: WebSocketEventType;
  data: T;
  timestamp: string;
}

// WebSocket event listener
type WebSocketEventListener<T = any> = (data: T) => void;

/**
 * WebSocket Service Class
 */
class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000; // Start with 2 seconds
  private reconnectTimeoutId: number | null = null;
  private eventListeners: Map<WebSocketEventType, WebSocketEventListener[]> = new Map();
  private statusListeners: ((status: WebSocketStatus) => void)[] = [];
  private status: WebSocketStatus = WebSocketStatus.DISCONNECTED;
  private authToken: string | null = null;

  /**
   * Constructor
   * @param url WebSocket server URL
   */
  constructor(url: string) {
    this.url = url;
  }

  /**
   * Set authentication token
   * @param token Authentication token
   */
  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  /**
   * Connect to the WebSocket server
   */
  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.updateStatus(WebSocketStatus.CONNECTING);

    try {
      // Add auth token as query parameter if available
      const connectionUrl = this.authToken 
        ? `${this.url}?token=${encodeURIComponent(this.authToken)}`
        : this.url;

      this.socket = new WebSocket(connectionUrl);

      // Set up event handlers
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.updateStatus(WebSocketStatus.ERROR);
      this.attemptReconnect();
    }
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    // Clear any pending reconnect attempts
    if (this.reconnectTimeoutId !== null) {
      window.clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }

    this.updateStatus(WebSocketStatus.DISCONNECTED);
  }

  /**
   * Send a message to the WebSocket server
   * @param type Message type
   * @param data Message data
   */
  send<T>(type: WebSocketEventType, data: T) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot send message: WebSocket is not connected');
      return false;
    }

    const message: WebSocketMessage<T> = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    try {
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  /**
   * Add an event listener
   * @param type Event type
   * @param listener Event listener
   */
  addEventListener<T>(type: WebSocketEventType, listener: WebSocketEventListener<T>) {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }

    this.eventListeners.get(type)!.push(listener as WebSocketEventListener);
  }

  /**
   * Remove an event listener
   * @param type Event type
   * @param listener Event listener
   */
  removeEventListener<T>(type: WebSocketEventType, listener: WebSocketEventListener<T>) {
    if (!this.eventListeners.has(type)) {
      return;
    }

    const listeners = this.eventListeners.get(type)!;
    const index = listeners.indexOf(listener as WebSocketEventListener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Add a status listener
   * @param listener Status listener
   */
  addStatusListener(listener: (status: WebSocketStatus) => void) {
    this.statusListeners.push(listener);
    // Immediately notify the listener of the current status
    listener(this.status);
  }

  /**
   * Remove a status listener
   * @param listener Status listener
   */
  removeStatusListener(listener: (status: WebSocketStatus) => void) {
    const index = this.statusListeners.indexOf(listener);
    if (index !== -1) {
      this.statusListeners.splice(index, 1);
    }
  }

  /**
   * Get the current connection status
   */
  getStatus(): WebSocketStatus {
    return this.status;
  }

  /**
   * Handle WebSocket open event
   */
  private handleOpen() {
    console.log('WebSocket connected');
    this.updateStatus(WebSocketStatus.CONNECTED);
    this.reconnectAttempts = 0;
  }

  /**
   * Handle WebSocket message event
   * @param event WebSocket message event
   */
  private handleMessage(event: MessageEvent) {
    try {
      const message = JSON.parse(event.data) as WebSocketMessage;
      
      // Dispatch the message to all registered listeners
      if (this.eventListeners.has(message.type)) {
        const listeners = this.eventListeners.get(message.type)!;
        listeners.forEach(listener => listener(message.data));
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Handle WebSocket close event
   */
  private handleClose(event: CloseEvent) {
    console.log(`WebSocket disconnected: ${event.code} ${event.reason}`);
    this.updateStatus(WebSocketStatus.DISCONNECTED);
    this.socket = null;

    // Attempt to reconnect if the close wasn't intentional
    if (event.code !== 1000) {
      this.attemptReconnect();
    }
  }

  /**
   * Handle WebSocket error event
   */
  private handleError(event: Event) {
    console.error('WebSocket error:', event);
    this.updateStatus(WebSocketStatus.ERROR);
  }

  /**
   * Attempt to reconnect to the WebSocket server
   */
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnect attempts reached');
      return;
    }

    // Calculate exponential backoff delay
    const delay = Math.min(
      30000, // Max 30 seconds
      this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts)
    );

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);

    this.reconnectTimeoutId = window.setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  /**
   * Update the connection status and notify listeners
   * @param status New connection status
   */
  private updateStatus(status: WebSocketStatus) {
    this.status = status;
    this.statusListeners.forEach(listener => listener(status));
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService(
  // Use secure WebSocket protocol in production
  window.location.protocol === 'https:' 
    ? `wss://${window.location.host}/api/ws`
    : `ws://${window.location.host}/api/ws`
);

export default websocketService;
