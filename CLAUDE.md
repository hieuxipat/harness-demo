# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Goal

This repository is the **single source of truth** for project scaffolding at Megaminds. It provides ready-to-use project templates — each a complete, opinionated workspace with source code boilerplate, Claude Code skills, and layered `CLAUDE.md` guidance — so that any team member can spin up a new project and start building immediately with consistent patterns, tooling, and AI-assisted workflows.

## What This Repo Is (and Is Not)

- **IS:** A collection of project templates. Each template under `templates/projects/` is a self-contained starter kit that produces a working project when scaffolded.
- **IS NOT:** A runnable application. There is no `package.json` at the root, no build commands, no tests to run at this level. All runnable code lives inside each template.

## Tech Stack (across all templates)

- **Frontend:** React 18, Redux Toolkit + RTK Query, Styled-components 6, Vite 5
- **Backend:** Node.js, NestJS 10, TypeORM (PostgreSQL), Mongoose (MongoDB)
- **Testing:** Jest 29 (unit/integration), Playwright (E2E)
- **Linting:** ESLint 8 + Prettier 3
- **Platform:** Shopify (App Development — Polaris, App Bridge, Admin GraphQL API)
- **Language:** TypeScript (strict mode) everywhere

## Repository Structure

```
boilerplate/
├── CLAUDE.md                          ← you are here
├── templates/
│   ├── projects/
│   │   ├── react-app/                 ← React SPA (Redux, RTK Query, Styled-components)
│   │   ├── node-api/                  ← Express REST API (TypeORM + Mongoose)
│   │   ├── fullstack/                 ← Monorepo: client/ (React) + server/ (Express)
│   │   ├── shopify-app/              ← Shopify embedded app (Polaris + Express + webhooks)
│   │   └── claude-setup/             ← AI-agent structure for existing projects
│   ├── skills/                        ← 15 standalone skills for generate command
│   ├── hooks/                         ← Hook templates (pre-commit)
│   └── mcp-servers/                   ← MCP server templates (basic)
└── docs/superpowers/                  ← Implementation plans and specs
```

### Inside Each Project Template

```
<project>/
├── template.json                      ← Scaffolding variables & conditionals
├── .claude/
│   ├── settings.json                  ← Claude Code permissions for this project
│   └── skills/<name>/SKILL.md         ← Claude Code skills (YAML frontmatter)
├── CLAUDE.md                          ← Root-level project guidance
├── <subdir>/CLAUDE.md                 ← Directory-scoped guidance (client/, server/, etc.)
├── package.json
├── tsconfig.json
└── src/...                            ← Source code boilerplate
```

### Inside Each Standalone Skill

```
<skill>/
├── template.json                      ← Skill metadata & variables
└── SKILL.md                           ← Skill content with {{skill_name}} variable
```

## Template Engine

Templates use a variable-based engine:

| Syntax | Where | Example |
|--------|-------|---------|
| `{{var}}` | File content | `"name": "{{project_name}}"` |
| `__var__` | File names | `__project_name__/README.md` |
| `conditionals` | `template.json` | `"e2e": "include_e2e"` (boolean → skip directory) |

**Constraint:** Only boolean conditionals are supported. For string-based branching (e.g., SQL vs MongoDB), create separate templates.

## Project Templates

### react-app
React SPA with Redux Toolkit, RTK Query, and Styled-components. Feature-based directory structure (`src/features/<name>/`). Includes example counter feature with slice, API, styles, and tests.

### node-api
NestJS REST API with TypeScript. Includes both TypeORM (SQL) and Mongoose (MongoDB) setups — choose one and remove the other. Module → Controller → Service pattern with dependency injection. Consistent `{ data, error, meta }` response format.

### fullstack
npm workspaces monorepo combining `client/` (react-app structure) and `server/` (NestJS). Vite proxies `/api` requests to the server during development.

### shopify-app
Shopify embedded app with Polaris frontend + Express backend. Includes App Bridge provider, HMAC-validated webhook handlers, GDPR mandatory endpoints, and Shopify API client. Supports app extensions.

### claude-setup
AI-agent structure for existing projects. Prompts for project name, optional frontend/backend directory names. Outputs `.claude/` with settings, `CLAUDE.md` hierarchy with conventions. Use `megamind-ai generate skill <name>` after init to add specific skills.

## Skills (20 total, distributed per project)

Skills follow Claude Code's native format: `.claude/skills/<name>/SKILL.md` with YAML frontmatter (`name`, `description`). Each project template includes only the skills relevant to its domain.

| Category | Skills | react-app | node-api | fullstack | shopify-app |
|----------|--------|:---------:|:--------:|:---------:|:-----------:|
| Core (7) | code-review, git-commit, debugging, refactoring, documentation, security-audit, performance-review | all | all | all | all |
| Frontend (3) | react-component, redux-slice, styled-component | all | — | all | react-component |
| Backend (3) | api-endpoint, typeorm-entity, mongoose-model | — | all | all | api-endpoint |
| Testing (2) | jest-testing, playwright-testing | all | jest | all | all |
| Shopify (5) | shopify-webhook, shopify-graphql, shopify-polaris, shopify-billing, shopify-extension | — | — | — | all |

## Standalone Templates

For use with `megamind-ai generate <type> <name>` on existing projects:

| Type | Templates |
|------|-----------|
| skill | code-review, git-commit, debugging, refactoring, documentation, security-audit, performance-review, react-component, redux-slice, styled-component, api-endpoint, typeorm-entity, mongoose-model, jest-testing, playwright-testing |
| hook | pre-commit |
| mcp-server | basic |

## CLAUDE.md Hierarchy

Each template has **multiple CLAUDE.md files** at different directory levels, providing progressively more specific guidance:

| Project | CLAUDE.md locations |
|---------|-------------------|
| react-app | root, `src/` |
| node-api | root, `src/` |
| fullstack | root, `client/`, `server/` |
| shopify-app | root, `web/frontend/`, `web/backend/`, `extensions/` |

Claude Code automatically reads the nearest `CLAUDE.md` in the working directory hierarchy, so agents get the right context without extra configuration.

## Key Conventions (shared across templates)

### Frontend
- Feature-based structure: `src/features/<name>/` with page, slice, API, styles, tests
- Component structure: `components/<Name>/` with `.tsx`, `.styles.ts`, optional `.types.ts`
- Named exports only (no default exports)
- Styled-components with theme tokens — never hardcode colors, spacing, or fonts
- RTK Query for server state, Redux slices for UI state, `useState` for forms

### Backend
- NestJS Module → Controller → Service pattern with dependency injection
- Controllers handle HTTP only (decorators, params, status codes); services hold business logic
- Consistent JSON response: `{ data, error, meta }`
- Error handling: NestJS built-in exceptions (NotFoundException, BadRequestException, etc.)
- TypeORM: `@CreateDateColumn`/`@UpdateDateColumn`; Mongoose: `{ timestamps: true }`

### Shopify
- HMAC validation on every webhook (constant-time comparison)
- GDPR mandatory webhooks: `customers/data_request`, `customers/redact`, `shop/redact`
- GraphQL cost-based rate limiting (1000-point bucket, 50/s restore)
- `test: true` flag on billing mutations in development
- Shopify skills include Official Docs Reference URLs — always `WebFetch` latest docs before implementation

### Git
- Conventional commits: `<type>(<scope>): <subject>`
- Types: feat, fix, refactor, docs, style, test, chore, perf, ci
- Subject: imperative mood, lowercase, no period, max 72 chars

## Working in This Repo

When modifying templates:
- Edit files directly inside `templates/projects/<name>/` — source files sit alongside `template.json`
- Keep `template.json` variables in sync with any `{{var}}` usage in template files
- When adding a new skill, add it to every relevant project template (see the matrix above)
- All file content must be in English; team communication may be in Vietnamese
- Test template variables render correctly (no orphaned `{{var}}` references)
