---
name: debugging
description: "Systematic approach to finding and fixing bugs in Shopify apps"
---

# Debugging

Systematic approach to finding and fixing bugs.

## When to use

When investigating bugs, errors, or unexpected behavior.

## Instructions

### Process

1. **Reproduce** — Get a reliable reproduction. Document exact steps.
2. **Isolate** — Narrow down where the bug occurs.
   - Check error messages and stack traces
   - Check recent changes (git log / git blame)
   - Add logging at key boundaries
3. **Identify root cause** — Don't fix symptoms.
   - Ask: WHY does this happen, not just WHERE
   - Trace data flow from input to the point of failure
4. **Fix** — Make the minimal change that fixes the root cause.
5. **Verify** — Confirm the fix works and doesn't break anything.
6. **Add test** — Write a test that would have caught this bug.

### Common Patterns (React + Node.js)

**Frontend:**
- Stale closure in hooks → check useEffect/useCallback deps
- Infinite re-render → check useEffect dependency array
- RTK Query cache issues → check tag invalidation
- Styled-components not updating → check prop passing

**Backend:**
- Unhandled promise rejection → check async/await try-catch
- TypeORM query fails → check entity relations and eager/lazy loading
- Mongoose validation → check schema required fields
- Memory leak → check event listener cleanup, DB connection pooling

**Shopify:**
- App Bridge not loading → check host param and API key
- Webhook not received → check HTTPS, webhook registration
- GraphQL rate limits → check query cost, implement throttling
