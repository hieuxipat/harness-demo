# megamind-ai-boilerplate — Templates & Skills Plan

**Goal:** Xây dựng bộ templates đầy đủ cho repo `megaminds/megamind-ai-boilerplate`, bao gồm project templates và skills phục vụ team phát triển web (React + Node.js) và Shopify apps.

**Tech Stack của team:**
- Frontend: React, Redux + RTK Query, Styled-components
- Backend: Node.js (Express/Nest.js), TypeORM, Mongoose
- Testing: Jest, Playwright CLI
- Linting: ESLint + Prettier
- Platform: Shopify (App Development)

---

## Tổng quan cấu trúc

```
megamind-ai-boilerplate/
├── templates/
│   ├── projects/
│   │   ├── react-app/                    ← React frontend
│   │   ├── node-api/                     ← Node.js REST API
│   │   ├── fullstack/                    ← React + Node.js monorepo
│   │   └── shopify-app/                  ← Shopify embedded app
│   │
│   ├── skills/
│   │   ├── code-review/                  ← General code review
│   │   ├── git-commit/                   ← Conventional commits
│   │   ├── debugging/                    ← Systematic debugging
│   │   ├── refactoring/                  ← Code refactoring
│   │   ├── documentation/                ← Code & API documentation
│   │   ├── security-audit/               ← Security review
│   │   ├── performance-review/           ← Performance audit
│   │   ├── react-component/              ← Create React components
│   │   ├── redux-slice/                  ← Redux Toolkit + RTK Query
│   │   ├── styled-component/             ← Styled-components patterns
│   │   ├── api-endpoint/                 ← REST API endpoint (Express/Nest)
│   │   ├── typeorm-entity/               ← TypeORM entity + migration
│   │   ├── mongoose-model/               ← Mongoose schema + model
│   │   ├── jest-testing/                 ← Unit/integration tests
│   │   ├── playwright-testing/           ← E2E tests
│   │   ├── shopify-webhook/              ← Shopify webhook handling
│   │   ├── shopify-graphql/              ← Shopify GraphQL API
│   │   ├── shopify-polaris/              ← Polaris UI components
│   │   ├── shopify-billing/              ← App billing & subscriptions
│   │   └── shopify-extension/            ← Shopify app extensions
│   │
│   └── hooks/
│       ├── pre-commit/                   ← ESLint + Prettier check
│       └── pre-push/                     ← Test runner
│
└── .gitlab-ci.yml
```

---

## Phase 1: Project Templates (4 templates)

### 1.1. `react-app` — React Frontend

Scaffold một React app với Redux, RTK Query, Styled-components.

**Cấu trúc output:**

```
{{project_name}}/
├── src/
│   ├── app/
│   │   └── store.ts                      ← Redux store config
│   ├── features/                         ← Feature-based structure
│   │   └── example/
│   │       ├── ExamplePage.tsx
│   │       ├── ExamplePage.styles.ts     ← Styled-components
│   │       ├── exampleSlice.ts           ← Redux slice
│   │       ├── exampleApi.ts             ← RTK Query API
│   │       └── __tests__/
│   │           └── ExamplePage.test.tsx
│   ├── components/                       ← Shared components
│   │   └── Layout/
│   │       ├── Layout.tsx
│   │       └── Layout.styles.ts
│   ├── hooks/                            ← Custom hooks
│   ├── utils/                            ← Utilities
│   ├── styles/
│   │   └── theme.ts                      ← Styled-components theme
│   ├── App.tsx
│   └── main.tsx
├── e2e/
│   └── example.spec.ts                   ← Playwright test
├── .eslintrc.json
├── .prettierrc
├── jest.config.ts
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── CLAUDE.md
└── .claude/
    └── settings.json
```

**template.json variables:**

| Variable | Prompt | Default | Type |
|---|---|---|---|
| `project_name` | Project name? | `my-react-app` | input (required) |
| `description` | Description? | — | input |
| `port` | Dev server port? | `3000` | input |
| `include_e2e` | Include Playwright E2E? | `true` | confirm |

**conditionals:** `e2e/` → `include_e2e`

---

### 1.2. `node-api` — Node.js REST API

Scaffold một Node.js API với Express, TypeORM/Mongoose.

**Cấu trúc output:**

```
{{project_name}}/
├── src/
│   ├── config/
│   │   ├── database.ts                   ← DB connection config
│   │   └── env.ts                        ← Environment variables
│   ├── entities/                         ← TypeORM entities (nếu SQL)
│   │   └── Example.ts
│   ├── models/                           ← Mongoose models (nếu MongoDB)
│   │   └── Example.ts
│   ├── routes/
│   │   ├── index.ts                      ← Route registry
│   │   └── example.routes.ts
│   ├── controllers/
│   │   └── example.controller.ts
│   ├── services/
│   │   └── example.service.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── auth.ts
│   ├── utils/
│   └── app.ts                            ← Express app setup
├── tests/
│   ├── example.test.ts
│   └── setup.ts
├── .eslintrc.json
├── .prettierrc
├── jest.config.ts
├── tsconfig.json
├── package.json
├── CLAUDE.md
└── .claude/
    └── settings.json
```

**template.json variables:**

| Variable | Prompt | Default | Type |
|---|---|---|---|
| `project_name` | Project name? | `my-api` | input (required) |
| `description` | Description? | — | input |
| `port` | Server port? | `4000` | input |
| `db_type` | Database type? (sql/mongodb) | `sql` | input |

**conditionals:**
- `entities/` → `db_type === "sql"` (cần custom logic hoặc dùng 2 template riêng)
- `models/` → `db_type === "mongodb"`

> **Lưu ý:** Vì template engine hiện tại chỉ hỗ trợ boolean conditionals, có 2 cách xử lý db_type:
> - **Cách 1:** Tạo 2 project template riêng: `node-api-sql` và `node-api-mongo`
> - **Cách 2:** Include cả hai, developer xóa folder không dùng
>
> **Khuyến nghị Cách 1** — tách thành 2 template cho rõ ràng.

---

### 1.3. `fullstack` — React + Node.js Monorepo

Kết hợp react-app + node-api trong một monorepo.

**Cấu trúc output:**

```
{{project_name}}/
├── client/                               ← React app (cấu trúc như 1.1)
│   ├── src/
│   ├── package.json
│   └── ...
├── server/                               ← Node API (cấu trúc như 1.2)
│   ├── src/
│   ├── package.json
│   └── ...
├── package.json                          ← Root package.json (workspaces)
├── CLAUDE.md
└── .claude/
    └── settings.json
```

**template.json variables:**

| Variable | Prompt | Default | Type |
|---|---|---|---|
| `project_name` | Project name? | `my-fullstack-app` | input (required) |
| `description` | Description? | — | input |
| `client_port` | Client dev port? | `3000` | input |
| `server_port` | Server port? | `4000` | input |
| `include_e2e` | Include Playwright E2E? | `true` | confirm |

---

### 1.4. `shopify-app` — Shopify Embedded App

Scaffold Shopify app với React frontend (Polaris) + Node.js backend.

**Cấu trúc output:**

```
{{project_name}}/
├── web/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── providers/
│   │   │   │       └── AppBridgeProvider.tsx
│   │   │   ├── pages/
│   │   │   │   └── Index.tsx             ← Polaris UI
│   │   │   ├── hooks/
│   │   │   │   └── useShopifyQuery.ts
│   │   │   └── App.tsx
│   │   └── package.json
│   │
│   └── backend/
│       ├── src/
│       │   ├── routes/
│       │   │   └── webhooks.ts
│       │   ├── services/
│       │   │   └── shopify.ts            ← Shopify API client
│       │   ├── middleware/
│       │   │   └── shopifyAuth.ts
│       │   └── app.ts
│       └── package.json
│
├── extensions/                           ← App extensions (optional)
│   └── .gitkeep
├── shopify.app.toml                      ← Shopify app config
├── package.json
├── CLAUDE.md
└── .claude/
    ├── skills/
    └── settings.json
```

**template.json variables:**

| Variable | Prompt | Default | Type |
|---|---|---|---|
| `project_name` | App name? | `my-shopify-app` | input (required) |
| `description` | Description? | — | input |
| `shopify_api_key` | Shopify API key? | — | input |
| `include_extensions` | Include app extensions? | `false` | confirm |
| `include_billing` | Include billing/subscriptions? | `true` | confirm |

**conditionals:**
- `extensions/` → `include_extensions`

---

## Phase 2: Core Skills (7 skills)

Các skills chung, áp dụng cho mọi loại project.

### 2.1. `code-review`

```markdown
# Code Review

Review code changes with focus on quality, correctness, and maintainability.

## When to use

Use when reviewing PRs or code changes before merge.

## Instructions

### Review Checklist

**Correctness:**
- Does the code do what it's supposed to?
- Are edge cases handled?
- Are error states handled gracefully?

**Code Quality:**
- Are names descriptive and accurate?
- Is there unnecessary duplication?
- Are functions/components focused (single responsibility)?

**Security:**
- No hardcoded secrets or credentials
- Input validation on API boundaries
- SQL injection / XSS prevention

**Performance:**
- No unnecessary re-renders (React)
- No N+1 queries (backend)
- No blocking operations in hot paths

**Testing:**
- Are new features covered by tests?
- Do tests verify behavior, not implementation?

**Style:**
- Follows ESLint + Prettier config
- Consistent with existing codebase patterns

### Output Format

For each issue found:
1. File and line reference
2. Severity: Critical / Important / Minor
3. Description of the issue
4. Suggested fix
```

---

### 2.2. `git-commit`

```markdown
# Git Commit

Write conventional commit messages following team standards.

## When to use

When creating git commits.

## Instructions

### Format

<type>(<scope>): <subject>

<body>

### Types

| Type | When to use |
|---|---|
| feat | New feature |
| fix | Bug fix |
| refactor | Code change that neither fixes nor adds feature |
| docs | Documentation only |
| style | Formatting, missing semicolons, etc |
| test | Adding or updating tests |
| chore | Maintenance tasks, deps update |
| perf | Performance improvement |
| ci | CI/CD changes |

### Rules

- Subject: imperative mood, lowercase, no period, max 72 chars
- Scope: component or area affected (e.g., auth, cart, api)
- Body: explain WHY, not WHAT (the diff shows what)
- Reference ticket/issue if available

### Examples

feat(cart): add quantity selector to cart items

fix(auth): prevent token refresh race condition

refactor(api): extract validation middleware from controllers
```

---

### 2.3. `debugging`

```markdown
# Debugging

Systematic approach to finding and fixing bugs.

## When to use

When investigating bugs, errors, or unexpected behavior.

## Instructions

### Process

1. **Reproduce** — Get a reliable reproduction. Document exact steps.
2. **Isolate** — Narrow down where the bug occurs.
   - Check error messages and stack traces
   - Check recent changes (git log / git blame)
   - Add logging at key boundaries
3. **Identify root cause** — Don't fix symptoms.
   - Ask: WHY does this happen, not just WHERE
   - Trace data flow from input to the point of failure
4. **Fix** — Make the minimal change that fixes the root cause.
5. **Verify** — Confirm the fix works and doesn't break anything.
6. **Add test** — Write a test that would have caught this bug.

### Common Patterns (React + Node.js)

**Frontend:**
- Stale closure in hooks → check useEffect/useCallback deps
- Infinite re-render → check useEffect dependency array
- RTK Query cache issues → check tag invalidation
- Styled-components not updating → check prop passing

**Backend:**
- Unhandled promise rejection → check async/await try-catch
- TypeORM query fails → check entity relations and eager/lazy loading
- Mongoose validation → check schema required fields
- Memory leak → check event listener cleanup, DB connection pooling

**Shopify:**
- App Bridge not loading → check host param and API key
- Webhook not received → check HTTPS, webhook registration
- GraphQL rate limits → check query cost, implement throttling
```

---

### 2.4. `refactoring`

```markdown
# Refactoring

Improve code structure without changing behavior.

## When to use

When code is hard to understand, modify, or test.

## Instructions

### Before refactoring

- Ensure tests exist for the code being refactored
- Run tests BEFORE and AFTER each change
- Make small, incremental changes — one refactoring at a time
- Commit after each successful refactoring step

### Common Refactorings

**Extract:** Long function → smaller functions with clear names
**Inline:** Unnecessary abstraction → simpler direct code
**Rename:** Unclear name → name that describes purpose
**Move:** Code in wrong place → closer to where it's used
**Simplify conditionals:** Nested if/else → early returns or guard clauses

### Red Flags to Refactor

- Function > 30 lines
- Component > 200 lines
- More than 3 levels of nesting
- Duplicated code in 3+ places
- Function takes > 3 parameters
- File imports from 10+ different modules

### Do NOT

- Refactor and add features in the same commit
- Refactor code you don't understand yet
- Over-abstract for hypothetical future needs (YAGNI)
```

---

### 2.5. `documentation`

```markdown
# Documentation

Write clear documentation for code and APIs.

## When to use

When creating or updating documentation for modules, APIs, or components.

## Instructions

### API Documentation

For each endpoint document:
- Method + Path
- Description (one sentence)
- Request: headers, params, query, body (with types)
- Response: status codes + body shape
- Example request/response
- Error cases

### Component Documentation

For each React component document:
- Purpose (one sentence)
- Props table (name, type, required, default, description)
- Usage example
- Notes (edge cases, performance considerations)

### Code Comments

- Only add comments where the logic isn't self-evident
- Explain WHY, not WHAT
- Keep comments up to date with code changes
- Use JSDoc for public APIs and exported functions
```

---

### 2.6. `security-audit`

```markdown
# Security Audit

Review code for security vulnerabilities.

## When to use

When reviewing authentication, authorization, user input handling, or sensitive data operations.

## Instructions

### Checklist

**Authentication & Authorization:**
- [ ] Passwords hashed with bcrypt (cost >= 10)
- [ ] JWT tokens have expiration
- [ ] Refresh tokens are rotated
- [ ] Session invalidation on password change
- [ ] Role-based access control on all protected routes

**Input Validation:**
- [ ] All user input validated and sanitized
- [ ] SQL/NoSQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding, CSP headers)
- [ ] File upload validation (type, size, content)
- [ ] Rate limiting on auth endpoints

**Data Protection:**
- [ ] No secrets in code or git history
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] No sensitive data in logs

**Shopify-Specific:**
- [ ] HMAC validation on webhooks
- [ ] Session tokens verified with Shopify
- [ ] App proxy requests authenticated
- [ ] Billing API checks before premium features
- [ ] GDPR endpoints implemented (data request, erasure)

**Dependencies:**
- [ ] No known vulnerabilities (npm audit)
- [ ] Dependencies pinned to specific versions
```

---

### 2.7. `performance-review`

```markdown
# Performance Review

Audit code for performance issues.

## When to use

When investigating slow pages, slow APIs, or high resource usage.

## Instructions

### Frontend (React)

**Rendering:**
- Unnecessary re-renders: use React.memo, useMemo, useCallback
- Large lists: use virtualization (react-window/react-virtual)
- Expensive computations: move to useMemo or Web Worker
- Component splitting: lazy load with React.lazy + Suspense

**Bundle:**
- Tree-shaking: import specific modules, not entire libraries
- Code splitting: route-based splitting
- Assets: compress images, use WebP, lazy load below-fold images

**Network:**
- RTK Query: check cache policy, avoid unnecessary refetches
- Pagination: avoid loading all data at once
- Debounce: search inputs, resize handlers

### Backend (Node.js)

**Database:**
- N+1 queries: use joins/populate/eager loading
- Missing indexes: add indexes on queried fields
- Connection pooling: reuse connections
- Query optimization: explain/analyze slow queries

**API:**
- Response size: paginate large datasets
- Caching: Redis/in-memory for frequent reads
- Async operations: use queues for heavy tasks
- Compression: enable gzip/brotli

**Shopify:**
- GraphQL: minimize query cost, use bulk operations for large datasets
- Webhooks: process async, respond quickly (< 5s)
- API rate limits: implement request throttling
```

---

## Phase 3: Frontend Skills (3 skills)

### 3.1. `react-component`

```markdown
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
```

---

### 3.2. `redux-slice`

```markdown
# Redux Slice

Create Redux Toolkit slices and RTK Query API services.

## When to use

When adding new state management or API integration.

## Instructions

### Redux Slice (local state)

File: `features/<name>/<name>Slice.ts`

- Use createSlice from @reduxjs/toolkit
- Define initial state with TypeScript interface
- Use Immer (built-in) for immutable updates
- Export actions and selector functions
- Keep slices focused on one domain

### RTK Query API (server state)

File: `features/<name>/<name>Api.ts`

- Use createApi from @reduxjs/toolkit/query/react
- Define endpoints: queries and mutations
- Use tag system for cache invalidation
- Transform responses if needed (transformResponse)
- Handle errors with onQueryStarted for optimistic updates

### When to use which

| Scenario | Use |
|---|---|
| Data from API | RTK Query |
| UI state (modals, toggles) | Redux slice |
| Form state | Local useState or form library |
| Server state + optimistic UI | RTK Query + onQueryStarted |

### Testing

- Slice: test reducers with initial state + action → expected state
- RTK Query: test with MSW for API mocking
```

---

### 3.3. `styled-component`

```markdown
# Styled-Components

Create styled-components following team conventions.

## When to use

When creating or updating component styles.

## Instructions

### Theme Usage

Always use theme values instead of hardcoded values:

- Colors: theme.colors.primary, theme.colors.text
- Spacing: theme.spacing.sm, theme.spacing.md
- Typography: theme.fonts.body, theme.fonts.heading
- Breakpoints: theme.breakpoints.mobile, theme.breakpoints.tablet

### Patterns

**Responsive styles:** Use theme breakpoints with media queries
**Variants:** Use props to create component variants (primary/secondary/danger)
**Composition:** Extend existing styled components with styled(BaseComponent)
**Animations:** Use keyframes from styled-components, keep animations subtle

### Naming

- PascalCase for styled components: `StyledButton`, `Container`, `Title`
- Descriptive names based on purpose, not appearance
- Prefix with `Styled` only when conflicting with logic components

### Do NOT

- Use inline styles (style prop)
- Hardcode colors, spacing, or font sizes
- Create global styles outside theme
- Nest more than 3 levels deep
```

---

## Phase 4: Backend Skills (3 skills)

### 4.1. `api-endpoint`

```markdown
# API Endpoint

Create REST API endpoints following team conventions.

## When to use

When adding new API routes/endpoints.

## Instructions

### Structure

For each resource:

routes/<resource>.routes.ts      ← Route definitions
controllers/<resource>.controller.ts  ← Request handling
services/<resource>.service.ts        ← Business logic
middleware/                           ← Auth, validation

### Conventions

- Routes: RESTful naming (GET /resources, POST /resources, etc.)
- Controllers: thin — validate input, call service, send response
- Services: all business logic here, no req/res objects
- Error handling: throw typed errors, catch in errorHandler middleware
- Validation: validate request body/params at controller level
- Response format: consistent JSON shape { data, error, meta }

### HTTP Status Codes

| Code | When |
|---|---|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 204 | No content (DELETE) |
| 400 | Bad request (validation failed) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (no permission) |
| 404 | Not found |
| 500 | Internal server error |

### Testing

- Test each endpoint: success + error cases
- Use supertest for HTTP testing
- Mock service layer for unit tests
- Test validation: bad input should return 400
```

---

### 4.2. `typeorm-entity`

```markdown
# TypeORM Entity

Create TypeORM entities, relations, and migrations.

## When to use

When adding new database tables or modifying schema (SQL databases).

## Instructions

### Entity

File: `entities/<EntityName>.ts`

- Use decorators: @Entity, @Column, @PrimaryGeneratedColumn
- Define relations explicitly: @OneToMany, @ManyToOne, @ManyToMany
- Add indexes on frequently queried columns
- Use enum types for constrained values
- Add createdAt/updatedAt with @CreateDateColumn/@UpdateDateColumn

### Migration

After creating/modifying entity:
1. Generate: `npx typeorm migration:generate -n <MigrationName>`
2. Review the generated SQL
3. Run: `npx typeorm migration:run`
4. Test: verify data integrity

### Relations

| Relation | When | Example |
|---|---|---|
| @OneToMany / @ManyToOne | Parent-child | User → Orders |
| @ManyToMany | N:N | Products ↔ Categories |
| @OneToOne | 1:1 extension | User → Profile |

### Query Patterns

- Use QueryBuilder for complex queries
- Always select only needed columns
- Use pagination (skip/take) for list endpoints
- Use transactions for multi-table writes
```

---

### 4.3. `mongoose-model`

```markdown
# Mongoose Model

Create Mongoose schemas and models.

## When to use

When adding new MongoDB collections or modifying schema.

## Instructions

### Schema

File: `models/<ModelName>.ts`

- Define interface for document type (extends Document)
- Use schema validation: required, enum, min/max, match
- Add indexes: schema.index({ field: 1 })
- Use timestamps: { timestamps: true }
- Add virtual fields for computed properties
- Add pre/post hooks for lifecycle events

### Patterns

**Embedded vs Reference:**
| Pattern | When | Example |
|---|---|---|
| Embed | Small, always accessed together | Address in User |
| Reference | Large, independent lifecycle | Comments on Post |

**Population:** Use .populate() sparingly — prefer embedding for read-heavy data

**Indexes:**
- Compound indexes for frequent multi-field queries
- Text indexes for search
- TTL indexes for expiring data (sessions, logs)

### Query Patterns

- Use .lean() for read-only queries (faster, plain objects)
- Use projection to select only needed fields
- Use cursor for large datasets
- Use bulkWrite for batch operations
```

---

## Phase 5: Testing Skills (2 skills)

### 5.1. `jest-testing`

```markdown
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
```

---

### 5.2. `playwright-testing`

```markdown
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
```

---

## Phase 6: Shopify Skills (5 skills)

### 6.1. `shopify-webhook`

```markdown
# Shopify Webhook

Handle Shopify webhooks securely and reliably.

## When to use

When adding or modifying Shopify webhook handlers.

## Instructions

### Setup

1. Register webhooks via Shopify API or shopify.app.toml
2. Create handler in routes/webhooks.ts
3. Always validate HMAC signature before processing
4. Respond with 200 quickly, process async

### HMAC Validation

Every webhook request must be validated:
- Extract X-Shopify-Hmac-Sha256 header
- Compute HMAC-SHA256 of raw body with app secret
- Compare with constant-time comparison

### Common Webhooks

| Topic | When to use |
|---|---|
| orders/create | New order placed |
| orders/updated | Order modified |
| products/update | Product changed |
| app/uninstalled | App removed — cleanup data |
| customers/data_request | GDPR data request |
| customers/redact | GDPR data erasure |
| shop/redact | GDPR shop data erasure |

### GDPR Mandatory Webhooks

Every Shopify app MUST implement these 3 endpoints:
1. customers/data_request — return customer data
2. customers/redact — delete customer data
3. shop/redact — delete shop data after uninstall

### Best Practices

- Process webhooks asynchronously (queue)
- Implement idempotency (webhooks can be sent multiple times)
- Log webhook receipt for debugging
- Handle app/uninstalled to cleanup shop data
- Set reasonable timeout (5 seconds to respond)
```

---

### 6.2. `shopify-graphql`

```markdown
# Shopify GraphQL API

Work with Shopify Admin GraphQL API.

## When to use

When querying or mutating Shopify data (products, orders, customers, etc.).

## Instructions

### Client Setup

Use @shopify/shopify-api official client:
- Initialize with shop domain + access token
- Use GraphQL client for all API calls
- Handle rate limiting with retry logic

### Query Patterns

**Pagination:** Use cursor-based pagination (first/after, last/before)
**Bulk Operations:** For large datasets (>250 items), use bulkOperationRunQuery
**Metafields:** Use metafield queries for custom data

### Rate Limiting

- Shopify uses cost-based rate limiting
- Each query has a cost (check extensions.cost in response)
- Available bucket: 1000 points, restores 50/second
- Implement: check cost, throttle if near limit, retry on 429

### Common Operations

| Operation | API |
|---|---|
| Get products | products(first: 50) |
| Create product | productCreate(input: {...}) |
| Update metafield | metafieldsSet(metafields: [...]) |
| Fulfill order | fulfillmentCreateV2(fulfillment: {...}) |
| Get shop info | shop { name, email, plan } |

### Best Practices

- Request only fields you need (no select *)
- Use fragments for repeated field sets
- Cache responses where appropriate
- Use webhook for real-time updates, not polling
- Test with Shopify Partner sandbox store
```

---

### 6.3. `shopify-polaris`

```markdown
# Shopify Polaris

Build Shopify app UI with Polaris design system.

## When to use

When building UI for Shopify embedded apps.

## Instructions

### Setup

- Use @shopify/polaris for components
- Use @shopify/app-bridge-react for embedded app features
- Wrap app in AppProvider with i18n and linkComponent

### Page Structure

Every page should follow Shopify admin patterns:
- Page component as top-level wrapper (title, actions, breadcrumbs)
- Layout for content organization
- Card for content sections
- Use ResourceList or IndexTable for data lists

### Common Patterns

**Data table:** IndexTable with sorting, filtering, pagination
**Forms:** FormLayout with TextField, Select, Checkbox
**Loading states:** SkeletonPage, SkeletonBodyText while loading
**Empty states:** EmptyState with action when no data
**Toasts and banners:** Toast for success, Banner for persistent messages
**Modals:** Modal for confirmations and quick forms

### Navigation

- Use App Bridge NavigationMenu for sidebar nav
- Use App Bridge TitleBar for page actions
- Use Polaris Link with app bridge routing

### Best Practices

- Follow Shopify design guidelines (polaris.shopify.com)
- Use Polaris tokens for spacing and colors, not custom values
- Test in Shopify admin iframe (not standalone browser)
- Support both light and dark mode
- Keep UX consistent with Shopify admin patterns
```

---

### 6.4. `shopify-billing`

```markdown
# Shopify Billing

Implement app billing and subscription management.

## When to use

When adding paid plans, usage charges, or subscription management.

## Instructions

### Billing Types

| Type | When | API |
|---|---|---|
| Recurring charge | Monthly/annual subscription | appSubscriptionCreate |
| One-time charge | Single purchase | appPurchaseOneTimeCreate |
| Usage charge | Pay-per-use (on top of recurring) | appUsageRecordCreate |

### Flow

1. User selects plan → call appSubscriptionCreate mutation
2. Shopify returns confirmationUrl → redirect user
3. User approves on Shopify → redirect back to app
4. Verify charge status via API
5. Grant access to paid features

### Plan Verification

Before premium features, always verify:
- Active subscription exists
- Subscription matches required plan
- Handle grace period for failed payments

### Testing

- Use test: true flag in development
- Test upgrade, downgrade, and cancellation flows
- Test what happens when billing fails
- Verify GDPR compliance: data access after unsubscribe

### Best Practices

- Always offer free tier or trial
- Show clear pricing before redirect to Shopify
- Handle billing errors gracefully (show banner, not crash)
- Cache billing status (don't check every request)
- Implement usage tracking for usage-based billing
```

---

### 6.5. `shopify-extension`

```markdown
# Shopify App Extension

Build Shopify app extensions (theme, checkout, admin UI).

## When to use

When creating Shopify app extensions that extend Shopify admin, checkout, or storefront.

## Instructions

### Extension Types

| Type | Where it runs | Use case |
|---|---|---|
| Theme app extension | Storefront | App blocks in themes |
| Checkout UI extension | Checkout | Custom checkout fields/banners |
| Admin UI extension | Admin | Custom admin actions/blocks |
| Post-purchase extension | Post checkout | Upsell after purchase |

### Setup

1. Create extension: `shopify app generate extension`
2. Choose extension type
3. Develop in `extensions/<name>/`
4. Test with `shopify app dev`

### Theme App Extension

- Use Liquid + JavaScript (no React)
- Define blocks in `blocks/` directory
- Use app block schema for settings
- Access app data via App Proxy or Storefront API

### Admin UI Extension

- Use @shopify/ui-extensions-react for React-like components
- Define extension target (e.g., admin.product-details.block.render)
- Use direct API access with authenticated fetch

### Best Practices

- Keep extensions lightweight (affects merchant page load)
- Use extension settings for merchant customization
- Test on multiple themes (Dawn, Debut, etc.)
- Handle extension uninstallation gracefully
- Version extensions independently from main app
```

---

## Phase 7: Hooks (2 hooks)

### 7.1. `pre-commit`

```markdown
# Pre-commit Hook

Run ESLint + Prettier on staged files before commit.
```

**hook.sh:**
```bash
#!/bin/bash
npx lint-staged
```

**template.json variables:** none

---

### 7.2. `pre-push`

```markdown
# Pre-push Hook

Run tests before pushing to remote.
```

**hook.sh:**
```bash
#!/bin/bash
npm test
```

**template.json variables:** none

---

## Tổng kết

| Phase | Số lượng | Items |
|---|---|---|
| 1. Project Templates | 4 | react-app, node-api, fullstack, shopify-app |
| 2. Core Skills | 7 | code-review, git-commit, debugging, refactoring, documentation, security-audit, performance-review |
| 3. Frontend Skills | 3 | react-component, redux-slice, styled-component |
| 4. Backend Skills | 3 | api-endpoint, typeorm-entity, mongoose-model |
| 5. Testing Skills | 2 | jest-testing, playwright-testing |
| 6. Shopify Skills | 5 | shopify-webhook, shopify-graphql, shopify-polaris, shopify-billing, shopify-extension |
| 7. Hooks | 2 | pre-commit, pre-push |
| **Tổng** | **26** | |

### Thứ tự triển khai khuyến nghị

1. **Phase 2 (Core Skills)** — dùng được ngay cho mọi project
2. **Phase 7 (Hooks)** — đơn giản, setup nhanh
3. **Phase 3 + 4 (Frontend + Backend Skills)** — hỗ trợ development hằng ngày
4. **Phase 5 (Testing Skills)** — cải thiện chất lượng test
5. **Phase 1 (Project Templates)** — phức tạp nhất, cần viết nhiều file boilerplate
6. **Phase 6 (Shopify Skills)** — chuyên biệt, thêm sau cùng

### Lưu ý về template engine

Hiện tại template engine chỉ hỗ trợ:
- `{{var}}` string replacement trong file content
- `__var__` replacement trong file name
- Boolean `conditionals` để skip directory

**Không hỗ trợ:**
- Conditional dựa trên string value (ví dụ: `db_type === "sql"`)
- Loops hoặc if/else trong template content
- Template inheritance

→ Nếu cần logic phức tạp hơn (ví dụ: chọn SQL vs MongoDB), **tạo template riêng** thay vì dùng conditionals.
