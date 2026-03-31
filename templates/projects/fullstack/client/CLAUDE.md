# Client (React Frontend)

## Commands

- **Dev:** `npm run dev` (port {{client_port}}, proxies `/api` to server)
- **Test:** `npm test`
- **Lint:** `npm run lint`

## Architecture

React app with Redux Toolkit + RTK Query + Styled-components.

- `src/app/` — Redux store config and typed hooks
- `src/features/` — Feature modules (page, slice, API, styles, tests)
- `src/components/` — Shared UI components
- `src/styles/` — Theme and styled-components type declarations
- `e2e/` — Playwright E2E tests

## Conventions

- Feature structure: `features/<name>/` with `<Name>Page.tsx`, `<name>Slice.ts`, `<name>Api.ts`, `<Name>Page.styles.ts`
- Named exports only (no default exports)
- Styled-components use theme values — no hardcoded colors/spacing
- RTK Query for server state, Redux slices for UI state
- API calls go through RTK Query, which proxies to `http://localhost:{{server_port}}`
