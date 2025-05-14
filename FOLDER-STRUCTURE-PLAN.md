# Folder Structure Reorganization Plan

This document outlines the plan for reorganizing the project's folder structure to be more feature-centric and maintainable.

## Current Structure

```
src/
  components/
    ui/
    dashboard/
    layout/
    ...
  context/
  hooks/
  pages/
    dashboard/
    coach/
    onboarding/
    ...
  services/
  utils/
  types/
```

## Proposed Structure

```
src/
  features/
    auth/
      components/
      hooks/
      context/
      services/
      utils/
      types.ts
    workout/
      components/
      hooks/
      context/
      services/
      utils/
      types.ts
    nutrition/
      components/
      hooks/
      context/
      services/
      utils/
      types.ts
    coach/
      components/
      hooks/
      context/
      services/
      utils/
      types.ts
    user/
      components/
      hooks/
      context/
      services/
      utils/
      types.ts
    offline/
      components/
      hooks/
      context/
      services/
      utils/
      types.ts
  shared/
    components/
      ui/
      layout/
      error-boundary/
      ...
    hooks/
    context/
    services/
    utils/
    types/
  pages/
    dashboard/
    coach/
    onboarding/
    ...
  app/
    providers.tsx
    routes.tsx
    App.tsx
    main.tsx
```

## Migration Steps

### Phase 1: Create the New Structure

1. Create the new directory structure
2. Create placeholder README.md files in each directory to explain its purpose
3. Update import paths in tsconfig.json

### Phase 2: Migrate Shared Components

1. Move UI components to shared/components/ui
2. Move layout components to shared/components/layout
3. Move error boundary components to shared/components/error-boundary
4. Update imports in all files that use these components

### Phase 3: Migrate Features

1. Identify components, hooks, and utilities for each feature
2. Move them to the appropriate feature directory
3. Update imports in all files that use these components

### Phase 4: Migrate Services

1. Move API services to the appropriate feature directories
2. Move shared services to shared/services
3. Update imports in all files that use these services

### Phase 5: Migrate Context and Hooks

1. Move feature-specific context providers to their feature directories
2. Move shared context providers to shared/context
3. Move feature-specific hooks to their feature directories
4. Move shared hooks to shared/hooks
5. Update imports in all files that use these hooks and context providers

### Phase 6: Migrate Types

1. Move feature-specific types to their feature directories
2. Move shared types to shared/types
3. Update imports in all files that use these types

### Phase 7: Reorganize Pages

1. Update imports in page components to use the new structure
2. Consider organizing pages by feature as well

### Phase 8: Update App Structure

1. Create app/providers.tsx to centralize provider management
2. Create app/routes.tsx to centralize route definitions
3. Update App.tsx and main.tsx to use the new structure

## Benefits

1. **Feature Cohesion**: Related code is grouped together, making it easier to understand and modify features
2. **Clear Boundaries**: Clear separation between features and shared code
3. **Scalability**: Easier to add new features without affecting existing ones
4. **Maintainability**: Easier to maintain and refactor code
5. **Onboarding**: Easier for new developers to understand the codebase

## Considerations

1. **Import Paths**: Will need to update many import paths
2. **Circular Dependencies**: Need to be careful to avoid circular dependencies
3. **Shared Code**: Need to clearly define what belongs in shared vs. features
4. **Migration Strategy**: Need to migrate gradually to avoid breaking the application

## Timeline

- Phase 1: 1 day
- Phase 2: 1-2 days
- Phase 3: 2-3 days
- Phase 4: 1-2 days
- Phase 5: 1-2 days
- Phase 6: 1 day
- Phase 7: 1-2 days
- Phase 8: 1 day

Total: 9-14 days
