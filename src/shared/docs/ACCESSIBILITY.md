# Accessibility Guidelines

This document outlines the accessibility features and guidelines for the Athlete Genesis AI application. Following these guidelines will help ensure that our application is accessible to all users, including those with disabilities.

## Table of Contents

1. [Introduction](#introduction)
2. [Accessibility Features](#accessibility-features)
3. [Development Guidelines](#development-guidelines)
4. [Testing](#testing)
5. [Browser Compatibility](#browser-compatibility)
6. [Internationalization](#internationalization)
7. [Mobile Accessibility](#mobile-accessibility)
8. [Complex Components](#complex-components)
9. [Resources](#resources)

## Introduction

Accessibility is a core part of our application design. We aim to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 AA standards. This means our application should be:

- **Perceivable**: Information and user interface components must be presentable to users in ways they can perceive.
- **Operable**: User interface components and navigation must be operable.
- **Understandable**: Information and the operation of the user interface must be understandable.
- **Robust**: Content must be robust enough that it can be interpreted by a wide variety of user agents, including assistive technologies.

## Accessibility Features

Our application includes the following accessibility features:

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Focus is visually indicated and follows a logical order
- Keyboard shortcuts are available for common actions
- Skip links allow users to bypass navigation

### Screen Reader Support

- All images have appropriate alt text
- Form controls have associated labels
- ARIA attributes are used where appropriate
- Live regions announce dynamic content changes

### Visual Adjustments

- High contrast mode for users with low vision
- Font size adjustments
- Reduced motion option for users with vestibular disorders
- Color choices that meet contrast requirements

### Offline Support

- Offline mode indicators
- Cached content for offline use
- Automatic retry when connection is restored

## Development Guidelines

### Components

Use the accessibility components provided in `src/shared/components/accessibility`:

- `SkipToContent`: Allows keyboard users to bypass navigation
- `VisuallyHidden`: Hides content visually but keeps it accessible to screen readers
- `LiveRegion`: Announces dynamic content changes to screen readers
- `AccessibilitySettings`: Provides user controls for accessibility preferences

### Hooks

Use the accessibility hooks provided in `src/shared/hooks`:

- `useKeyboard`: Manages keyboard shortcuts and navigation
- `useFocusTrap`: Traps focus within modals and dialogs
- `useReducedMotion`: Respects user's motion preferences
- `useAnnounce`: Announces messages to screen readers

### Context

Use the `AccessibilityContext` to access and update accessibility settings:

```tsx
import { useAccessibility } from "@/shared/context/AccessibilityContext";

function MyComponent() {
  const { highContrast, prefersReducedMotion, fontSizeAdjustment, announce } =
    useAccessibility();

  // Use these settings in your component
}
```

### HTML and ARIA

- Use semantic HTML elements (`<button>`, `<a>`, `<input>`, etc.)
- Add appropriate ARIA attributes when necessary
- Ensure proper heading hierarchy (`<h1>` to `<h6>`)
- Use lists (`<ul>`, `<ol>`) for list content
- Use tables (`<table>`) for tabular data with appropriate headers

### Forms

- Associate labels with form controls using `htmlFor`
- Group related form controls with `<fieldset>` and `<legend>`
- Provide clear error messages
- Use `aria-describedby` for additional instructions
- Ensure form validation errors are announced to screen readers

### Images and Media

- Add alt text to all images (`alt="Description"`)
- Use empty alt text for decorative images (`alt=""`)
- Provide captions and transcripts for audio and video
- Ensure media controls are keyboard accessible

### Color and Contrast

- Don't rely on color alone to convey information
- Ensure sufficient contrast between text and background
- Test with color blindness simulators
- Support high contrast mode

## Testing

### Automated Testing

We use several tools for automated accessibility testing:

1. **Jest with axe-core**: Run accessibility tests with:

   ```
   npm test
   ```

2. **Development Mode Auditor**: Use the `AccessibilityAuditor` component in development mode to identify issues in the browser console.

### Manual Testing

In addition to automated testing, perform these manual checks:

1. **Keyboard Navigation**: Test the application using only the keyboard
2. **Screen Readers**: Test with screen readers like NVDA, JAWS, or VoiceOver
3. **Zoom**: Test the application at different zoom levels (up to 200%)
4. **High Contrast**: Test with high contrast mode enabled
5. **Reduced Motion**: Test with reduced motion preferences enabled

## Browser Compatibility

Our accessibility features are designed to work across a wide range of browsers, with fallbacks and polyfills for older browsers.

### Supported Browsers

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

### Feature Detection and Polyfills

We use feature detection to provide appropriate fallbacks for browsers that don't support certain features. The `browser-support.ts` utility handles this automatically:

```tsx
import {
  initBrowserSupport,
  supportsFocusVisible,
} from "@/shared/utils/browser-support";

// Initialize browser support with polyfills
initBrowserSupport();

// Check if a specific feature is supported
if (supportsFocusVisible()) {
  console.log("Focus visible is supported");
} else {
  console.log("Focus visible is not supported");
}
```

### Fallbacks

For browsers that don't support certain features, we provide the following fallbacks:

- **CSS Variables**: Fallback to static colors
- **Focus Visible**: Polyfill loaded automatically
- **Intersection Observer**: Polyfill loaded automatically
- **Resize Observer**: Polyfill loaded automatically
- **Web Animations**: Polyfill loaded automatically

## Internationalization

Accessibility and internationalization (i18n) are closely related. Here's how to ensure your components work well with different languages:

### Text Direction

Support right-to-left (RTL) languages by using the `dir` attribute:

```html
<html dir="rtl">
  <!-- RTL content -->
</html>
```

In CSS, use logical properties instead of directional ones:

```css
/* Instead of this */
.element {
  margin-left: 1rem;
  padding-right: 1rem;
}

/* Use this */
.element {
  margin-inline-start: 1rem;
  padding-inline-end: 1rem;
}
```

### Screen Reader Announcements

When using the `useAnnounce` hook, make sure to use translated strings:

```tsx
import { useAnnounce } from "@/shared/hooks";
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { announce } = useAnnounce();
  const { t } = useTranslation();

  const handleSubmit = () => {
    // Use translated string for announcement
    announce(t("form.submitSuccess"), { politeness: "assertive" });
  };
}
```

### Language Attributes

Always specify the language of your content:

```html
<html lang="en">
  <!-- English content -->
  <p lang="es">Contenido en español</p>
</html>
```

## Mobile Accessibility

Mobile devices present unique accessibility challenges. Here are guidelines for mobile accessibility:

### Touch Targets

Ensure touch targets are large enough (at least 44x44 pixels):

```css
.button {
  min-width: 44px;
  min-height: 44px;
}
```

### Gestures

Provide alternatives for complex gestures:

```tsx
function Carousel() {
  return (
    <div>
      {/* Swipeable carousel */}
      <div role="region" aria-label="Image carousel">
        {/* Carousel content */}
      </div>

      {/* Alternative controls */}
      <button aria-label="Previous image">Previous</button>
      <button aria-label="Next image">Next</button>
    </div>
  );
}
```

### Orientation

Support both portrait and landscape orientations:

```css
@media screen and (orientation: portrait) {
  /* Portrait styles */
}

@media screen and (orientation: landscape) {
  /* Landscape styles */
}
```

### Mobile Screen Readers

Test with mobile screen readers:

- VoiceOver on iOS
- TalkBack on Android

## Complex Components

Some components require special attention to make them accessible. Here are guidelines for common complex components:

### Data Tables

```tsx
function DataTable({ data, columns }) {
  return (
    <div role="region" aria-label="Data table" tabIndex={0}>
      <table>
        <caption>User Information</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col">
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={`${row.id}-${column.id}`}>{row[column.id]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Modal Dialogs

```tsx
function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);

  // Trap focus within the modal
  useFocusTrap(modalRef, { active: isOpen });

  // Announce the modal to screen readers
  const { announce } = useAnnounce();
  useEffect(() => {
    if (isOpen) {
      announce(`Dialog opened: ${title}`, { politeness: "assertive" });
    }
  }, [isOpen, title, announce]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title">{title}</h2>
      <div>{children}</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### Tabs

```tsx
function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            id={`tab-${index}`}
            aria-selected={activeTab === index}
            aria-controls={`panel-${index}`}
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`panel-${index}`}
          aria-labelledby={`tab-${index}`}
          hidden={activeTab !== index}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
```

### Autocomplete

```tsx
function Autocomplete({ options, onChange }) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter suggestions based on input
  useEffect(() => {
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  }, [value, options]);

  return (
    <div>
      <label id="autocomplete-label">Search</label>
      <input
        type="text"
        aria-labelledby="autocomplete-label"
        aria-autocomplete="list"
        aria-controls="suggestions"
        aria-activedescendant={
          activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : ""
        }
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul id="suggestions" role="listbox">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === activeSuggestion}
              onClick={() => {
                setValue(suggestion);
                onChange(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Resources

- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Axe DevTools](https://www.deque.com/axe/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Accessible Rich Internet Applications (ARIA)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [Mobile Accessibility: How WCAG 2.0 and Other W3C/WAI Guidelines Apply to Mobile](https://www.w3.org/TR/mobile-accessibility-mapping/)
- [Internationalization Techniques](https://www.w3.org/International/techniques/developing-specs)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)
- [Inclusive Components](https://inclusive-components.design/)
- [The A11Y Project](https://www.a11yproject.com/)
