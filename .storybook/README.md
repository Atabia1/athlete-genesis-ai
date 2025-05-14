# Storybook Configuration

This directory contains the configuration files for Storybook, which is used for component documentation.

## Files

- `main.js`: The main configuration file for Storybook
- `preview.js`: Configuration for the preview iframe
- `manager.js`: Configuration for the Storybook UI
- `theme.js`: Custom theme for Storybook
- `decorators.jsx`: Custom decorators for stories

## Running Storybook

To run Storybook locally:

```bash
npm run storybook
```

This will start Storybook on port 6006. You can access it at http://localhost:6006.

## Building Storybook

To build Storybook for deployment:

```bash
npm run build-storybook
```

This will create a static build of Storybook in the `storybook-static` directory.

## Adding Stories

To add a new story for a component:

1. Create a new file named `ComponentName.stories.tsx` in the same directory as your component
2. Import the component and define the stories
3. Add documentation using JSDoc comments

Example:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

/**
 * Documentation for the component
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  // ...
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};
```

## Best Practices

- Use JSDoc comments to document components
- Include examples of how to use the component
- Show different variants and states of the component
- Use controls to allow users to interact with the component
- Group related components together under the same category
