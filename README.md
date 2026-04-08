# Megamind AI Boilerplate

**AI-powered development workflow** cho division Megamind. Boilerplate cung cấp 16 Claude Code skills giúp dev tự động hoá quy trình làm task: từ phân tích task, chia nhỏ user stories, implement theo TDD, review code, test, đến thông báo team qua Lark.

## Boilerplate này làm gì?

Khi bạn clone boilerplate này vào project, bạn sẽ có một **bộ công cụ AI** (Claude Code skills) giúp:

1. **Lấy task từ board** mà không cần mở trình duyệt
2. **Tự động chia task** thành các user stories vừa đủ nhỏ để implement
3. **Implement theo TDD** (viết test trước, code sau)
4. **Review code** bằng agent độc lập (khách quan)
5. **Chạy test** (unit, integration, E2E trên browser)
6. **Kiểm tra quality** (SonarQube + coverage)
7. **Thông báo team** qua Lark khi xong

Tất cả được điều phối bởi **workflow orchestrator** — bạn chỉ cần gọi 1 lệnh, AI sẽ chạy từng bước theo thứ tự.

---

## Cấu trúc thư mục

```
megamind-{app-name}/
├── .claude/skills/           # 16 skills (não bộ của workflow)
├── backend/                  # NestJS app
├── frontend/                 # React admin app (Shopify embedded)
├── storefront/               # Theme extension / storefront widget
├── docs/
│   ├── registry.yaml         # Master index — tất cả features
│   ├── features/             # Feature Registry
│   │   └── {FEATURE_FLAG}/
│   │       ├── manifest.yaml         # Metadata: owner, status, version
│   │       ├── user-stories/         # US-001.md, US-002.md,...
│   │       ├── test-cases/           # TC-001.md + coverage-matrix.md
│   │       └── decisions/            # ADR-001.md
│   ├── templates/            # Templates chuẩn cho PO/Tester/Dev
│   └── app-discovery/        # Thông tin app
├── e2e-tests/
│   ├── admin/                # E2E cho frontend (Shopify admin)
│   ├── storefront/           # E2E cho storefront
│   └── fixtures/             # Shared test data
├── chrome-profile/           # Browser profile cho Playwright (đăng nhập 1 lần, dùng lại)
├── resources.md              # *** Config bắt buộc ***
├── larkbot.md                # Hướng dẫn format Lark message
├── CLAUDE.md                 # Hướng dẫn cho Claude Code
├── WORKFLOW-BLUEPRINT.md     # Tài liệu thiết kế chi tiết
└── .gitlab-ci.yml            # CI/CD pipeline
```

---

## Bắt đầu nhanh

### Bước 1: Clone boilerplate

```bash
git clone <boilerplate-repo-url> my-workspace-name
cd my-workspace-name
```

### Bước 2: Mở Claude Code và chạy `/init-workspace`

```bash
claude
```

Trong Claude Code, gõ:

```
/init-workspace
```

Skill sẽ hỏi bạn:
1. **Workspace name** — vd: `ordertracking-workspace`
2. **GitLab remote URL** — vd: `git@gitlab.com:megamind/ordertracking-workspace.git`
3. **App name** — vd: `Order Tracking`
4. **Subprojects** — các dự án con cần kéo vào workspace:
   ```
   backend  → git@gitlab.com:megamind/ordertracking-backend.git
   frontend → git@gitlab.com:megamind/ordertracking-frontend.git
   done
   ```

Skill sẽ tự động:
- Xoá git history cũ của boilerplate
- Cấu hình `.gitignore` để ignore các subproject
- Init git mới và push lên remote của team
- Clone các subproject vào workspace
- Đổi tên thư mục theo workspace name
- Tự xoá skill (chỉ cần chạy 1 lần)

**Kết quả:**

```
ordertracking-workspace/          ← workspace git (skills, docs, config)
├── .claude/skills/               ← 16 skills
├── docs/
├── e2e-tests/
├── resources.md
├── CLAUDE.md
├── backend/                      ← git repo riêng
├── frontend/                     ← git repo riêng
└── .gitignore                    ← ignore backend/, frontend/
```

### Bước 3: Config `resources.md`

Mở file `resources.md` và điền thêm các thông tin còn lại:

```
TASK_LIST_URL=https://...           # URL task board (Notion/Linear)
LARK_NOTIFY_URL=https://...         # Lark Bot webhook
APP_URL=https://...                 # URL app để test
SONARQUBE_TOKEN=xxx                 # SonarQube auth token
SONARQUBE_KEY=xxx                   # SonarQube project key
FIGMA_URL=https://...               # Figma design (nếu có)
```

> **Lưu ý:** `APP_NAME` đã được set bởi `/init-workspace`. Các field khác tuỳ chọn — nhưng skill liên quan sẽ không hoạt động nếu thiếu config tương ứng.

### Bước 4: Dùng Claude Code

Mở terminal trong project, chạy Claude Code và bắt đầu dùng các skill.

---

## Cách sử dụng

### Cách 1: Workflow tự động (khuyên dùng)

Dùng orchestrator để chạy toàn bộ quy trình:

```bash
# Feature mới — chọn scope phù hợp
/task-flow --scope fullstack      # Cả BE + FE + Storefront
/task-flow --scope backend        # Chỉ backend
/task-flow --scope frontend       # Chỉ frontend
/task-flow --scope storefront     # Chỉ storefront

# Fix bug gấp
/hotfix-flow
```

**`/task-flow` sẽ làm gì?**

```
1. Hỏi bạn chọn scope (nếu chưa có)
2. /explore-task     → Lấy task từ board (tuỳ chọn)
3. /break-task       → Chia task thành user stories
4. /explore-codebase → Scan code conventions
5. Lặp cho mỗi user story:
   ├── /implement    → Viết test + code (TDD)
   ├── /review-code  → Agent review code
   └── /docs-api     → Thêm Swagger (nếu có BE)
6. /test-integration → Test API (nếu có BE)
7. /test-e2e         → Test trên browser (nếu có FE/Storefront)
8. /check-quality    → Unit test + SonarQube
9. Commit
10. /notify          → Thông báo team qua Lark
```

**`/hotfix-flow` sẽ làm gì?**

```
1. /explore-codebase → Tìm root cause
2. /implement        → Fix + viết test
3. /review-code      → Quick review
4. /check-quality    → Đảm bảo không break gì
5. Commit
6. /notify           → Thông báo URGENT qua Lark
```

### Cách 2: Chạy từng skill độc lập

Mỗi skill đều chạy được độc lập, không bắt buộc phải qua orchestrator:

```bash
# Phân tích & planning
/explore-task              # Xem task board
/break-task                # Chia task thành user stories
/explore-codebase          # Khám phá codebase conventions

# Implement
/implement                 # Implement 1 user story (TDD)
/review-code               # Review code hiện tại
/docs-api                  # Thêm Swagger decorators

# Testing
/test-e2e                  # Chạy E2E test trên browser
/test-integration          # Chạy integration test
/check-quality             # Unit test + SonarQube scan

# Thông báo
/notify                    # Gửi thông báo qua Lark
```

---

## Danh sách 16 Skills

### Orchestrators — Điều phối workflow

| Skill | Mục đích | Khi nào dùng |
|---|---|---|
| `/task-flow` | Workflow đầy đủ cho feature | Bắt đầu làm feature mới |
| `/hotfix-flow` | Workflow rút gọn cho hotfix | Fix bug gấp |

### Task Analysis — Phân tích task

| Skill | Mục đích | Khi nào dùng |
|---|---|---|
| `/explore-task` | Lấy task từ board (Notion/Linear) | Cần xem task nào cần làm |
| `/break-task` | Chia task thành user stories + đánh giá độ phức tạp | Nhận task mới, cần planning |
| `/explore-codebase` | Scan codebase: structure, patterns, conventions | Trước khi code hoặc onboard dự án |

### Implementation — Viết code

| Skill | Mục đích | Khi nào dùng |
|---|---|---|
| `/implement` | Implement theo TDD (Red → Green → Refactor) | Implement user story |
| `/review-code` | Code review bằng agent độc lập | Sau implement, trước commit |
| `/docs-api` | Thêm Swagger/OpenAPI decorators | Sau implement BE endpoints |

### Testing — Kiểm tra

| Skill | Mục đích | Khi nào dùng |
|---|---|---|
| `/test-e2e` | E2E test trên browser (Playwright) | Task có FE hoặc Storefront |
| `/test-integration` | Integration test (API → Service → DB) | Task có BE |
| `/check-quality` | Unit tests + SonarQube quality gate | Trước khi commit |

### Reference — Tài liệu tham khảo

| Skill | Mục đích | Dùng bởi |
|---|---|---|
| `/playwright-cli` | Hướng dẫn Playwright CLI | `explore-task`, `test-e2e` |
| `/ui-shopify` | Shopify Polaris + UI/UX design system | `implement`, `explore-codebase` |
| `/swagger-ref` | OpenAPI/Swagger reference | `docs-api` |
| `/larkbot-ref` | Lark message format | `notify` |
| `/notify` | Gửi notification qua Lark webhook | Bất kỳ skill nào cần thông báo |

---

## Cách break-task đánh giá độ phức tạp

Khi chạy `/break-task`, mỗi user story sẽ được đánh giá **Implementation Readiness Score**:

```
US-01: Merchant can enable cookie banner ✅ READY
  Scope: Backend (1 endpoint) + Frontend (1 component)
  Complexity: S (1-2 files/layer)
  → Implement được luôn

US-02: Banner hiển thị theo geo-location ⚠️ NEEDS BREAKDOWN
  Scope: Backend (GeoIP service + middleware) + Storefront (script injection)
  Complexity: L (5+ files, external service)
  → Cần chia nhỏ hơn:
    US-02a: Backend GeoIP service
    US-02b: Middleware filter by country
    US-02c: Storefront script injection
```

| Tiêu chí | ✅ READY | ⚠️ NEEDS BREAKDOWN |
|---|---|---|
| Số files thay đổi | ≤ 5 files/layer | > 5 files/layer |
| Số layers liên quan | 1-2 layers | 3+ layers phức tạp |
| External dependencies | Không hoặc có sẵn | Cần tích hợp service mới |
| Số test cases | ≤ 8 | > 8 |
| Demo độc lập được | Có | Không |

---

## Quy tắc quan trọng

- **TDD bắt buộc** — Không viết production code khi chưa có failing test
- **Quality gate bắt buộc** — Code không được commit nếu chưa pass quality check
- **User confirm** — Mỗi bước quan trọng (implement, review, commit) đều hỏi user trước khi thực hiện
- **Scope-aware** — Skill tự detect đang làm backend/, frontend/, hay storefront/ để điều chỉnh hành vi
- **Không hardcode** — Thông tin app đọc từ `resources.md`, không hardcode trong code

---

## Feature Registry System — Quản lý user stories, test cases, tiến độ

### Cấu trúc

```
docs/
├── registry.yaml                         # Master index — tất cả features
├── features/
│   └── {FEATURE_FLAG}/                   # Mỗi feature 1 folder
│       ├── manifest.yaml                 # Metadata: owner, status, version, timeline
│       ├── user-stories/
│       │   ├── US-001.md                 # User story với frontmatter chuẩn
│       │   ├── US-002.md
│       │   └── ...
│       ├── test-cases/
│       │   ├── TC-001.md                 # Test case liên kết với US
│       │   ├── coverage-matrix.md        # Mapping US → TC (traceability)
│       │   └── ...
│       └── decisions/
│           └── ADR-001.md                # Architecture Decision Records
├── templates/                            # Templates chuẩn
│   ├── user-story.template.md
│   ├── test-case.template.md
│   ├── manifest.template.yaml
│   ├── coverage-matrix.template.md
│   └── adr.template.md
└── app-discovery/
```

### Quy trình

1. Dev chạy `/break-task` → skill tạo feature folder, `manifest.yaml`, `US-xxx.md` files, `coverage-matrix.md`
2. PO review và bổ sung user stories (hoặc viết trước vào `docs/features/{FEATURE_FLAG}/user-stories/`)
3. Tester viết test cases vào `docs/features/{FEATURE_FLAG}/test-cases/`
4. Dev chạy `/implement` → skill đọc US, cập nhật status khi xong
5. Test skills (`/test-integration`, `/test-e2e`) → tạo `TC-xxx.md`, cập nhật coverage matrix
6. `/check-quality` → kiểm tra story coverage, cảnh báo nếu có story chưa có test
7. `/notify` → đọc registry gửi summary: "3/4 stories done, coverage 75%"

### manifest.yaml — Tim của mỗi feature

Mỗi feature có 1 file `manifest.yaml` chứa:
- **Metadata:** feature flag, name, version, status (draft → approved → in-progress → done)
- **Ownership:** PO, lead dev, developers + stories assigned, tester
- **Scope:** backend/frontend/storefront/fullstack
- **Dependencies:** features và services phụ thuộc
- **Timeline:** created, approved, target completion
- **History:** changelog của feature

### Coverage Matrix — Đảm bảo không sót test

Mapping rõ ràng giữa User Story → Acceptance Criteria → Test Cases:

```
| US    | AC   | Unit   | Integration | E2E    | Status  |
|-------|------|--------|-------------|--------|---------|
| US-001| AC-1 | TC-U01 | TC-001      | —      | Covered |
| US-002| AC-1 | —      | —           | —      | Missing |
```

### Quản lý nhiều dev trong team

- Mỗi dev được assign vào stories cụ thể trong `manifest.yaml`
- Story có `status` field: draft → approved → implementing → done
- Mỗi dev làm trên branch riêng: `feature/{FEATURE_FLAG}/US-xxx`
- Registry tự cập nhật tiến độ: stories_done, tests_pass, coverage

---

## Lark Notification

Skill `/notify` gửi thông báo qua Lark Bot webhook (config trong `resources.md`). Các loại thông báo:

- **Task hoàn thành** — Header xanh lá
- **Cần review** — Header xanh dương
- **Lỗi phát sinh** — Header đỏ
- **Hotfix urgent** — Header đỏ + flag URGENT

Xem chi tiết format trong `larkbot.md`.

---

## CI/CD

Pipeline GitLab CI (`.gitlab-ci.yml`) gồm 3 stages:

1. **validate** — Kiểm tra các file `template.json` hợp lệ (chạy trên branch `develop` và version tags)
2. **package** — Đóng gói templates thành tarball (chỉ chạy trên version tags `vX.Y.Z`)
3. **release** — Upload package + tạo GitLab Release (chỉ chạy trên version tags)

---

## Tài liệu tham khảo

- `WORKFLOW-BLUEPRINT.md` — Thiết kế chi tiết toàn bộ workflow, so sánh skills, dependency map
- `CLAUDE.md` — Hướng dẫn cho Claude Code (tự động đọc khi chạy)
- `larkbot.md` — Format và cách gửi Lark card message
- `resources.md` — Config project
