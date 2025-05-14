import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/shared/components/ui/button';
import { Mail, Send, Loader2 } from 'lucide-react';

/**
 * The Button component is used to trigger an action or event, such as submitting a form, opening a dialog, canceling an action, or performing a delete operation.
 * 
 * ## Features
 * 
 * - Multiple variants (default, destructive, outline, secondary, ghost, link)
 * - Multiple sizes (default, sm, lg, icon)
 * - Support for icons
 * - Loading state
 * - Disabled state
 * - Full width option
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
 * <Button size="sm">Small Button</Button>
 * 
 * // With icon
 * <Button>
 *   <Mail className="mr-2 h-4 w-4" /> Email
 * </Button>
 * 
 * // Loading state
 * <Button disabled>
 *   <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
 * </Button>
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
      description: 'The visual style of the button',
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
        defaultValue: { summary: false },
      },
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render as a child component',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
      table: {
        type: { summary: 'string' },
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
    variant: 'default',
    size: 'default',
  },
};

/**
 * Use the destructive variant for actions that are destructive or potentially dangerous.
 */
export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
};

/**
 * Use the outline variant for secondary actions or to reduce visual weight.
 */
export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

/**
 * Use the secondary variant for less important actions.
 */
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

/**
 * Use the ghost variant for the least important actions or in places where a button needs to blend with the background.
 */
export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
};

/**
 * Use the link variant to make a button look like a link.
 */
export const Link: Story = {
  args: {
    children: 'Link',
    variant: 'link',
  },
};

/**
 * Use the small size for compact UIs.
 */
export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
};

/**
 * Use the large size for important actions or to increase visibility.
 */
export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg',
  },
};

/**
 * Use the icon size for buttons that only contain an icon.
 */
export const Icon: Story = {
  args: {
    children: <Mail />,
    size: 'icon',
    'aria-label': 'Send email',
  },
};

/**
 * You can combine a button with an icon to provide additional context.
 */
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Send className="mr-2" />
        Send
      </>
    ),
  },
};

/**
 * Use the disabled state to indicate that a button is not interactive.
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

/**
 * Use the loading state to indicate that an action is in progress.
 */
export const Loading: Story = {
  args: {
    children: (
      <>
        <Loader2 className="mr-2 animate-spin" />
        Loading
      </>
    ),
    disabled: true,
  },
};

/**
 * You can display all button variants together to compare them.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon"><Mail /></Button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button disabled>Disabled</Button>
        <Button disabled variant="destructive">Disabled</Button>
        <Button disabled variant="outline">Disabled</Button>
      </div>
    </div>
  ),
};
