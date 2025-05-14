/**
 * Accessibility Utilities
 *
 * This file contains utilities for improving accessibility in the application.
 * It includes functions for ARIA attributes, keyboard navigation, color contrast,
 * focus management, and screen reader announcements.
 *
 * These utilities help ensure that the application is accessible to all users,
 * including those with disabilities, in compliance with WCAG 2.1 standards.
 */

/**
 * Chart accessibility options
 */
export interface ChartAccessibilityOptions {
  /** Chart title for screen readers */
  title: string;
  /** Chart description for screen readers */
  description?: string;
  /** Summary of the chart data for screen readers */
  summary?: string;
  /** Whether to include data table for screen readers */
  includeDataTable?: boolean;
  /** Whether to enable keyboard navigation */
  enableKeyboardNavigation?: boolean;
  /** Whether to announce data point details on focus */
  announceDataPoints?: boolean;
  /** Whether to use patterns in addition to colors */
  usePatterns?: boolean;
}

/**
 * Generate ARIA attributes for a chart
 * @param options Chart accessibility options
 * @returns Object with ARIA attributes
 */
export function getChartAriaAttributes(options: ChartAccessibilityOptions): Record<string, string> {
  const attributes: Record<string, string> = {
    role: 'img',
    'aria-label': options.title,
  };

  if (options.description) {
    attributes['aria-description'] = options.description;
  }

  return attributes;
}

/**
 * Generate a hidden description for screen readers
 * @param options Chart accessibility options
 * @returns HTML string with hidden description
 */
export function generateHiddenDescription(options: ChartAccessibilityOptions): string {
  let description = `<div class="sr-only">
    <h2>${options.title}</h2>`;

  if (options.description) {
    description += `<p>${options.description}</p>`;
  }

  if (options.summary) {
    description += `<p>${options.summary}</p>`;
  }

  description += '</div>';

  return description;
}

/**
 * Generate a data table for screen readers
 * @param data Array of data objects
 * @param columns Array of column definitions
 * @returns HTML string with data table
 */
export function generateDataTable<T>(
  data: T[],
  columns: Array<{
    key: keyof T;
    header: string;
    format?: (value: any) => string;
  }>
): string {
  let table = `<div class="sr-only">
    <table>
      <caption>Data table</caption>
      <thead>
        <tr>`;

  // Add headers
  columns.forEach(column => {
    table += `<th scope="col">${column.header}</th>`;
  });

  table += `</tr>
      </thead>
      <tbody>`;

  // Add rows
  data.forEach(item => {
    table += '<tr>';

    columns.forEach(column => {
      const value = item[column.key];
      const formattedValue = column.format ? column.format(value) : String(value);

      table += `<td>${formattedValue}</td>`;
    });

    table += '</tr>';
  });

  table += `</tbody>
    </table>
  </div>`;

  return table;
}

/**
 * Check if a color has sufficient contrast against white or black
 * @param color Hex color code (e.g., "#FF0000")
 * @returns Object with contrast ratios and whether they pass WCAG AA
 */
export function checkColorContrast(color: string): {
  whiteContrast: number;
  blackContrast: number;
  passesWhiteAA: boolean;
  passesBlackAA: boolean;
  bestTextColor: 'white' | 'black';
} {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Calculate relative luminance
  const rgb = [r, g, b].map(c => {
    if (c <= 0.03928) {
      return c / 12.92;
    }
    return Math.pow((c + 0.055) / 1.055, 2.4);
  });

  const luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];

  // Calculate contrast ratio with white (luminance = 1)
  const whiteContrast = (1 + 0.05) / (luminance + 0.05);

  // Calculate contrast ratio with black (luminance = 0)
  const blackContrast = (luminance + 0.05) / (0 + 0.05);

  // Check if they pass WCAG AA (4.5:1 for normal text)
  const passesWhiteAA = whiteContrast >= 4.5;
  const passesBlackAA = blackContrast >= 4.5;

  // Determine best text color
  const bestTextColor = whiteContrast > blackContrast ? 'white' : 'black';

  return {
    whiteContrast,
    blackContrast,
    passesWhiteAA,
    passesBlackAA,
    bestTextColor,
  };
}

/**
 * Generate an accessible color palette
 * @param baseColor Base color in hex format
 * @param steps Number of steps in the palette
 * @returns Array of colors with good contrast
 */
export function generateAccessibleColorPalette(
  baseColor: string,
  steps: number = 5
): string[] {
  // Convert hex to HSL
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }

    h /= 6;
  }

  // Generate palette
  const palette: string[] = [];

  for (let i = 0; i < steps; i++) {
    // Adjust lightness
    const newL = Math.max(0, Math.min(1, l - 0.3 + (i / (steps - 1)) * 0.6));

    // Convert back to RGB
    let r, g, b;

    if (s === 0) {
      r = g = b = newL;
    } else {
      const q = newL < 0.5 ? newL * (1 + s) : newL + s - newL * s;
      const p = 2 * newL - q;

      r = hueToRgb(p, q, h + 1/3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1/3);
    }

    // Convert to hex
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    palette.push(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
  }

  return palette;
}

/**
 * Helper function for HSL to RGB conversion
 */
function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}

/**
 * Create keyboard navigation handlers for interactive elements
 * @param options Options for keyboard navigation
 * @returns Object with event handlers
 */
export function createKeyboardNavigation(options: {
  itemCount: number;
  onFocus: (index: number) => void;
  onSelect?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical' | 'grid';
  gridColumns?: number;
  loop?: boolean;
}) {
  const {
    itemCount,
    onFocus,
    onSelect,
    orientation = 'horizontal',
    gridColumns = 1,
    loop = true,
  } = options;

  return {
    handleKeyDown: (e: React.KeyboardEvent, currentIndex: number) => {
      let newIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'grid') {
            newIndex = currentIndex + 1;
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'grid') {
            newIndex = currentIndex - 1;
          }
          break;
        case 'ArrowDown':
          if (orientation === 'vertical') {
            newIndex = currentIndex + 1;
          } else if (orientation === 'grid') {
            newIndex = currentIndex + gridColumns;
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical') {
            newIndex = currentIndex - 1;
          } else if (orientation === 'grid') {
            newIndex = currentIndex - gridColumns;
          }
          break;
        case 'Home':
          newIndex = 0;
          break;
        case 'End':
          newIndex = itemCount - 1;
          break;
        case 'Enter':
        case ' ':
          if (onSelect) {
            onSelect(currentIndex);
            e.preventDefault();
          }
          return;
        default:
          return;
      }

      // Handle looping
      if (loop) {
        if (newIndex < 0) {
          newIndex = itemCount - 1;
        } else if (newIndex >= itemCount) {
          newIndex = 0;
        }
      } else {
        if (newIndex < 0 || newIndex >= itemCount) {
          return;
        }
      }

      // Focus the new item
      if (newIndex !== currentIndex) {
        onFocus(newIndex);
        e.preventDefault();
      }
    },

    getItemProps: (index: number) => ({
      tabIndex: index === 0 ? 0 : -1,
      'aria-selected': index === 0,
      role: 'option',
    }),
  };
}

/**
 * Screen reader announcement utility
 *
 * This function creates a visually hidden element that announces messages to screen readers.
 * It uses the aria-live attribute to control the politeness of the announcement.
 *
 * @param message Message to announce
 * @param politeness Politeness level (assertive for important messages, polite for less important)
 * @param timeout Time in milliseconds before removing the announcement (default: 5000ms)
 */
export function announceToScreenReader(
  message: string,
  politeness: 'assertive' | 'polite' = 'polite',
  timeout: number = 5000
): void {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') return;

  // Create or get the announcement container
  let container = document.getElementById('a11y-announcer');

  if (!container) {
    container = document.createElement('div');
    container.id = 'a11y-announcer';
    container.setAttribute('aria-live', politeness);
    container.setAttribute('aria-atomic', 'true');
    container.setAttribute('role', 'status');
    container.style.position = 'absolute';
    container.style.width = '1px';
    container.style.height = '1px';
    container.style.margin = '-1px';
    container.style.padding = '0';
    container.style.overflow = 'hidden';
    container.style.clip = 'rect(0, 0, 0, 0)';
    container.style.whiteSpace = 'nowrap';
    container.style.border = '0';

    document.body.appendChild(container);
  }

  // Set the politeness level
  container.setAttribute('aria-live', politeness);

  // Clear any existing content
  container.textContent = '';

  // Force a DOM reflow
  void container.offsetWidth;

  // Set the new message
  container.textContent = message;

  // Remove the message after the timeout
  if (timeout > 0) {
    setTimeout(() => {
      if (container && container.textContent === message) {
        container.textContent = '';
      }
    }, timeout);
  }
}

/**
 * Focus trap utility
 *
 * This function creates a focus trap that keeps focus within a container.
 * It's useful for modals, dialogs, and other components that need to trap focus.
 *
 * @param containerElement Container element to trap focus within
 * @returns Object with activate, deactivate, and updateContainer methods
 */
export function createFocusTrap(containerElement: HTMLElement) {
  let firstFocusableElement: HTMLElement | null = null;
  let lastFocusableElement: HTMLElement | null = null;
  let isActive = false;
  let previousActiveElement: HTMLElement | null = null;

  // Get all focusable elements
  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'a[href]:not([tabindex="-1"])',
      'button:not([disabled]):not([tabindex="-1"])',
      'input:not([disabled]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]:not([tabindex="-1"])',
    ];

    const elements = container.querySelectorAll(focusableSelectors.join(','));
    return Array.from(elements) as HTMLElement[];
  };

  // Update the focusable elements
  const updateFocusableElements = () => {
    const focusableElements = getFocusableElements(containerElement);

    if (focusableElements.length === 0) {
      firstFocusableElement = null;
      lastFocusableElement = null;
      return;
    }

    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
  };

  // Handle keydown events
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isActive || event.key !== 'Tab') return;

    // If there are no focusable elements, do nothing
    if (!firstFocusableElement || !lastFocusableElement) return;

    // Check if shift + tab is pressed
    if (event.shiftKey) {
      // If focus is on the first element, move to the last element
      if (document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      }
    } else {
      // If focus is on the last element, move to the first element
      if (document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    }
  };

  // Activate the focus trap
  const activate = () => {
    if (isActive) return;

    // Save the currently focused element
    previousActiveElement = document.activeElement as HTMLElement;

    // Update focusable elements
    updateFocusableElements();

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Focus the first focusable element
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    isActive = true;
  };

  // Deactivate the focus trap
  const deactivate = () => {
    if (!isActive) return;

    // Remove event listener
    document.removeEventListener('keydown', handleKeyDown);

    // Restore focus to the previously focused element
    if (previousActiveElement) {
      previousActiveElement.focus();
    }

    isActive = false;
  };

  // Update the container element
  const updateContainer = (newContainer: HTMLElement) => {
    containerElement = newContainer;
    updateFocusableElements();
  };

  return {
    activate,
    deactivate,
    updateContainer,
  };
}

/**
 * Skip link utility
 *
 * This function creates a skip link that allows keyboard users to skip to the main content.
 * It's useful for improving keyboard navigation.
 *
 * @param targetId ID of the element to skip to
 * @param linkText Text for the skip link
 * @returns The created skip link element
 */
export function createSkipLink(
  targetId: string,
  linkText: string = 'Skip to main content'
): HTMLAnchorElement {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    return {} as HTMLAnchorElement;
  }

  // Create the skip link
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'skip-link';
  skipLink.textContent = linkText;

  // Style the skip link
  skipLink.style.position = 'absolute';
  skipLink.style.top = '-40px';
  skipLink.style.left = '0';
  skipLink.style.padding = '8px';
  skipLink.style.zIndex = '9999';
  skipLink.style.background = '#ffffff';
  skipLink.style.color = '#000000';
  skipLink.style.textDecoration = 'none';
  skipLink.style.fontWeight = 'bold';
  skipLink.style.transition = 'top 0.2s';

  // Show the skip link when it receives focus
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });

  // Hide the skip link when it loses focus
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });

  // Add the skip link to the document
  document.body.insertBefore(skipLink, document.body.firstChild);

  return skipLink;
}

/**
 * Live region utility
 *
 * This function creates a live region that announces dynamic content changes to screen readers.
 * It's useful for announcing updates without moving focus.
 *
 * @param id ID for the live region
 * @param politeness Politeness level (assertive for important messages, polite for less important)
 * @returns Object with announce and clear methods
 */
export function createLiveRegion(
  id: string = 'live-region',
  politeness: 'assertive' | 'polite' = 'polite'
) {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    return {
      announce: () => {},
      clear: () => {},
      element: null,
    };
  }

  // Create or get the live region
  let liveRegion = document.getElementById(id);

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = id;
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('role', 'status');
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.margin = '-1px';
    liveRegion.style.padding = '0';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    liveRegion.style.whiteSpace = 'nowrap';
    liveRegion.style.border = '0';

    document.body.appendChild(liveRegion);
  }

  // Announce a message
  const announce = (message: string, clearAfter: number = 5000) => {
    // Clear any existing content
    liveRegion!.textContent = '';

    // Force a DOM reflow
    void liveRegion!.offsetWidth;

    // Set the new message
    liveRegion!.textContent = message;

    // Clear the message after the timeout
    if (clearAfter > 0) {
      setTimeout(() => {
        if (liveRegion && liveRegion.textContent === message) {
          liveRegion.textContent = '';
        }
      }, clearAfter);
    }
  };

  // Clear the live region
  const clear = () => {
    if (liveRegion) {
      liveRegion.textContent = '';
    }
  };

  return {
    announce,
    clear,
    element: liveRegion,
  };
}
