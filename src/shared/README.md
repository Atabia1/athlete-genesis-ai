# Shared Directory

This directory contains shared code that is used across multiple features of the application.

## Components

The `components` directory contains reusable UI components that are used throughout the application:

- `ui`: Basic UI components like buttons, inputs, etc.
- `layout`: Layout components like containers, grids, etc.
- `error-boundary`: Error boundary components for handling errors gracefully
- `form`: Form-related components like inputs, selectors, etc.
- `data-display`: Components for displaying data like tables, cards, etc.

## Hooks

The `hooks` directory contains custom React hooks that can be used across the application.

## Context

The `context` directory contains React context providers that can be used across the application.

## Services

The `services` directory contains service modules that provide functionality to different parts of the application:

- API clients
- Authentication services
- Logging services
- Analytics services
- etc.

## Types

The `types` directory contains TypeScript type definitions that are used across the application.

## Utils

The `utils` directory contains utility functions that are used across the application:

- `cn.ts`: Utility for combining class names
- `error-handling.ts`: Error handling utilities
- `feature-flags.ts`: Feature flag utilities
- `validation.ts`: Data validation utilities
- etc.

## Usage

Import shared components, hooks, services, types, and utilities as needed in your feature modules:

```tsx
// Import shared components
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ErrorFallback } from "@/shared/components/error-boundary/ErrorFallback";

// Import shared hooks
import { useLocalStorage } from "@/shared/hooks/use-local-storage";

// Import shared services
import { apiClient } from "@/shared/services/api-client";

// Import shared types
import { User } from "@/shared/types/user";

// Import shared utilities
import { cn } from "@/shared/utils/cn";
import { validateData } from "@/shared/utils/validation";
```
