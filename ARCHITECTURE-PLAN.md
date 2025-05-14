# Architecture Implementation Plan

This document outlines the plan for implementing a clear architecture in the Athlete Genesis AI application.

## Current Issues

1. **Lack of Clear Architecture**: No clear separation between UI, business logic, and data access
2. **Mixed State Management**: Inconsistent use of different state management approaches
3. **Unclear Component Composition**: No clear pattern for component composition
4. **Inconsistent Hook Usage**: Inconsistent use of hooks vs. higher-order components
5. **Poor Separation of Concerns**: Business logic mixed with UI components
6. **Unclear Data Flow**: Difficult to understand how data flows through the application

## Architecture Principles

### 1. Feature-Based Organization

Organize code by feature rather than by type:

```
src/
  features/
    auth/
      components/
      hooks/
      services/
      utils/
      types.ts
      index.ts
    workout/
      components/
      hooks/
      services/
      utils/
      types.ts
      index.ts
    ...
```

### 2. Clean Architecture

Implement a clean architecture with clear separation of concerns:

```
UI Layer (Components)
    ↑↓
Application Layer (Hooks, Context)
    ↑↓
Domain Layer (Business Logic)
    ↑↓
Infrastructure Layer (API, Storage)
```

### 3. Dependency Inversion

Use dependency inversion to make higher-level modules independent of lower-level modules:

```typescript
// Define an interface in the domain layer
interface UserRepository {
  getUser(id: string): Promise<User>;
  saveUser(user: User): Promise<void>;
}

// Implement the interface in the infrastructure layer
class ApiUserRepository implements UserRepository {
  async getUser(id: string): Promise<User> {
    // Implementation using API
  }

  async saveUser(user: User): Promise<void> {
    // Implementation using API
  }
}

// Use the interface in the application layer
function useUser(userId: string) {
  const userRepository = useUserRepository();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    userRepository.getUser(userId).then(setUser);
  }, [userId, userRepository]);

  return user;
}

// Provide the implementation in the composition root
function App() {
  return (
    <UserRepositoryProvider repository={new ApiUserRepository()}>
      <UserProfile userId="123" />
    </UserRepositoryProvider>
  );
}
```

### 4. Unidirectional Data Flow

Implement unidirectional data flow:

```
Action → Dispatcher → Store → View → Action
```

### 5. Command Query Responsibility Segregation (CQRS)

Separate commands (write operations) from queries (read operations):

```typescript
// Query
function useUserQuery(userId: string) {
  return useQuery(['user', userId], () => userService.getUser(userId));
}

// Command
function useUpdateUserCommand() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (user: User) => userService.updateUser(user),
    {
      onSuccess: (_, user) => {
        queryClient.invalidateQueries(['user', user.id]);
      },
    }
  );
}
```

## Implementation Strategies

### 1. Feature Module Pattern

Implement the feature module pattern:

```typescript
// feature/index.ts
export * from './components';
export * from './hooks';
export * from './types';

// Only export what should be used by other features
```

### 2. Presentational and Container Components

Separate presentational and container components:

```typescript
// Presentational component
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  isLoading: boolean;
  error: Error | null;
}

function UserProfile({ user, onUpdate, isLoading, error }: UserProfileProps) {
  // Render UI based on props
}

// Container component
function UserProfileContainer({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUserQuery(userId);
  const { mutate: updateUser } = useUpdateUserCommand();

  if (!user) return null;

  return (
    <UserProfile
      user={user}
      onUpdate={updateUser}
      isLoading={isLoading}
      error={error}
    />
  );
}
```

### 3. Custom Hooks for Business Logic

Extract business logic into custom hooks:

```typescript
function useWorkoutCreation() {
  const [workout, setWorkout] = useState<Workout>({
    id: '',
    name: '',
    exercises: [],
  });

  const addExercise = useCallback((exercise: Exercise) => {
    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise],
    }));
  }, []);

  const removeExercise = useCallback((exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(e => e.id !== exerciseId),
    }));
  }, []);

  const saveWorkout = useCallback(async () => {
    // Save workout logic
  }, [workout]);

  return {
    workout,
    setWorkout,
    addExercise,
    removeExercise,
    saveWorkout,
  };
}
```

### 4. Service Layer for External Communication

Create a service layer for communication with external systems:

```typescript
class WorkoutService {
  constructor(private api: ApiClient) {}

  async getWorkouts(): Promise<Workout[]> {
    return this.api.get('/workouts');
  }

  async getWorkout(id: string): Promise<Workout> {
    return this.api.get(`/workouts/${id}`);
  }

  async createWorkout(workout: Workout): Promise<Workout> {
    return this.api.post('/workouts', workout);
  }

  async updateWorkout(workout: Workout): Promise<Workout> {
    return this.api.put(`/workouts/${workout.id}`, workout);
  }

  async deleteWorkout(id: string): Promise<void> {
    return this.api.delete(`/workouts/${id}`);
  }
}
```

### 5. Domain Models for Business Logic

Create domain models to encapsulate business logic:

```typescript
class WorkoutModel {
  constructor(private workout: Workout) {}

  get id(): string {
    return this.workout.id;
  }

  get name(): string {
    return this.workout.name;
  }

  get exercises(): Exercise[] {
    return [...this.workout.exercises];
  }

  get duration(): number {
    return this.workout.exercises.reduce(
      (total, exercise) => total + exercise.duration,
      0
    );
  }

  addExercise(exercise: Exercise): WorkoutModel {
    return new WorkoutModel({
      ...this.workout,
      exercises: [...this.workout.exercises, exercise],
    });
  }

  removeExercise(exerciseId: string): WorkoutModel {
    return new WorkoutModel({
      ...this.workout,
      exercises: this.workout.exercises.filter(e => e.id !== exerciseId),
    });
  }

  toJSON(): Workout {
    return { ...this.workout };
  }
}
```

## Implementation Plan

### Phase 1: Define Architecture

1. Document the architecture principles
2. Create architecture diagrams
3. Define the folder structure
4. Define the module boundaries
5. Define the data flow

### Phase 2: Implement Core Infrastructure

1. Create the service layer
2. Implement the repository pattern
3. Create domain models
4. Implement dependency injection
5. Create utility functions

### Phase 3: Refactor Features

1. Refactor authentication feature
2. Refactor workout feature
3. Refactor offline feature
4. Refactor user feature
5. Refactor payment feature

### Phase 4: Implement Cross-Cutting Concerns

1. Implement error handling
2. Implement logging
3. Implement analytics
4. Implement performance monitoring
5. Implement feature flags

### Phase 5: Document Architecture

1. Create architecture documentation
2. Create component diagrams
3. Create data flow diagrams
4. Create state management diagrams
5. Create API documentation

## Conclusion

By implementing a clear architecture, we can significantly improve the maintainability, testability, and scalability of the Athlete Genesis AI application. This will make it easier for developers to understand the codebase, add new features, and fix bugs.
