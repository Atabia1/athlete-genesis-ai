import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { useState } from 'react';

/**
 * The Checkbox component is used to select one or more items from a list of options.
 * 
 * ## Features
 * 
 * - Toggle between checked and unchecked states
 * - Support for indeterminate state
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
      control: 'boolean',
      description: 'Whether the checkbox is checked',
      table: {
        type: { summary: 'boolean' },
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
 * A checkbox in the checked state.
 */
export const Checked: Story = {
  args: {
    defaultChecked: true,
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
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="controlled-checkbox"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <Label htmlFor="controlled-checkbox">
            {checked ? 'Checked' : 'Unchecked'}
          </Label>
        </div>
        <p className="text-sm text-gray-500">
          The checkbox is {checked ? 'checked' : 'unchecked'}
        </p>
      </div>
    );
  },
};

/**
 * An example of a checkbox group.
 */
export const CheckboxGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Label className="text-base">Select your interests:</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="programming" />
          <Label htmlFor="programming">Programming</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="design" defaultChecked />
          <Label htmlFor="design">Design</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="marketing" />
          <Label htmlFor="marketing">Marketing</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="business" />
          <Label htmlFor="business">Business</Label>
        </div>
      </div>
    </div>
  ),
};

/**
 * An example of a checkbox with an indeterminate state.
 */
export const Indeterminate: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [checkedItems, setCheckedItems] = useState({
      apple: false,
      orange: false,
      banana: false,
    });

    const allChecked = Object.values(checkedItems).every(Boolean);
    const indeterminate = Object.values(checkedItems).some(Boolean) && !allChecked;

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="all"
            checked={allChecked}
            // @ts-ignore - indeterminate is not in the type definition
            ref={(el) => el && (el.indeterminate = indeterminate)}
            onCheckedChange={(checked) => {
              setCheckedItems({
                apple: !!checked,
                orange: !!checked,
                banana: !!checked,
              });
            }}
          />
          <Label htmlFor="all">Select all fruits</Label>
        </div>
        <div className="ml-6 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="apple"
              checked={checkedItems.apple}
              onCheckedChange={(checked) => {
                setCheckedItems({ ...checkedItems, apple: !!checked });
              }}
            />
            <Label htmlFor="apple">Apple</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="orange"
              checked={checkedItems.orange}
              onCheckedChange={(checked) => {
                setCheckedItems({ ...checkedItems, orange: !!checked });
              }}
            />
            <Label htmlFor="orange">Orange</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="banana"
              checked={checkedItems.banana}
              onCheckedChange={(checked) => {
                setCheckedItems({ ...checkedItems, banana: !!checked });
              }}
            />
            <Label htmlFor="banana">Banana</Label>
          </div>
        </div>
      </div>
    );
  },
};
