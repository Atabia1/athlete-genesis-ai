# Athlete Genesis AI Architecture

This document describes the architecture of the Athlete Genesis AI application after the refactoring to address the identified flaws.

## Overview

The application follows a feature-based architecture with clear separation of concerns and a standardized approach to state management, error handling, and offline functionality.

## Directory Structure

```
src/
  app/                      # Application core
    providers/              # Application providers
    routes/                 # Application routes
  
  components/               # Shared components
    ui/                     # UI components
    layout/                 # Layout components
    error-boundary/         # Error boundary components
  
  context/                  # Context providers
  
  features/                 # Feature modules
    auth/                   # Authentication feature
    offline/                # Offline feature
    workout/                # Workout feature
  
  hooks/                    # Shared hooks
  
  services/                 # Services
  
  shared/                   # Shared utilities and components
    components/             # Shared components
    context/                # Shared context
    hooks/                  # Shared hooks
    utils/                  # Shared utilities
  
  types/                    # TypeScript types
  
  utils/                    # Utility functions
```

## Key Architectural Components

### 1. Context Factory

The context factory provides a standardized way to create React contexts with:
- Type safety
- Error handling
- Context selectors to prevent unnecessary re-renders
- Consistent API

```typescript
// Create a context with the factory
const {
  Context,
  useContext,
  useContextSelector,
  Provider,
} = createContextFactory<MyContextType>({
  name: 'MyContext',
  defaultValue: initialValue,
});
```

### 2. Consolidated Context Providers

We've consolidated related context providers to reduce nesting and improve performance:

#### UserPreferencesProvider

Combines:
- Theme preferences
- Accessibility settings

```typescript
// Use the consolidated provider
<UserPreferencesProvider>
  <App />
</UserPreferencesProvider>

// Use the selector hooks
const { theme, setTheme } = useTheme();
const { accessibilitySettings, updateAccessibilitySetting } = useAccessibilitySettings();
```

#### OfflineSyncProvider

Combines:
- Network status tracking
- Retry queue for failed operations
- Synchronization between online and offline states
- Offline workouts management

```typescript
// Use the consolidated provider
<OfflineSyncProvider>
  <App />
</OfflineSyncProvider>

// Use the selector hooks
const { isOnline } = useNetworkStatus();
const { retryQueue, addToQueue } = useRetryQueue();
const { syncStatus, syncNow } = useSync();
const { offlineWorkouts, savedWorkouts } = useOfflineWorkouts();
```

### 3. Enhanced IndexedDB Service

The enhanced IndexedDB service provides:
- Transaction queue to prevent race conditions
- Improved error recovery mechanisms
- Better handling of offline scenarios
- Enhanced data validation

```typescript
// Use the enhanced service
await enhancedDbService.add('savedWorkouts', workout);

// Use transaction batching
const transaction = await enhancedDbService.startTransaction(['savedWorkouts'], 'readwrite');
await transaction.add('savedWorkouts', workout1);
await transaction.add('savedWorkouts', workout2);
```

### 4. Root Provider Component

The AppProviders component consolidates all providers into a single component:

```typescript
// Use the root provider
<AppProviders>
  <App />
</AppProviders>

// Or with custom options
<AppProviders queryClient={customQueryClient} withRouter={false}>
  <App />
</AppProviders>
```

### 5. Standardized Error Handling

The error handling utilities provide:
- Specific error types and codes
- User-friendly error messages
- Consistent error handling throughout the application
- Error recovery mechanisms

```typescript
// Use the error handling utilities
try {
  await someOperation();
} catch (error) {
  logError(error);
  showErrorToast(error);
}

// Or with the tryCatch utility
const result = await tryCatch(
  () => someOperation(),
  (error) => {
    // Custom error handling
  }
);
```

## Data Flow

The application follows a unidirectional data flow:

1. User interacts with a component
2. Component calls a hook or context function
3. Function updates state or calls a service
4. Service performs the operation and returns the result
5. State is updated and components re-render

## State Management

The application uses a combination of state management approaches:

1. **React Context**: For global state that needs to be accessed by multiple components
2. **React Query**: For server state and data fetching
3. **Local Component State**: For component-specific state

## Error Handling

The application uses a standardized approach to error handling:

1. **Error Types**: Specific error types for different kinds of errors
2. **Error Classes**: Custom error classes with additional context
3. **Error Handling Utilities**: Utilities for logging, displaying, and recovering from errors
4. **Error Boundaries**: React error boundaries to catch and handle errors in the component tree

## Offline Functionality

The application provides robust offline functionality:

1. **Network Status Tracking**: Track online/offline status
2. **Retry Queue**: Queue failed operations for retry when back online
3. **Offline Data Storage**: Store data locally for offline use
4. **Synchronization**: Sync local data with the server when back online
5. **Conflict Resolution**: Resolve conflicts between local and server data

## Performance Optimization

The application includes several performance optimizations:

1. **Context Selectors**: Prevent unnecessary re-renders when only part of the context changes
2. **Memoization**: Memoize expensive computations
3. **Transaction Batching**: Batch related operations into a single transaction
4. **Lazy Loading**: Load components and data only when needed
5. **Code Splitting**: Split code into smaller chunks for faster loading

## Accessibility

The application follows accessibility best practices:

1. **Semantic HTML**: Use semantic HTML elements
2. **ARIA Attributes**: Add ARIA attributes where needed
3. **Keyboard Navigation**: Ensure keyboard navigation works
4. **Screen Reader Support**: Provide screen reader support
5. **High Contrast Mode**: Support high contrast mode
6. **Reduced Motion**: Support reduced motion preferences

## Conclusion

The refactored architecture addresses the identified flaws and provides a solid foundation for future development. It follows best practices for React applications and provides a consistent, maintainable, and performant codebase.
