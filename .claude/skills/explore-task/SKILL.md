---
name: explore-task
description: >
  Tìm và lấy danh sách task cần làm từ task board (Notion/Linear).
  Dùng khi user muốn xem task nào cần làm, tìm task, hoặc nói
  "task nào cần làm", "list task", "xem task board", "tìm task".
  Sử dụng Playwright CLI để truy cập task board.
---

# Explore Task

Truy cập task board để lấy danh sách task cần làm. Dùng Playwright CLI vì task board là Notion/Linear page, cần render browser để đọc nội dung.

## Trigger

```
/explore-task
```

## Config

Lấy từ `resources.md`:
- **TASK_LIST_URL** — URL của task board

## Quy trình

### Step 1: Truy cập task board

Dùng Playwright CLI mở task board (tham khảo `/playwright-cli`):

```bash
playwright-cli open {TASK_LIST_URL} --profile=chrome-profile
playwright-cli snapshot
```

### Step 2: Lấy danh sách task

- **Nếu user chỉ định task cụ thể** (tên task hoặc user story ID) → tìm và lấy task đó
- **Nếu không chỉ định** ��� lấy tất cả task có trạng thái khác DONE

Thông tin cần lấy cho mỗi task:
- Title
- Description
- Assignee
- Status
- Feature flag (nếu có)

### Step 3: Tổng hợp và confirm

Tạo danh sách dạng markdown với các task tìm được:

```markdown
## Tasks from Board

| # | Title | Status | Assignee | Feature Flag |
|---|-------|--------|----------|-------------|
| 1 | ... | In Progress | ... | ... |
| 2 | ... | Todo | ... | ... |
```

Trình bày cho user và hỏi: "Bạn muốn làm task nào?"

Đóng browser sau khi lấy xong data:
```bash
playwright-cli close
```

## Lưu ý

- TASK_LIST_URL phải có trong `resources.md`, nếu trống → hỏi user URL
- Dùng persistent profile (`chrome-profile/`) để giữ session login
- Nếu board cần login → dùng `playwright-cli state-save` sau lần login đầu
