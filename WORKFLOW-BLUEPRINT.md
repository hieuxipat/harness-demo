# Megamind AI Boilerplate - Workflow Blueprint

## 1. Tổng quan kiến trúc

### Workspace concept

Mỗi dự án trong division Megamind sử dụng boilerplate này như **1 workspace**, bên trong chứa:

```
megamind-{app-name}/
├── .claude/
│   ├── skills/                 # Tất cả skills
│   ├── settings.local.json     # Config cụ thể cho project
│   └── command/                # Custom commands (nếu có)
├── backend/                    # NestJS app
├── frontend/                   # React admin app (embedded Shopify)
├── storefront/                 # Theme extension / storefront widget
├── docs/
│   ├── {FEATURE_FLAG}/
│   │   ├── user-stories/       # PO viết
│   │   └── test-cases/         # Tester viết
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

TASK_LIST_URL=                    # Notion/Linear board URL
LARK_NOTIFY_URL=                  # Lark Bot webhook
APP_NAME=""                       # Tên app (vd: "Consentik Shopify")
SONARQUBE_TOKEN=                  # SonarQube auth
SONARQUBE_KEY=                    # SonarQube project key
APP_URL=                          # App URL để test
FIGMA_URL=                        # Figma design URL (nếu có)
```

---

## 2. Phân tích so sánh: Xipat Workflow vs Megamind Boilerplate

### 2.1 Skills hiện có trong megamind (8 skills, tất cả đều trống)

| Skill hiện tại | Tương đương Xipat | Nhận xét |
|---|---|---|
| `task-explorer` | `dev-task-explore` | Giữ, đổi tên cho nhất quán |
| `break-task` | `dev-task-break` | Giữ, cần cải thiện cơ chế đánh giá "đủ nhỏ" |
| `implement-user-story` | `dev-test-driven-development` | Giữ, tên tốt hơn Xipat vì focus vào user story |
| `test-driven-development` | `dev-test-driven-development` | **Trùng mục đích** với `implement-user-story` → gộp |
| `e2e-test` | `dev-e2e-test` | Giữ |
| `explorer-flow-app` | Không có | Mới - khám phá codebase hiện tại |
| `playwright-cli` | `playwright-cli` (shared) | Giữ - reference skill |
| `ui-shopify` | `shopify-design-guideline` + `ui-ux-pro-max` | Giữ, gộp 2 skill Xipat thành 1 |

### 2.2 Skills Xipat có mà Megamind THIẾU (cần bổ sung)

| Skill Xipat | Tại sao cần | Mức ưu tiên |
|---|---|---|
| `dev-code-rules` | Scan conventions trước khi code → tránh viết sai pattern | **Cao** |
| `dev-code-review` | Review bằng agent riêng → phát hiện lỗi trước commit | **Cao** |
| `dev-docs-api` | Swagger decorators cho NestJS API | **Cao** (nếu có BE) |
| `dev-code-quality` | SonarQube + coverage gate | **Trung bình** |
| `dev-task-flow` | Orchestrator điều phối workflow | **Cao** |
| `larkbot` (reference) | Notification cho team | **Trung bình** |
| `swagger` (reference) | OpenAPI reference | **Trung bình** |
| `dev-test-case-check` | Kiểm tra tester đã viết test case chưa | **Thấp** - có thể gộp vào flow |
| `dev-integration-test` | Test controller→service→DB | **Trung bình** |

### 2.3 Skills Xipat KHÔNG cần cho Megamind

| Skill | Lý do bỏ |
|---|---|
| `tester-task-flow` | Megamind focus dev workflow, tester có flow riêng |
| `tester-task-explore` | Tương tự |
| `tester-write-test-cases` | Tương tự |
| `tester-test-api` | Gộp concept vào `integration-test` |
| `dev-eni-test` (gateway) | Không cần skill riêng chỉ để route, logic này nằm trong orchestrator |
| `dev-sonar-check` | Gộp vào `code-quality` luôn |
| `dev-quality-gate` | Gộp vào `code-quality` luôn |

---

## 3. Thiết kế danh sách Skills mới

### 3.1 Quy tắc đặt tên

**Format:** `{action}-{object}` — ngắn gọn, verb-first, không prefix `dev-`/`tester-`

Lý do: Megamind chỉ có 1 workflow cho dev, không cần phân biệt role trong tên skill.

### 3.2 Danh sách Skills đề xuất (16 skills)

#### Nhóm A: Orchestrators (2 skills)

| # | Skill | Mục đích | Khi nào dùng |
|---|---|---|---|
| A1 | **`task-flow`** | Orchestrator chính cho feature đầy đủ | Làm feature mới |
| A2 | **`hotfix-flow`** | Orchestrator rút gọn cho hotfix | Fix bug gấp |

#### Nhóm B: Task Analysis (3 skills)

| # | Skill | Mục đích | Khi nào dùng |
|---|---|---|---|
| B1 | **`explore-task`** | Lấy task từ board (Notion/Linear) | Cần lấy task từ board |
| B2 | **`break-task`** | Phân tích & chia user stories | Nhận task mới, cần planning |
| B3 | **`explore-codebase`** | Khám phá app hiện tại (structure, patterns, conventions) | Onboard dự án mới hoặc trước khi code |

#### Nhóm C: Implementation (3 skills)

| # | Skill | Mục đích | Khi nào dùng |
|---|---|---|---|
| C1 | **`implement`** | TDD implementation (Red→Green→Refactor) | Implement user story |
| C2 | **`review-code`** | Code review bằng agent riêng | Sau implement, trước commit |
| C3 | **`docs-api`** | Swagger/OpenAPI decorators | Sau implement BE endpoints |

#### Nhóm D: Testing (3 skills)

| # | Skill | Mục đích | Khi nào dùng |
|---|---|---|---|
| D1 | **`test-e2e`** | E2E test trên browser (Playwright) | Task có FE hoặc Storefront |
| D2 | **`test-integration`** | Integration test (controller→service→DB) | Task có BE |
| D3 | **`check-quality`** | SonarQube scan + coverage gate | Trước commit |

#### Nhóm E: Reference/Shared (5 skills)

| # | Skill | Mục đích | Dùng bởi |
|---|---|---|---|
| E1 | **`playwright-cli`** | Playwright CLI reference | `explore-task`, `test-e2e` |
| E2 | **`ui-shopify`** | Shopify Polaris + UI/UX design system | `implement`, `explore-codebase` |
| E3 | **`swagger-ref`** | OpenAPI/Swagger reference | `docs-api` |
| E4 | **`larkbot-ref`** | Lark messaging reference | `task-flow`, `review-code` |
| E5 | **`notify`** | Gửi notification qua Larkbot | Bất kỳ skill nào cần thông báo |

---

## 4. Cơ chế Workflow theo loại task

### 4.1 Feature Full-stack (BE + FE + Storefront)

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

### 4.2 Feature Backend-only

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

### 4.3 Feature Frontend-only

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

### 4.4 Feature Storefront-only

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

### 4.5 Hotfix (rút gọn)

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

### 4.6 Standalone skills (dùng độc lập)

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

## 5. Cải thiện cơ chế Break Task

### Vấn đề ở Xipat
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

## 6. Cơ chế E2E Test

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

## 7. Cấu trúc thư mục Skills chi tiết

```
.claude/skills/
│
├── ── Orchestrators ──
├── task-flow/
│   └── SKILL.md              # Main workflow orchestrator
├── hotfix-flow/
│   └── SKILL.md              # Hotfix workflow
│
├── ── Task Analysis ──
├── explore-task/
│   └── SKILL.md              # Lấy task từ board
├── break-task/
│   └── SKILL.md              # Phân tích & chia user stories
├── explore-codebase/
│   └── SKILL.md              # Khám phá codebase
│
├── ── Implementation ──
├── implement/
│   └── SKILL.md              # TDD implementation
├── review-code/
│   └── SKILL.md              # Code review bằng agent
├── docs-api/
│   └── SKILL.md              # Swagger decorators
│
├── ── Testing ──
├── test-e2e/
│   └── SKILL.md              # E2E Playwright tests
├── test-integration/
│   └── SKILL.md              # Integration tests
├── check-quality/
│   └── SKILL.md              # SonarQube + coverage
│
├── ── Reference ──
├── playwright-cli/
│   ├── SKILL.md              # Playwright CLI guide
│   └── references/
│       ├── running-code.md
│       ├── session-management.md
│       └── ...
├── ui-shopify/
│   ├── SKILL.md              # Shopify Polaris + UI/UX
│   └── references/
│       ├── polaris-patterns.md
│       └── design-system.md
├── swagger-ref/
│   ├── SKILL.md
│   └── references/
│       └── openapi-spec.md
├── larkbot-ref/
│   └── SKILL.md              # Lark message format
└── notify/
    └── SKILL.md              # Send notifications
```

---

## 8. Nội dung tóm tắt mỗi Skill (SKILL.md outline)

### A1. task-flow (Orchestrator)

```
Trigger: /task-flow
Input: --scope (fullstack|backend|frontend|storefront)
Logic:
  1. Hỏi scope nếu chưa có
  2. explore-task (tuỳ chọn - hỏi user có cần không)
  3. break-task → output user stories với readiness score
  4. explore-codebase → scan conventions theo scope
  5. Loop mỗi user story READY:
     a. implement (TDD)
     b. review-code
     c. docs-api (nếu scope có backend)
  6. test-integration (nếu scope có backend)
  7. test-e2e (nếu scope có frontend hoặc storefront)
  8. check-quality
  9. Commit
  10. notify (Larkbot)
```

### A2. hotfix-flow

```
Trigger: /hotfix-flow
Input: Bug description hoặc issue link
Logic:
  1. explore-codebase → tìm root cause
  2. implement → fix + test
  3. review-code → quick review
  4. check-quality
  5. Commit (conventional: fix: ...)
  6. notify (URGENT flag)
```

### B1. explore-task

```
Trigger: /explore-task
Cơ chế: Playwright mở TASK_LIST_URL → scrape task list → user chọn
Output: Task info (title, description, assignee, status, feature flag)
Lấy từ Xipat: dev-task-explore (copy logic Playwright scraping)
```

### B2. break-task

```
Trigger: /break-task
Input: Task description hoặc output từ explore-task
Logic:
  1. Đọc user stories từ docs/{FEATURE_FLAG}/user-stories/ (nếu có)
  2. Phân tích task → chia user stories
  3. Mỗi story đánh giá:
     - Scope (BE/FE/Storefront)
     - Complexity (S/M/L)
     - Dependencies
     - Readiness: ✅ READY hoặc ⚠️ NEEDS BREAKDOWN
  4. Stories NEEDS BREAKDOWN → tự động chia tiếp
  5. Sắp xếp theo: dependencies → risk (cao trước) → scope
  6. User confirm
Output: Danh sách user stories có readiness score
```

### B3. explore-codebase

```
Trigger: /explore-codebase [--path <subdir>]
Logic:
  1. Scan directory structure
  2. Xác định patterns:
     - Backend: module structure, service pattern, DTO, entities, error handling
     - Frontend: component structure, state management, routing, styling
     - Storefront: theme structure, Liquid/JS patterns
  3. Detect tech stack & versions
  4. Summarize conventions
Output: Markdown report conventions
Lấy từ Xipat: dev-code-rules (nhưng mở rộng cho storefront)
```

### C1. implement

```
Trigger: /implement
Input: User story (từ break-task hoặc manual)
Logic:
  1. Đọc conventions từ explore-codebase (nếu đã chạy)
  2. Đọc test cases từ docs/{FEATURE_FLAG}/test-cases/ (nếu có)
  3. TDD cycle cho mỗi acceptance criteria:
     a. RED: Viết test fail
     b. GREEN: Code tối thiểu pass
     c. REFACTOR: Clean up, giữ test pass
  4. User confirm mỗi cycle
Lấy từ Xipat: dev-test-driven-development (giữ nguyên TDD core)
```

### C2. review-code

```
Trigger: /review-code
Logic:
  1. Spawn sub-agent reviewer
  2. Agent đọc git diff (staged + unstaged)
  3. Phân loại: 🔴 Blocker | 🟡 Warning | 🔵 Suggestion
  4. Trình bày cho user
  5. User chọn fix items nào
  6. Fix → report
Lấy từ Xipat: dev-code-review (giữ nguyên cơ chế agent riêng)
```

### C3. docs-api

```
Trigger: /docs-api
Logic:
  1. Tìm changed controllers & DTOs: git diff -- backend/
  2. Thêm Swagger decorators: @ApiTags, @ApiOperation, @ApiResponse, @ApiProperty
  3. Follow conventions từ code hiện tại
  4. Verify: no TS errors, all endpoints documented
Reference: /swagger-ref
Lấy từ Xipat: dev-docs-api (giữ nguyên)
```

### D1. test-e2e

```
Trigger: /test-e2e
Điều kiện: Task có frontend hoặc storefront
Logic:
  1. Xác định scope: admin | storefront | cả hai
  2. Gather test scenarios từ user stories + test cases
  3. Confirm danh sách scenarios với user
  4. Với mỗi scenario: Playwright open → navigate → interact → screenshot → verify
  5. Report: pass/fail + screenshots
Tool: /playwright-cli
Lấy từ Xipat: dev-e2e-test (giữ nguyên, thêm storefront support)
```

### D2. test-integration

```
Trigger: /test-integration
Điều kiện: Task có backend
Logic:
  1. Define scope: endpoints + modules
  2. Viết integration tests (*.integration.spec.ts)
  3. Real test DB, chỉ mock external services
  4. Run: npx jest --testPathPattern=integration --coverage
  5. Report
Lấy từ Xipat: dev-integration-test (giữ nguyên)
```

### D3. check-quality

```
Trigger: /check-quality
Logic:
  1. Unit tests: npx jest --coverage (target >70%)
  2. SonarQube scan: npm run sonar
  3. Check results qua API:
     - 0 Blocker, 0 Critical
     - Coverage > threshold
  4. Fix loop (max 3 rounds)
  5. Report
Lấy từ Xipat: dev-quality-gate + dev-sonar-check (gộp thành 1)
```

### E1-E5. Reference skills

| Skill | Nội dung | Nguồn |
|---|---|---|
| `playwright-cli` | Full Playwright CLI guide + references | Copy từ Xipat (đã đầy đủ) |
| `ui-shopify` | Shopify Polaris patterns + UI/UX design system | Gộp `shopify-design-guideline` + `ui-ux-pro-max` từ Xipat |
| `swagger-ref` | OpenAPI 3.0 spec reference | Copy từ Xipat `swagger` |
| `larkbot-ref` | Lark message format & examples | Copy từ Xipat `larkbot.md` |
| `notify` | Logic gửi notification qua Larkbot webhook | Mới - extract từ các skill Xipat dùng Larkbot |

---

## 9. Skill dependency map

```
task-flow (orchestrator)
├── explore-task ──────→ playwright-cli (ref)
├── break-task
├── explore-codebase ──→ ui-shopify (ref, nếu Shopify app)
├── implement
├── review-code
├── docs-api ──────────→ swagger-ref (ref)
├── test-integration
├── test-e2e ──────────→ playwright-cli (ref)
├── check-quality
└── notify ────────────→ larkbot-ref (ref)

hotfix-flow (orchestrator)
├── explore-codebase
├── implement
├── review-code
├── check-quality
└── notify ────────────→ larkbot-ref (ref)
```

---

## 10. So sánh trước/sau

### Skills megamind hiện tại → đề xuất

| Hiện tại (8, trống) | Đề xuất (16) | Thay đổi |
|---|---|---|
| `task-explorer` | `explore-task` | Đổi tên (verb-first) |
| `break-task` | `break-task` | Giữ nguyên, thêm readiness score |
| `implement-user-story` | `implement` | Rút gọn tên |
| `test-driven-development` | *(gộp vào implement)* | Xoá - TDD là cơ chế bên trong `implement` |
| `e2e-test` | `test-e2e` | Đổi tên (nhóm test- prefix) |
| `explorer-flow-app` | `explore-codebase` | Đổi tên rõ nghĩa hơn |
| `playwright-cli` | `playwright-cli` | Giữ nguyên |
| `ui-shopify` | `ui-shopify` | Giữ nguyên |
| *(thiếu)* | `task-flow` | **MỚI** - orchestrator chính |
| *(thiếu)* | `hotfix-flow` | **MỚI** - orchestrator hotfix |
| *(thiếu)* | `review-code` | **MỚI** - từ Xipat dev-code-review |
| *(thiếu)* | `docs-api` | **MỚI** - từ Xipat dev-docs-api |
| *(thiếu)* | `test-integration` | **MỚI** - từ Xipat dev-integration-test |
| *(thiếu)* | `check-quality` | **MỚI** - từ Xipat dev-quality-gate + dev-sonar-check |
| *(thiếu)* | `swagger-ref` | **MỚI** - từ Xipat swagger |
| *(thiếu)* | `larkbot-ref` | **MỚI** - từ Xipat larkbot.md |
| *(thiếu)* | `notify` | **MỚI** - extract notification logic |

### Tóm tắt thay đổi
- **Giữ:** 6 skills (đổi tên 4)
- **Xoá:** 1 skill (gộp vào implement)
- **Thêm mới:** 9 skills
- **Tổng:** 16 skills (8 action + 2 orchestrator + 1 notification + 5 reference)

---

## 11. Checklist triển khai

### Phase 1: Foundation (ưu tiên cao nhất)
- [ ] Tạo `resources.md` template
- [ ] Tạo `larkbot.md` reference (copy từ Xipat)
- [ ] Viết SKILL.md cho `explore-codebase` (B3)
- [ ] Viết SKILL.md cho `break-task` (B2) - với readiness score
- [ ] Viết SKILL.md cho `implement` (C1) - TDD core
- [ ] Viết SKILL.md cho `review-code` (C2)

### Phase 2: Testing & Quality
- [ ] Viết SKILL.md cho `test-e2e` (D1)
- [ ] Viết SKILL.md cho `test-integration` (D2)
- [ ] Viết SKILL.md cho `check-quality` (D3)
- [ ] Copy `playwright-cli` references từ Xipat (E1)

### Phase 3: Reference & Docs
- [ ] Viết SKILL.md cho `docs-api` (C3)
- [ ] Copy `swagger-ref` từ Xipat (E3)
- [ ] Gộp `ui-shopify` từ Xipat shopify-design-guideline + ui-ux-pro-max (E2)
- [ ] Viết SKILL.md cho `notify` (E5)

### Phase 4: Orchestrators (viết cuối cùng vì phụ thuộc tất cả skills khác)
- [ ] Viết SKILL.md cho `task-flow` (A1)
- [ ] Viết SKILL.md cho `hotfix-flow` (A2)
- [ ] Viết SKILL.md cho `explore-task` (B1)
- [ ] Viết `CLAUDE.md` project-level instructions
- [ ] Test full workflow

---

## 12. Lưu ý khi triển khai

1. **Mỗi skill phải chạy được độc lập** - Không bắt buộc phải chạy qua orchestrator
2. **User confirm ở mỗi bước quan trọng** - implement, review, commit
3. **Scope-aware** - Skill tự detect đang ở backend/, frontend/, hay storefront/ để điều chỉnh behavior
4. **Shopify-specific** - ui-shopify phải cover Polaris components, App Bridge, theme extension patterns
5. **File-based communication** - Giữ cơ chế `docs/{FEATURE_FLAG}/` nhưng skill phải handle case thư mục trống gracefully
6. **Không hardcode app name** - Đọc từ resources.md, mỗi project config riêng
