import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/shared/components/ui/badge';

/**
 * The Badge component is used to highlight an item's status for quick recognition.
 * 
 * ## Features
 * 
 * - Multiple variants (default, secondary, destructive, outline)
 * - Customizable appearance through className
 * 
 * ## Usage
 * 
 * ```tsx
 * import { Badge } from '@/shared/components/ui/badge';
 * 
 * // Basic usage
 * <Badge>Badge</Badge>
 * 
 * // With variant
 * <Badge variant="destructive">Error</Badge>
 * 
 * // With custom className
 * <Badge className="bg-blue-500 text-white">Custom</Badge>
 * ```
 */
const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'The visual style of the badge',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
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
type Story = StoryObj<typeof Badge>;

/**
 * The default badge style.
 */
export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

/**
 * Use the secondary variant for less important badges.
 */
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

/**
 * Use the destructive variant for error or warning states.
 */
export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
};

/**
 * Use the outline variant for a more subtle appearance.
 */
export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

/**
 * You can display all badge variants together to compare them.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

/**
 * Examples of badges used in different contexts.
 */
export const Examples: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant="default">New</Badge>
        <span>Feature announcement</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary">Beta</Badge>
        <span>This feature is in beta</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="destructive">Deprecated</Badge>
        <span>This API will be removed in the next version</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline">Version 1.0.0</Badge>
        <span>Release notes</span>
      </div>
    </div>
  ),
};
