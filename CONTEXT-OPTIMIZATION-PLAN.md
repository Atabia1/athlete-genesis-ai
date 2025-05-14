# Context Provider Optimization Plan

This document outlines the plan for optimizing context providers in the Athlete Genesis AI application to reduce nesting and improve performance.

## Current Issues

1. **Provider Hell**: Too many nested context providers in the application root
2. **Performance Issues**: Unnecessary re-renders due to context changes
3. **Unclear Data Flow**: Difficult to understand how data flows through the application
4. **Dependency Issues**: Context providers with dependencies on other providers
5. **Inconsistent API**: Different context providers have different APIs

## Optimization Strategies

### 1. Consolidate Related Contexts

Group related contexts together to reduce the number of providers:

#### Before:
```tsx
<ThemeProvider>
  <AccessibilityProvider>
    <LanguagePreferenceProvider>
      <App />
    </LanguagePreferenceProvider>
  </AccessibilityProvider>
</ThemeProvider>
```

#### After:
```tsx
<UserPreferencesProvider> {/* Combines theme, accessibility, and language */}
  <App />
</UserPreferencesProvider>
```

### 2. Implement Context Selectors

Use context selectors to prevent unnecessary re-renders:

#### Before:
```tsx
const { theme, setTheme, accessibility, setAccessibility } = useUserPreferences();
```

#### After:
```tsx
const { theme, setTheme } = useUserPreferencesSelector(state => ({
  theme: state.theme,
  setTheme: state.setTheme
}));
```

### 3. Use Context Factories

Create a factory function to generate contexts with consistent APIs:

```tsx
const [UserContext, useUser, UserProvider] = createContext<UserContextType>({
  name: 'User',
  defaultValue: {
    user: null,
    isLoading: false,
    error: null,
    login: async () => {},
    logout: async () => {},
    register: async () => {},
  },
});
```

### 4. Implement Provider Composition

Create a single root provider that composes all providers:

```tsx
export function AppProviders({ children }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <UserPreferencesProvider>
          <AuthProvider>
            <FeatureProvider>
              <WorkoutProvider>
                <OfflineProvider>
                  {children}
                </OfflineProvider>
              </WorkoutProvider>
            </FeatureProvider>
          </AuthProvider>
        </UserPreferencesProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

### 5. Use React Query for Server State

Move server state management to React Query to reduce context usage:

```tsx
// Before
const { workouts, isLoading, error } = useWorkoutContext();

// After
const { data: workouts, isLoading, error } = useQuery('workouts', fetchWorkouts);
```

## Implementation Plan

### Phase 1: Context Audit

1. Identify all context providers in the application
2. Document their purpose, state, and dependencies
3. Identify opportunities for consolidation
4. Identify performance bottlenecks

### Phase 2: Create Context Factory

1. Create a context factory function
2. Add support for context selectors
3. Add support for memoization
4. Add support for error handling

### Phase 3: Consolidate Related Contexts

1. Consolidate theme, accessibility, and language preferences into a single UserPreferences context
2. Consolidate offline, sync, and retry queue contexts into a single OfflineSync context
3. Consolidate authentication and authorization contexts into a single Auth context

### Phase 4: Implement Provider Composition

1. Create a root AppProviders component
2. Compose all providers in the correct order
3. Update the application entry point to use the AppProviders component

### Phase 5: Optimize Performance

1. Implement context selectors for all contexts
2. Add memoization for expensive computations
3. Add performance monitoring for context updates
4. Optimize re-render behavior

## Context Provider Structure

### UserPreferencesProvider

Combines theme, accessibility, and language preferences:

```tsx
interface UserPreferencesState {
  theme: Theme;
  accessibility: AccessibilitySettings;
  language: Language;
}

interface UserPreferencesActions {
  setTheme: (theme: Theme) => void;
  setAccessibility: (settings: AccessibilitySettings) => void;
  setLanguage: (language: Language) => void;
}

type UserPreferencesContextType = UserPreferencesState & UserPreferencesActions;
```

### OfflineSyncProvider

Combines offline, sync, and retry queue functionality:

```tsx
interface OfflineSyncState {
  isOnline: boolean;
  syncStatus: SyncStatus;
  pendingOperations: RetryOperation[];
  lastSyncTime: Date | null;
}

interface OfflineSyncActions {
  syncNow: () => Promise<void>;
  addToQueue: (operation: RetryOperation) => void;
  clearQueue: () => void;
  registerHandler: (type: string, handler: RetryHandler) => void;
}

type OfflineSyncContextType = OfflineSyncState & OfflineSyncActions;
```

### AuthProvider

Combines authentication and authorization functionality:

```tsx
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

interface AuthActions {
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: UserData) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
}

type AuthContextType = AuthState & AuthActions;
```

## Performance Monitoring

Add performance monitoring to track context updates and re-renders:

```tsx
function useContextWithMonitoring<T>(context: React.Context<T>, name: string): T {
  const value = useContext(context);
  
  useEffect(() => {
    performance.mark(`${name}-context-used`);
    
    return () => {
      performance.measure(
        `${name}-context-lifetime`,
        `${name}-context-used`
      );
    };
  }, [name]);
  
  return value;
}
```

## Conclusion

By implementing these optimizations, we can significantly reduce the complexity of our context providers, improve performance, and make the data flow more understandable. This will lead to a more maintainable and scalable application.
