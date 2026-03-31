---
name: shopify-graphql
description: "Query and mutate Shopify data via Admin GraphQL API"
---

# Shopify GraphQL API

Work with Shopify Admin GraphQL API.

## When to use

When querying or mutating Shopify data (products, orders, customers, etc.).

## Instructions

### Client Setup

Use @shopify/shopify-api official client:
- Initialize with shop domain + access token
- Use GraphQL client for all API calls
- Handle rate limiting with retry logic

### Query Patterns

**Pagination:** Use cursor-based pagination (first/after, last/before)
**Bulk Operations:** For large datasets (>250 items), use bulkOperationRunQuery
**Metafields:** Use metafield queries for custom data

### Rate Limiting

- Shopify uses cost-based rate limiting
- Each query has a cost (check extensions.cost in response)
- Available bucket: 1000 points, restores 50/second
- Implement: check cost, throttle if near limit, retry on 429

### Common Operations

| Operation | API |
|---|---|
| Get products | products(first: 50) |
| Create product | productCreate(input: {...}) |
| Update metafield | metafieldsSet(metafields: [...]) |
| Fulfill order | fulfillmentCreateV2(fulfillment: {...}) |
| Get shop info | shop { name, email, plan } |

### Best Practices

- Request only fields you need (no select *)
- Use fragments for repeated field sets
- Cache responses where appropriate
- Use webhook for real-time updates, not polling
- Test with Shopify Partner sandbox store

## Official Docs Reference

Information in this skill may be outdated. Before implementation, you MUST fetch the latest docs from these URLs:

| Topic | URL |
|---|---|
| GraphQL Admin API reference | https://shopify.dev/docs/api/admin-graphql |
| Rate limits & query cost | https://shopify.dev/docs/api/usage/rate-limits |
| Bulk operations | https://shopify.dev/docs/api/admin-graphql (search "bulkOperation") |
| Shopify App Remix package | https://shopify.dev/docs/api/shopify-app-remix |

**Usage:** When implementing specific queries/mutations, use `WebFetch` to read the API reference at `https://shopify.dev/docs/api/admin-graphql/unstable/mutations/<mutationName>` or `https://shopify.dev/docs/api/admin-graphql/unstable/queries/<queryName>`. Official docs take precedence over skill content if there are discrepancies.
