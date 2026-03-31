# Backend (Shopify App API)

## Architecture

Express server handling Shopify authentication, webhooks, and API proxying.

- `src/routes/webhooks.ts` — Webhook handlers with HMAC validation
- `src/services/shopify.ts` — Shopify API client (@shopify/shopify-api)
- `src/middleware/shopifyAuth.ts` — Session token verification

## Critical Requirements

- **HMAC validation:** Every webhook MUST validate X-Shopify-Hmac-Sha256 before processing
- **GDPR webhooks:** MUST implement customers/data_request, customers/redact, shop/redact
- **Webhook response:** Respond 200 immediately, process async (< 5s timeout)
- **Rate limiting:** Shopify GraphQL uses cost-based limits (1000 points, 50/s restore)
- **Session verification:** All authenticated endpoints must verify Shopify session tokens

## Conventions

- Webhook handlers respond quickly then process async
- Use @shopify/shopify-api for all Shopify API interactions
- GraphQL queries request only needed fields
- Implement idempotency for webhook processing (webhooks can be sent multiple times)
- Use `test: true` flag for billing mutations in development
