# Features Directory

This directory contains feature-specific code organized by domain. Each feature is a self-contained module that includes all the code related to a specific feature of the application.

## Structure

Each feature directory follows a similar structure:

- `components`: Feature-specific UI components
- `hooks`: Feature-specific React hooks
- `context`: Feature-specific context providers
- `services`: Feature-specific services
- `utils`: Feature-specific utility functions
- `types.ts`: Feature-specific type definitions
- `README.md`: Documentation for the feature

## Features

- `workout`: Workout plans and exercises
- `offline`: Offline functionality and synchronization
- `auth`: Authentication and authorization
- `user`: User profiles and settings
- `nutrition`: Meal plans and nutrition tracking

## Guidelines

When working with features:

1. **Isolation**: Features should be as isolated as possible from each other. If code needs to be shared between features, consider moving it to the `shared` directory.

2. **Imports**: Features can import from the `shared` directory, but should avoid importing from other features when possible. If you need to import from another feature, consider if that code should be moved to the `shared` directory.

3. **Exports**: Each feature should export a clear public API. Internal implementation details should not be exported.

4. **Documentation**: Each feature should have a README.md file that explains what the feature does and how to use it.

## Example

A typical feature directory structure might look like this:

```
src/features/workout/
├── components/
│   ├── WorkoutList.tsx
│   ├── WorkoutDetail.tsx
│   └── ...
├── hooks/
│   ├── use-workouts.ts
│   └── ...
├── context/
│   ├── WorkoutContext.tsx
│   └── ...
├── services/
│   ├── workout-service.ts
│   └── ...
├── utils/
│   ├── workout-formatter.ts
│   └── ...
├── types.ts
└── README.md
```
