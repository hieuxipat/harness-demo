# Shopify Domain Conventions

Short reference for Superpowers skills (especially `sp-brainstorming`, `sp-writing-plans`, `sp-test-driven-development`, `self-test`) to generate code that fits this Division's Shopify app stack. **Read this file when a workspace contains a Shopify app subproject** (detected via `@shopify/polaris`, `@shopify/shopify-api`, or `@shopify/app-bridge-react` in any `package.json`).

This is not a workflow override — it is a domain constraint checklist. If generated code violates any item below, treat it as a bug and fix during Phase 3 before moving to Phase 4.

## Stack reference (Division standard)

- **Backend:** NestJS + TypeORM + MySQL
- **Frontend:** ReactJS + **Polaris React** (`@shopify/polaris`) + App Bridge React (`@shopify/app-bridge-react`)
- **App type:** Embedded inside Shopify Admin (iframe under `*.myshopify.com/admin`)
- **APIs used:** Admin GraphQL (primary); Metafields/Metaobjects when custom data is needed

## Frontend — Polaris React (NOT Web Components)

**Important:** the `Shopify/Shopify-AI-Toolkit` skills and many current examples on `shopify.dev` use Polaris **Web Components** (`<s-button>`, `<s-page>`, `<s-badge>`, ...). This Division does **NOT** use that flavor. If generated code contains `<s-*>` tags, it is wrong stack — rewrite.

**Correct pattern:**

```tsx
import {Page, Card, Button, Badge} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css'; // import once at entry

export function ProductPage() {
  return (
    <Page title="Products">
      <Card>
        <Button variant="primary">Save</Button>
      </Card>
    </Page>
  );
}
```

**UI checklist:**

- ✅ Import from `@shopify/polaris` (React components, PascalCase)
- ✅ Props are camelCase (`primaryAction`, `onAction`)
- ✅ Wrap the app in `<AppProvider i18n={...}>` at the root
- ✅ Use App Bridge React hooks (`useAppBridge`, `useNavigate`, `useAuthenticatedFetch`) for navigation, toast, modal, resource picker
- ❌ Do NOT use web component tags `<s-button>`, `<s-page>`, `<s-badge>`
- ❌ Do NOT import from `@shopify/ui-extensions` (that package is for UI Extensions, not embedded apps)
- ❌ Do NOT import from `@shopify/app-bridge` (legacy v3) — use `@shopify/app-bridge-react` (v4+) instead

**Validation routing:** `shopify-dev-mcp`'s `validate_component_codeblocks` tool recognizes web component syntax. For Polaris React, use the **`context7`** MCP (`resolve-library-id` → `@shopify/polaris`) to look up the current API instead.

## Backend — NestJS + Shopify

### Admin GraphQL calls

Before writing any query or mutation:

1. Call `mcp__shopify-dev-mcp__search_docs_chunks` to locate the operation, field names, and deprecation status.
2. Call `mcp__shopify-dev-mcp__validate_graphql_codeblocks` to validate the query before committing.
3. Do NOT guess field names. Do NOT rely on training data — the Shopify API bumps version quarterly.

In Phase 3 brainstorming, the spec must record the API version in use (`2025-01`, `2024-10`, ...) and the scopes required.

### Webhook handlers

Every webhook controller in NestJS must:

- ✅ Verify the HMAC from the `X-Shopify-Hmac-Sha256` header BEFORE parsing the body (use the raw body).
- ✅ Respond `200 OK` quickly (< 5s); offload heavy work to a queue if needed.
- ✅ Be idempotent — webhooks can retry; use `X-Shopify-Webhook-Id` as the dedupe key.
- ✅ Implement all **GDPR mandatory webhooks**: `customers/data_request`, `customers/redact`, `shop/redact`.
- ❌ Do NOT log the raw webhook body (contains PII).

### Session & OAuth

- Session storage lives in a dedicated TypeORM entity (e.g. `ShopifySessionEntity`), not in the generic user table.
- Distinguish **offline tokens** (for backend cron/webhook work) from **online tokens** (for user sessions).
- When scopes change in `shopify.app.toml`, the merchant must re-OAuth. Flag this explicitly in the spec and test cases.

### Rate limits & query cost

- The Admin GraphQL API bills **calculated query cost**, not request count. Split heavy queries and use `bulk operations` for large datasets.
- Handle `THROTTLED` responses with exponential backoff.

## Phase-specific notes

### Phase 1 (`explore-story`)

- When a story touches UI, record an open question to the PO if the story does not specify which Polaris components are expected.
- When a story touches the Admin API, list the required scopes and the target API version before drafting acceptance criteria.

### Phase 3 (`sp-brainstorming` + TDD)

- The spec must document: (a) the Polaris React components planned, (b) Admin API operations + version, (c) webhook topics (if any), (d) TypeORM entity changes + migration plan.
- Unit tests for webhook controllers: mock the HMAC verify service and cover both valid and invalid HMAC cases.
- Tests for GraphQL calls: mock the Shopify client. Do NOT hit the real API from unit tests.

### Phase 4 (`/self-test`)

- **Browser mode:** the app must be opened inside the Shopify Admin iframe (App Bridge needs the admin context). Do NOT open `localhost:3000` directly — use the `shopify app dev` tunnel URL.
- **Integration mode — webhooks:** trigger via Shopify CLI (`shopify app webhook trigger`) instead of faking a curl call.
- **Integration mode — Admin API:** follow the `shopify-admin-execution` pattern — run CLI commands against a real dev store rather than a mock.

## Decision-log template (embed in `specs/<topic>-design.md`)

When the story touches Shopify, include this block in the spec:

```markdown
## Shopify integration decisions

- **API version:** 2025-01
- **Admin API scopes required:** read_products, write_inventory
- **Polaris React components:** Page, IndexTable, Modal, Toast
- **App Bridge hooks:** useAppBridge, useNavigate
- **Webhook topics:** products/update, orders/create
- **Metafields/Metaobjects:** $app:settings (metaobject type) — schema at <link>
- **Session mode:** online token for UI, offline token for background jobs
- **Rate limit plan:** estimated query cost ~50 points/request, batch up to 10 items
```

## When in doubt

- Polaris React API questions → `context7` MCP (`resolve-library-id` → `@shopify/polaris`).
- Shopify platform questions (Admin API, webhooks, CLI) → `shopify-dev-mcp`.
- Unclear between the two → ask the user. Do not guess.
