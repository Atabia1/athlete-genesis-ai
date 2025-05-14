# Project Structure Standardization

This document outlines the standardized project structure for the Athlete Genesis AI application.

## Directory Structure

```
src/
  features/                  # Feature-based organization
    auth/                    # Authentication feature
      components/            # Auth-specific components
      hooks/                 # Auth-specific hooks
      services/              # Auth-specific services
      utils/                 # Auth-specific utilities
      types.ts               # Auth-specific types
      index.ts               # Public API for the feature
    
    workout/                 # Workout feature
      components/            # Workout-specific components
      hooks/                 # Workout-specific hooks
      services/              # Workout-specific services
      utils/                 # Workout-specific utilities
      types.ts               # Workout-specific types
      index.ts               # Public API for the feature
    
    offline/                 # Offline feature
      components/            # Offline-specific components
      hooks/                 # Offline-specific hooks
      services/              # Offline-specific services
      utils/                 # Offline-specific utilities
      types.ts               # Offline-specific types
      index.ts               # Public API for the feature
    
    user/                    # User feature
      components/            # User-specific components
      hooks/                 # User-specific hooks
      services/              # User-specific services
      utils/                 # User-specific utilities
      types.ts               # User-specific types
      index.ts               # Public API for the feature
    
    payment/                 # Payment feature
      components/            # Payment-specific components
      hooks/                 # Payment-specific hooks
      services/              # Payment-specific services
      utils/                 # Payment-specific utilities
      types.ts               # Payment-specific types
      index.ts               # Public API for the feature
    
    dashboard/               # Dashboard feature
      components/            # Dashboard-specific components
      hooks/                 # Dashboard-specific hooks
      services/              # Dashboard-specific services
      utils/                 # Dashboard-specific utilities
      types.ts               # Dashboard-specific types
      index.ts               # Public API for the feature
  
  shared/                    # Shared code used across features
    components/              # Shared components
      ui/                    # UI components (buttons, inputs, etc.)
      layout/                # Layout components (header, footer, etc.)
      error/                 # Error handling components
    hooks/                   # Shared hooks
    services/                # Shared services
    utils/                   # Shared utilities
    types/                   # Shared types
    constants/               # Shared constants
  
  pages/                     # Page components that compose features
    home/                    # Home page
    dashboard/               # Dashboard page
    workout/                 # Workout page
    profile/                 # Profile page
    settings/                # Settings page
    auth/                    # Auth pages (login, register, etc.)
    payment/                 # Payment pages
  
  app/                       # Application core
    providers/               # Application providers
    routes/                  # Application routes
    App.tsx                  # Main App component
    main.tsx                 # Application entry point
  
  assets/                    # Static assets
    images/                  # Image assets
    icons/                   # Icon assets
    fonts/                   # Font assets
  
  styles/                    # Global styles
    global.css               # Global CSS
    themes/                  # Theme styles
    variables.css            # CSS variables
```

## Feature Structure

Each feature should follow a consistent structure:

### Components

- Feature-specific components
- Should be organized by functionality
- Should be reusable within the feature
- Should not depend on other features

### Hooks

- Feature-specific hooks
- Should encapsulate feature-specific logic
- Should be reusable within the feature
- Should not depend on other features

### Services

- Feature-specific services
- Should handle API calls, data processing, etc.
- Should be reusable within the feature
- Should not depend on other features

### Utils

- Feature-specific utilities
- Should be pure functions
- Should be reusable within the feature
- Should not depend on other features

### Types

- Feature-specific types
- Should define the data structures used by the feature
- Should be reusable within the feature
- Should not depend on other features

### Index

- Public API for the feature
- Should export only what is needed by other features
- Should hide implementation details

## Migration Plan

1. Create the new directory structure
2. Move existing code to the new structure
3. Update imports to reflect the new structure
4. Remove old directories and files
5. Update documentation to reflect the new structure

## Guidelines

- Keep features isolated from each other
- Use the shared directory for code used across features
- Use the pages directory for page components that compose features
- Use the app directory for application core code
- Use the assets directory for static assets
- Use the styles directory for global styles
