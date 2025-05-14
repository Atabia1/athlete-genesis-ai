# Accessibility Features

This document provides an overview of the accessibility features implemented in the Athlete Genesis AI application.

## Overview

The application is designed to be accessible to all users, including those with disabilities. It follows the Web Content Accessibility Guidelines (WCAG) 2.1 standards and includes features for screen readers, keyboard navigation, and visual accessibility.

## Components

### Accessibility Utilities

The accessibility utilities (`src/utils/accessibility-utils.ts`) provide functions for improving accessibility in the application. They include:

- ARIA attributes for charts and visualizations
- Keyboard navigation utilities
- Color contrast checking
- Focus management
- Screen reader announcements
- Skip links
- Live regions

```typescript
// Example usage
import { 
  getChartAriaAttributes, 
  createKeyboardNavigation,
  checkColorContrast,
  createFocusTrap,
  announceToScreenReader,
  createSkipLink,
  createLiveRegion
} from '@/utils/accessibility-utils';

// Add ARIA attributes to a chart
const ariaAttributes = getChartAriaAttributes({
  title: 'Steps Over Time',
  description: 'A line chart showing steps over the past 7 days',
  summary: 'Your step count has increased by 20% over the past week'
});

// Create keyboard navigation for a list
const keyboardNav = createKeyboardNavigation({
  itemCount: 10,
  onFocus: (index) => { /* Focus item at index */ },
  onSelect: (index) => { /* Select item at index */ },
  orientation: 'vertical',
  loop: true
});

// Check color contrast
const contrast = checkColorContrast('#3B82F6');
if (!contrast.passesWhiteAA) {
  console.warn('Color does not have sufficient contrast with white');
}

// Create a focus trap for a modal
const focusTrap = createFocusTrap(modalElement);
focusTrap.activate(); // When opening the modal
focusTrap.deactivate(); // When closing the modal

// Announce a message to screen readers
announceToScreenReader('Data updated successfully', 'polite');

// Create a skip link
const skipLink = createSkipLink('main-content', 'Skip to main content');

// Create a live region for dynamic updates
const liveRegion = createLiveRegion('health-updates', 'polite');
liveRegion.announce('Your step count has increased by 20%');
```

### Accessible Components

All components in the application are designed to be accessible. Some examples include:

#### Data Sync Indicator

The `DataSyncIndicator` component includes:

- ARIA attributes for screen readers
- Proper color contrast for different states
- Keyboard accessible sync button

#### Anomaly Alert

The `AnomalyAlert` component includes:

- ARIA attributes for screen readers
- Proper color contrast for different severity levels
- Keyboard accessible dismiss button

#### Community Leaderboard

The `CommunityLeaderboard` component includes:

- ARIA attributes for screen readers
- Keyboard navigation for the leaderboard
- Proper color contrast for different ranks

## Features

### Screen Reader Support

- All interactive elements have appropriate ARIA attributes
- Dynamic content changes are announced to screen readers
- Images have alt text
- Charts and visualizations have textual alternatives

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Focus order follows a logical sequence
- Focus is visually indicated
- Skip links allow keyboard users to bypass navigation

### Visual Accessibility

- Color is not used as the only means of conveying information
- Text has sufficient contrast with its background
- UI is responsive and supports zoom up to 200%
- Text can be resized without loss of functionality

### Focus Management

- Focus is managed appropriately in modals and dialogs
- Focus is restored when components are unmounted
- Focus traps prevent keyboard users from leaving modals accidentally

## Testing

Accessibility tests are provided for components:

- `src/components/ui/__tests__/data-sync-indicator.a11y.test.tsx`

These tests use the `jest-axe` library to check for accessibility violations.

## Implementation Guidelines

### ARIA Attributes

- Use `aria-label` for elements without visible text
- Use `aria-labelledby` to associate elements with their labels
- Use `aria-describedby` to provide additional information
- Use `aria-live` for dynamic content updates
- Use `aria-hidden` to hide decorative elements from screen readers

### Keyboard Navigation

- Ensure all interactive elements are focusable
- Use logical tab order
- Provide keyboard shortcuts for common actions
- Ensure focus is visible at all times

### Color and Contrast

- Ensure text has a contrast ratio of at least 4.5:1 (AA) or 7:1 (AAA)
- Do not use color alone to convey information
- Provide alternative indicators (icons, text, etc.)

### Screen Reader Announcements

- Announce important changes to the user
- Use appropriate politeness levels (`assertive` for important messages, `polite` for less important)
- Keep announcements concise and clear

## Future Improvements

- Implement more comprehensive accessibility testing
- Add support for high contrast mode
- Implement more keyboard shortcuts
- Add support for reduced motion preferences
- Implement more screen reader optimizations
- Add support for voice commands
