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
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Example route to trigger a real-time update
app.post('/api/health-data/:userId', express.json(), (req, res) => {
  const { userId } = req.params;
  const healthData: HealthData = req.body;
  
  // Validate the data (simplified for example)
  if (!healthData || typeof healthData !== 'object') {
    return res.status(400).json({ error: 'Invalid health data' });
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
    return res.status(400).json({ error: 'Invalid achievement data' });
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
    return res.status(400).json({ error: 'Invalid message data' });
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

/**
 * Example of how to use the WebSocket handler in a real application:
 * 
 * 1. Create a WebSocket handler instance when your server starts
 * 2. Integrate it with your authentication system
 * 3. Call the appropriate methods when data changes:
 *    - wsHandler.sendHealthDataUpdate(userId, healthData)
 *    - wsHandler.sendAchievementUnlocked(userId, achievement)
 *    - wsHandler.sendCoachMessage(userId, message)
 * 
 * For example, in your health data service:
 * 
 * ```
 * async function updateHealthData(userId, healthData) {
 *   // Save to database
 *   await db.healthData.update({ userId, ...healthData });
 *   
 *   // Send real-time update
 *   wsHandler.sendHealthDataUpdate(userId, healthData);
 * }
 * ```
 * 
 * Or in your achievement service:
 * 
 * ```
 * async function unlockAchievement(userId, achievementId) {
 *   // Check if already unlocked
 *   const existing = await db.achievements.findOne({ userId, achievementId });
 *   if (existing) return;
 *   
 *   // Save to database
 *   await db.achievements.insert({ userId, achievementId, unlockedAt: new Date() });
 *   
 *   // Get achievement details
 *   const achievement = await db.achievementDefinitions.findOne({ id: achievementId });
 *   
 *   // Send real-time notification
 *   wsHandler.sendAchievementUnlocked(userId, achievement);
 * }
 * ```
 */
