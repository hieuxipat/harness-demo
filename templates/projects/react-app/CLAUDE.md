# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (port {{port}})
- **Build:** `npm run build`
- **Test:** `npm test` / `npm run test:watch` / `npm run test:coverage`
- **E2E:** `npm run test:e2e`
- **Lint:** `npm run lint` / `npm run lint:fix`
- **Format:** `npm run format` / `npm run format:check`

## Architecture

React app with Redux Toolkit + RTK Query + Styled-components.

- `src/app/` — Redux store config and typed hooks
- `src/features/` — Feature-based modules (page, slice, api, styles, tests)
- `src/components/` — Shared UI components
- `src/styles/` — Theme definition and styled-components types
- `e2e/` — Playwright E2E tests

### Conventions

- Functional components with TypeScript, named exports
- Styled-components using theme values (no hardcoded colors/spacing)
- RTK Query for server state, Redux slices for UI state
- Co-located tests in `__tests__/` directories
- React Testing Library for unit tests, Playwright for E2E
