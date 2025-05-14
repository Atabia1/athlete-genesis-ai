# Testing Strategy

This document outlines the testing strategy for the Athlete Genesis AI application.

## Testing Levels

### 1. Unit Tests

Unit tests verify that individual units of code (functions, methods, components) work as expected in isolation.

**What to test:**
- Utility functions
- Service methods
- Hooks
- Context providers
- Individual components

**Tools:**
- Jest for test running and assertions
- React Testing Library for component testing

**Location:**
- `src/**/__tests__/*.test.ts` for non-component tests
- `src/**/__tests__/*.test.tsx` for component tests

### 2. Integration Tests

Integration tests verify that multiple units work together correctly.

**What to test:**
- Component interactions
- Context provider integrations
- Service interactions
- Form submissions
- API interactions

**Tools:**
- Jest
- React Testing Library
- Mock Service Worker (MSW) for API mocking

**Location:**
- `src/**/__tests__/*.integration.test.tsx`

### 3. End-to-End Tests

End-to-end tests verify that entire user flows work correctly from start to finish.

**What to test:**
- Critical user journeys
- Authentication flows
- Workout plan creation
- Offline functionality

**Tools:**
- Cypress or Playwright

**Location:**
- `cypress/e2e/` or `e2e/`

## Test Coverage Goals

- Unit tests: 80% coverage
- Integration tests: Key user flows
- E2E tests: Critical user journeys

## Testing Practices

### Test Organization

- Group tests by feature or module
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern
- Keep tests independent and isolated

### Mocking

- Mock external dependencies
- Use Jest mock functions for callbacks
- Use MSW for API mocking
- Create test data factories for consistent test data

### Continuous Integration

- Run tests on every pull request
- Enforce minimum coverage thresholds
- Generate and publish coverage reports

## Test Templates

See the `src/__tests__/templates` directory for example test templates:

- `unit.test.ts` - Template for utility function tests
- `component.test.tsx` - Template for component tests
- `hook.test.tsx` - Template for custom hook tests
- `context.test.tsx` - Template for context provider tests
- `integration.test.tsx` - Template for integration tests

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- path/to/test.test.ts
```

## Writing Testable Code

- Keep functions pure when possible
- Use dependency injection
- Avoid direct DOM manipulation
- Extract complex logic into testable functions
- Use interfaces and type definitions
- Avoid global state when possible
