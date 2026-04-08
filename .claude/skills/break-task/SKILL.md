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

### Step 1: Khởi tạo Feature Registry

1. Tạo thư mục `docs/features/{FEATURE_FLAG}/` với cấu trúc:
   ```
   docs/features/{FEATURE_FLAG}/
   ├── manifest.yaml
   ├── user-stories/
   ├── test-cases/
   │   └── coverage-matrix.md
   └── decisions/
   ```

2. Tạo `manifest.yaml` từ template `docs/templates/manifest.template.yaml`:
   - Điền `feature.flag`, `feature.name`, `feature.status: draft`
   - Điền `ownership.po`, `scope` từ task description
   - Điền `timeline.created` = ngày hiện tại

3. Cập nhật `docs/registry.yaml` — thêm feature mới vào `features:`

### Step 2: Đối chiếu user stories

Đọc user stories từ PO trong `docs/features/{FEATURE_FLAG}/user-stories/`.

Nếu chưa có user stories → gửi notification qua Larkbot:
- Nội dung: "PO cần bổ sung user stories cho feature flag {FEATURE_FLAG} của app {APP_NAME}"
- LARK_NOTIFY_URL, APP_NAME lấy từ `resources.md`
- FEATURE_FLAG lấy từ field Feature flag của task
- Cách gửi message: xem file `larkbot.md`

### Step 3: Verify design (nếu có)

Nếu task có Figma design URL (từ `resources.md` hoặc task description):
- Xem chi tiết design
- Đối chiếu design với user stories
- Bổ sung các sub-task liên quan đến UI/UX từ design

### Step 4: Tạo user stories với Readiness Score

Mỗi user story cần:
- Viết theo góc nhìn người dùng
- Deliver được giá trị và test được độc lập
- Đánh giá Implementation Readiness Score

**Tạo file cho mỗi story** theo template `docs/templates/user-story.template.md`:
- Lưu tại `docs/features/{FEATURE_FLAG}/user-stories/US-001.md`, `US-002.md`,...
- Điền frontmatter: id, title, version, status (draft), priority, complexity
- Viết user story theo format: Là {ROLE}, tôi muốn {ACTION} để {BENEFIT}
- Liệt kê acceptance criteria cụ thể

**Format output (hiển thị cho user):**

```markdown
## User Stories for {FEATURE_FLAG}

### US-001: [Tên story] ✅ READY
- Scope: Backend (X endpoints) + Frontend (X components)
- Complexity: S (1-2 files mỗi layer)
- Dependencies: Không
- Verdict: **Implement được luôn**

### US-002: [Tên story] ⚠️ NEEDS BREAKDOWN
- Scope: Backend (service + middleware + API) + Storefront (script injection)
- Complexity: L (5+ files, external service)
- Dependencies: US-001 phải xong trước
- Verdict: **Cần chia nhỏ hơn**
  → US-002a: [Sub-story a]
  → US-002b: [Sub-story b]
  → US-002c: [Sub-story c]
```

### Tiêu chí đánh giá Readiness

| Criteria | ✅ READY | ⚠️ NEEDS BREAKDOWN |
|---|---|---|
| Số files thay đổi | ≤ 5 files/layer | > 5 files/layer |
| Số layers liên quan | 1-2 layers | 3 layers + phức tạp |
| External dependencies | Không hoặc đã có sẵn | Cần tích hợp service mới |
| Estimated test cases | ≤ 8 test cases | > 8 test cases |
| Có thể demo độc lập | Có | Không, phụ thuộc story khác |

### Step 5: Tự động chia tiếp stories NEEDS BREAKDOWN

Stories đánh dấu ⚠️ NEEDS BREAKDOWN → tự động chia thành sub-stories nhỏ hơn, mỗi sub-story phải đạt ✅ READY. Tạo file riêng cho mỗi sub-story (US-002a.md, US-002b.md,...).

### Step 6: Sắp xếp thứ tự implement

Sắp xếp theo:
1. **Dependencies** — story không phụ thuộc story khác lên trước
2. **Risk** — phần chưa rõ ràng, cần thêm thông tin, hoặc ảnh hưởng nhiều → lên trước
3. **Scope** — Backend trước (API cần có trước khi FE gọi)

### Step 7: Cập nhật manifest và coverage matrix

1. Cập nhật `manifest.yaml`:
   - `feature.status` → `approved` (sau khi user confirm)
   - `feature.version` increment nếu thay đổi stories
   - `ownership.developers` — assign dev vào stories (nếu biết)
   - `history` — thêm entry mới

2. Tạo `coverage-matrix.md` skeleton từ template `docs/templates/coverage-matrix.template.md`:
   - Liệt kê tất cả US + AC
   - Các cột test để trống (sẽ được fill bởi test skills)

3. Cập nhật `docs/registry.yaml`:
   - `stories_total`, `stories_done: 0`, `coverage: 0%`
   - `status: approved`

### Step 8: Feedback

Trình bày danh sách user stories cho user. Hỏi có muốn chỉnh sửa story nào không, chỉnh lại theo yêu cầu cho đến khi user hài lòng.

## Lưu ý

- Stories không chứa chi tiết về code — chỉ mô tả behavior từ góc nhìn người dùng
- Mỗi story phải có acceptance criteria rõ ràng
- Nếu task quá nhỏ (chỉ 1-2 stories, tất cả READY) → không cần chia thêm, xác nhận với user và tiếp tục
- Mọi story files phải nằm trong `docs/features/{FEATURE_FLAG}/user-stories/` (KHÔNG dùng `docs/{FEATURE_FLAG}/` cũ)
