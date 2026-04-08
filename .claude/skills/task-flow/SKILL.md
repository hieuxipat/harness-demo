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

## Error Recovery & Resume

### Checkpoint tracking

Registry là checkpoint tự nhiên. Khi fail ở bất kỳ step nào, tiến độ đã được ghi:
- `manifest.yaml` → biết stories nào đã done, đang implementing
- `registry.yaml` → biết stories_done, tests_total
- User story files → biết story nào đã `done`, đang `implementing`, còn `approved`

### Resume sau khi fail

Khi user gọi lại `/task-flow` cho cùng feature:

1. **Đọc manifest.yaml** — kiểm tra `feature.status`:
   - `draft` → chưa bắt đầu, chạy từ Step [2]
   - `approved` → đã break-task, chưa implement → chạy từ Step [3]
   - `in-progress` → đang implement → tìm story đầu tiên chưa `done`, resume loop [4-6]
   - `review` → implement xong, đang test → resume từ Step [7] hoặc [8]
   - `done` → đã hoàn thành, hỏi user muốn làm gì tiếp

2. **Thông báo user**:
   > "Feature `{FEATURE_FLAG}` đang ở trạng thái `{status}`.
   > Tiến độ: {stories_done}/{stories_total} stories done.
   > Bạn muốn tiếp tục từ bước hiện tại, hay chạy lại từ đầu?"

3. **Nếu tiếp tục** → skip các step đã hoàn thành, bắt đầu từ step phù hợp

### Khi 1 story fail giữa loop

Nếu `/implement` hoặc `/review-code` fail cho 1 story:

1. Story đang implement giữ status `implementing` (chưa chuyển `done`)
2. Hỏi user:
   > "Story US-xxx gặp lỗi. Bạn muốn:
   > 1. Retry story này
   > 2. Skip story này, tiếp tục stories còn lại
   > 3. Dừng workflow, xử lý manual"
3. Nếu skip → ghi note vào `manifest.yaml` history: "US-xxx skipped — {lý do}"
4. Workflow tiếp tục với stories còn lại

### Chuyển từ hotfix-flow sang task-flow

Nếu `/hotfix-flow` phát hiện scope lớn:

1. Hotfix-flow **giữ nguyên code đã viết** (không revert)
2. Tạo feature registry mới cho hotfix: `docs/features/{HOTFIX_FLAG}/`
3. Chuyển sang `/task-flow` với `feature.status: in-progress` (skip step [1], [2])
4. Task-flow đọc manifest → thấy đã có code → resume từ Step [5] (review)

## Nguyên tắc

- Mỗi bước phải hoàn thành và được user confirm trước khi sang bước tiếp
- Nếu bất kỳ bước nào fail → dừng, hỏi user cách xử lý (retry/skip/stop)
- User có quyền skip bất kỳ bước nào nếu họ yêu cầu — nhưng luôn hỏi xác nhận
- Không bao giờ tự ý bypass quality gate
- **Registry phải luôn up-to-date** — mỗi skill tự cập nhật phần mình khi hoàn thành
- **Resume-friendly** — đọc registry trước khi bắt đầu, skip steps đã hoàn thành
