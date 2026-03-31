# Source Code Guide

## Directory Structure

- `app/` — Redux store configuration and typed hooks (`useAppDispatch`, `useAppSelector`)
- `features/` — Feature-based modules, each containing page, slice, API, styles, and tests
- `components/` — Shared UI components reusable across features
- `styles/` — Theme definition (`theme.ts`) and styled-components type declarations
- `hooks/` — Custom React hooks shared across features
- `utils/` — Utility functions

## Conventions

- Feature module structure: `features/<name>/` contains `<Name>Page.tsx`, `<name>Slice.ts`, `<name>Api.ts`, `<Name>Page.styles.ts`, and `__tests__/`
- Component structure: `components/<Name>/` contains `<Name>.tsx`, `<Name>.styles.ts`, and optionally `<Name>.types.ts`
- All components use named exports (not default)
- Styled-components use theme values from `styles/theme.ts` — never hardcode colors, spacing, or fonts
- RTK Query for server state (`*Api.ts`), Redux slices for UI state (`*Slice.ts`), local `useState` for form state
- TypeScript strict mode enabled — no `any` types
