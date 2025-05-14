# Real-time Updates

This document provides an overview of the real-time update features implemented in the Athlete Genesis AI application.

## Overview

The real-time update system allows the application to receive and display data updates without requiring a page refresh. This is particularly useful for health data, which may be updated from multiple sources (wearable devices, mobile apps, etc.).

## Components

### WebSocket Service

The WebSocket service (`src/services/websocket-service.ts`) provides a client-side implementation for connecting to a WebSocket server. It handles:

- Connection management
- Reconnection with exponential backoff
- Message sending and receiving
- Event subscription

```typescript
// Example usage
import websocketService, { WebSocketEventType } from '@/services/websocket-service';

// Connect to the WebSocket server
websocketService.connect();

// Subscribe to health data updates
websocketService.addEventListener(WebSocketEventType.HEALTH_DATA_UPDATE, (data) => {
  console.log('Received health data update:', data);
});

// Send a message
websocketService.send(WebSocketEventType.SYNC_STATUS_UPDATE, { status: 'syncing' });
```

### React Hooks

Two React hooks are provided for using the WebSocket service in components:

1. `useWebSocket`: Provides connection management and event handling
2. `useWebSocketEvent`: Subscribes to a specific event type and provides the latest data

```typescript
// Example usage
import { useWebSocket, useWebSocketEvent } from '@/hooks/use-websocket';
import { WebSocketEventType } from '@/services/websocket-service';

function MyComponent() {
  // Connect to WebSocket and get status
  const { status, send } = useWebSocket({
    autoConnect: true,
    autoReconnect: true,
  });

  // Subscribe to health data updates
  const healthData = useWebSocketEvent(WebSocketEventType.HEALTH_DATA_UPDATE, null);

  // Use the data in your component
  return (
    <div>
      <p>Connection status: {status}</p>
      {healthData && <p>Steps: {healthData.steps}</p>}
    </div>
  );
}
```

### Data Sync Indicator

The `DataSyncIndicator` component (`src/components/ui/data-sync-indicator.tsx`) provides a visual indication of the synchronization status. It supports different variants and accessibility features.

```typescript
// Example usage
import DataSyncIndicator, { SyncStatus } from '@/components/ui/data-sync-indicator';

function MyComponent() {
  return (
    <DataSyncIndicator 
      status={SyncStatus.REALTIME}
      lastSyncTime={new Date()}
      showSyncButton={true}
      onSyncClick={handleManualSync}
      variant="badge"
    />
  );
}
```

## Server-side Implementation

The server-side implementation (`src/server/websocket-handler.ts`) provides a WebSocket server that can be integrated with Express, Fastify, or other Node.js server frameworks. It handles:

- Connection management
- Authentication
- Message routing
- Broadcasting to specific users

```typescript
// Example usage in an Express server
import express from 'express';
import http from 'http';
import { WebSocketHandler } from './websocket-handler';

const app = express();
const server = http.createServer(app);
const wsHandler = new WebSocketHandler(server, 'your-jwt-secret');

// Send health data update to a specific user
wsHandler.sendHealthDataUpdate('user123', {
  steps: 10000,
  heartRate: { average: 75 },
});

server.listen(3000);
```

## Integration with Health Data

The real-time update system is integrated with the health dashboard to provide live updates of health data. When new data is received from a wearable device or mobile app, it is immediately displayed on the dashboard.

## Offline Support

The system includes offline support through:

1. Detection of offline status
2. Queuing of updates when offline
3. Automatic retry when back online
4. Clear indication of offline status to the user

## Security Considerations

- All WebSocket connections are authenticated using JWT tokens
- Data is validated before being sent to the client
- Sensitive data is not sent over the WebSocket connection

## Testing

Unit and integration tests are provided for the WebSocket service and hooks:

- `src/services/__tests__/websocket-service.test.ts`
- `src/hooks/__tests__/use-websocket.test.tsx`

## Future Improvements

- Add support for end-to-end encryption
- Implement message compression for large data payloads
- Add support for binary data (e.g., for waveform data)
- Implement rate limiting to prevent abuse
