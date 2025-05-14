# Workout Feature

This directory contains all the code related to workout plans and exercises in the application.

## Components

The `components` directory contains UI components specific to workouts:

- Workout plan display and editing
- Exercise display and editing
- Workout session tracking
- Workout history and progress visualization

## Hooks

The `hooks` directory contains custom React hooks for workout functionality:

- `useWorkoutPlans`: Hook for fetching and managing workout plans
- `useExercises`: Hook for fetching and managing exercises
- `useWorkoutSession`: Hook for tracking workout sessions

## Context

The `context` directory contains React context providers for workout functionality:

- `PlanContext`: Context for managing workout plans
- `WorkoutSessionContext`: Context for tracking workout sessions

## Services

The `services` directory contains service modules for workout functionality:

- `workout-service.ts`: Service for managing workout plans
- `exercise-service.ts`: Service for managing exercises
- `workout-session-service.ts`: Service for tracking workout sessions

## Utils

The `utils` directory contains utility functions for workout functionality:

- `workout-normalizer.ts`: Utilities for normalizing workout data structures

## Usage

The workout feature provides functionality for creating, viewing, and tracking workout plans and exercises. It includes:

1. Creating and editing workout plans
2. Browsing and selecting exercises
3. Tracking workout sessions
4. Viewing workout history and progress

Example usage:

```tsx
import { useWorkoutPlans } from "@/features/workout/hooks/useWorkoutPlans";
import { WorkoutPlanList } from "@/features/workout/components/WorkoutPlanList";
import { WorkoutPlanProvider } from "@/features/workout/context/WorkoutPlanContext";

function WorkoutPlansPage() {
  const { workoutPlans, isLoading, error } = useWorkoutPlans();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <WorkoutPlanProvider>
      <h1>Your Workout Plans</h1>
      <WorkoutPlanList plans={workoutPlans} />
    </WorkoutPlanProvider>
  );
}
```
