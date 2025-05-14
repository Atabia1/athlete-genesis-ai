import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Search, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

/**
 * The Input component is used to get user input in a text field.
 * 
 * ## Features
 * 
 * - Support for all standard input types (text, email, password, etc.)
 * - Support for disabled state
 * - Support for readonly state
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
 * <Input placeholder="Enter your name" />
 * 
 * // With label
 * <div className="grid w-full max-w-sm items-center gap-1.5">
 *   <Label htmlFor="email">Email</Label>
 *   <Input type="email" id="email" placeholder="Email" />
 * </div>
 * 
 * // With icon
 * <div className="relative">
 *   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
 *   <Input className="pl-8" type="search" placeholder="Search..." />
 * </div>
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
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url', 'date', 'time', 'datetime-local', 'month', 'week'],
      description: 'The type of the input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the input is read-only',
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
type Story = StoryObj<typeof Input>;

/**
 * The default input style.
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
  },
};

/**
 * An input with a label.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="Enter your name" />
    </div>
  ),
};

/**
 * An input with an icon.
 */
export const WithIcon: Story = {
  render: () => (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input className="pl-8" type="search" placeholder="Search..." />
    </div>
  ),
};

/**
 * A disabled input.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    value: 'You cannot change this',
  },
};

/**
 * A read-only input.
 */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    placeholder: 'Read-only input',
    value: 'You cannot change this',
  },
};

/**
 * An input with an error state.
 */
export const WithError: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-error">Email</Label>
      <Input
        id="email-error"
        type="email"
        placeholder="Enter your email"
        className="border-red-500 focus-visible:ring-red-500"
      />
      <p className="text-sm text-red-500">Please enter a valid email address.</p>
    </div>
  ),
};

/**
 * A password input with show/hide functionality.
 */
export const Password: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="relative w-full max-w-sm">
        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          className="pl-8 pr-10"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  },
};

/**
 * Examples of inputs used in a form.
 */
export const FormExample: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="form-name">Name</Label>
        <Input id="form-name" placeholder="Enter your name" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="form-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            id="form-email"
            type="email"
            className="pl-8"
            placeholder="Enter your email"
          />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="form-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            id="form-password"
            type="password"
            className="pl-8"
            placeholder="Enter your password"
          />
        </div>
      </div>
    </div>
  ),
};
