
/**
 * Server Example
 * 
 * This file demonstrates how to integrate the WebSocket handler with an Express server.
 * This is just an example and not meant to be used directly in production.
 */

import express from 'express';
import http from 'http';
import { WebSocketHandler } from './websocket-handler';
import { HealthData } from '@/integrations/health-apps/types';

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// JWT secret (should be stored in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Create WebSocket handler
const wsHandler = new WebSocketHandler(server, JWT_SECRET);

// API routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Example route to trigger a real-time update
app.post('/api/health-data/:userId', express.json(), (req, res) => {
  const { userId } = req.params;
  const healthData: HealthData = req.body;
  
  // Validate the data (simplified for example)
  if (!healthData || typeof healthData !== 'object') {
    res.status(400).json({ error: 'Invalid health data' });
    return;
  }
  
  // In a real implementation, you would:
  // 1. Authenticate the request
  // 2. Validate the user ID
  // 3. Save the data to the database
  // 4. Then broadcast the update
  
  // Broadcast the update to all connected clients of this user
  wsHandler.sendHealthDataUpdate(userId, healthData);
  
  res.json({ success: true });
});

// Example route to trigger an achievement notification
app.post('/api/achievements/:userId', express.json(), (req, res) => {
  const { userId } = req.params;
  const achievement = req.body;
  
  // Validate the data (simplified for example)
  if (!achievement || typeof achievement !== 'object') {
    res.status(400).json({ error: 'Invalid achievement data' });
    return;
  }
  
  // Broadcast the achievement notification
  wsHandler.sendAchievementUnlocked(userId, achievement);
  
  res.json({ success: true });
});

// Example route to send a coach message
app.post('/api/coach-messages/:userId', express.json(), (req, res) => {
  const { userId } = req.params;
  const message = req.body;
  
  // Validate the data (simplified for example)
  if (!message || typeof message !== 'object') {
    res.status(400).json({ error: 'Invalid message data' });
    return;
  }
  
  // Broadcast the coach message
  wsHandler.sendCoachMessage(userId, message);
  
  res.json({ success: true });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  wsHandler.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
