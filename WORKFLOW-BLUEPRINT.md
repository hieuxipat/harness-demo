# Megamind AI Boilerplate - Workflow Blueprint

## 1. Tổng quan kiến trúc

### Workspace concept

Mỗi dự án trong division Megamind sử dụng boilerplate này như **1 workspace**, bên trong chứa:

```
megamind-{app-name}/
├── .claude/
│   ├── skills/                 # 17 skills (xem Section 3)
│   ├── settings.local.json     # Config cụ thể cho project
│   └── command/                # Custom commands (nếu có)
├── backend/                    # NestJS app (git repo riêng)
├── frontend/                   # React admin app (git repo riêng)
├── storefront/                 # Theme extension (git repo riêng)
├── docs/
│   ├── registry.yaml           # Master index — tất cả features
│   ├── features/               # Feature Registry (mỗi feature 1 folder)
│   │   └── {FEATURE_FLAG}/
│   │       ├── manifest.yaml           # Metadata: owner, status, version
│   │       ├── user-stories/           # US-001.md, US-002.md,...
│   │       ├── test-cases/             # TC-001.md + coverage-matrix.md
│   │       └── decisions/              # ADR-001.md
│   ├── templates/              # Templates chuẩn (user-story, test-case, manifest, ADR)
│   ├── REGISTRY-CONTRACT.md    # Quy tắc concurrent access cho multi-dev
│   └── app-discovery/          # Thông tin app
├── e2e-tests/                  # Playwright E2E tests
├── chrome-profile/             # Persistent browser profile
├── resources.md                # Environment config
├── larkbot.md                  # Lark messaging reference
└── CLAUDE.md                   # Project-level instructions
```

### resources.md (template)

```markdown
# Resources

TASK_LIST_URL=                    # board URL
LARK_NOTIFY_URL=                  # Lark Bot webhook
APP_NAME=""                       # Tên app (vd: "Consentik Shopify")
SONARQUBE_TOKEN=                  # SonarQube auth
SONARQUBE_KEY=                    # SonarQube project key
APP_URL=                          # App URL để test
FIGMA_URL=                        # Figma design URL (nếu có)
```

---

## 2. Danh sách Skills (17 skills)

### 2.1 Quy tắc đặt tên

**Format:** `{action}-{object}` — ngắn gọn, verb-first, không prefix `dev-`/`tester-`

### 2.2 Skills theo nhóm

#### Nhóm A: Setup (1 skill)

| # | Skill | Mục đích | Khi nào dùng |
|---|---|---|---|
| A1 | **`init-workspace`** | Khởi tạo workspace mới từ boilerplate | Chạy 1 lần sau clone (tự xoá) |

#### Nhóm B: Orchestrators (2 skills)

| # | Skill | Mục đích | Khi nào dùng |
|---|---|---|---|
| B1 | **`task-flow`** | Orchestrator chính cho feature, có error recovery + resume | Làm feature mới |
| B2 | **`hotfix-flow`** | Orchestrator rút gọn cho hotfix, có scope escalation | Fix bug gấp |

#### Nhóm C: Task Analysis (3 skills)

| # | Skill | Mục đích | Khi nào dùng |
|---|---|---|---|
| C1 | **`explore-task`** | Lấy task từ board (Notion/Linear/Lark/Jira), filter + lưu file | Cần lấy task từ board |
| C2 | **`break-task`** | Phân tích & chia user stories, tạo Feature Registry | Nhận task mới, cần planning |
| C3 | **`explore-codebase`** | Khám phá app hiện tại (structure, patterns, conventions) | Onboard dự án mới hoặc trước khi code |

#### Nhóm D: Implementation (3 skills)

| # | Skill | Mục đích | Khi nào dùng |
|---|---|---|---|
| D1 | **`implement`** | TDD implementation, đọc/ghi registry | Implement user story |
| D2 | **`review-code`** | Code review bằng agent riêng, verify AC | Sau implement, trước commit |
| D3 | **`docs-api`** | Swagger/OpenAPI decorators | Sau implement BE endpoints |

#### Nhóm E: Testing (3 skills)

| # | Skill | Mục đích | Khi nào dùng |
|---|---|---|---|
| E1 | **`test-e2e`** | E2E test trên browser, tạo TC files + coverage matrix | Task có FE hoặc Storefront |
| E2 | **`test-integration`** | Integration test, tạo TC files + coverage matrix | Task có BE |
| E3 | **`check-quality`** | Unit test + SonarQube + story coverage check | Trước commit |

#### Nhóm F: Reference/Shared (5 skills)

| # | Skill | Mục đích | Dùng bởi |
|---|---|---|---|
| F1 | **`playwright-cli`** | Playwright CLI reference | `explore-task`, `test-e2e` |
| F2 | **`ui-shopify`** | Shopify Polaris + UI/UX design system | `implement`, `explore-codebase` |
| F3 | **`swagger-ref`** | OpenAPI/Swagger reference | `docs-api` |
| F4 | **`larkbot-ref`** | Lark messaging reference | `notify` |
| F5 | **`notify`** | Gửi notification qua Larkbot, đọc registry cho summary | Bất kỳ skill nào cần thông báo |

---

## 3. Cơ chế Workflow theo loại task

### 3.1 Feature Full-stack (BE + FE + Storefront)

```
/task-flow --scope fullstack

[1] explore-task (tuỳ chọn)     → Lấy task từ board
[2] break-task                   → Chia user stories, đánh dấu scope mỗi story
[3] explore-codebase             → Scan conventions cả 3 repos
    ║
    ║  Lặp cho mỗi user story:
    ║
    ╠══ [4] implement            → TDD cho story (BE → FE → Storefront)
    ╠══ [5] review-code          → Agent review changes
    ╠══ [6] docs-api             → Swagger (nếu story có BE endpoint)
    ║
[7] test-integration             → Test BE APIs
[8] test-e2e                     → Test UI flow trên browser
[9] check-quality                → SonarQube + coverage
[10] Commit & Notify
```

### 3.2 Feature Backend-only

```
/task-flow --scope backend

[1] explore-task (tuỳ chọn)
[2] break-task
[3] explore-codebase --path backend/
    ║
    ║  Lặp cho mỗi user story:
    ╠══ [4] implement
    ╠══ [5] review-code
    ╠══ [6] docs-api
    ║
[7] test-integration
[8] check-quality
[9] Commit & Notify

→ SKIP: test-e2e (không có UI)
```

### 3.3 Feature Frontend-only

```
/task-flow --scope frontend

[1] explore-task (tuỳ chọn)
[2] break-task
[3] explore-codebase --path frontend/
    ║
    ║  Lặp cho mỗi user story:
    ╠══ [4] implement
    ╠══ [5] review-code
    ║
[6] test-e2e
[7] check-quality
[8] Commit & Notify

→ SKIP: docs-api (không có API mới), test-integration
```

### 3.4 Feature Storefront-only

```
/task-flow --scope storefront

[1] explore-task (tuỳ chọn)
[2] break-task
[3] explore-codebase --path storefront/
    ║
    ║  Lặp cho mỗi user story:
    ╠══ [4] implement
    ╠══ [5] review-code
    ║
[6] test-e2e
[7] Commit & Notify

→ SKIP: docs-api, test-integration, check-quality (storefront thường không có SonarQube)
```

### 3.5 Hotfix (rút gọn)

```
/hotfix-flow

[1] explore-codebase             → Hiểu context bug
[2] implement                    → Fix + viết test cho bug
[3] review-code                  → Quick review
[4] check-quality                → Đảm bảo không break gì
[5] Commit & Notify (urgent)

→ SKIP: explore-task, break-task, docs-api, test-e2e
→ Notify có flag URGENT qua Larkbot
```

### 3.6 Standalone skills (dùng độc lập)

Mỗi skill đều có thể chạy độc lập mà không cần orchestrator:

```bash
/explore-task          # Chỉ xem task board
/break-task            # Chỉ phân tích task
/explore-codebase      # Chỉ khám phá codebase
/implement             # Implement 1 user story cụ thể
/review-code           # Review code hiện tại
/test-e2e              # Chạy E2E test
/check-quality         # Chỉ check quality
/docs-api              # Chỉ cập nhật Swagger
/notify                # Gửi thông báo
```

---

## 4. Cải thiện cơ chế Break Task

### Vấn đề
- Chia user stories nhưng không cho user biết story nào đủ nhỏ để implement luôn
- Không có tiêu chí rõ ràng để đánh giá "size" của story

### Giải pháp cho Megamind

`break-task` sẽ output mỗi user story với **Implementation Readiness Score**:

```markdown
## User Stories for {FEATURE_FLAG}

### US-01: Merchant can enable cookie banner ✅ READY
- Scope: Backend (1 endpoint) + Frontend (1 component)
- Complexity: S (1-2 files mỗi layer)
- Dependencies: Không
- Verdict: **Implement được luôn**

### US-02: Banner hiển thị theo geo-location ⚠️ NEEDS BREAKDOWN
- Scope: Backend (GeoIP service + middleware + API) + Storefront (script injection)
- Complexity: L (5+ files, external service)
- Dependencies: US-01 phải xong trước
- Verdict: **Cần chia nhỏ hơn**
  → US-02a: Backend GeoIP service
  → US-02b: Middleware filter by country
  → US-02c: Storefront script injection

### US-03: Admin dashboard thống kê consent ⚠️ NEEDS BREAKDOWN
- Scope: Backend (3 endpoints + aggregation) + Frontend (chart components)
- Complexity: L
- Verdict: **Cần chia nhỏ hơn**
  → US-03a: Backend aggregation APIs
  → US-03b: Frontend chart components
  → US-03c: Frontend filter & export
```

**Tiêu chí đánh giá:**

| Criteria | ✅ READY | ⚠️ NEEDS BREAKDOWN |
|---|---|---|
| Số files thay đổi | ≤ 5 files/layer | > 5 files/layer |
| Số layers liên quan | 1-2 layers | 3 layers + phức tạp |
| External dependencies | Không hoặc đã có sẵn | Cần tích hợp service mới |
| Estimated test cases | ≤ 8 test cases | > 8 test cases |
| Có thể demo độc lập | Có | Không, phụ thuộc story khác |

---

## 5. Cơ chế E2E Test

### Khi nào cần E2E?

```
Task scope includes frontend OR storefront → E2E REQUIRED
Task scope is backend-only                 → E2E SKIP
Hotfix                                     → E2E SKIP (trừ khi fix UI bug)
```

### E2E test strategy theo scope

| Scope | Test gì | Tool |
|---|---|---|
| Frontend (admin) | Merchant flow trong Shopify admin | Playwright + chrome-profile |
| Storefront | Customer-facing widget/banner | Playwright + store URL |
| Fullstack | Cả admin flow + storefront | Playwright (2 sessions) |

### Thư mục E2E

```
e2e-tests/
├── admin/                # Tests cho frontend (Shopify admin)
│   └── {feature}.spec.ts
├── storefront/           # Tests cho storefront
│   └── {feature}.spec.ts
└── fixtures/             # Shared test data
```

---

## 6. Cấu trúc thư mục Skills chi tiết

```
.claude/skills/
│
├── ── Setup ──
├── init-workspace/
│   └── SKILL.md              # One-time workspace setup (tự xoá sau)
│
├── ── Orchestrators ──
├── task-flow/
│   └── SKILL.md              # Main workflow + error recovery + resume
├── hotfix-flow/
│   └── SKILL.md              # Hotfix workflow + scope escalation
│
├── ── Task Analysis ──
├── explore-task/
│   └── SKILL.md              # Lấy task từ board, filter, lưu file
├── break-task/
│   └── SKILL.md              # Chia user stories + tạo Feature Registry
├── explore-codebase/
│   └── SKILL.md              # Khám phá codebase conventions
│
├── ── Implementation ──
├── implement/
│   └── SKILL.md              # TDD + registry integration
├── review-code/
│   └── SKILL.md              # Code review + AC verification
├── docs-api/
│   └── SKILL.md              # Swagger decorators
│
├── ── Testing ──
├── test-e2e/
│   └── SKILL.md              # E2E test + TC files + coverage matrix
├── test-integration/
│   └── SKILL.md              # Integration test + TC files + coverage matrix
├── check-quality/
│   └── SKILL.md              # Unit test + SonarQube + story coverage
│
├── ── Reference ──
├── playwright-cli/
│   ├── SKILL.md              # Playwright CLI guide
│   └── references/
│       └── ...
├── ui-shopify/
│   ├── SKILL.md              # Shopify Polaris + UI/UX
│   └── references/
│       ├── index.md
│       ├── apps.md           # App design guidelines (40KB)
│       └── llms.md           # Shopify dev platform reference (94KB)
├── swagger-ref/
│   ├── SKILL.md              # OpenAPI/Swagger reference
│   └── references/
│       ├── index.md
│       ├── specification.md  # OpenAPI spec (372KB)
│       ├── api.md            # Swagger API tools (58KB)
│       ├── open-source-tools.md  # OSS tools (157KB)
│       └── other.md
├── larkbot-ref/
│   └── SKILL.md              # Lark message format
└── notify/
    └── SKILL.md              # Notifications, đọc registry cho summary
```

---

## 7. Nội dung tóm tắt mỗi Skill

### A1. init-workspace

```
Trigger: /init-workspace (chạy 1 lần, tự xoá sau)
Logic:
  1. Hỏi workspace name, GitLab remote, app name, subprojects
  2. Xoá git history boilerplate → init git mới
  3. Clone subprojects (backend, frontend, storefront)
  4. Config .gitignore, resources.md
  5. Push lên remote → tự xoá skill
```

### B1. task-flow (Orchestrator)

```
Trigger: /task-flow --scope (fullstack|backend|frontend|storefront)
Registry: Đọc manifest.yaml để resume nếu feature đang in-progress
Logic:
  1. explore-task (tuỳ chọn)
  2. break-task → tạo Feature Registry + user stories với readiness score
  3. explore-codebase → scan conventions theo scope
  4-6. Loop mỗi user story READY:
     a. implement (TDD) → cập nhật story status + registry
     b. review-code → verify AC
     c. docs-api (nếu scope có backend)
  7. test-integration → tạo TC files + coverage matrix (nếu có backend)
  8. test-e2e → tạo TC files + coverage matrix (nếu có frontend/storefront)
  9. check-quality → unit test + SonarQube + story coverage check
  10. Finalize → cập nhật manifest + registry → commit → notify
Error Recovery:
  - Resume từ bước cuối dựa trên manifest.status
  - Story fail: retry / skip / stop (user chọn)
  - Hotfix escalation: giữ progress, tạo registry, chuyển task-flow
```

### B2. hotfix-flow

```
Trigger: /hotfix-flow
Logic:
  1. explore-codebase → tìm root cause
  2. implement → fix + test (TDD)
  3. review-code → quick review
  4. check-quality
  5. Commit (fix: ...) → notify (URGENT)
Scope escalation:
  - Nếu scope lớn → tạo Feature Registry → chuyển sang task-flow (giữ code đã viết)
```

### C1. explore-task

```
Trigger: /explore-task
Config: TASK_LIST_URL từ resources.md
Logic:
  1. Filter selection: pending / upcoming (5 ngày) / custom / tất cả chưa done
  2. Playwright mở board, filter by logged-in Assignee
  3. Thu thập task details (ID, title, status, assignee, due, priority, feature flag)
  4. Lưu mỗi task thành ./tasks/{TASK-ID}.md
  5. Hiển thị bảng tóm tắt → user chọn task
```

### C2. break-task

```
Trigger: /break-task
Input: Task description hoặc output từ explore-task
Registry output:
  1. Tạo docs/features/{FEATURE_FLAG}/ (manifest.yaml, user-stories/, test-cases/, decisions/)
  2. Tạo US-xxx.md cho mỗi story (frontmatter: id, status, priority, complexity)
  3. Tạo coverage-matrix.md skeleton
  4. Cập nhật docs/registry.yaml
Logic:
  1. Đọc user stories từ PO (nếu có)
  2. Verify Figma design (nếu có)
  3. Chia user stories + đánh giá Readiness Score
  4. Auto-breakdown stories NEEDS BREAKDOWN
  5. Sắp xếp: dependencies → risk → scope
  6. Cập nhật manifest + registry
  7. User confirm
```

### C3. explore-codebase

```
Trigger: /explore-codebase [--path <subdir>]
Logic:
  1. Scan directory structure
  2. Xác định patterns (Backend/Frontend/Storefront)
  3. Detect tech stack & versions
  4. Summarize conventions
Output: Markdown report conventions
```

### D1. implement

```
Trigger: /implement
Input: User story (từ break-task hoặc manual)
Registry integration:
  - Đọc manifest.yaml + US-xxx.md để lấy AC
  - Cập nhật story status: implementing → done
  - Cập nhật registry: stories_done
Logic:
  1. Đọc conventions + manifest + user story + test cases
  2. TDD cycle: RED → verify fail → GREEN → verify pass → REFACTOR
  3. User confirm mỗi cycle
  4. Sau xong: cập nhật US-xxx.md (status, AC checkboxes) + manifest + registry
```

### D2. review-code

```
Trigger: /review-code
Registry integration:
  - Agent nhận manifest + user stories + coverage matrix
  - Verify code match acceptance criteria → Blocker nếu AC chưa covered
Logic:
  1. Spawn sub-agent reviewer
  2. Agent đọc git diff + manifest + AC
  3. Phân loại: 🔴 Blocker | 🟡 Warning | 🔵 Suggestion
  4. User chọn fix items → fix → report
  5. Cập nhật manifest history nếu có fix
```

### D3. docs-api

```
Trigger: /docs-api
Logic: Tìm changed controllers & DTOs → thêm Swagger decorators → verify
Reference: /swagger-ref
```

### E1. test-e2e

```
Trigger: /test-e2e
Registry integration:
  - Đọc coverage matrix → tìm stories chưa có E2E test
  - Tạo TC-xxx.md (type: e2e, covers: [US-xxx])
  - Cập nhật coverage-matrix.md + registry
Logic:
  1. Gather scenarios từ user stories + test cases
  2. Playwright: open → navigate → interact → screenshot → verify
  3. Tạo TC files + cập nhật coverage matrix
  4. Report với traceability (TC-E01 → US-001/AC-2)
```

### E2. test-integration

```
Trigger: /test-integration
Registry integration: Tương tự test-e2e (tạo TC files, cập nhật coverage matrix)
Logic:
  1. Define scope: endpoints + modules
  2. TDD: viết integration tests (*.integration.spec.ts)
  3. Real DB, chỉ mock external services
  4. Tạo TC files + cập nhật coverage matrix
  5. Report với traceability
```

### E3. check-quality

```
Trigger: /check-quality
Registry integration:
  - Đọc coverage-matrix → cảnh báo stories chưa có test
  - Cập nhật registry: tests_pass, coverage
Logic:
  1. Unit tests: npx jest --coverage (>70%)
  2. SonarQube scan + check results (0 Blocker, 0 Critical)
  3. Story coverage check (recommend ≥80%)
  4. Fix loop (max 3 rounds)
  5. Report: tests + SonarQube + story coverage
```

### F1-F5. Reference & Shared skills

| Skill | Nội dung | Reference files |
|---|---|---|
| `playwright-cli` | Playwright CLI guide | references/ (commands, sessions, etc.) |
| `ui-shopify` | Shopify Polaris + UI/UX design | references/apps.md (40KB), llms.md (94KB) |
| `swagger-ref` | OpenAPI/Swagger reference | references/specification.md (372KB), api.md (58KB), etc. |
| `larkbot-ref` | Lark message format | Cross-ref larkbot.md |
| `notify` | Gửi notification, đọc registry cho summary | 4 types: completed, urgent, missing stories, review request |

---

## 8. Skill dependency map

```
task-flow (orchestrator)                          Feature Registry
├── explore-task ──────→ playwright-cli (ref)      │
├── break-task ────────────────────────────────→ CREATES registry
├── explore-codebase ──→ ui-shopify (ref)          │
├── implement ─────────────────────────────────→ UPDATES story status
├── review-code ───────────────────────────────→ READS AC from stories
├── docs-api ──────────→ swagger-ref (ref)         │
├── test-integration ──────────────────────────→ CREATES TC files
├── test-e2e ──────────→ playwright-cli (ref) ─→ CREATES TC files
├── check-quality ─────────────────────────────→ READS coverage matrix
└── notify ────────────→ larkbot-ref (ref) ────→ READS registry summary

hotfix-flow (orchestrator)
├── explore-codebase
├── implement ─────────────────────────────────→ (no registry unless escalated)
├── review-code
├── check-quality
└── notify ────────────→ larkbot-ref (ref)
    ↓ (scope escalation)
    → task-flow (tạo registry, resume từ review)
```

---

## 9. Feature Registry System

### 9.1 Tổng quan

Feature Registry là hệ thống file-based quản lý user stories, test cases, và tiến độ feature. Được tạo bởi `/break-task` và cập nhật bởi tất cả skills trong workflow.

### 9.2 Cấu trúc

```
docs/
├── registry.yaml                         # Master index
├── features/
│   └── {FEATURE_FLAG}/
│       ├── manifest.yaml                 # Source of truth cho feature
│       ├── user-stories/US-xxx.md        # Frontmatter: id, status, assigned_to, priority, complexity
│       ├── test-cases/TC-xxx.md          # Frontmatter: type, covers, covers_ac, status
│       ├── test-cases/coverage-matrix.md # Mapping US → AC → TC
│       └── decisions/ADR-xxx.md          # Architecture Decision Records
├── templates/                            # 5 templates chuẩn
└── REGISTRY-CONTRACT.md                  # Quy tắc concurrent access
```

### 9.3 Status flow

**Feature:** `draft → approved → in-progress → review → done → archived`
**User Story:** `draft → approved → implementing → done`
**Test Case:** `draft → ready → pass | fail | blocked`

### 9.4 Concurrent access (multi-dev)

Quy tắc chi tiết tại `docs/REGISTRY-CONTRACT.md`:

- **Mỗi dev sở hữu stories riêng** — không sửa file người khác
- **manifest.yaml** — lead dev quản lý, history append-only
- **Branch strategy:** `feature/{FLAG}/US-xxx` per dev → merge vào `feature/{FLAG}` → merge vào main
- **Conflict resolution:** status lấy giá trị "tiến hơn", stories_done lấy giá trị lớn hơn

### 9.5 Example

Xem `docs/features/_example-cookie-banner/` — feature mẫu hoàn chỉnh với:
- 1 manifest.yaml
- 3 user stories (US-001, US-002, US-003)
- 5 test cases (TC-001 → TC-004, TC-E01)
- 1 coverage matrix (78% coverage)
- 1 ADR

---

## 10. Error Recovery & Resume

### 10.1 Task-flow resume

Khi gọi lại `/task-flow` cho feature đang làm, orchestrator đọc `manifest.yaml`:

| manifest.status | Resume từ |
|---|---|
| `draft` | Step [2] break-task |
| `approved` | Step [3] explore-codebase |
| `in-progress` | Loop [4-6] — tìm story chưa `done` |
| `review` | Step [7] hoặc [8] (test) |
| `done` | Hỏi user muốn làm gì tiếp |

### 10.2 Story-level recovery

Khi 1 story fail trong loop:
1. Story giữ status `implementing`
2. Hỏi user: **Retry** / **Skip** (ghi note) / **Stop** (xử lý manual)
3. Workflow tiếp tục với stories còn lại

### 10.3 Hotfix → Task-flow escalation

Khi hotfix scope lớn hơn dự kiến:
1. Giữ nguyên code đã viết
2. Tạo Feature Registry cho hotfix
3. Chuyển sang `/task-flow` → resume từ Step [5] (review)

---

## 11. Conventions

1. **Mỗi skill chạy được độc lập** — không bắt buộc phải qua orchestrator
2. **User confirm ở mỗi bước quan trọng** — implement, review, commit
3. **Scope-aware** — Skill tự detect backend/, frontend/, storefront/
4. **Registry luôn up-to-date** — mỗi skill tự cập nhật phần mình khi hoàn thành
5. **Traceability** — test case phải liên kết với user story qua `covers` field
6. **Resume-friendly** — orchestrator đọc registry trước khi bắt đầu, skip steps đã hoàn thành
7. **Multi-dev safe** — ownership rules trong REGISTRY-CONTRACT.md
8. **Shopify-specific** — ui-shopify cover Polaris, App Bridge, theme extension patterns
9. **Không hardcode app name** — đọc từ resources.md
10. **TDD bắt buộc** — không viết production code khi chưa có failing test
11. **Quality gate bắt buộc** — code không commit nếu chưa pass
