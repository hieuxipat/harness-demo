# CLAUDE.md — Fit Confidence

Workspace for **Fit Confidence**. Guidance for Claude Code khi làm việc qua các subproject trong workspace này.

## Workflow: harness + codegraph (per-subproject)

Workspace dùng workflow **claude-code-harness (plugin) + codegraph**, chạy **PER-SUBPROJECT**. Trước mọi verb harness phải `cd <subproject>`.

**Cài 1 lần (USER step, cần restart Claude Code):**
```
/plugin marketplace add Chachamaru127/claude-code-harness
/plugin install claude-code-harness@claude-code-harness-marketplace
cd <subproject> && /harness-setup
```

**Loop trong từng subproject:**
- `/harness-plan` → spec.md + Plans.md (user duyệt)
- `/harness-work --no-commit` → TDD slice (LUÔN `--no-commit`)
- `/harness-review` → review độc lập, block major
- `/harness-sync` → đồng bộ spec/Plans/code
- `/harness-release` → đóng gói evidence, preflight

Domain rules per-subproject ở `.claude/rules/project-rules.md` (tiếng Việt, no-commit, task-sizing, codegraph-first, Shopify). codegraph query-first khi subproject có `.codegraph/`.

## ⚠️ Monorepo layout (khác mặc định boilerplate)

Workspace này được cấu hình theo quyết định của user là **MONOREPO, flatten ra root**: code subproject (`frontend/`, `backend/`, `storefront/`) nằm ngay ở **root** của repo `harness-demo`, push lên `https://github.com/hieuxipat/harness-demo`. Scaffold boilerplate (templates/, skill init-workspace, CLAUDE/README boilerplate) đã được gỡ bỏ. Khác với mặc định (mỗi subproject là git repo riêng, overlay local-only qua `.git/info/exclude`):

- Subproject **không có `.git` riêng** — đã xoá khi clone để gộp monorepo.
- Harness/codegraph artifacts không dùng `.git/info/exclude`; thay vào đó ignore qua `.gitignore` ở root repo: `.codegraph/`, `.claude/state/`, `state.db`, `evidence/`.
- `harness.toml` / `spec.md` / `Plans.md` / `project-rules.md` **được commit** (file contract hữu ích, đây là repo của chính team).
- Vì vậy **Workflow rule #1 và #9 bên dưới (per-subproject git repo, `.git/info/exclude`) không áp dụng** cho workspace này — harness state vẫn keep per-subproject folder, nhưng tất cả nằm trong một git repo.

## Subprojects

Workspace này gồm 3 subproject (đều thuộc Shopify app). Harness/codegraph đã được wire sẵn:

| Folder | Repo (nguồn) | Branch | Stack | Harness wiring |
|--------|------|--------|-------|----------------|
| `frontend/` | gitlab.xipat.com/megaminds/megamind-ordertracking-boilerplate-frontend | `reactjs_boilerplate` | React 18 + Vite + Shopify Polaris 12 + App Bridge React | ✅ codegraph (197 nodes) + harness.toml + rules |
| `backend/` | gitlab.xipat.com/megaminds/megamind-boilerplate-nestjs-react (bỏ `storefront/`) | `nestjs-boilerplate` | NestJS 11 + TypeORM + @shopify/shopify-api | ✅ codegraph (1,122 nodes) + harness.toml + rules |
| `storefront/` | cùng repo nestjs-react, chỉ folder `storefront/` | `nestjs-boilerplate` | React 19 + Vite 6 (storefront widget) | ✅ codegraph (114 nodes) + harness.toml + rules |

> `backend/` và `storefront/` tách ra từ **cùng một repo** `megamind-boilerplate-nestjs-react`: `backend/` = toàn bộ repo trừ folder `storefront/`; `storefront/` = chính folder đó.

### Tổng quan từng subproject

#### `frontend/` — Shopify embedded Admin app UI (`ot_boilerplate`)
React SPA chạy nhúng trong **Shopify Admin iframe** (App Bridge). UI dùng **Polaris React** + polaris-viz cho chart, react-redux cho state, react-router-dom cho routing.
- Tech stack: React 18, Vite 4, `@shopify/polaris@12`, `@shopify/app-bridge-react@3`, `@shopify/polaris-viz`, `@shopify/react-form`, axios.
- Entry points: `npm run dev` (Vite dev server), `npm run build`, `npm run lint`.

#### `backend/` — NestJS API backend (`boilerplate`)
Backend NestJS cho Shopify app: auth/OAuth Shopify, gọi Admin & Storefront GraphQL, job queue (Bull), TypeORM migrations, Swagger docs.
- Tech stack: NestJS 11, TypeORM, `@shopify/shopify-api@11`, `@shopify/admin-api-client`, `@shopify/storefront-api-client`, Bull, Passport/JWT, Throttler, Terminus.
- Entry points: `npm run start:dev`, `npm run shopify:dev`, `npm run migration:generate` / `migration:run`.

#### `storefront/` — Shopify storefront widget (`storefront`)
Phần chạy ngoài **storefront** của khách (theme app extension / widget). Minimal React 19 + Vite 6, build ra asset nhúng vào theme.
- Tech stack: React 19, Vite 6.
- Entry points: `npm run dev`, `npm run build`, `npm run build:types`.

### Mối tương quan giữa các subprojects

- `backend/` cung cấp API (Admin GraphQL proxy, business logic) cho cả `frontend/` (Admin app) và `storefront/` (widget). Cấu hình qua `.env` (xem `backend/.env.sample`).
- `frontend/` embedded trong Shopify Admin iframe, giao tiếp backend qua App Bridge + axios.
- `storefront/` render trên storefront của merchant, lấy data qua API của `backend/`.
- Trong monorepo này cả ba deploy độc lập nhưng share một git history.

> **Lưu ý:** Phân tích ban đầu từ metadata (package.json/README). Xác nhận/cập nhật khi làm việc thực tế với code.

## Commit rules cho workspace

- **Monorepo:** code subproject commit chung vào repo `harness-demo` (origin: github.com/hieuxipat/harness-demo). Không có git riêng per-subproject.
- **No auto-commit:** luôn `/harness-work --no-commit`; user commit khi sẵn sàng.
- Commit style: prefix ngắn lowercase (`feat:`, `fix:`, `chore:`...).

## Shopify domain conventions

Workspace có subproject Shopify app (`frontend/` Polaris + App Bridge; `backend/` `@shopify/shopify-api`). Đọc `docs/shopify-conventions.md` trước khi `/harness-plan` hoặc `/harness-work` code đụng Shopify:
- UI dùng **Polaris React** (`@shopify/polaris`), KHÔNG web components `<s-*>`.
- Validate Admin GraphQL qua `shopify-dev-mcp`; tra Polaris API qua `context7`.
- App embedded trong Shopify Admin iframe. Bug UI → repro `playwright-cli --headed` trong Admin iframe + lưu `evidence/`.

## Workflow rules that override defaults

1. **Harness runs per-subproject.** `cd <subproject>` before any `/harness-*` verb. Each subproject is its own git repo with its own `harness.toml`/`Plans.md`/`spec.md`.
2. **No auto-commit anywhere.** Always `/harness-work --no-commit`; user commits manually in the right subproject.
3. **`spec.md`/`Plans.md` are source-of-truth.** Don't invent data not observed ("not_observed ≠ absent"). Fix scope gaps in the plan, not downstream.
4. **codegraph query-first** when a subproject has `.codegraph/` — only Read/Grep to confirm details.
5. **All user-facing output is Vietnamese** (harness i18n has no VN; enforced via `.claude/rules`/CLAUDE.md). Technical tokens stay English.
6. **Task-sizing routing** (defined in `.claude/rules/project-rules.md`): Trivial (≤2 files, no product-behavior/API/data/permissions/billing change) → prompt directly, skip ceremony; Small → Solo `--auto-mode --no-commit`; Medium → `--parallel` with plan gate; Large → full loop with mandatory spec + review.
7. **Selective auto-mode** — on for Trivial/Small, off for Medium/Large. Independent of no-auto-commit.
8. **Shopify UI bugs must be reproduced** with `playwright-cli --headed` in the Admin iframe + evidence saved to `evidence/` before fixing.
9. **Never commit harness/codegraph overlay files** into a subproject's tracked git — they belong only in `.git/info/exclude`.
10. **Installing the harness plugin + `/harness-setup` are user steps** — a Claude session cannot install marketplace plugins.

> **Monorepo override (workspace này):** rule #1 và #9 áp dụng theo biến thể monorepo — KHÔNG có git per-subproject, KHÔNG dùng `.git/info/exclude`; harness state giữ per-subproject folder nhưng commit chung vào repo `harness-demo`. `.codegraph/` / `.claude/state/` / `state.db` / `evidence/` được ignore qua `.gitignore`. Các rule còn lại giữ nguyên.
