---
name: shopify-extension
description: "Build theme, checkout, and admin UI extensions"
---

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

## Official Docs Reference

Information in this skill may be outdated. Before implementation, you MUST fetch the latest docs from these URLs:

| Topic | URL |
|---|---|
| App extensions overview | https://shopify.dev/docs/apps/build/app-extensions |
| Theme app extensions | https://shopify.dev/docs/apps/build/online-store/theme-app-extensions |
| Checkout extensions | https://shopify.dev/docs/apps/build/checkout |
| Admin UI extensions | https://shopify.dev/docs/apps/build/admin/actions-blocks |
| App Bridge | https://shopify.dev/docs/api/app-bridge |

**Usage:** When creating extensions, use `WebFetch` to read the docs for the specific extension type before writing code. Official docs take precedence over skill content if there are discrepancies.
