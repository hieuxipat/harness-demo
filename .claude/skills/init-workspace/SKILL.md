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

Hỏi user lần lượt (dùng AskUserQuestion cho từng câu):

1. **Workspace name** — Tên workspace (vd: `ordertracking-workspace`)
   - Validate: lowercase, numbers, hyphens only. Regex: `^[a-z0-9][a-z0-9-]*[a-z0-9]$`
   - Nếu không hợp lệ → báo lỗi, hỏi lại

2. **GitLab remote URL** — URL remote cho workspace
   - Vd: `git@gitlab.com:megamind/ordertracking-workspace.git`

3. **App name** — Tên app hiển thị (vd: `Order Tracking`)
   - Sẽ được ghi vào `resources.md` → field `APP_NAME`

4. **Subprojects** — Danh sách các dự án con cần clone vào workspace
   - Hỏi: "Liệt kê các dự án con bạn muốn kéo vào workspace (tên thư mục + git URL). Nhập từng cái, gõ 'done' khi xong."
   - Mỗi dự án con cần:
     - **Tên thư mục** (vd: `backend`, `frontend`, `storefront`, hoặc tên tuỳ ý)
     - **Git URL** (vd: `git@gitlab.com:megamind/ordertracking-backend.git`)
   - Có thể 0 hoặc nhiều dự án con
   - Ví dụ input:
     ```
     backend  → git@gitlab.com:megamind/ordertracking-backend.git
     frontend → git@gitlab.com:megamind/ordertracking-frontend.git
     done
     ```

### Bước 2: Xác nhận

Hiển thị summary cho user confirm trước khi thực hiện:

```
Summary:
  Workspace:  ordertracking-workspace
  Remote:     git@gitlab.com:megamind/ordertracking-workspace.git
  App name:   Order Tracking
  Subprojects:
    - backend/   ← git@gitlab.com:megamind/ordertracking-backend.git
    - frontend/  ← git@gitlab.com:megamind/ordertracking-frontend.git

Proceed? [Y/n]
```

### Bước 3: Thực hiện

Sau khi user confirm, thực hiện các bước sau **theo thứ tự**:

#### 3.1 Xoá git history cũ của boilerplate

```bash
rm -rf .git
```

#### 3.2 Cập nhật .gitignore

Thêm các thư mục subproject vào `.gitignore`:

```
# Subprojects (managed by their own git repos)
backend/
frontend/
```

Mỗi subproject thêm 1 dòng `{folder_name}/`.

#### 3.3 Cập nhật resources.md

Set `APP_NAME` trong `resources.md`:

```
APP_NAME="Order Tracking"
```

#### 3.4 Cập nhật CLAUDE.md

Thêm section **Subprojects** vào cuối CLAUDE.md để Claude Code biết cấu trúc workspace:

```markdown
## Subprojects

Workspace này chứa các dự án con (mỗi cái có git repo riêng):

| Thư mục | Repo |
|---------|------|
| `backend/` | git@gitlab.com:megamind/ordertracking-backend.git |
| `frontend/` | git@gitlab.com:megamind/ordertracking-frontend.git |

> Các thư mục subproject được ignore bởi workspace git. Để commit code trong subproject, `cd` vào thư mục đó.
```

#### 3.5 Init git mới cho workspace

```bash
git init
git add -A
git commit -m "Initial commit from megamind-ai-boilerplate

Workspace: {WORKSPACE_NAME}
Subprojects: {list of subproject names}"
```

#### 3.6 Set remote và push

```bash
git remote add origin {REMOTE_URL}
git branch -M main
git push -u origin main
```

#### 3.7 Clone các subprojects

Clone từng subproject vào workspace:

```bash
git clone {subproject_git_url} {folder_name}
```

Nếu clone fail → báo warning nhưng **không dừng** flow. User có thể clone lại sau.

#### 3.8 Rename thư mục workspace

Nếu tên thư mục hiện tại khác workspace name:

```bash
# Thực hiện từ parent directory
cd ..
mv {current_dir_name} {workspace_name}
cd {workspace_name}
```

> **Lưu ý:** Bước này thực hiện **sau cùng** vì rename directory sẽ thay đổi working directory.
> Nếu thư mục đích đã tồn tại → báo lỗi, skip rename.

### Bước 4: Xoá skill init-workspace

Sau khi hoàn tất, xoá thư mục `.claude/skills/init-workspace/` vì không còn cần thiết:

```bash
rm -rf .claude/skills/init-workspace
```

Commit thay đổi này:

```bash
git add -A
git commit -m "Remove init-workspace skill (one-time setup completed)"
git push
```

### Bước 5: Hiển thị kết quả

```
✅ Workspace initialized!

  Directory:    /path/to/ordertracking-workspace
  Remote:       git@gitlab.com:megamind/ordertracking-workspace.git
  Branch:       main
  Subprojects:
    ✅ backend/   — cloned
    ✅ frontend/  — cloned

  Next steps:
    1. Config resources.md with remaining fields (TASK_LIST_URL, LARK_NOTIFY_URL, etc.)
    2. Start using skills: /task-flow, /explore-codebase, etc.
```

## Lưu ý

- Skill này chỉ chạy **1 lần**. Sau khi hoàn tất, skill tự xoá.
- Nếu `.git` directory không tồn tại (đã bị xoá trước đó) → skip bước 3.1
- Nếu user không có subproject nào → skip bước 3.7, `.gitignore` không thêm gì
- Luôn confirm trước khi thực hiện destructive actions (xoá .git, push)
- Nếu push fail (repo chưa tạo trên GitLab) → báo user tạo repo trước rồi chạy `git push -u origin main` manually
