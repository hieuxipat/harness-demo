# AI-Assisted Development Workflow — Harness + CodeGraph

Boilerplate cài quy trình phát triển hỗ trợ bởi AI vào dự án host, ghép từ **`claude-code-harness`** (plugin — loop `plan → work → review → sync → release`, có gate, enforce bằng Go binary) và **`codegraph`** (index ngữ nghĩa code local, per-subproject). Boilerplate chỉ **cấu hình** 2 tool này cho workspace — không chứa source sản phẩm.

> Trước đây boilerplate dùng workflow 4-phase tự viết (superpowers `sp-*`, `explore-story`, `create-test-case`, `self-test`...). Đã **thay hoàn toàn** bằng harness + codegraph. Chi tiết & lý do: `docs/harness-codegraph-migration-plan.md`.

## Quick Reference

```bash
# Bước 0 — cài plugin harness (USER step, 1 lần/máy, cần restart Claude Code):
/plugin marketplace add Chachamaru127/claude-code-harness
/plugin install claude-code-harness@claude-code-harness-marketplace
# → restart Claude Code

# Bước 1 — khởi tạo workspace từ boilerplate (chạy trong thư mục boilerplate):
/init-workspace
# → clone subprojects, codegraph init mỗi subproject, seed harness.toml + rules,
#   ghi .mcp.json + CLAUDE.md, set .git/info/exclude. In hướng dẫn /harness-setup.

# Bước 2 — bật harness trong từng subproject (USER step, 1 lần/subproject):
cd <workspace>/backend && /harness-setup     # rồi frontend/, storefront/...

# Bước 3 — chạy loop harness, LUÔN ở trong subproject:
cd <workspace>/backend
/harness-plan        # → spec.md + Plans.md (user duyệt)
/harness-work --no-commit   # → TDD slice (LUÔN --no-commit)
/harness-review      # → review độc lập, block major
/harness-sync        # → đồng bộ spec/Plans/code
/harness-release     # → đóng gói evidence, preflight

# Commit khi sẵn sàng (KHÔNG auto-commit) — trong đúng subproject:
git commit ...   # hoặc /ship-it
```

## Prerequisites

- [Claude Code](https://claude.ai/code) CLI (≥ 2.1.117 để dùng `extraKnownMarketplaces`/plugin ổn định).
- `git` ≥ 2.30 (clone subprojects, set `.git/info/exclude`).
- `node` + `npx` (codegraph chạy qua `npx @colbymchenry/codegraph`).
- Playwright (`playwright-cli`) — verify UI thật trong Shopify Admin iframe.
- Quyền access (HTTPS token / SSH key) tới repo các subproject.
- Jira access (tuỳ chọn — plugin `atlassian` để plan từ Jira link).

## Cài plugin harness (USER step — không tự động được)

Claude **không thể tự cài** marketplace plugin từ trong session. Bạn chạy thủ công 1 lần/máy:

```bash
/plugin marketplace add Chachamaru127/claude-code-harness
/plugin install claude-code-harness@claude-code-harness-marketplace
# restart Claude Code, rồi trong mỗi subproject: /harness-setup
```

`.claude/settings.json` của boilerplate đã khai báo `extraKnownMarketplaces` (pin ref **`v4.12.3`**, `autoUpdate: false`) + `enabledPlugins`. Khi mở Claude Code trong workspace và trust folder, Claude Code sẽ tự **prompt cài** plugin này cho cả team (cùng version).

`bin/harness` là Go binary (đa nền tảng, ~11MB/nền). Đã verify chạy OK trên macOS arm64 (không bị Gatekeeper chặn). Hooks (`PreToolUse`/`PermissionRequest`) chạy tự động sau khi cài.

## Setup workspace: `/init-workspace`

**Goal:** biến boilerplate thành workspace thật — folder chứa subprojects đã clone, mỗi subproject được wire sẵn harness + codegraph (overlay local), git boilerplate giữ nguyên. Chạy **một lần** cho mỗi workspace.

### Chuẩn bị

- Tên workspace (lowercase, gạch ngang — vd `ordertracking-workspace`)
- Tên app hiển thị (vd `Order Tracking`)
- GitLab remote URL cho workspace *(tuỳ chọn)*
- Danh sách subproject: `<folder> <git-url>` mỗi dòng

### `/init-workspace` làm gì (đã cập nhật cho harness + codegraph)

1. Tạo `<boilerplate>/<workspace-name>/`, copy scaffold (`.claude/`, `chrome-profile/`, `docs/`, `.mcp.json`, `README.md`).
2. Xoá skill `init-workspace` khỏi workspace (chỉ dùng 1 lần).
3. Generate `.gitignore` workspace (ignore subproject folders, `.codegraph/`, `.claude/state/`, secrets).
4. **Clone subprojects** (HTTPS-first, SSH fallback, timeout 60s/lần).
5. Với **mỗi subproject clone thành công:**
   - Thêm overlay harness/codegraph vào **`.git/info/exclude`** (không bẩn git team): `harness.toml`, `Plans.md`, `spec.md`, `.claude/state/`, `.codegraph/`, `evidence/`.
   - `codegraph init` (+ index) → tạo `.codegraph/` riêng.
   - Seed `harness.toml` (từ `templates/harness/`, điền tên subproject) + `.claude/rules/project-rules.md`.
   - Thêm entry codegraph vào `.mcp.json`: `npx -y @colbymchenry/codegraph serve --mcp --path <subproject>`.
6. Phân tích tech stack mỗi subproject; generate `CLAUDE.md` workspace (bảng subprojects + harness loop + Shopify section nếu detect).
7. Init git workspace (branch `main`), commit, set remote + push (nếu có URL).
8. Thêm `<workspace-name>/` vào `.gitignore` boilerplate.

### Cấu trúc sau khi init

```
megamind-ai-boilerplate/        ← giữ nguyên
  .claude/  docs/  .mcp.json  templates/harness/  CLAUDE.md  README.md
  <workspace-name>/             ← workspace MỚI, git repo riêng
    .claude/  docs/  chrome-profile/  .mcp.json  CLAUDE.md  README.md
    backend/                    ← subproject (git team) + overlay LOCAL:
      .git/info/exclude (+= harness/codegraph artifacts)
      harness.toml  Plans.md  spec.md  .codegraph/  evidence/
      .claude/rules/project-rules.md
    frontend/  storefront/      ← tương tự
```

## Harness loop (per-subproject)

Harness lưu state **per git repo** → chạy verbs **trong từng subproject** (`cd backend/` rồi `/harness-*`).

| Verb | Làm gì |
|---|---|
| `/harness-plan` | Research → `spec.md` (product contract) + `Plans.md` (task ledger). User duyệt. |
| `/harness-work --no-commit` | TDD slice theo task. **LUÔN `--no-commit`.** |
| `/harness-review` | Review độc lập; block critical/major. |
| `/harness-sync` | Đồng bộ `spec.md`/`Plans.md`/code cross-session. |
| `/harness-release` | Đóng gói evidence, preflight. |

Agents có sẵn của harness: `advisor`, `reviewer`, `scaffolder`, `worker`. Verify UI thật → `playwright-cli --headed` trong Shopify Admin iframe.

## Routing theo độ lớn task

| Loại | Tiêu chí | Đường đi |
|---|---|---|
| **Trivial** | ≤ 2 file, không đổi product behavior/API/data/permissions/billing | Prompt thẳng, bỏ ceremony (hook vẫn chạy). |
| **Nhỏ** | 1 task, behavior nhẹ | `/harness-work` Solo `--auto-mode --no-commit`. |
| **Vừa** | 2-3 task độc lập | `/harness-plan` → `/harness-work --parallel --no-commit`. Gate plan. |
| **Lớn** | 4+ task / đổi behavior lớn | Full loop plan→review→sync→release, `--no-commit`. |

Auto-mode bật cho Trivial/Nhỏ, tắt cho Vừa/Lớn. Định nghĩa ngưỡng trong `.claude/rules/project-rules.md`.

## Config sống ở đâu (KHÔNG có config.json / constitution.md)

| Bề mặt | Ai đọc | Chứa gì |
|---|---|---|
| `harness.toml` (subproject root) | Go binary | permissions, sandbox denyRead, protectedBranchPush, tdd. Sửa xong: `bin/harness sync`. |
| `.claude/rules/project-rules.md` | agent | domain rules: tiếng Việt, no-commit, task-sizing, codegraph-first, Shopify, bug intake. |
| `CLAUDE.md` (subproject) | agent | guidance + trỏ tới rules. |
| `spec.md` + `Plans.md` | harness verbs | contract source-of-truth. |

Template seed ở `templates/harness/`.

## MCP servers (`.mcp.json`)

- `shopify-dev-mcp` — search Shopify docs, validate Admin GraphQL + Polaris component.
- **codegraph per-subproject** (init-workspace thêm) — `serve --mcp --path <subproject>`. Query trước grep khi có `.codegraph/`. Tools: `codegraph_search/context/trace/callers/callees/impact/node/explore`.

## Shopify conventions

Subproject là Shopify app → đọc `docs/shopify-conventions.md` trước khi plan/work code đụng Shopify. Cứng: **Polaris React** (không `<s-*>`); validate GraphQL qua `shopify-dev-mcp`; app embedded trong Admin iframe; tra Polaris API qua `context7`.

## Commit rules

**Không auto-commit.** `/harness-work` mặc định auto-commit → luôn `--no-commit`. `harness.toml` để `git commit`/`git push` ở `ask`. User commit khi sẵn sàng, **trong đúng subproject**. Prefix: `feat:`/`fix:`/`chore:`...

## Workflow rules (override defaults)

1. Harness chạy **per-subproject** — `cd <subproject>` trước mọi `/harness-*`.
2. **No auto-commit** — luôn `--no-commit`; user commit thủ công.
3. `spec.md`/`Plans.md` là source-of-truth; không bịa data chưa quan sát.
4. **codegraph query-first** khi có `.codegraph/`.
5. **Output tiếng Việt** cho user (harness không có i18n VN).
6. Task-sizing routing (rules) + selective auto-mode.
7. **Bug UI Shopify**: repro `playwright-cli --headed` trong Admin iframe + lưu `evidence/` trước khi fix.
8. **Không commit overlay harness/codegraph** vào git subproject — chỉ ở `.git/info/exclude`.
9. Cài plugin + `/harness-setup` là **user step** — session không tự cài được.
```
