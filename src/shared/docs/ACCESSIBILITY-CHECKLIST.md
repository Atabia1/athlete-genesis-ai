# Accessibility Checklist

This checklist helps ensure that your components and pages meet accessibility standards. Use it when developing new features or reviewing existing code.

## Keyboard Accessibility

- [ ] All interactive elements are keyboard accessible
- [ ] Focus order is logical and follows the visual order
- [ ] Focus is visible and has sufficient contrast
- [ ] No keyboard traps (focus can't get stuck)
- [ ] Keyboard shortcuts don't conflict with browser or screen reader shortcuts
- [ ] Skip links are provided for navigation
- [ ] Modal dialogs trap focus when open

## Screen Reader Support

- [ ] All images have appropriate alt text
- [ ] Form controls have associated labels
- [ ] ARIA attributes are used correctly
- [ ] Landmarks are used to identify page regions
- [ ] Headings are used to create a logical document structure
- [ ] Lists are marked up as list elements
- [ ] Tables have appropriate headers and captions
- [ ] Live regions announce dynamic content changes
- [ ] Custom components have appropriate ARIA roles and states

## Visual Design

- [ ] Color is not used as the only means of conveying information
- [ ] Text has sufficient contrast with its background
- [ ] UI is usable at 200% zoom
- [ ] Content is readable and functional when text size is increased
- [ ] Layout works in both portrait and landscape orientations
- [ ] High contrast mode is supported
- [ ] Animations can be disabled via reduced motion settings
- [ ] Focus indicators are visible in all color schemes

## Forms and Validation

- [ ] All form controls have associated labels
- [ ] Required fields are clearly indicated
- [ ] Error messages are associated with form controls
- [ ] Error messages are clear and descriptive
- [ ] Form validation errors are announced to screen readers
- [ ] Form submission feedback is provided
- [ ] Autocomplete attributes are used where appropriate

## Touch and Mobile

- [ ] Touch targets are at least 44x44 pixels
- [ ] Gestures have alternatives
- [ ] Touch feedback is provided
- [ ] Content is usable in both portrait and landscape orientations
- [ ] Content is readable without requiring horizontal scrolling
- [ ] Interactive elements have sufficient spacing
- [ ] Mobile screen readers are supported

## Content and Language

- [ ] Page has a language attribute
- [ ] Changes in language are indicated
- [ ] Abbreviations and acronyms are explained
- [ ] Reading level is appropriate for the audience
- [ ] Instructions don't rely solely on sensory characteristics
- [ ] Link text is descriptive and makes sense out of context
- [ ] Headings are descriptive and follow a logical hierarchy

## Media

- [ ] Audio has transcripts
- [ ] Video has captions and audio descriptions
- [ ] Media controls are keyboard accessible
- [ ] Media doesn't autoplay
- [ ] Media can be paused
- [ ] Media volume can be controlled

## Testing

- [ ] Automated accessibility tests pass
- [ ] Manual keyboard testing has been performed
- [ ] Screen reader testing has been performed
- [ ] High contrast mode has been tested
- [ ] Zoom has been tested
- [ ] Mobile accessibility has been tested
- [ ] Browser compatibility has been tested

## Documentation

- [ ] Accessibility features are documented
- [ ] Known accessibility issues are documented
- [ ] Accessibility statement is provided
- [ ] Alternative accessible methods are documented

## Compliance

- [ ] WCAG 2.1 AA success criteria are met
- [ ] Accessibility issues are prioritized and addressed
- [ ] Accessibility is considered from the beginning of development
- [ ] Accessibility is tested throughout development

## Resources

- [WebAIM WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Deque University](https://dequeuniversity.com/)
- [Axe DevTools](https://www.deque.com/axe/)
