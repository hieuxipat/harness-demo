---
name: {{skill_name}}
description: "Create React components with TypeScript, styled-components, and tests"
---

# React Component

Create React components following team conventions.

## When to use

When creating new React components.

## Instructions

### Structure

Each component gets its own directory:

├── ComponentName/
│   ├── ComponentName.tsx           ← Component logic
│   ├── ComponentName.styles.ts     ← Styled-components
│   ├── ComponentName.types.ts      ← Types (if complex)
│   └── __tests__/
│       └── ComponentName.test.tsx  ← Jest tests

### Component Template

- Use functional components with TypeScript
- Define Props interface explicitly
- Export as named export (not default)
- Use styled-components for styling (not inline styles)
- Keep components focused — one responsibility

### Styled-Components Conventions

- Use theme values for colors, spacing, typography
- Name styled components descriptively: `Container`, `Title`, `ActionButton`
- Co-locate styles in `ComponentName.styles.ts`
- Export styled components for reuse if needed

### Testing

- Test user behavior, not implementation
- Use React Testing Library (not Enzyme)
- Test: rendering, user interactions, edge cases
- Mock API calls with MSW or jest.mock
