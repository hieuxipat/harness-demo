---
name: task-flow
description: >
  Workflow orchestrator chính cho feature implementation từ đầu đến cuối.
  Dùng khi user muốn bắt đầu làm task mới, implement feature, hoặc nói
  "bắt đầu task", "làm task", "start task", "implement feature", "task flow".
  Gọi lần lượt các skill con theo đúng thứ tự tùy scope.
---

# Task Flow — Main Orchestrator

Workflow end-to-end cho việc implement một task. Mỗi bước gọi một skill chuyên biệt, đảm bảo quá trình implement có hệ thống từ phân tích → code → review → test → commit.

Lý do quan trọng: bỏ qua bất kỳ bước nào đều tạo rủi ro — bỏ break-task thì implement sai scope, bỏ TDD thì code không có test, bỏ quality gate thì bug lọt lên production.

## Trigger

```
/task-flow --scope (fullstack|backend|frontend|storefront)
```

## Step 0: Xác định scope

Hỏi user nếu chưa có `--scope`:
- **fullstack** — Backend + Frontend + Storefront
- **backend** — Backend only
- **frontend** — Frontend only
- **storefront** — Storefront only

## Feature Registry

Workflow sử dụng **Feature Registry System** để quản lý user stories, test cases, và tiến độ:
- `docs/registry.yaml` — master index tất cả features
- `docs/features/{FEATURE_FLAG}/manifest.yaml` — metadata cho mỗi feature
- `docs/features/{FEATURE_FLAG}/user-stories/US-xxx.md` — user stories
- `docs/features/{FEATURE_FLAG}/test-cases/TC-xxx.md` — test cases
- `docs/features/{FEATURE_FLAG}/test-cases/coverage-matrix.md` — mapping US → TC
- Templates: `docs/templates/`

Mọi skill trong workflow đều đọc/ghi vào registry. Đảm bảo registry luôn up-to-date ở mỗi bước.

## Các bước (thực hiện tuần tự)

### [1] Tìm task → `/explore-task` (tuỳ chọn)

Hỏi user: "Bạn đã có task description chưa, hay cần lấy từ board?"
- Nếu user đã có → bỏ qua
- Nếu cần lấy → gọi `/explore-task`

### [2] Chia nhỏ task → `/break-task`

Phân tích task thành user stories với Implementation Readiness Score.
- **Tạo feature registry:** `docs/features/{FEATURE_FLAG}/` với manifest.yaml, user stories, coverage matrix
- **Cập nhật registry.yaml:** thêm feature vào master index
- User confirm danh sách stories trước khi tiếp tục

### [3] Scan conventions → `/explore-codebase`

Scan conventions theo scope:
- `fullstack` → scan tất cả
- `backend` → `--path backend/`
- `frontend` → `--path frontend/`
- `storefront` → `--path storefront/`

### [4-6] Loop cho mỗi user story ✅ READY

Lặp theo thứ tự đã sắp xếp từ break-task:

#### [4] Implement → `/implement`
TDD cho story. Nếu scope fullstack: Backend → Frontend → Storefront.
- Đọc US-xxx.md để lấy acceptance criteria
- Cập nhật story status: `implementing` → `done`
- Cập nhật registry: `stories_done`

#### [5] Review → `/review-code`
Agent riêng review changes. Đối chiếu code với acceptance criteria trong US-xxx.md.
User chọn fix items.

#### [6] API Docs → `/docs-api` (nếu scope có backend)
Thêm Swagger decorators cho endpoints mới/thay đổi.

### [7] Integration test → `/test-integration` (nếu scope có backend)

Test BE APIs: controller → service → DB.
- Tạo TC-xxx.md files liên kết với user stories
- Cập nhật coverage-matrix.md

**SKIP nếu:** scope là frontend hoặc storefront only.

### [8] E2E test → `/test-e2e` (nếu scope có frontend hoặc storefront)

Test UI flow trên browser thật.
- Tạo TC-xxx.md files (type: e2e) liên kết với user stories
- Cập nhật coverage-matrix.md

**SKIP nếu:** scope là backend only.

### [9] Quality check → `/check-quality`

Unit tests + SonarQube scan + story coverage check. Phải pass trước khi commit.
- Cảnh báo nếu có story chưa có test case
- Cập nhật registry với test results

**SKIP nếu:** scope là storefront only (thường không có SonarQube).

### [10] Finalize & Notify

1. Cập nhật `manifest.yaml`: `feature.status: done`
2. Cập nhật `docs/registry.yaml`: `status: done`
3. Xác nhận với user trước khi commit
4. Tạo commit message rõ ràng (conventional commits)
5. Gọi `/notify` — đọc registry để gửi summary chính xác (stories done, test coverage)

## Workflow theo scope

### Fullstack: [1] → [2] → [3] → loop([4] [5] [6]) → [7] → [8] → [9] → [10]
### Backend:   [1] → [2] → [3] → loop([4] [5] [6]) → [7] → [9] → [10]
### Frontend:  [1] → [2] → [3] → loop([4] [5]) → [8] → [9] → [10]
### Storefront: [1] → [2] → [3] → loop([4] [5]) → [8] → [10]

## Nguyên tắc

- Mỗi bước phải hoàn thành và được user confirm trước khi sang bước tiếp
- Nếu bất kỳ bước nào fail, dừng lại và xử lý trước khi tiếp tục
- User có quyền skip bất kỳ bước nào nếu họ yêu cầu — nhưng luôn hỏi xác nhận
- Không bao giờ tự ý bypass quality gate
- **Registry phải luôn up-to-date** — mỗi skill tự cập nhật phần mình khi hoàn thành
