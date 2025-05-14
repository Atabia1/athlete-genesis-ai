# Offline Feature

This directory contains all the code related to the offline functionality of the application.

## Components

- `NetworkStatus`: Displays the current network status with visual indicators
- `OfflineModeIndicator`: Shows a banner when the user is offline
- `RetryQueueBanner`: Displays pending operations that will be retried when online
- `SyncBanner`: Shows synchronization status and progress
- `SyncIndicator`: Reusable component for displaying sync status

## Context

- `RetryQueueContext`: Manages operations that need to be retried when online
- `SyncContext`: Manages data synchronization between local and remote storage

## Hooks

- `use-network-status`: Hook for detecting and monitoring network connectivity

## Services

- `retry-queue-service`: Service for managing retry operations
- `sync-service`: Service for synchronizing data between local and remote storage

## Utils

- Various utility functions for offline functionality

## Usage

The offline feature allows users to continue using the application even when they lose internet connectivity. It provides:

1. Visual indicators of network status
2. Automatic retry of failed operations when connectivity is restored
3. Local storage of data that syncs when online
4. Graceful degradation of features when offline

To use this feature, wrap your application with the necessary context providers:

```tsx
import { RetryQueueProvider } from "@/features/offline/context/RetryQueueContext";
import { SyncProvider } from "@/features/offline/context/SyncContext";

function App() {
  return (
    <RetryQueueProvider>
      <SyncProvider>
        <YourApp />
      </SyncProvider>
    </RetryQueueProvider>
  );
}
```

Then use the components and hooks as needed in your application:

```tsx
import { useNetworkStatus } from "@/features/offline/hooks/use-network-status";
import NetworkStatus from "@/features/offline/components/NetworkStatus";
import { OfflineModeIndicator } from "@/features/offline/components/OfflineModeIndicator";

function YourComponent() {
  const { isOnline } = useNetworkStatus();

  return (
    <div>
      <NetworkStatus />
      <OfflineModeIndicator />

      {isOnline ? <OnlineContent /> : <OfflineContent />}
    </div>
  );
}
```
