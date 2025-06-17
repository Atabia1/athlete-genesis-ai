
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';

/**
 * The Input component is used for text input fields.
 * 
 * ## Features
 * 
 * - Support for different input types (text, email, password, etc.)
 * - Support for disabled state
 * - Support for placeholder text
 * - Customizable appearance through className
 * 
 * ## Usage
 * 
 * ```tsx
 * import { Input } from '@/shared/components/ui/input';
 * import { Label } from '@/shared/components/ui/label';
 * 
 * // Basic usage
 * <Input placeholder="Enter text..." />
 * 
 * // With label
 * <div className="grid w-full max-w-sm items-center gap-1.5">
 *   <Label htmlFor="email">Email</Label>
 *   <Input type="email" id="email" placeholder="Email" />
 * </div>
 * 
 * // Disabled
 * <Input disabled placeholder="Disabled input" />
 * ```
 */
const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'The type of the input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
type Story = StoryObj<typeof Input>;

/**
 * The default input style.
 */
export const Default: Story = {
  args: {
    placeholder: 'Type something...',
  },
};

/**
 * An email input field.
 */
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
  },
};

/**
 * A password input field.
 */
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
  },
};

/**
 * A number input field.
 */
export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number',
  },
};

/**
 * A disabled input field.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
};

/**
 * A disabled input with a value.
 */
export const DisabledWithValue: Story = {
  args: {
    disabled: true,
    defaultValue: 'Can\'t edit this',
  },
};

/**
 * An input with a label.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

/**
 * Examples of inputs used in a form.
 */
export const FormExample: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Your name" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Your email" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" placeholder="Your password" />
      </div>
      <Button type="submit">Submit</Button>
    </div>
  ),
};
