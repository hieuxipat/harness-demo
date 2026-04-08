---
name: explore-task
description: >
  Tìm và lấy danh sách task cần làm từ task board (Notion/Linear/Lark/Jira).
  Dùng khi user muốn xem task nào cần làm, tìm task, hoặc nói
  "task nào cần làm", "list task", "xem task board", "tìm task".
  Hỗ trợ filter theo status, deadline, priority. Lưu task thành file markdown.
---

# Explore Task

Truy cập task board để lấy danh sách task cần làm. Dùng Playwright CLI vì task board là web app, cần render browser để đọc nội dung.

## Trigger

```
/explore-task
```

## Config

Lấy từ `resources.md`:
- **TASK_LIST_URL** — URL của task board

Nếu TASK_LIST_URL trống → hỏi user URL và nhắc cập nhật `resources.md`.

## Quy trình

### Step 1: Filter selection

Hỏi user:

> Chọn filter:
> 1. **Task đang chờ** — status "pending" / "backlog" / "not started"
> 2. **Task sắp đến hạn** — status "to do" / "in progress", due trong 5 ngày tới
> 3. **Custom filter** — chỉ định field và value cụ thể
> 4. **Tất cả task chưa done** — mặc định

Nếu user chọn option 3, hỏi:
- Filter theo field nào? (Priority, Label, Sprint,...)
- Value mong muốn?

### Step 2: Truy cập task board

Dùng Playwright CLI (tham khảo `/playwright-cli`):

```bash
playwright-cli open {TASK_LIST_URL} --profile=chrome-profile --headed
playwright-cli snapshot
```

**Nếu cần login:**
> "Trang cần đăng nhập. Hãy đăng nhập trong browser window. Cho tôi biết khi xong."

Chờ user confirm → snapshot lại verify đã login.

### Step 3: Xác định logged-in account

Tìm thông tin account đang đăng nhập (profile name, avatar). **Luôn filter Assignee = account đang login** — chỉ lấy task của người đang dùng.

Field name variants cho Assignee: "Assignee", "Assigned to", "Owner", "Responsible", "Member"

### Step 4: Apply filters và thu thập data

**Field name variants** (tìm theo tên gần đúng vì mỗi platform đặt tên khác):

| Concept | Variants |
|---------|----------|
| Status | "Status", "State", "Stage", "Workflow" |
| Due date | "Due date", "Deadline", "End date", "Target date" |
| Priority | "Priority", "Urgency", "Importance" |

Thông tin cần lấy cho mỗi task:
- Task ID
- Title
- Description / Requirements
- Status
- Assignee
- Due date (nếu có)
- Priority (nếu có)
- Labels/Tags (nếu có)
- Feature flag (nếu có)
- Comments (nếu có)

### Step 5: Lưu kết quả

Tạo file markdown cho mỗi task tại `./tasks/{TASK-ID}.md`:

```markdown
# {Task Title}

- **ID**: {task-id}
- **Status**: {status}
- **Assignee**: {assignee}
- **Due date**: {due-date hoặc "N/A"}
- **Priority**: {priority hoặc "N/A"}
- **Labels/Tags**: {labels hoặc "N/A"}
- **Feature flag**: {feature-flag hoặc "N/A"}

## Description

{task description/requirements}

## Comments

{comments hoặc "No comments"}
```

Tạo thư mục `./tasks/` nếu chưa có.

### Step 6: Tổng hợp và confirm

Hiển thị bảng tóm tắt:

```markdown
## Tasks from Board

| # | ID | Title | Status | Due date | Priority |
|---|-----|-------|--------|----------|----------|
| 1 | TASK-123 | Example | In Progress | 2026-04-08 | High |
| 2 | TASK-456 | Another | Todo | 2026-04-10 | Medium |
```

Hỏi user:
> Bạn muốn làm task nào? Hoặc:
> - Xem chi tiết 1 task cụ thể
> - Chạy lại với filter khác
> - Bắt đầu implement task

### Step 7: Đóng browser

```bash
playwright-cli close
```

## Lưu ý

- Dùng persistent profile (`chrome-profile/`) để giữ session login
- Luôn filter by logged-in Assignee — chỉ lấy task của mình
- Nếu board cần login lần đầu → user login manual, session được lưu trong chrome-profile
- Task files lưu tại `./tasks/` — có thể dùng làm input cho `/break-task`
