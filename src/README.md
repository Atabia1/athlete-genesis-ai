# Source Directory

This directory contains the source code for the application, organized using a feature-based architecture.

## Directory Structure

- `features/`: Feature-specific code organized by domain
- `shared/`: Shared code used across multiple features
- `app/`: Application-level code (routing, layout, etc.)
- `assets/`: Static assets (images, fonts, etc.)
- `styles/`: Global styles and theme configuration

## Architecture

The application follows a feature-based architecture, where code is organized by domain rather than by technical role. This approach has several benefits:

1. **Cohesion**: Related code is kept together, making it easier to understand and modify features.
2. **Isolation**: Features are isolated from each other, reducing coupling and making the codebase more maintainable.
3. **Scalability**: New features can be added without affecting existing ones.
4. **Reusability**: Shared code is extracted to the `shared` directory, promoting reuse across features.

## Guidelines

When working with this codebase:

1. **Feature Isolation**: Keep features isolated from each other. If code needs to be shared between features, move it to the `shared` directory.

2. **Import Rules**:
   - Features can import from `shared`
   - Features should not import from other features
   - `app` can import from both `features` and `shared`

3. **Component Organization**:
   - UI components specific to a feature should be in that feature's `components` directory
   - Shared UI components should be in the `shared/components` directory
   - Layout components should be in the `app/components` directory

4. **State Management**:
   - Feature-specific state should be managed within the feature
   - Global state should be managed at the application level

5. **Documentation**:
   - Each directory should have a README.md file explaining its purpose
   - Complex components and functions should have JSDoc comments

## Entry Points

- `main.tsx`: The entry point for the application
- `app/App.tsx`: The root component for the application
- `app/routes.tsx`: The routing configuration for the application
