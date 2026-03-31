---
name: shopify-webhook
description: "Handle Shopify webhooks with HMAC validation and GDPR compliance"
---

# Shopify Webhook

Handle Shopify webhooks securely and reliably.

## When to use

When adding or modifying Shopify webhook handlers.

## Instructions

### Setup

1. Register webhooks via Shopify API or shopify.app.toml
2. Create handler in routes/webhooks.ts
3. Always validate HMAC signature before processing
4. Respond with 200 quickly, process async

### HMAC Validation

Every webhook request must be validated:
- Extract X-Shopify-Hmac-Sha256 header
- Compute HMAC-SHA256 of raw body with app secret
- Compare with constant-time comparison

### Common Webhooks

| Topic | When to use |
|---|---|
| orders/create | New order placed |
| orders/updated | Order modified |
| products/update | Product changed |
| app/uninstalled | App removed — cleanup data |
| customers/data_request | GDPR data request |
| customers/redact | GDPR data erasure |
| shop/redact | GDPR shop data erasure |

### GDPR Mandatory Webhooks

Every Shopify app MUST implement these 3 endpoints:
1. customers/data_request — return customer data
2. customers/redact — delete customer data
3. shop/redact — delete shop data after uninstall

### Best Practices

- Process webhooks asynchronously (queue)
- Implement idempotency (webhooks can be sent multiple times)
- Log webhook receipt for debugging
- Handle app/uninstalled to cleanup shop data
- Set reasonable timeout (5 seconds to respond)

## Official Docs Reference

Information in this skill may be outdated. Before implementation, you MUST fetch the latest docs from these URLs:

| Topic | URL |
|---|---|
| Webhooks overview | https://shopify.dev/docs/apps/build/webhooks |
| Privacy/GDPR webhooks | https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance |
| Webhook API reference | https://shopify.dev/docs/api/admin-graphql (search "webhookSubscription") |
| Rate limits | https://shopify.dev/docs/api/usage/rate-limits |

**Usage:** When implementing webhooks, use `WebFetch` to read the latest docs before writing code. Official docs take precedence over skill content if there are discrepancies.
