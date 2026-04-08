---
name: init-workspace
description: >
  Khởi tạo workspace mới từ boilerplate: đặt tên workspace, cấu hình remote GitLab,
  clone các dự án con (backend, frontend, storefront) vào workspace, tự động cấu hình
  .gitignore để ignore các subproject. Chạy 1 lần duy nhất sau khi clone boilerplate.
  Dùng khi user nói "init workspace", "setup project", "khởi tạo workspace", "init".
---

# Init Workspace

Khởi tạo workspace mới từ megamind-ai-boilerplate. Chạy **1 lần duy nhất** sau khi clone boilerplate về.

## Trigger

```
/init-workspace
```

## Flow

### Bước 1: Thu thập thông tin

Hỏi user từng câu một. Mỗi câu hỏi ghi rõ bắt buộc hay tuỳ chọn. Nếu user trả lời trống hoặc "skip" cho câu tuỳ chọn → bỏ qua.

**Câu 1 (bắt buộc): Workspace name**

```
Tên workspace? (vd: ordertracking-workspace)
→ Chỉ cho phép: chữ thường, số, dấu gạch ngang
```

- Validate regex: `^[a-z0-9][a-z0-9-]*[a-z0-9]$`
- Nếu không hợp lệ → giải thích lỗi, hỏi lại
- Nếu chỉ 1 ký tự → regex `^[a-z0-9]$`

**Câu 2 (bắt buộc): App name**

```
Tên app hiển thị? (vd: Order Tracking)
→ Sẽ được ghi vào resources.md
```

**Câu 3 (tuỳ chọn): GitLab remote URL cho workspace**

```
GitLab remote URL cho workspace? (vd: git@gitlab.com:megamind/ordertracking-workspace.git)
→ Nhập 'skip' hoặc Enter để bỏ qua (có thể thêm sau)
```

- Nếu user trả lời "skip", "không có", "chưa có", trống, hoặc bất kỳ câu nào thể hiện chưa có → ghi nhận `REMOTE_URL = none`, skip push ở bước thực hiện
- **KHÔNG** hỏi lại, **KHÔNG** báo lỗi

**Câu 4 (tuỳ chọn): Subprojects**

```
Các dự án con muốn kéo vào workspace?
→ Nhập theo format: tên-thư-mục git-url (mỗi dòng 1 project)
→ Nhập 'done' hoặc Enter để kết thúc
→ Nhập 'skip' nếu chưa có

Ví dụ:
  backend git@gitlab.com:megamind/ordertracking-backend.git
  frontend git@gitlab.com:megamind/ordertracking-frontend.git
  done
```

- Nếu user trả lời "skip", "done", trống → ghi nhận danh sách rỗng
- Cho phép nhập nhiều lần cho đến khi user gõ "done"

### Bước 2: Xác nhận

Hiển thị summary **CHỈ những gì user đã cung cấp**. Mục nào skip thì ghi "(skip)":

```
╔══════════════════════════════════════╗
║         Init Workspace Summary       ║
╠══════════════════════════════════════╣
  Workspace:  ordertracking-workspace
  App name:   Order Tracking
  Remote:     git@gitlab.com:megamind/ordertracking-workspace.git
              (hoặc: "— chưa có, sẽ thêm sau")
  Subprojects:
    - backend/   ← git@gitlab.com:megamind/ordertracking-backend.git
    - frontend/  ← git@gitlab.com:megamind/ordertracking-frontend.git
              (hoặc: "— không có subproject")
╚══════════════════════════════════════╝

Proceed? [Y/n]
```

Chờ user confirm. Nếu user nói không → hỏi muốn sửa gì, quay lại câu hỏi tương ứng.

### Bước 3: Thực hiện

Sau khi user confirm, thực hiện **tuần tự** theo đúng thứ tự dưới đây. Mỗi bước log rõ đang làm gì.

#### 3.1 Xoá git history cũ

```bash
rm -rf .git
```

- Nếu `.git` không tồn tại → skip, log: "Không có .git cũ, skip."

#### 3.2 Cập nhật .gitignore

**Chỉ thực hiện nếu có subprojects.** Ghi vào `.gitignore`:

```
# Subprojects (managed by their own git repos)
backend/
frontend/
```

- Nếu `.gitignore` đã có nội dung → append thêm (không xoá nội dung cũ)
- Nếu không có subprojects → skip bước này

#### 3.3 Cập nhật resources.md

Thay `APP_NAME=""` thành `APP_NAME="{app_name}"` trong `resources.md`.

#### 3.4 Cập nhật CLAUDE.md

**Chỉ thực hiện nếu có subprojects.** Thêm section vào cuối CLAUDE.md:

```markdown

## Subprojects

Workspace này chứa các dự án con (mỗi cái có git repo riêng):

| Thư mục | Repo |
|---------|------|
| `backend/` | git@gitlab.com:megamind/ordertracking-backend.git |
| `frontend/` | git@gitlab.com:megamind/ordertracking-frontend.git |

> Các thư mục subproject được ignore bởi workspace git. Để commit code trong subproject, `cd` vào thư mục đó.
```

#### 3.5 Init git mới

```bash
git init
git add -A
git commit -m "Initial commit from megamind-ai-boilerplate

Workspace: {WORKSPACE_NAME}"
```

#### 3.6 Set remote và push

**Chỉ thực hiện nếu user cung cấp remote URL (REMOTE_URL != none).**

```bash
git remote add origin {REMOTE_URL}
git branch -M main
git push -u origin main
```

- Nếu push fail → **KHÔNG dừng flow**. Log warning:
  ```
  ⚠️ Push failed. Có thể repo chưa được tạo trên GitLab.
  Bạn có thể push sau bằng: git push -u origin main
  ```
- Nếu REMOTE_URL = none → skip hoàn toàn bước này. Log:
  ```
  Skip remote — chưa có URL. Thêm sau bằng:
    git remote add origin <url>
    git push -u origin main
  ```

#### 3.7 Clone subprojects

**Chỉ thực hiện nếu có subprojects.**

Clone từng subproject:

```bash
git clone {subproject_git_url} {folder_name}
```

- Nếu clone fail → log warning, **tiếp tục** clone các project còn lại:
  ```
  ⚠️ Clone backend/ failed. Bạn có thể clone sau:
    git clone git@gitlab.com:megamind/ordertracking-backend.git backend
  ```
- Nếu không có subprojects → skip bước này

#### 3.8 Rename thư mục workspace

Nếu tên thư mục hiện tại **khác** workspace name:

```bash
cd ..
mv {current_dir_name} {workspace_name}
cd {workspace_name}
```

- Nếu thư mục đích đã tồn tại → skip rename, log warning
- Nếu tên đã đúng → skip

### Bước 4: Xoá skill init-workspace

```bash
rm -rf .claude/skills/init-workspace
```

Nếu có remote và push thành công:

```bash
git add -A
git commit -m "Remove init-workspace skill (one-time setup completed)"
git push
```

Nếu không có remote:

```bash
git add -A
git commit -m "Remove init-workspace skill (one-time setup completed)"
```

### Bước 5: Hiển thị kết quả

Hiển thị kết quả với trạng thái từng bước:

```
Workspace initialized!

  Directory:    /path/to/ordertracking-workspace
  App name:     Order Tracking
  Remote:       git@gitlab.com:megamind/ordertracking-workspace.git (pushed)
                hoặc: "— chưa cấu hình"
  Branch:       main
  Subprojects:
    backend/    — cloned
    frontend/   — cloned
                hoặc: "— không có subproject"

Next steps:
  1. Config resources.md (TASK_LIST_URL, LARK_NOTIFY_URL, ...)
  2. (Nếu chưa push) git remote add origin <url> && git push -u origin main
  3. Start using skills: /task-flow, /explore-codebase, etc.
```

**Chỉ hiển thị "next steps" liên quan:**
- Nếu đã push → không hiển thị step push
- Nếu không có subprojects → không hiển thị subproject info

## Xử lý lỗi

| Tình huống | Xử lý |
|-----------|-------|
| User trả lời "skip"/"không có"/trống cho câu tuỳ chọn | Ghi nhận skip, tiếp tục câu tiếp |
| Workspace name không hợp lệ | Giải thích, hỏi lại |
| Remote URL không hợp lệ | Giải thích, hỏi lại hoặc cho skip |
| Push fail | Warning, tiếp tục flow, hướng dẫn push sau |
| Clone subproject fail | Warning, tiếp tục clone project khác |
| Thư mục rename conflict | Skip rename, log warning |
| `.git` không tồn tại | Skip xoá, tiếp tục |
| User nói "no" ở confirm | Hỏi muốn sửa gì, quay lại câu hỏi đó |
