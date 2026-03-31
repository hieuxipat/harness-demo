---
name: redux-slice
description: "Create Redux Toolkit slices and RTK Query API services"
---

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
