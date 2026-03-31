# Shopify App Extensions

## Overview

App extensions run outside the main app — in the storefront, checkout, or admin.

## Extension Types

| Type | Location | Language |
|---|---|---|
| Theme app extension | Storefront | Liquid + JS (no React) |
| Checkout UI extension | Checkout | @shopify/ui-extensions-react |
| Admin UI extension | Admin | @shopify/ui-extensions-react |
| Post-purchase extension | Post checkout | @shopify/ui-extensions-react |

## Commands

- **Generate:** `shopify app generate extension`
- **Dev:** `shopify app dev` (serves all extensions)

## Conventions

- Each extension in its own directory: `extensions/<name>/`
- Theme extensions use Liquid + vanilla JS — no React
- Admin/checkout extensions use `@shopify/ui-extensions-react`
- Keep extensions lightweight — they affect merchant page load
- Test on multiple themes (Dawn, etc.)
- Version extensions independently from main app
- Use extension settings for merchant customization
