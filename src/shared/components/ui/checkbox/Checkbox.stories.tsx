
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { useState } from 'react';
import type { CheckedState } from '@radix-ui/react-checkbox';

/**
 * The Checkbox component is used for multiple selection from a set of options.
 * 
 * ## Features
 * 
 * - Support for checked, unchecked, and indeterminate states
 * - Support for disabled state
 * - Customizable appearance through className
 * 
 * ## Usage
 * 
 * ```tsx
 * import { Checkbox } from '@/shared/components/ui/checkbox';
 * import { Label } from '@/shared/components/ui/label';
 * 
 * // Basic usage
 * <Checkbox />
 * 
 * // With label
 * <div className="flex items-center space-x-2">
 *   <Checkbox id="terms" />
 *   <Label htmlFor="terms">Accept terms and conditions</Label>
 * </div>
 * 
 * // Controlled
 * const [checked, setChecked] = useState(false);
 * <Checkbox checked={checked} onCheckedChange={setChecked} />
 * ```
 */
const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'select',
      options: [true, false, 'indeterminate'],
      description: 'The checked state of the checkbox',
      table: {
        type: { summary: 'boolean | "indeterminate"' },
      },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'The default checked state when uncontrolled',
      table: {
        type: { summary: 'boolean' },
      },
    },
    onCheckedChange: {
      action: 'checked changed',
      description: 'Event handler called when the checked state changes',
      table: {
        type: { summary: 'function' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
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
type Story = StoryObj<typeof Checkbox>;

/**
 * The default checkbox style.
 */
export const Default: Story = {
  args: {
    defaultChecked: false,
  },
};

/**
 * A checked checkbox.
 */
export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

/**
 * An indeterminate checkbox.
 */
export const Indeterminate: Story = {
  args: {
    checked: 'indeterminate',
  },
};

/**
 * A disabled checkbox.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * A disabled and checked checkbox.
 */
export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

/**
 * A checkbox with a label.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

/**
 * A controlled checkbox example.
 */
export const Controlled: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [checked, setChecked] = useState<CheckedState>(false);
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="controlled-checkbox"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <Label htmlFor="controlled-checkbox">
            {checked === true ? 'Checked' : checked === 'indeterminate' ? 'Indeterminate' : 'Unchecked'}
          </Label>
        </div>
        <p className="text-sm text-gray-500">
          The checkbox is {checked === true ? 'checked' : checked === 'indeterminate' ? 'indeterminate' : 'unchecked'}
        </p>
      </div>
    );
  },
};

/**
 * Examples of checkboxes used in different contexts.
 */
export const Examples: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="marketing" />
        <Label htmlFor="marketing">Send me marketing emails</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="notifications" defaultChecked />
        <Label htmlFor="notifications">Send me notifications</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="updates" checked="indeterminate" />
        <Label htmlFor="updates">Send me product updates</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" disabled />
        <Label htmlFor="newsletter">Subscribe to newsletter (disabled)</Label>
      </div>
    </div>
  ),
};
