---
name: performance-review
description: "Audit code for database queries, API response times, and resource usage"
---

# Performance Review

Audit code for performance issues.

## When to use

When investigating slow pages, slow APIs, or high resource usage.

## Instructions

### Frontend (React)

**Rendering:**
- Unnecessary re-renders: use React.memo, useMemo, useCallback
- Large lists: use virtualization (react-window/react-virtual)
- Expensive computations: move to useMemo or Web Worker
- Component splitting: lazy load with React.lazy + Suspense

**Bundle:**
- Tree-shaking: import specific modules, not entire libraries
- Code splitting: route-based splitting
- Assets: compress images, use WebP, lazy load below-fold images

**Network:**
- RTK Query: check cache policy, avoid unnecessary refetches
- Pagination: avoid loading all data at once
- Debounce: search inputs, resize handlers

### Backend (Node.js)

**Database:**
- N+1 queries: use joins/populate/eager loading
- Missing indexes: add indexes on queried fields
- Connection pooling: reuse connections
- Query optimization: explain/analyze slow queries

**API:**
- Response size: paginate large datasets
- Caching: Redis/in-memory for frequent reads
- Async operations: use queues for heavy tasks
- Compression: enable gzip/brotli

**Shopify:**
- GraphQL: minimize query cost, use bulk operations for large datasets
- Webhooks: process async, respond quickly (< 5s)
- API rate limits: implement request throttling
