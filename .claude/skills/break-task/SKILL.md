---
name: break-task
description: >
  Phân tích task thành user stories với Implementation Readiness Score.
  Dùng khi cần chia nhỏ task, lên plan implement, hoặc user nói
  "break task", "chia nhỏ task", "lên sub-task", "phân tích task này".
  Output: danh sách user stories có readiness score (READY / NEEDS BREAKDOWN).
---

# Break Task

Chia nhỏ task thành các user stories. Mục tiêu: mỗi story đủ nhỏ để implement và test được độc lập, sắp xếp theo thứ tự giảm rủi ro.

## Trigger

```
/break-task
```

Input: Task description hoặc output từ `/explore-task`

## Quy trình

### Step 1: Đối chiếu user stories

Đọc user stories trong `docs/{FEATURE_FLAG}/user-stories/` để hiểu scope của task.

Nếu chưa có user stories trong thư mục → gửi notification qua Larkbot:
- Nội dung: "PO cần bổ sung user stories cho feature flag {FEATURE_FLAG} của app {APP_NAME}"
- LARK_NOTIFY_URL, APP_NAME lấy từ `resources.md`
- FEATURE_FLAG lấy từ field Feature flag của task
- Cách gửi message: xem file `larkbot.md`

### Step 2: Verify design (nếu có)

Nếu task có Figma design URL (từ `resources.md` hoặc task description):
- Xem chi tiết design
- Đối chiếu design với user stories
- Bổ sung các sub-task liên quan đến UI/UX từ design

### Step 3: Tạo user stories với Readiness Score

Mỗi user story cần:
- Viết theo góc nhìn người dùng
- Deliver được giá trị và test được độc lập
- Đánh giá Implementation Readiness Score

**Format output:**

```markdown
## User Stories for {FEATURE_FLAG}

### US-01: [Tên story] ✅ READY
- Scope: Backend (X endpoints) + Frontend (X components)
- Complexity: S (1-2 files mỗi layer)
- Dependencies: Không
- Verdict: **Implement được luôn**

### US-02: [Tên story] ⚠️ NEEDS BREAKDOWN
- Scope: Backend (service + middleware + API) + Storefront (script injection)
- Complexity: L (5+ files, external service)
- Dependencies: US-01 phải xong trước
- Verdict: **Cần chia nhỏ hơn**
  → US-02a: [Sub-story a]
  → US-02b: [Sub-story b]
  → US-02c: [Sub-story c]
```

### Tiêu chí đánh giá Readiness

| Criteria | ✅ READY | ⚠️ NEEDS BREAKDOWN |
|---|---|---|
| Số files thay đổi | ≤ 5 files/layer | > 5 files/layer |
| Số layers liên quan | 1-2 layers | 3 layers + phức tạp |
| External dependencies | Không hoặc đã có sẵn | Cần tích hợp service mới |
| Estimated test cases | ≤ 8 test cases | > 8 test cases |
| Có thể demo độc lập | Có | Không, phụ thuộc story khác |

### Step 4: Tự động chia tiếp stories NEEDS BREAKDOWN

Stories đánh dấu ⚠️ NEEDS BREAKDOWN → tự động chia thành sub-stories nhỏ hơn, mỗi sub-story phải đạt ✅ READY.

### Step 5: Sắp xếp thứ tự implement

Sắp xếp theo:
1. **Dependencies** — story không phụ thuộc story khác lên trước
2. **Risk** — phần chưa rõ ràng, cần thêm thông tin, hoặc ảnh hưởng nhiều → lên trước
3. **Scope** — Backend trước (API cần có trước khi FE gọi)

### Step 6: Feedback

Trình bày danh sách user stories cho user. Hỏi có muốn chỉnh sửa story nào không, chỉnh lại theo yêu cầu cho đến khi user hài lòng.

## Lưu ý

- Stories không chứa chi tiết về code — chỉ mô tả behavior từ góc nhìn người dùng
- Mỗi story phải có acceptance criteria rõ ràng
- Nếu task quá nhỏ (chỉ 1-2 stories, tất cả READY) → không cần chia thêm, xác nhận với user và tiếp tục
