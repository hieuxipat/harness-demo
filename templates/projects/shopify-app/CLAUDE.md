# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev:** `npm run dev` (uses Shopify CLI)
- **Build:** `npm run build`
- **Test:** `npm test`
- **Lint:** `npm run lint`

## Architecture

Shopify embedded app with React (Polaris) frontend + Node.js backend.

- `web/frontend/` — React app with Polaris UI components
  - `src/components/providers/` — App Bridge and Polaris providers
  - `src/pages/` — App pages
  - `src/hooks/` — Custom hooks (Shopify queries, etc.)
- `web/backend/` — Express API server
  - `src/routes/webhooks.ts` — Webhook handlers with HMAC validation
  - `src/services/shopify.ts` — Shopify API client
  - `src/middleware/` — Auth and session verification
- `extensions/` — Shopify app extensions
- `shopify.app.toml` — Shopify app configuration

### Key Requirements

- All webhooks must validate HMAC before processing
- GDPR mandatory webhooks must be implemented (customers/data_request, customers/redact, shop/redact)
- Use Polaris components for all UI (follow Shopify admin patterns)
- Test in Shopify admin iframe, not standalone browser
