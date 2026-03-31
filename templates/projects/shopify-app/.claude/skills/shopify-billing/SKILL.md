---
name: shopify-billing
description: "Implement app billing, subscriptions, and usage charges"
---

# Shopify Billing

Implement app billing and subscription management.

## When to use

When adding paid plans, usage charges, or subscription management.

## Instructions

### Billing Types

| Type | When | API |
|---|---|---|
| Recurring charge | Monthly/annual subscription | appSubscriptionCreate |
| One-time charge | Single purchase | appPurchaseOneTimeCreate |
| Usage charge | Pay-per-use (on top of recurring) | appUsageRecordCreate |

### Flow

1. User selects plan → call appSubscriptionCreate mutation
2. Shopify returns confirmationUrl → redirect user
3. User approves on Shopify → redirect back to app
4. Verify charge status via API
5. Grant access to paid features

### Plan Verification

Before premium features, always verify:
- Active subscription exists
- Subscription matches required plan
- Handle grace period for failed payments

### Testing

- Use test: true flag in development
- Test upgrade, downgrade, and cancellation flows
- Test what happens when billing fails
- Verify GDPR compliance: data access after unsubscribe

### Best Practices

- Always offer free tier or trial
- Show clear pricing before redirect to Shopify
- Handle billing errors gracefully (show banner, not crash)
- Cache billing status (don't check every request)
- Implement usage tracking for usage-based billing

## Official Docs Reference

Information in this skill may be outdated. Before implementation, you MUST fetch the latest docs from these URLs:

| Topic | URL |
|---|---|
| Billing overview | https://shopify.dev/docs/apps/launch/billing |
| appSubscriptionCreate mutation | https://shopify.dev/docs/api/admin-graphql/unstable/mutations/appSubscriptionCreate |
| appPurchaseOneTimeCreate mutation | https://shopify.dev/docs/api/admin-graphql/unstable/mutations/appPurchaseOneTimeCreate |
| appUsageRecordCreate mutation | https://shopify.dev/docs/api/admin-graphql/unstable/mutations/appUsageRecordCreate |
| GraphQL Admin API | https://shopify.dev/docs/api/admin-graphql |

**Usage:** When implementing billing, use `WebFetch` to read billing docs and mutation references before writing code. Official docs take precedence over skill content if there are discrepancies.
