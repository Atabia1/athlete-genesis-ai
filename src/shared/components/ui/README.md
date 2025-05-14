# UI Components

This directory contains basic UI components that are used across multiple features.

## Component Documentation

Each component is documented using Storybook. The documentation includes:

- Component description
- Features
- Usage examples
- Props documentation
- Interactive examples

## Storybook

To view the component documentation in Storybook:

```bash
npm run storybook
```

This will start Storybook on port 6006. You can access it at http://localhost:6006.

## Components

- `alert`: Alert component for displaying important messages
- `badge`: Badge component for highlighting items
- `button`: Button component for triggering actions
- `checkbox`: Checkbox component for selecting options
- `dialog`: Dialog component for modal interfaces
- `input`: Input component for text entry
- `label`: Label component for form elements
- `switch`: Switch component for toggling options
- `toast`: Toast component for notifications
- `toggle`: Toggle component for switching between states

## Adding New Components

When adding a new component:

1. Create a new directory for the component
2. Add the component implementation
3. Create a Storybook story for the component
4. Document the component using JSDoc comments

Example directory structure:

```
button/
├── Button.tsx
├── Button.stories.tsx
└── index.ts
```

## Best Practices

- Use TypeScript for type safety
- Document props using JSDoc comments
- Create stories for all component variants
- Follow the design system guidelines
- Make components accessible
- Write unit tests for components
