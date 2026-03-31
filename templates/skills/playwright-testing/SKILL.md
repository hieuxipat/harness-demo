---
name: {{skill_name}}
description: "Write E2E tests with Playwright for user flows"
---

# Playwright Testing

Write E2E tests with Playwright CLI.

## When to use

When writing end-to-end tests for user flows.

## Instructions

### Structure

e2e/
├── tests/
│   ├── auth.spec.ts              ← Login/logout flows
│   ├── <feature>.spec.ts         ← Feature-specific flows
│   └── smoke.spec.ts             ← Critical path smoke tests
├── fixtures/                     ← Shared test data
├── pages/                        ← Page Object Models
│   └── LoginPage.ts
└── playwright.config.ts

### Conventions

- One spec file per user flow or feature
- Use Page Object Model for reusable page interactions
- Test the critical user journey, not every UI detail
- Use test.describe for grouping related tests
- Use test.beforeEach for common setup (login, navigation)

### Page Object Model

Create a class per page:
- Properties: locators for key elements
- Methods: user actions (login, addToCart, checkout)
- No assertions inside POM — assert in tests

### Best Practices

- Wait for network idle or specific elements, not arbitrary timeouts
- Use data-testid for E2E selectors (separate from unit test selectors)
- Run tests in CI with headed=false
- Take screenshots on failure (auto with Playwright)
- Test on multiple browsers if cross-browser support needed

### Shopify E2E

- Use Shopify CLI dev mode for local testing
- Test app installation flow
- Test embedded app navigation with App Bridge
- Test billing flow with test charges
