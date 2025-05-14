/**
 * UI Components Polyfill
 * 
 * This script provides polyfills for UI component libraries that might be missing
 * in certain environments or bundling configurations. It focuses on Radix UI and
 * other common UI libraries used in the application.
 */

(function() {
  console.log('UI Components Polyfill loaded');
  
  // Create a global RadixUI object if it doesn't exist
  if (typeof window.RadixUI === 'undefined') {
    console.log('Creating RadixUI polyfill');
    window.RadixUI = {};
  }
  
  // Polyfill for Radix UI components
  const radixComponents = [
    'Dialog',
    'Popover',
    'Tooltip',
    'DropdownMenu',
    'Tabs',
    'Select',
    'Switch',
    'Checkbox',
    'RadioGroup',
    'Slider',
    'Avatar',
    'Accordion',
    'ScrollArea'
  ];
  
  // Create basic implementations for each Radix component
  radixComponents.forEach(component => {
    const namespace = `react-${component.toLowerCase()}`;
    
    if (typeof window.RadixUI[namespace] === 'undefined') {
      window.RadixUI[namespace] = {};
      
      // Create Root component
      window.RadixUI[namespace].Root = window.React.forwardRef(function Root(props, ref) {
        return window.React.createElement('div', {
          ...props,
          ref: ref,
          'data-radix-component': component,
          'data-state': 'closed'
        });
      });
      
      // Create Trigger component
      window.RadixUI[namespace].Trigger = window.React.forwardRef(function Trigger(props, ref) {
        return window.React.createElement('button', {
          ...props,
          ref: ref,
          'data-radix-component': `${component}Trigger`,
          type: 'button'
        });
      });
      
      // Create Content component
      window.RadixUI[namespace].Content = window.React.forwardRef(function Content(props, ref) {
        return window.React.createElement('div', {
          ...props,
          ref: ref,
          'data-radix-component': `${component}Content`,
          'data-state': 'closed'
        });
      });
      
      // Create Portal component
      window.RadixUI[namespace].Portal = function Portal(props) {
        return props.children;
      };
      
      // Add component-specific elements
      switch (component) {
        case 'Dialog':
          window.RadixUI[namespace].Title = window.React.forwardRef(function Title(props, ref) {
            return window.React.createElement('h2', {
              ...props,
              ref: ref,
              'data-radix-component': `${component}Title`
            });
          });
          
          window.RadixUI[namespace].Description = window.React.forwardRef(function Description(props, ref) {
            return window.React.createElement('p', {
              ...props,
              ref: ref,
              'data-radix-component': `${component}Description`
            });
          });
          
          window.RadixUI[namespace].Close = window.React.forwardRef(function Close(props, ref) {
            return window.React.createElement('button', {
              ...props,
              ref: ref,
              'data-radix-component': `${component}Close`,
              type: 'button'
            });
          });
          break;
          
        case 'Tabs':
          window.RadixUI[namespace].List = window.React.forwardRef(function List(props, ref) {
            return window.React.createElement('div', {
              ...props,
              ref: ref,
              role: 'tablist',
              'data-radix-component': `${component}List`
            });
          });
          
          window.RadixUI[namespace].Trigger = window.React.forwardRef(function Trigger(props, ref) {
            return window.React.createElement('button', {
              ...props,
              ref: ref,
              role: 'tab',
              'data-radix-component': `${component}Trigger`,
              type: 'button'
            });
          });
          
          window.RadixUI[namespace].Content = window.React.forwardRef(function Content(props, ref) {
            return window.React.createElement('div', {
              ...props,
              ref: ref,
              role: 'tabpanel',
              'data-radix-component': `${component}Content`
            });
          });
          break;
          
        case 'Select':
          window.RadixUI[namespace].Value = window.React.forwardRef(function Value(props, ref) {
            return window.React.createElement('span', {
              ...props,
              ref: ref,
              'data-radix-component': `${component}Value`
            });
          });
          
          window.RadixUI[namespace].Item = window.React.forwardRef(function Item(props, ref) {
            return window.React.createElement('div', {
              ...props,
              ref: ref,
              role: 'option',
              'data-radix-component': `${component}Item`
            });
          });
          break;
      }
    }
  });
  
  // Create a global shadcn object if it doesn't exist
  if (typeof window.shadcn === 'undefined') {
    console.log('Creating shadcn polyfill');
    window.shadcn = {
      ui: {}
    };
  }
  
  // Polyfill for shadcn/ui components
  const shadcnComponents = [
    'Button',
    'Card',
    'Input',
    'Label',
    'Textarea',
    'Select',
    'Checkbox',
    'RadioGroup',
    'Switch',
    'Slider',
    'Tabs',
    'Dialog',
    'Popover',
    'Tooltip',
    'DropdownMenu',
    'Sheet',
    'Avatar',
    'Badge',
    'Alert',
    'Toast'
  ];
  
  // Create basic implementations for each shadcn component
  shadcnComponents.forEach(component => {
    if (typeof window.shadcn.ui[component] === 'undefined') {
      window.shadcn.ui[component] = window.React.forwardRef(function ShadcnComponent(props, ref) {
        const element = component === 'Button' ? 'button' : 'div';
        return window.React.createElement(element, {
          ...props,
          ref: ref,
          'data-shadcn-component': component
        });
      });
    }
  });
  
  // Log success
  console.log('UI Components Polyfill complete');
})();
