# State Management Strategy

This document outlines the state management strategy for the Athlete Genesis AI application.

## State Management Principles

### Appropriate Scope
- Keep state at the appropriate level
- Avoid global state when possible
- Use local state for UI-specific concerns

### Single Source of Truth
- Maintain a single source of truth for data
- Avoid duplicating state
- Synchronize state when necessary

### Predictable Updates
- Make state updates predictable
- Use immutable update patterns
- Implement unidirectional data flow

### Performance Optimization
- Minimize unnecessary re-renders
- Implement state normalization
- Use memoization for derived state

## State Categories

### 1. UI State

#### Component State
- Form input values
- Toggle states (open/closed)
- Animation states
- Scroll positions

#### UI Control State
- Modal visibility
- Sidebar expansion
- Tab selection
- Pagination state

#### User Preferences
- Theme selection
- Language preference
- Display settings
- Notification preferences

### 2. Application State

#### Authentication State
- User authentication status
- User profile information
- Permissions and roles
- Session management

#### Navigation State
- Current route
- Navigation history
- Deep linking state
- Breadcrumb trail

#### Feature Flags
- Enabled/disabled features
- A/B test variations
- User-specific features
- Environment-specific features

### 3. Domain State

#### Entity Data
- User data
- Workout plans
- Nutrition plans
- Progress tracking data

#### Cached API Data
- API response caching
- Stale-while-revalidate data
- Optimistic updates
- Offline data

#### Derived Data
- Computed statistics
- Filtered/sorted lists
- Aggregated metrics
- Transformed data

### 4. Async State

#### Loading State
- Request in progress indicators
- Skeleton screens
- Progress indicators
- Timeout handling

#### Error State
- Error messages
- Retry mechanisms
- Fallback content
- Error boundaries

#### Synchronization State
- Online/offline status
- Sync progress
- Conflict resolution
- Retry queue

## State Management Solutions

### React Context + Hooks
- **Use for**: Theme, authentication, UI preferences
- **Benefits**: Built-in to React, simple API
- **Drawbacks**: No built-in performance optimizations

### React Query
- **Use for**: Server state, API data fetching
- **Benefits**: Caching, background updates, stale-while-revalidate
- **Drawbacks**: Learning curve, additional dependency

### Zustand
- **Use for**: Global application state
- **Benefits**: Simple API, good performance, minimal boilerplate
- **Drawbacks**: Less ecosystem than Redux

### Local Component State
- **Use for**: Component-specific UI state
- **Benefits**: Simple, encapsulated, built-in to React
- **Drawbacks**: Limited to component scope

### IndexedDB (via idb or Dexie.js)
- **Use for**: Offline data storage, large datasets
- **Benefits**: Persistent, transactional, indexed
- **Drawbacks**: Async API, browser-only

## State Management Patterns

### 1. Context Provider Pattern

```tsx
// Create context with default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Create hook for consuming context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### 2. Custom Hook Pattern

```tsx
// Create custom hook for form state
export function useForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };
  
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset,
    setValues,
    setErrors,
  };
}
```

### 3. React Query Pattern

```tsx
// Create a query hook
export function useWorkouts(userId: string) {
  return useQuery({
    queryKey: ['workouts', userId],
    queryFn: () => fetchWorkouts(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  });
}

// Create a mutation hook
export function useCreateWorkout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (workout: Workout) => createWorkout(workout),
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      
      // Or update the cache directly
      queryClient.setQueryData(['workouts', variables.userId], (old: Workout[]) => {
        return [...old, data];
      });
    },
  });
}
```

### 4. Zustand Store Pattern

```tsx
// Create a store
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await loginUser(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    await logoutUser();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
```

## Implementation Guidelines

### State Location Decision Tree

1. **Is it component-specific UI state?**
   - Yes: Use local component state (useState)
   - No: Continue

2. **Is it server data?**
   - Yes: Use React Query
   - No: Continue

3. **Is it shared across multiple components?**
   - Yes: Use Context or Zustand
   - No: Use local component state

4. **Is it complex with many actions?**
   - Yes: Use Zustand
   - No: Use Context

5. **Does it need to persist across sessions?**
   - Yes: Use IndexedDB + sync mechanism
   - No: Use in-memory state

### Performance Optimization

#### Memoization
- Use `useMemo` for expensive computations
- Use `React.memo` for pure components
- Use `useCallback` for callback functions

#### State Normalization
- Store entities in a normalized format
- Use IDs to reference related entities
- Implement selectors for derived data

#### Context Splitting
- Split context by domain or update frequency
- Use multiple smaller contexts instead of one large context
- Implement context selectors

## Migration Plan

### Phase 1: Assessment
1. Identify current state management approaches
2. Document state requirements by category
3. Identify performance bottlenecks

### Phase 2: Foundation
1. Set up React Query for server state
2. Implement context providers for shared state
3. Create custom hooks for common patterns

### Phase 3: Advanced State Management
1. Implement Zustand for complex global state
2. Set up offline storage with IndexedDB
3. Create synchronization mechanisms

### Phase 4: Optimization
1. Normalize state structure
2. Implement memoization strategies
3. Split contexts for better performance

### Phase 5: Documentation and Standards
1. Document state management patterns
2. Create guidelines for new features
3. Implement state management linting rules
