
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/shared/components/ui/button';

/**
 * The Button component is used for triggering actions and navigation.
 * 
 * ## Features
 * 
 * - Multiple variants (default, destructive, outline, secondary, ghost, link)
 * - Multiple sizes (default, sm, lg, icon)
 * - Support for disabled state
 * - Icon support with proper spacing
 * 
 * ## Usage
 * 
 * ```tsx
 * import { Button } from '@/shared/components/ui/button';
 * 
 * // Basic usage
 * <Button>Click me</Button>
 * 
 * // With variant
 * <Button variant="destructive">Delete</Button>
 * 
 * // With size
 * <Button size="lg">Large Button</Button>
 * 
 * // Disabled
 * <Button disabled>Can't click me</Button>
 * ```
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The variant of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    asChild: {
      control: 'boolean',
      description: 'Change the default rendered element for the one passed as a child',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * The default button style.
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * Use the destructive variant for actions that are destructive or dangerous.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

/**
 * Use the outline variant for secondary actions.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

/**
 * Use the secondary variant for less prominent actions.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

/**
 * Use the ghost variant for subtle actions.
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

/**
 * Use the link variant for navigation actions.
 */
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link',
  },
};

/**
 * Large button for more prominent actions.
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

/**
 * Small button for compact layouts.
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

/**
 * Disabled button state.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

/**
 * Disabled destructive button.
 */
export const DisabledDestructive: Story = {
  args: {
    disabled: true,
    variant: 'destructive',
    children: 'Disabled Destructive',
  },
};
