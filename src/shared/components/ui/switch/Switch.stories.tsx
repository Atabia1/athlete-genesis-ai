import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { useState } from 'react';

/**
 * The Switch component is used as an alternative to the Checkbox component for toggling between enabled and disabled states.
 * 
 * ## Features
 * 
 * - Toggle between checked and unchecked states
 * - Support for disabled state
 * - Customizable appearance through className
 * 
 * ## Usage
 * 
 * ```tsx
 * import { Switch } from '@/shared/components/ui/switch';
 * import { Label } from '@/shared/components/ui/label';
 * 
 * // Basic usage
 * <Switch />
 * 
 * // With label
 * <div className="flex items-center space-x-2">
 *   <Switch id="airplane-mode" />
 *   <Label htmlFor="airplane-mode">Airplane Mode</Label>
 * </div>
 * 
 * // Controlled
 * const [checked, setChecked] = useState(false);
 * <Switch checked={checked} onCheckedChange={setChecked} />
 * ```
 */
const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the switch is checked',
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
      description: 'Whether the switch is disabled',
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
type Story = StoryObj<typeof Switch>;

/**
 * The default switch style.
 */
export const Default: Story = {
  args: {
    defaultChecked: false,
  },
};

/**
 * A switch in the checked state.
 */
export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

/**
 * A disabled switch.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * A disabled and checked switch.
 */
export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

/**
 * A switch with a label.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

/**
 * A controlled switch example.
 */
export const Controlled: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="controlled-switch"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <Label htmlFor="controlled-switch">
            {checked ? 'Enabled' : 'Disabled'}
          </Label>
        </div>
        <p className="text-sm text-gray-500">
          The switch is {checked ? 'checked' : 'unchecked'}
        </p>
      </div>
    );
  },
};

/**
 * Examples of switches used in different contexts.
 */
export const Examples: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
        <Switch id="airplane-mode" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="wifi">Wi-Fi</Label>
        <Switch id="wifi" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="bluetooth">Bluetooth</Label>
        <Switch id="bluetooth" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">Notifications</Label>
        <Switch id="notifications" defaultChecked />
      </div>
    </div>
  ),
};
