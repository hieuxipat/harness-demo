# Megamind AI Boilerplate

Boilerplate workspace cho các dự án trong division Megamind. Mỗi project clone boilerplate này và config riêng qua `resources.md`.

## Workspace Structure

```
{workspace-name}/
├── .claude/skills/           # Skills (xem bên dưới)
├── backend/                  # Subproject — git repo riêng (ignored by workspace git)
├── frontend/                 # Subproject — git repo riêng (ignored by workspace git)
├── storefront/               # Subproject — git repo riêng (ignored by workspace git)
├── docs/
│   ├── registry.yaml         # Master index — tất cả features
│   ├── features/             # Feature Registry (mỗi feature 1 folder)
│   │   └── {FEATURE_FLAG}/
│   │       ├── manifest.yaml         # Metadata: owner, status, version
│   │       ├── user-stories/         # US-001.md, US-002.md,...
│   │       ├── test-cases/           # TC-001.md + coverage-matrix.md
│   │       └── decisions/            # ADR-001.md (Architecture Decision Records)
│   ├── templates/            # Templates chuẩn cho PO/Tester/Dev
│   │   ├── user-story.template.md
│   │   ├── test-case.template.md
│   │   ├── manifest.template.yaml
│   │   ├── coverage-matrix.template.md
│   │   └── adr.template.md
│   └── app-discovery/        # Thông tin app
├── e2e-tests/                # Playwright E2E tests
│   ├── admin/                # Tests cho frontend
│   ├── storefront/           # Tests cho storefront
│   └── fixtures/             # Shared test data
├── chrome-profile/           # Persistent browser profile
├── resources.md              # Environment config (PHẢI config trước khi dùng)
├── larkbot.md                # Lark messaging reference
└── CLAUDE.md                 # File này``
```

## Config

Trước khi dùng bất kỳ skill nào, config `resources.md`:
- `APP_NAME` — tên app (bắt buộc)
- `TASK_LIST_URL` — URL task board
- `LARK_NOTIFY_URL` — Lark Bot webhook
- `APP_URL` — App URL để test
- `SONARQUBE_TOKEN` / `SONARQUBE_KEY` — SonarQube auth

## Skills (17 total)

### Setup
- `/init-workspace` — Khởi tạo workspace mới từ boilerplate (chạy 1 lần, tự xoá sau khi xong)

### Orchestrators
- `/task-flow` — Workflow chính cho feature (fullstack/backend/frontend/storefront)
- `/hotfix-flow` — Workflow rút gọn cho hotfix

### Task Analysis
- `/explore-task` — Lấy task từ board (Notion/Linear)
- `/break-task` — Phân tích & chia user stories với readiness score
- `/explore-codebase` — Khám phá codebase conventions

### Implementation
- `/implement` — TDD implementation (Red → Green → Refactor)
- `/review-code` — Code review bằng agent riêng
- `/docs-api` — Swagger/OpenAPI decorators cho NestJS

### Testing
- `/test-e2e` — E2E test trên browser (Playwright)
- `/test-integration` — Integration test (controller → service → DB)
- `/check-quality` — Unit tests + SonarQube quality gate

### Reference
- `/playwright-cli` — Playwright CLI guide
- `/ui-shopify` — Shopify Polaris + UI/UX design system
- `/swagger-ref` — OpenAPI/Swagger reference
- `/larkbot-ref` — Lark message format
- `/notify` — Gửi notification qua Larkbot

## Workflow Patterns

### Feature mới
```
/task-flow --scope fullstack|backend|frontend|storefront
```

### Hotfix gấp
```
/hotfix-flow
```

### Standalone (chạy skill đơn lẻ)
```
/explore-codebase
/implement
/review-code
/check-quality
```

## Feature Registry System

Hệ thống quản lý user stories, test cases, và tiến độ feature:

- `docs/registry.yaml` — master index tất cả features trong workspace
- `docs/features/{FEATURE_FLAG}/manifest.yaml` — metadata, ownership, timeline cho mỗi feature
- `docs/features/{FEATURE_FLAG}/user-stories/US-xxx.md` — user stories với frontmatter (id, status, assigned_to, priority, complexity)
- `docs/features/{FEATURE_FLAG}/test-cases/TC-xxx.md` — test cases liên kết với user stories
- `docs/features/{FEATURE_FLAG}/test-cases/coverage-matrix.md` — mapping US → TC (traceability)
- Templates tại `docs/templates/` — dùng khi tạo file mới

**Flow:** `/break-task` tạo registry → `/implement` cập nhật status → test skills tạo TC files → `/check-quality` kiểm tra coverage → `/notify` gửi summary

## Conventions

- **Mỗi skill chạy được độc lập** — không bắt buộc phải qua orchestrator
- **User confirm ở mỗi bước quan trọng** — implement, review, commit
- **Scope-aware** — Skill tự detect backend/, frontend/, storefront/
- **File-based communication** — User stories và test cases nằm trong `docs/features/{FEATURE_FLAG}/`
- **Registry luôn up-to-date** — Mỗi skill tự cập nhật registry khi hoàn thành
- **Traceability** — Test case phải liên kết với user story qua `covers` field
- **Không hardcode app name** — Đọc từ `resources.md`
- **TDD bắt buộc** — Không viết production code khi chưa có failing test
- **Quality gate bắt buộc** — Code không được commit nếu chưa pass quality gate
