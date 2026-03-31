# Frontend (Shopify Embedded App)

## Architecture

React app embedded in Shopify admin using App Bridge + Polaris.

- `src/components/providers/` — AppBridgeProvider and PolarisProvider (wrap entire app)
- `src/pages/` — App pages using Polaris Page/Layout/Card pattern
- `src/hooks/` — Custom hooks (useShopifyQuery for GraphQL)
- `src/Routes.tsx` — React Router route definitions

## Conventions

- Use Polaris components for ALL UI — never use custom HTML/CSS for admin UI
- Every page uses `<Page>` → `<Layout>` → `<Card>` structure
- Use Polaris tokens for spacing and colors, not custom values
- Loading states: `SkeletonPage` + `SkeletonBodyText`
- Empty states: `EmptyState` with primary action
- Error feedback: `Banner` for persistent errors, `Toast` for success
- Navigation: App Bridge `NavigationMenu` for sidebar, `TitleBar` for page actions
- Test in Shopify admin iframe (not standalone browser)
- Support both light and dark mode
