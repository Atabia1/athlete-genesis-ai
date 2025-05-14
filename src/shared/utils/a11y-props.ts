/**
 * Accessibility Props Utility
 * 
 * This utility provides functions to generate accessibility props for components.
 * It helps ensure that components have the necessary ARIA attributes and other
 * accessibility properties.
 */

import { HTMLAttributes } from 'react';

/**
 * Props for accessible elements
 */
export interface AccessibleProps extends HTMLAttributes<HTMLElement> {
  /** ID for the element */
  id?: string;
  /** ARIA role for the element */
  role?: string;
  /** ARIA label for the element */
  'aria-label'?: string;
  /** ID of the element that labels this element */
  'aria-labelledby'?: string;
  /** ID of the element that describes this element */
  'aria-describedby'?: string;
  /** Whether the element is expanded */
  'aria-expanded'?: boolean;
  /** Whether the element is hidden */
  'aria-hidden'?: boolean;
  /** Whether the element is disabled */
  'aria-disabled'?: boolean;
  /** Whether the element is selected */
  'aria-selected'?: boolean;
  /** Whether the element is checked */
  'aria-checked'?: boolean | 'mixed';
  /** Whether the element is pressed */
  'aria-pressed'?: boolean | 'mixed';
  /** Whether the element is required */
  'aria-required'?: boolean;
  /** Whether the element is invalid */
  'aria-invalid'?: boolean;
  /** Whether the element is busy */
  'aria-busy'?: boolean;
  /** The current state of the element */
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  /** The controls property */
  'aria-controls'?: string;
  /** The owns property */
  'aria-owns'?: string;
  /** The live property */
  'aria-live'?: 'polite' | 'assertive' | 'off';
  /** The atomic property */
  'aria-atomic'?: boolean;
  /** The relevant property */
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';
  /** The haspopup property */
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  /** The level property */
  'aria-level'?: number;
  /** The orientation property */
  'aria-orientation'?: 'horizontal' | 'vertical';
  /** The valuemin property */
  'aria-valuemin'?: number;
  /** The valuemax property */
  'aria-valuemax'?: number;
  /** The valuenow property */
  'aria-valuenow'?: number;
  /** The valuetext property */
  'aria-valuetext'?: string;
  /** The posinset property */
  'aria-posinset'?: number;
  /** The setsize property */
  'aria-setsize'?: number;
  /** The sort property */
  'aria-sort'?: 'ascending' | 'descending' | 'other' | 'none';
  /** The colcount property */
  'aria-colcount'?: number;
  /** The colindex property */
  'aria-colindex'?: number;
  /** The colspan property */
  'aria-colspan'?: number;
  /** The rowcount property */
  'aria-rowcount'?: number;
  /** The rowindex property */
  'aria-rowindex'?: number;
  /** The rowspan property */
  'aria-rowspan'?: number;
  /** The autocomplete property */
  'aria-autocomplete'?: 'inline' | 'list' | 'both' | 'none';
  /** The modal property */
  'aria-modal'?: boolean;
  /** The keyshortcuts property */
  'aria-keyshortcuts'?: string;
  /** The roledescription property */
  'aria-roledescription'?: string;
  /** The placeholder property */
  'aria-placeholder'?: string;
  /** The errormessage property */
  'aria-errormessage'?: string;
}

/**
 * Generate props for a button element
 * @param props - Additional props for the button
 * @returns Props for an accessible button
 */
export function getButtonProps(props: Partial<AccessibleProps> = {}): AccessibleProps {
  const { role = 'button', ...rest } = props;
  
  return {
    role,
    tabIndex: 0,
    ...rest,
  };
}

/**
 * Generate props for a toggle button element
 * @param pressed - Whether the button is pressed
 * @param props - Additional props for the button
 * @returns Props for an accessible toggle button
 */
export function getToggleButtonProps(
  pressed: boolean,
  props: Partial<AccessibleProps> = {}
): AccessibleProps {
  return {
    ...getButtonProps(props),
    'aria-pressed': pressed,
  };
}

/**
 * Generate props for a menu button element
 * @param expanded - Whether the menu is expanded
 * @param props - Additional props for the button
 * @returns Props for an accessible menu button
 */
export function getMenuButtonProps(
  expanded: boolean,
  props: Partial<AccessibleProps> = {}
): AccessibleProps {
  return {
    ...getButtonProps(props),
    'aria-expanded': expanded,
    'aria-haspopup': 'menu',
  };
}

/**
 * Generate props for a menu element
 * @param props - Additional props for the menu
 * @returns Props for an accessible menu
 */
export function getMenuProps(props: Partial<AccessibleProps> = {}): AccessibleProps {
  const { role = 'menu', ...rest } = props;
  
  return {
    role,
    tabIndex: -1,
    ...rest,
  };
}

/**
 * Generate props for a menu item element
 * @param props - Additional props for the menu item
 * @returns Props for an accessible menu item
 */
export function getMenuItemProps(props: Partial<AccessibleProps> = {}): AccessibleProps {
  const { role = 'menuitem', ...rest } = props;
  
  return {
    role,
    tabIndex: -1,
    ...rest,
  };
}

/**
 * Generate props for a dialog element
 * @param props - Additional props for the dialog
 * @returns Props for an accessible dialog
 */
export function getDialogProps(props: Partial<AccessibleProps> = {}): AccessibleProps {
  const { role = 'dialog', ...rest } = props;
  
  return {
    role,
    'aria-modal': true,
    tabIndex: -1,
    ...rest,
  };
}

/**
 * Generate props for a tooltip element
 * @param props - Additional props for the tooltip
 * @returns Props for an accessible tooltip
 */
export function getTooltipProps(props: Partial<AccessibleProps> = {}): AccessibleProps {
  const { role = 'tooltip', ...rest } = props;
  
  return {
    role,
    ...rest,
  };
}

/**
 * Generate props for a live region element
 * @param politeness - The politeness level of the live region
 * @param props - Additional props for the live region
 * @returns Props for an accessible live region
 */
export function getLiveRegionProps(
  politeness: 'polite' | 'assertive' = 'polite',
  props: Partial<AccessibleProps> = {}
): AccessibleProps {
  return {
    'aria-live': politeness,
    'aria-atomic': true,
    ...props,
  };
}

/**
 * Generate props for a tab element
 * @param selected - Whether the tab is selected
 * @param props - Additional props for the tab
 * @returns Props for an accessible tab
 */
export function getTabProps(
  selected: boolean,
  props: Partial<AccessibleProps> = {}
): AccessibleProps {
  const { role = 'tab', ...rest } = props;
  
  return {
    role,
    'aria-selected': selected,
    tabIndex: selected ? 0 : -1,
    ...rest,
  };
}

/**
 * Generate props for a tablist element
 * @param props - Additional props for the tablist
 * @returns Props for an accessible tablist
 */
export function getTabListProps(props: Partial<AccessibleProps> = {}): AccessibleProps {
  const { role = 'tablist', ...rest } = props;
  
  return {
    role,
    ...rest,
  };
}

/**
 * Generate props for a tabpanel element
 * @param props - Additional props for the tabpanel
 * @returns Props for an accessible tabpanel
 */
export function getTabPanelProps(props: Partial<AccessibleProps> = {}): AccessibleProps {
  const { role = 'tabpanel', ...rest } = props;
  
  return {
    role,
    tabIndex: 0,
    ...rest,
  };
}

/**
 * Generate props for a checkbox element
 * @param checked - Whether the checkbox is checked
 * @param props - Additional props for the checkbox
 * @returns Props for an accessible checkbox
 */
export function getCheckboxProps(
  checked: boolean | 'mixed',
  props: Partial<AccessibleProps> = {}
): AccessibleProps {
  const { role = 'checkbox', ...rest } = props;
  
  return {
    role,
    'aria-checked': checked,
    tabIndex: 0,
    ...rest,
  };
}

/**
 * Generate props for a radio element
 * @param checked - Whether the radio is checked
 * @param props - Additional props for the radio
 * @returns Props for an accessible radio
 */
export function getRadioProps(
  checked: boolean,
  props: Partial<AccessibleProps> = {}
): AccessibleProps {
  const { role = 'radio', ...rest } = props;
  
  return {
    role,
    'aria-checked': checked,
    tabIndex: checked ? 0 : -1,
    ...rest,
  };
}

/**
 * Generate props for a radiogroup element
 * @param props - Additional props for the radiogroup
 * @returns Props for an accessible radiogroup
 */
export function getRadioGroupProps(props: Partial<AccessibleProps> = {}): AccessibleProps {
  const { role = 'radiogroup', ...rest } = props;
  
  return {
    role,
    ...rest,
  };
}

/**
 * Generate props for a switch element
 * @param checked - Whether the switch is checked
 * @param props - Additional props for the switch
 * @returns Props for an accessible switch
 */
export function getSwitchProps(
  checked: boolean,
  props: Partial<AccessibleProps> = {}
): AccessibleProps {
  const { role = 'switch', ...rest } = props;
  
  return {
    role,
    'aria-checked': checked,
    tabIndex: 0,
    ...rest,
  };
}

/**
 * Generate props for a slider element
 * @param value - The current value of the slider
 * @param min - The minimum value of the slider
 * @param max - The maximum value of the slider
 * @param props - Additional props for the slider
 * @returns Props for an accessible slider
 */
export function getSliderProps(
  value: number,
  min: number,
  max: number,
  props: Partial<AccessibleProps> = {}
): AccessibleProps {
  const { role = 'slider', ...rest } = props;
  
  return {
    role,
    'aria-valuenow': value,
    'aria-valuemin': min,
    'aria-valuemax': max,
    tabIndex: 0,
    ...rest,
  };
}

/**
 * Generate props for a progress element
 * @param value - The current value of the progress
 * @param min - The minimum value of the progress
 * @param max - The maximum value of the progress
 * @param props - Additional props for the progress
 * @returns Props for an accessible progress
 */
export function getProgressProps(
  value: number,
  min: number,
  max: number,
  props: Partial<AccessibleProps> = {}
): AccessibleProps {
  const { role = 'progressbar', ...rest } = props;
  
  return {
    role,
    'aria-valuenow': value,
    'aria-valuemin': min,
    'aria-valuemax': max,
    ...rest,
  };
}

/**
 * Example usage:
 * 
 * import { getButtonProps, getMenuButtonProps, getDialogProps } from '@/shared/utils/a11y-props';
 * 
 * function MyButton() {
 *   return (
 *     <div {...getButtonProps({ 'aria-label': 'Close' })}>
 *       X
 *     </div>
 *   );
 * }
 * 
 * function MyMenuButton({ isOpen }) {
 *   return (
 *     <div {...getMenuButtonProps(isOpen, { 'aria-label': 'Menu' })}>
 *       Menu
 *     </div>
 *   );
 * }
 * 
 * function MyDialog({ title }) {
 *   return (
 *     <div {...getDialogProps({ 'aria-labelledby': 'dialog-title' })}>
 *       <h2 id="dialog-title">{title}</h2>
 *       <div>Dialog content</div>
 *     </div>
 *   );
 * }
 */
