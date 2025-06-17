/**
 * WebSocket Handler
 * 
 * This file contains the server-side WebSocket handler for real-time updates.
 * It can be used with Express, Fastify, or other Node.js server frameworks.
 */

import { WebSocket, WebSocketServer } from 'ws';
import { parse } from 'url';
import { verify } from 'jsonwebtoken';
import { HealthData } from '@/integrations/health-apps/types';

// WebSocket event types (must match client-side types)
export enum WebSocketEventType {
  HEALTH_DATA_UPDATE = 'health_data_update',
  SYNC_STATUS_UPDATE = 'sync_status_update',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  COACH_MESSAGE = 'coach_message',
  ERROR = 'error',
}

// WebSocket message interface
export interface WebSocketMessage<T = any> {
  type: WebSocketEventType;
  data: T;
  timestamp: string;
}

// Client connection interface
interface ClientConnection {
  userId: string;
  socket: WebSocket;
  isAlive: boolean;
  lastActivity: Date;
}

// WebSocket handler class
export class WebSocketHandler {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();
  private pingInterval: NodeJS.Timeout | null = null;
  private jwtSecret: string;
  
  /**
   * Constructor
   * @param server HTTP server instance
   * @param jwtSecret JWT secret for authentication
   * @param path WebSocket path (default: /api/ws)
   */
  constructor(server: any, jwtSecret: string, path: string = '/api/ws') {
    this.jwtSecret = jwtSecret;
    
    // Create WebSocket server
    this.wss = new WebSocketServer({ 
      noServer: true,
      path,
    });
    
    // Handle HTTP server upgrade
    server.on('upgrade', (request: any, socket: any, head: any) => {
      const { pathname } = parse(request.url);
      
      if (pathname === path) {
        this.wss.handleUpgrade(request, socket, head, (ws) => {
          this.wss.emit('connection', ws, request);
        });
      }
    });
    
    // Set up WebSocket server events
    this.setupServerEvents();
    
    // Start ping interval
    this.startPingInterval();
    
    console.log(`WebSocket server started on path: ${path}`);
  }
  
  /**
   * Set up WebSocket server events
   */
  private setupServerEvents(): void {
    this.wss.on('connection', (socket, request) => {
      // Parse token from query string
      const { query } = parse(request.url || '', true);
      const token = query.token as string;
      
      // Authenticate client
      let userId: string;
      try {
        if (!token) {
          throw new Error('No token provided');
        }
        
        const decoded = verify(token, this.jwtSecret) as { id: string };
        userId = decoded.id;
        
        if (!userId) {
          throw new Error('Invalid token');
        }
      } catch (error) {
        console.error('WebSocket authentication error:', error);
        this.sendError(socket, 'Authentication failed');
        socket.close(1008, 'Authentication failed');
        return;
      }
      
      // Add client to the map
      const clientId = `${userId}_${Date.now()}`;
      this.clients.set(clientId, {
        userId,
        socket,
        isAlive: true,
        lastActivity: new Date(),
      });
      
      console.log(`Client connected: ${clientId} (User: ${userId})`);
      
      // Set up socket events
      socket.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString()) as WebSocketMessage;
          this.handleMessage(clientId, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          this.sendError(socket, 'Invalid message format');
        }
      });
      
      socket.on('close', () => {
        console.log(`Client disconnected: ${clientId}`);
        this.clients.delete(clientId);
      });
      
      socket.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });
      
      socket.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.isAlive = true;
        }
      });
      
      // Send initial data
      this.sendInitialData(clientId);
    });
  }
  
  /**
   * Start ping interval to keep connections alive
   */
  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      this.clients.forEach((client, clientId) => {
        if (!client.isAlive) {
          console.log(`Client ${clientId} is not responding, terminating connection`);
          client.socket.terminate();
          this.clients.delete(clientId);
          return;
        }
        
        client.isAlive = false;
        client.socket.ping();
      });
    }, 30000); // 30 seconds
  }
  
  /**
   * Stop ping interval
   */
  public stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
  
  /**
   * Handle incoming message
   * @param clientId Client ID
   * @param message WebSocket message
   */
  private handleMessage(clientId: string, message: WebSocketMessage): void {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    client.lastActivity = new Date();
    
    console.log(`Received message from client ${clientId}:`, message.type);
    
    // Handle different message types
    switch (message.type) {
      case WebSocketEventType.HEALTH_DATA_UPDATE:
        // Client is sending health data update (e.g., from a device)
        // Process and broadcast to other clients of the same user
        this.broadcastToUser(client.userId, message, clientId);
        break;
        
      case WebSocketEventType.SYNC_STATUS_UPDATE:
        // Client is sending sync status update
        // Process and broadcast to other clients of the same user
        this.broadcastToUser(client.userId, message, clientId);
        break;
        
      default:
        console.warn(`Unhandled message type: ${message.type}`);
        break;
    }
  }
  
  /**
   * Send initial data to client
   * @param clientId Client ID
   */
  private sendInitialData(clientId: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    // In a real implementation, you would fetch the latest data from the database
    // For now, we'll just send a mock health data update
    const mockHealthData: HealthData = {
      steps: 8432,
      distance: 6.7,
      calories: 420,
      heartRate: {
        resting: 65,
        average: 72,
        max: 142
      },
      sleep: {
        duration: 432, // 7.2 hours in minutes
        quality: 'good'
      },
      weight: 75.5,
      hydration: 65
    };
    
    this.sendToClient(client, {
      type: WebSocketEventType.HEALTH_DATA_UPDATE,
      data: mockHealthData,
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Send message to a specific client
   * @param client Client connection
   * @param message WebSocket message
   */
  private sendToClient(client: ClientConnection, message: WebSocketMessage): void {
    if (client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(JSON.stringify(message));
    }
  }
  
  /**
   * Send error message to a client
   * @param socket WebSocket connection
   * @param errorMessage Error message
   */
  private sendError(socket: WebSocket, errorMessage: string): void {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: WebSocketEventType.ERROR,
        data: { message: errorMessage },
        timestamp: new Date().toISOString()
      }));
    }
  }
  
  /**
   * Broadcast message to all clients of a specific user
   * @param userId User ID
   * @param message WebSocket message
   * @param excludeClientId Client ID to exclude
   */
  private broadcastToUser(userId: string, message: WebSocketMessage, excludeClientId?: string): void {
    this.clients.forEach((client, clientId) => {
      if (client.userId === userId && clientId !== excludeClientId) {
        this.sendToClient(client, message);
      }
    });
  }
  
  /**
   * Broadcast message to all connected clients
   * @param message WebSocket message
   */
  public broadcastToAll(message: WebSocketMessage): void {
    this.clients.forEach((client) => {
      this.sendToClient(client, message);
    });
  }
  
  /**
   * Send health data update to a specific user
   * @param userId User ID
   * @param healthData Health data
   */
  public sendHealthDataUpdate(userId: string, healthData: HealthData): void {
    const message: WebSocketMessage<HealthData> = {
      type: WebSocketEventType.HEALTH_DATA_UPDATE,
      data: healthData,
      timestamp: new Date().toISOString()
    };
    
    this.broadcastToUser(userId, message);
  }
  
  /**
   * Send achievement unlocked notification to a specific user
   * @param userId User ID
   * @param achievement Achievement data
   */
  public sendAchievementUnlocked(userId: string, achievement: any): void {
    const message: WebSocketMessage = {
      type: WebSocketEventType.ACHIEVEMENT_UNLOCKED,
      data: achievement,
      timestamp: new Date().toISOString()
    };
    
    this.broadcastToUser(userId, message);
  }
  
  /**
   * Send coach message to a specific user
   * @param userId User ID
   * @param coachMessage Coach message data
   */
  public sendCoachMessage(userId: string, coachMessage: any): void {
    const message: WebSocketMessage = {
      type: WebSocketEventType.COACH_MESSAGE,
      data: coachMessage,
      timestamp: new Date().toISOString()
    };
    
    this.broadcastToUser(userId, message);
  }
  
  /**
   * Close all connections and stop the server
   */
  public close(): void {
    this.stopPingInterval();
    
    this.clients.forEach((client) => {
      client.socket.close();
    });
    
    this.clients.clear();
    this.wss.close();
    
    console.log('WebSocket server closed');
  }
}
