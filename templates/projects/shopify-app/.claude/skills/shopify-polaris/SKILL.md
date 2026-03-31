---
name: shopify-polaris
description: "Build Shopify embedded app UI with Polaris components"
---

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

## Official Docs Reference

Information in this skill may be outdated. Before implementation, you MUST fetch the latest docs from these URLs:

| Topic | URL |
|---|---|
| Polaris components | https://polaris.shopify.com |
| App Bridge | https://shopify.dev/docs/api/app-bridge |
| App extensions overview | https://shopify.dev/docs/apps/build/app-extensions |

**Usage:** When using a specific Polaris component, use `WebFetch` to read docs at `https://polaris.shopify.com/components/<component-name>` (e.g., `.../components/index-table`). Official docs take precedence over skill content if there are discrepancies.
