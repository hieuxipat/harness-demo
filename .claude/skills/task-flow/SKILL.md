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

## Các bước (thực hiện tuần tự)

### [1] Tìm task → `/explore-task` (tuỳ chọn)

Hỏi user: "Bạn đã có task description chưa, hay cần lấy từ board?"
- Nếu user đã có → bỏ qua
- Nếu cần lấy → gọi `/explore-task`

### [2] Chia nhỏ task → `/break-task`

Phân tích task thành user stories với Implementation Readiness Score. User confirm danh sách stories trước khi tiếp tục.

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

#### [5] Review → `/review-code`
Agent riêng review changes. User chọn fix items.

#### [6] API Docs → `/docs-api` (nếu scope có backend)
Thêm Swagger decorators cho endpoints mới/thay đổi.

### [7] Integration test → `/test-integration` (nếu scope có backend)

Test BE APIs: controller → service → DB.

**SKIP nếu:** scope là frontend hoặc storefront only.

### [8] E2E test → `/test-e2e` (nếu scope có frontend hoặc storefront)

Test UI flow trên browser thật.

**SKIP nếu:** scope là backend only.

### [9] Quality check → `/check-quality`

Unit tests + SonarQube scan. Phải pass trước khi commit.

**SKIP nếu:** scope là storefront only (thường không có SonarQube).

### [10] Commit & Notify

1. Xác nhận với user trước khi commit
2. Tạo commit message rõ ràng (conventional commits)
3. Gọi `/notify` để thông báo team qua Larkbot

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
