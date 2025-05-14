# Utilities Documentation

This document describes the standardized utilities that have been added to the Athlete Genesis AI application to improve code quality, maintainability, and performance.

## Context Factory

The context factory provides a standardized way to create React contexts with:
- Type safety
- Error handling
- Context selectors to prevent unnecessary re-renders
- Consistent API

### Usage

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

// Use the context
function MyComponent() {
  const context = useContext();
  return <div>{context.value}</div>;
}

// Use a selector to prevent unnecessary re-renders
function MyOptimizedComponent() {
  const value = useContextSelector(state => state.value);
  return <div>{value}</div>;
}

// Provide the context
function App() {
  return (
    <Provider value={myValue}>
      <MyComponent />
    </Provider>
  );
}
```

## Component Factory

The component factory provides a standardized way to create React components with:
- Built-in error handling
- Performance optimizations
- Consistent API
- TypeScript type safety

### Usage

```typescript
// Create a component with the factory
const MyComponent = createComponent(
  ({ name, age }) => {
    return <div>Hello, {name}! You are {age} years old.</div>;
  },
  {
    displayName: 'MyComponent',
    withErrorHandling: true,
    memo: true,
  }
);

// Use the component
function App() {
  return <MyComponent name="John" age={30} />;
}
```

## Form Handling

The form handling utilities provide a standardized way to handle forms with:
- Form validation
- Form submission
- Error handling
- Field management
- Form state

### Usage

```typescript
// Use the form hook
function MyForm() {
  const { formState, formHandlers } = useForm({
    initialValues: {
      name: '',
      email: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = 'Name is required';
      }
      if (!values.email) {
        errors.email = 'Email is required';
      }
      return errors;
    },
    onSubmit: async (values) => {
      await api.post('/users', values);
    },
  });

  return (
    <form onSubmit={formHandlers.handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={formState.values.name}
          onChange={formHandlers.handleChange}
          onBlur={formHandlers.handleBlur}
        />
        {formState.touched.name && formState.errors.name && (
          <div>{formState.errors.name}</div>
        )}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          value={formState.values.email}
          onChange={formHandlers.handleChange}
          onBlur={formHandlers.handleBlur}
        />
        {formState.touched.email && formState.errors.email && (
          <div>{formState.errors.email}</div>
        )}
      </div>
      <button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

## API Client

The API client provides a standardized way to make API requests with:
- Error handling
- Request/response interceptors
- Automatic retry for failed requests
- Request cancellation
- Request caching
- Authentication handling

### Usage

```typescript
// Create an API client
const api = new ApiClient({
  baseUrl: 'https://api.example.com',
  defaultOptions: {
    timeout: 30000,
    retry: {
      maxRetries: 3,
      retryDelay: 1000,
      retryStatusCodes: [408, 429, 500, 502, 503, 504],
    },
  },
});

// Make a GET request
const users = await api.get('/users');

// Make a POST request
const user = await api.post('/users', {
  name: 'John',
  email: 'john@example.com',
});

// Make a PUT request
const updatedUser = await api.put('/users/123', {
  name: 'John Doe',
});

// Make a DELETE request
await api.delete('/users/123');
```

## API Hooks

The API hooks provide a standardized way to make API requests with React Query integration:
- Error handling
- Loading states
- Automatic retries
- Offline support
- Caching

### Usage

```typescript
// Use the API query hook
function UserList() {
  const { data: users, isLoading, error } = useApiQuery(
    ['users'],
    () => api.get('/users'),
    {
      offlineSupport: true,
      getOfflineData: () => db.getUsers(),
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Use the API mutation hook
function CreateUser() {
  const { mutate, isLoading } = useApiMutation(
    (user) => api.post('/users', user),
    {
      offlineSupport: true,
      retryOperationType: 'CREATE_USER',
      onSuccess: () => {
        // Invalidate the users query
        queryClient.invalidateQueries(['users']);
      },
    }
  );

  const handleSubmit = (user) => {
    mutate(user);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

## Form Components

The form components provide a standardized way to create forms with:
- Error handling
- Loading states
- Validation
- Accessibility

### Usage

```tsx
// Use the custom form components
function MyForm() {
  const { formState, formHandlers, isSubmitting, submitError } = useForm({
    initialValues: {
      name: '',
      email: '',
    },
    onSubmit: async (values) => {
      await api.post('/users', values);
    },
  });

  return (
    <CustomForm
      onSubmit={formHandlers.handleSubmit}
      isLoading={isSubmitting}
      hasErrors={!!submitError}
      errorMessage={submitError?.message}
    >
      <CustomFormField
        name="name"
        label="Name"
        required
        error={formState.touched.name && formState.errors.name}
      >
        <input
          name="name"
          value={formState.values.name}
          onChange={formHandlers.handleChange}
          onBlur={formHandlers.handleBlur}
        />
      </CustomFormField>
      
      <CustomFormField
        name="email"
        label="Email"
        required
        error={formState.touched.email && formState.errors.email}
      >
        <input
          name="email"
          value={formState.values.email}
          onChange={formHandlers.handleChange}
          onBlur={formHandlers.handleBlur}
        />
      </CustomFormField>
      
      <CustomFormSubmit isLoading={isSubmitting}>
        Submit
      </CustomFormSubmit>
    </CustomForm>
  );
}
```

## Authentication Hook

The authentication hook provides authentication functionality including:
- Login
- Logout
- Registration
- Password reset
- User management

### Usage

```tsx
// Use the authentication hook
function LoginForm() {
  const { login, isLoading, error } = useAuth();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    
    try {
      await login({ email, password });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>
      {error && <div>{error.message}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## Workouts Hook

The workouts hook provides workout management functionality including:
- Fetching workouts
- Creating workouts
- Updating workouts
- Deleting workouts
- Offline support

### Usage

```tsx
// Use the workouts hook
function WorkoutList() {
  const { workouts, isLoading, error, saveWorkoutForOffline } = useWorkouts();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  return (
    <ul>
      {workouts.map(workout => (
        <li key={workout.id}>
          {workout.name}
          <button onClick={() => saveWorkoutForOffline(workout)}>
            Save for Offline
          </button>
        </li>
      ))}
    </ul>
  );
}
```

## Conclusion

These standardized utilities provide a solid foundation for building maintainable, performant, and user-friendly applications. By using these utilities consistently throughout the codebase, we can ensure that the application follows best practices and provides a consistent experience for users and developers alike.
