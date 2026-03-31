# Frontend ({{frontend_dir}})

## Architecture

React app with Redux Toolkit + RTK Query + Styled-components.

- `src/app/` — Redux store config and typed hooks
- `src/features/` — Feature-based modules (page, slice, api, styles, tests)
- `src/components/` — Shared UI components
- `src/styles/` — Theme definition and styled-components types

## Conventions

- Functional components with TypeScript, named exports only
- Feature structure: `features/<name>/` with `<Name>Page.tsx`, `<name>Slice.ts`, `<name>Api.ts`, `<Name>Page.styles.ts`
- Component structure: `components/<Name>/` with `.tsx`, `.styles.ts`, optional `.types.ts`
- Styled-components use theme values — never hardcode colors, spacing, or fonts
- RTK Query for server state, Redux slices for UI state, local `useState` for forms
- React Testing Library for unit tests, Playwright for E2E
