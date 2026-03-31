---
name: jest-testing
description: "Write unit and integration tests with Jest and React Testing Library"
---

# Jest Testing

Write unit and integration tests with Jest.

## When to use

When writing tests for components, services, utilities, or API endpoints.

## Instructions

### Structure

tests/
├── unit/                    ← Pure function tests
├── integration/             ← Multi-module tests
└── setup.ts                 ← Global test config

Or co-located: `__tests__/` next to source files.

### Patterns

**React components:** Use React Testing Library
- Render component → find elements → assert
- Query by role, label, text (not by test-id unless necessary)
- Test user interactions with userEvent
- Mock API with MSW or jest.mock

**Backend services:** Test business logic
- Mock database layer
- Test success and error paths
- Test edge cases and boundary values

**API endpoints:** Use supertest
- Test request → response
- Test authentication and authorization
- Test validation errors

### Conventions

- Describe block per function/component
- Test name: "should [expected behavior] when [condition]"
- One assertion per test when possible
- Use beforeEach for setup, afterEach for cleanup
- Mock external dependencies, not internal logic

### Do NOT

- Test implementation details (private methods, internal state)
- Write tests that always pass (no-op assertions)
- Mock everything — test real integration where practical
- Leave console.log in tests
