---
name: init-workspace
description: >
  Khởi tạo workspace mới từ boilerplate cho workflow harness + codegraph: tạo folder workspace bên trong boilerplate,
  copy .claude/chrome-profile/docs/.mcp.json, clone subprojects bằng HTTPS (có SSH fallback nếu user nhập SSH URL),
  rồi PER-SUBPROJECT: set .git/info/exclude (overlay local không bẩn git team), codegraph init,
  seed harness.toml + .claude/rules/project-rules.md, thêm entry codegraph vào .mcp.json.
  Phân tích tech stack để generate CLAUDE.md workspace (mô tả harness loop), cấu hình remote GitLab, init git.
  Giữ nguyên git của boilerplate. Dùng khi user nói "init workspace", "setup project", "khởi tạo workspace", "init".
---

# Init Workspace

## Output language

CLAUDE.md workspace, README, mọi message hỏi user và summary đều viết bằng **tiếng Việt có dấu**. Giữ tiếng Anh các phần kỹ thuật: tên path, lệnh `git`/`bash`, slash command, header bảng `Folder | Repo | Stack | Claude setup`, tên framework/lib (Next.js, Express...), key trong package.json/composer.json. Section "Workflow rules that override defaults" copy nguyên văn từ boilerplate CLAUDE.md (giữ tiếng Anh) để khớp contract harness.

## Bối cảnh workflow (đọc trước khi thực thi)

Workspace dùng workflow **harness (plugin) + codegraph, chạy PER-SUBPROJECT**. init-workspace KHÔNG cài plugin (đó là user step: `/plugin install` + `/harness-setup`) — nó chỉ **wire sẵn** mỗi subproject: overlay local qua `.git/info/exclude`, `codegraph init`, seed `harness.toml` + `.claude/rules/project-rules.md`, thêm entry codegraph vào `.mcp.json`. Seed template lấy từ `$BOILERPLATE_DIR/templates/harness/`.

---

Tạo workspace mới **bên trong** thư mục megamind-ai-boilerplate. Boilerplate giữ nguyên git repo. Workspace mới có git repo riêng.

## Nguyên tắc chính

1. **Clone subprojects TRƯỚC khi commit workspace.** CLAUDE.md và initial commit phản ánh trạng thái thật (đã clone được những project nào, tech stack gì).
2. **Mặc định clone bằng HTTPS.** Nếu user nhập SSH URL → tự convert sang HTTPS trước khi clone. Nếu HTTPS fail → thử URL gốc (SSH) làm fallback. Chỉ log warning nếu cả hai đều fail.
3. **Luôn dùng absolute path trong Bash calls.** Không `cd` giữa các call (state không persist giữa các Bash tool call).
4. **Phân tích subproject để viết CLAUDE.md có giá trị.** Đọc `package.json`, `README.md`, detect framework. Không chỉ liệt kê bảng repo.
5. **Không tự tạo `CLAUDE.md` trong subproject.** Subproject có git repo riêng của team khác; chỉ phát hiện thiếu và gợi ý user.

## Cấu trúc sau khi init

```
megamind-ai-boilerplate/          ← giữ nguyên, git repo không bị thay đổi
  .git/                           ← git của boilerplate (KHÔNG XOÁ)
  .claude/
  templates/harness/              ← seed harness.toml + project-rules.md (nguồn để seed subproject)
  .gitignore                      ← thêm <workspace-name>/
  chrome-profile/
  docs/
  CLAUDE.md
  README.md
  <workspace-name>/              ← folder workspace MỚI
    .claude/                     ← copy từ boilerplate (đã xoá init-workspace skill)
    .gitignore                   ← generate mới (ignore .codegraph/, .claude/state/)
    chrome-profile/              ← copy từ boilerplate
    docs/                        ← copy từ boilerplate
    .mcp.json                    ← copy + thêm entry codegraph per-subproject
    CLAUDE.md                    ← generate mới, mô tả harness loop + subprojects
    README.md                    ← copy từ boilerplate
    .git/                        ← git repo riêng của workspace
    backend/                     ← subproject (git repo riêng team) + OVERLAY LOCAL:
      .git/info/exclude          ← += harness.toml, Plans.md, spec.md, .claude/state/, .codegraph/, evidence/
      harness.toml               ← seed (local, không commit vào repo team)
      .claude/rules/project-rules.md  ← seed domain rules
      .codegraph/                ← codegraph init (local)
    frontend/                    ← subproject — tương tự
```

## Trigger

```
/init-workspace
```

## Flow

### Bước 1: Thu thập thông tin

Hỏi user từng câu một. Nếu user trả lời trống hoặc "skip" cho câu tuỳ chọn → bỏ qua.

**Câu 1 (bắt buộc): Workspace name**

```
Tên workspace? (vd: ordertracking-workspace)
→ Chỉ cho phép: chữ thường, số, dấu gạch ngang
→ Folder sẽ được tạo tại: <boilerplate-dir>/<workspace-name>/
```

- Validate regex: `^[a-z0-9][a-z0-9-]*[a-z0-9]$` (nếu 1 ký tự: `^[a-z0-9]$`)
- Nếu không hợp lệ → giải thích, hỏi lại
- Nếu folder đã tồn tại → báo lỗi, hỏi chọn tên khác hoặc xác nhận ghi đè

**Câu 2 (bắt buộc): App name**

```
Tên app hiển thị? (vd: Order Tracking)
→ Sẽ được ghi vào CLAUDE.md của workspace
```

**Câu 3 (tuỳ chọn): GitLab remote URL cho workspace**

```
GitLab remote URL cho workspace? (vd: https://gitlab.com/megamind/ordertracking-workspace.git)
→ Nhập 'skip' hoặc Enter để bỏ qua (có thể thêm sau)
→ Khuyến nghị dùng HTTPS URL. Nếu nhập SSH URL, sẽ được dùng nguyên.
```

- Nếu user trả lời "skip", "không có", trống → `REMOTE_URL = none`
- **KHÔNG** hỏi lại, **KHÔNG** báo lỗi

**Câu 4 (tuỳ chọn): Subprojects**

```
Các dự án con muốn kéo vào workspace?
→ Format: "<folder-name> <git-url>" hoặc "<folder-name>: <git-url>" (1 project/dòng)
→ Khuyến nghị dùng HTTPS URL. Nếu nhập SSH URL, skill sẽ tự convert sang HTTPS để clone.
→ Nhập 'done' hoặc Enter để kết thúc
→ Nhập 'skip' nếu chưa có

Ví dụ:
  backend https://gitlab.com/megamind/ordertracking-backend.git
  frontend: https://gitlab.com/megamind/ordertracking-frontend.git
  done
```

**Parse rules:**
- **Split mỗi dòng tại khoảng trắng ĐẦU TIÊN** để tách `folder-token` và `url`. KHÔNG split trên `:` — vì URL SSH bản thân chứa `:` (vd `git@gitlab.com:org/repo.git`).
- Sau khi tách xong, **strip dấu `:` ở cuối folder-token** (cho phép cả `backend:` và `backend` làm folder-name).
- Nếu user paste nhiều dòng cùng lúc → parse tất cả, KHÔNG hỏi lại "are you done?". User có thể sửa ở Bước 2 (confirm).
- Nếu user trả lời "skip", "done", trống → danh sách rỗng.

**Ví dụ parse:**
- `backend: https://gitlab.com/org/repo.git` → folder `backend`, url `https://gitlab.com/org/repo.git` ✓
- `backend https://gitlab.com/org/repo.git` → folder `backend`, url `https://gitlab.com/org/repo.git` ✓
- `backend: git@gitlab.com:org/repo.git` → folder `backend`, url `git@gitlab.com:org/repo.git` ✓ (sẽ convert sang HTTPS ở bước clone)
- ❌ `split(":")` sai: tạo ra 3 phần `["backend", " git@gitlab.com", "org/repo.git"]`.

### Bước 2: Xác nhận

Hiển thị summary **CHỈ những gì user đã cung cấp**. Mục skip ghi rõ:

```
╔══════════════════════════════════════════════════════════════════╗
║                    Init Workspace Summary                        ║
╠══════════════════════════════════════════════════════════════════╣
  Workspace:    age-workspace
  Location:     /path/to/boilerplate/age-workspace/
  App name:     Age Verification
  Remote:       https://gitlab.com/megamind/age-workspace.git
                (hoặc: "— chưa có, sẽ thêm sau")
  Subprojects:  (clone bằng HTTPS — SSH URL nếu nhập sẽ tự convert)
    - backend/   ← https://gitlab.com/megamind/age-backend.git
    - frontend/  ← https://gitlab.com/megamind/age-frontend.git
                (hoặc: "— không có subproject")
╚══════════════════════════════════════════════════════════════════╝

Proceed? [Y/n]
```

Chờ user confirm. Nếu "no" → hỏi sửa gì, quay lại câu hỏi đó.

### Bước 3: Thực hiện

Sau khi user confirm, thực hiện theo đúng thứ tự dưới đây. Dùng absolute path cho tất cả Bash calls.

Biến dùng chung (hãy resolve trước):
- `$BOILERPLATE_DIR` = thư mục làm việc hiện tại (boilerplate root)
- `$WORKSPACE_DIR` = `$BOILERPLATE_DIR/$WORKSPACE_NAME`

#### 3.1 Tạo folder workspace

```bash
mkdir -p "$WORKSPACE_DIR"
```

#### 3.2 Copy scaffold từ boilerplate vào workspace

```bash
cp -r "$BOILERPLATE_DIR/.claude" "$WORKSPACE_DIR/.claude"
cp -r "$BOILERPLATE_DIR/chrome-profile" "$WORKSPACE_DIR/chrome-profile"
cp -r "$BOILERPLATE_DIR/docs" "$WORKSPACE_DIR/docs"
cp -r "$BOILERPLATE_DIR/templates" "$WORKSPACE_DIR/templates"
cp "$BOILERPLATE_DIR/README.md" "$WORKSPACE_DIR/README.md"
cp "$BOILERPLATE_DIR/.mcp.json" "$WORKSPACE_DIR/.mcp.json"
```

**KHÔNG copy:**
- `.git` (boilerplate git repo)
- `.gitignore` (sẽ generate riêng)
- `CLAUDE.md` (sẽ generate mới ở bước 3.6 sau khi biết kết quả clone)
- Folder workspace khác nếu tồn tại

**Lưu ý `.mcp.json`:** project-scoped MCP config của Claude Code. Copy sang workspace để mọi dự án con dùng chung MCP servers (`shopify-dev-mcp`). Entry **codegraph per-subproject** sẽ được **thêm vào ở bước 3.5** sau khi biết subproject nào clone thành công. Lần đầu mở Claude Code trong workspace, user cần approve các MCP server.

**Lưu ý `templates/`:** copy để nếu sau này thêm subproject mới (ngoài init) vẫn có seed `harness.toml` + `project-rules.md` dùng lại.

#### 3.3 Xoá skill init-workspace khỏi workspace

```bash
rm -rf "$WORKSPACE_DIR/.claude/skills/init-workspace"
```

Skill này chỉ dùng 1 lần. Giữ nguyên trong boilerplate.

#### 3.4 Generate .gitignore cho workspace

Ghi file `$WORKSPACE_DIR/.gitignore`:

```
# Secrets & credentials
resources.md

# Browser session data
chrome-profile/

# Subprojects (managed by their own git repos)
<folder-name>/   # chỉ thêm nếu có subprojects — 1 dòng mỗi folder
...

# Harness + codegraph artifacts (local overlay, không commit)
.claude/state/
.codegraph/
state.db

# Dependencies
node_modules/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# Build output
dist/
build/
.cache/

# Environment
.env
.env.*
```

#### 3.5 Clone subprojects (HTTPS-first, SSH fallback nếu user nhập SSH)

**Chỉ thực hiện nếu có subprojects.** Chạy song song nhiều subproject bằng multiple Bash calls trong 1 message.

Với mỗi subproject:

**Quan trọng — chặn hang:** luôn set `GIT_TERMINAL_PROMPT=0` để git không hỏi username/password tương tác (sẽ treo forever trong tool call). Và luôn dùng Bash với `timeout` ≤ 60000ms (60s) cho mỗi attempt, để host unreachable không làm cả flow hang 2 phút mỗi lần.

**Step 0 — Chuẩn hoá URL về HTTPS:**

- Nếu URL bắt đầu bằng `https://` → giữ nguyên. `HTTPS_URL = $SUBPROJECT_URL`. `SSH_URL = none`.
- Nếu URL bắt đầu bằng `git@` (SSH) → convert sang HTTPS:
  - `git@<host>:<path>.git` → `https://<host>/<path>.git`
  - Ví dụ: `git@gitlab.xipat.com:megaminds/megamind-age-verify-backend.git` → `https://gitlab.xipat.com/megaminds/megamind-age-verify-backend.git`
  - `HTTPS_URL = <converted>`. `SSH_URL = $SUBPROJECT_URL` (giữ làm fallback).
- Nếu URL không nhận dạng được → dùng nguyên gốc làm `HTTPS_URL`, `SSH_URL = none`.

**Step 1 — Thử HTTPS URL (mặc định):**

```bash
GIT_TERMINAL_PROMPT=0 git clone "$HTTPS_URL" "$WORKSPACE_DIR/$FOLDER_NAME" 2>&1
```
(Bash tool call: set `timeout: 60000`.)

**Step 2 — Nếu HTTPS fail (exit code ≠ 0) VÀ có `SSH_URL`, thử SSH fallback:**

```bash
GIT_TERMINAL_PROMPT=0 git clone "$SSH_URL" "$WORKSPACE_DIR/$FOLDER_NAME" 2>&1
```
(Bash tool call: set `timeout: 60000`.)

Thông báo user: `"HTTPS clone failed, thử SSH fallback (URL gốc)..."`

**Không skip SSH fallback** kể cả khi nhìn URL "có vẻ không tồn tại". Lý do cho skip phải là exit code thật từ HTTPS attempt, không phải suy đoán. Nếu user chỉ nhập HTTPS URL (không có SSH gốc) → bỏ qua step 2.

**Step 3 — Nếu cả hai đều fail (hoặc HTTPS fail mà không có SSH gốc):**

- Log warning, **KHÔNG dừng flow**, tiếp tục clone các subproject còn lại:
  ```
  ⚠️ Clone <folder>/ failed.
     HTTPS URL: <https-url>
     SSH URL: <ssh-url hoặc "— user không cung cấp">
     Có thể do: chưa kết nối VPN, không có quyền access, hoặc repo không tồn tại.
     Bạn có thể clone sau khi fix: cd <workspace-path> && git clone <url> <folder>
  ```
- Ghi nhận trạng thái `FAILED` cho subproject này để dùng ở bước 3.6.

**Ghi nhận kết quả:** với mỗi subproject, lưu:
- `folder_name`
- `url_used` (https hoặc ssh)
- `status` (success / failed)

#### 3.5b Wire harness + codegraph cho mỗi subproject clone THÀNH CÔNG

**Chỉ chạy cho subproject `status = success`.** Mục tiêu: overlay harness/codegraph LOCAL, KHÔNG làm bẩn git của team. Biến: `$SUB = $WORKSPACE_DIR/$FOLDER_NAME`.

**(a) Thêm overlay vào `.git/info/exclude`** (per-clone, không commit, không đụng `.gitignore` tracked của team):

```bash
cat >> "$SUB/.git/info/exclude" <<'EOF'

# --- harness + codegraph overlay (local-only, do init-workspace thêm) ---
harness.toml
Plans.md
spec.md
.claude/state/
.codegraph/
evidence/
EOF
```

> Nếu subproject **đã có** `.claude/` riêng của team → vẫn ghi `.claude/state/` vào exclude (chỉ exclude state, không exclude cả `.claude/`). Nếu chưa có `.claude/` → sẽ tạo ở bước (c).

**(b) `codegraph init` (+ index)** — tạo `.codegraph/` riêng cho subproject:

```bash
GIT_TERMINAL_PROMPT=0 npx -y @colbymchenry/codegraph@latest init --index "$SUB" 2>&1
```
(Bash tool call: `timeout: 120000`. Nếu fail/timeout → log warning, KHÔNG dừng flow; subproject vẫn dùng được, chỉ thiếu codegraph. Ghi `codegraph: skipped` cho subproject.)

**(c) Seed `harness.toml` + `.claude/rules/project-rules.md`** (từ `$BOILERPLATE_DIR/templates/harness/`):

```bash
# harness.toml — copy rồi thay placeholder tên subproject
cp "$BOILERPLATE_DIR/templates/harness/harness.toml" "$SUB/harness.toml"
sed -i '' "s/SUBPROJECT_NAME/$FOLDER_NAME/" "$SUB/harness.toml"   # macOS sed; Linux: sed -i "s/.../.../"
# project-rules.md
mkdir -p "$SUB/.claude/rules"
cp "$BOILERPLATE_DIR/templates/harness/project-rules.md" "$SUB/.claude/rules/project-rules.md"
```

> KHÔNG ghi đè nếu file đã tồn tại trong subproject (team có thể đã có). Kiểm tra trước; nếu có → log "đã tồn tại, skip seed", giữ file team.

**(d) Thêm entry codegraph vào `$WORKSPACE_DIR/.mcp.json`** — 1 entry/subproject, key `codegraph-<folder>`:

```jsonc
"codegraph-<folder>": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@colbymchenry/codegraph@latest", "serve", "--mcp", "--path", "<folder>"]
}
```

- `--path <folder>` là **relative path** tính từ workspace root (vd `backend`), để scope MCP server vào đúng `.codegraph/` của subproject đó (mặc định serve lấy `rootUri` từ client = workspace root → phải `--path`).
- Đọc `.mcp.json`, parse JSON, thêm key vào `mcpServers`, ghi lại (giữ nguyên `shopify-dev-mcp`). Chỉ thêm cho subproject có codegraph init thành công ở (b).

**Ghi nhận thêm cho mỗi subproject:** `codegraph` (ok/skipped), `harness_seeded` (yes/skip-existing).

#### 3.6 Phân tích subprojects và generate CLAUDE.md workspace

Với mỗi subproject **clone thành công**, đọc metadata:

1. **Tech stack detection** — đọc các file sau (nếu có):
   - `package.json` → name, description, dependencies (React, Next, Express, Vue, Nuxt, Shopify Polaris, Remix...)
   - **Shopify app detection:** nếu package.json chứa BẤT KỲ dependency nào trong: `@shopify/polaris`, `@shopify/shopify-api`, `@shopify/app-bridge-react`, `@shopify/shopify-app-remix` → đánh dấu `is_shopify_app = true` cho subproject đó. Nếu workspace có ≥ 1 subproject Shopify app → thêm section "Shopify domain conventions" vào CLAUDE.md workspace (template ở cuối skill này).
   - `composer.json` → PHP / Laravel
   - `requirements.txt` / `pyproject.toml` → Python / Django / FastAPI
   - `go.mod` → Go
   - `Gemfile` → Ruby / Rails
   - `pom.xml` / `build.gradle` → Java / Spring Boot
   - `README.md` → đọc 50 dòng đầu để lấy mô tả dự án

2. **Claude setup check** — kiểm tra trong subproject:
   - Có `CLAUDE.md` không?
   - Có `.claude/` không?
   - Ghi nhận: `has_claude_md`, `has_claude_dir`

3. **Generate CLAUDE.md workspace** — ghi file mới `$WORKSPACE_DIR/CLAUDE.md` với cấu trúc:

```markdown
# CLAUDE.md — <App name>

Workspace for <App name>. Guidance for Claude Code khi làm việc qua các subproject trong workspace này.

## Workflow: harness + codegraph (per-subproject)

Workspace dùng workflow **claude-code-harness (plugin) + codegraph**, chạy **PER-SUBPROJECT**. Trước mọi verb harness phải `cd <subproject>`.

**Cài 1 lần (USER step, cần restart Claude Code):**
```
/plugin marketplace add Chachamaru127/claude-code-harness
/plugin install claude-code-harness@claude-code-harness-marketplace
cd <subproject> && /harness-setup
```

**Loop trong từng subproject:**
- `/harness-plan` → spec.md + Plans.md (user duyệt)
- `/harness-work --no-commit` → TDD slice (LUÔN `--no-commit`)
- `/harness-review` → review độc lập, block major
- `/harness-sync` → đồng bộ spec/Plans/code
- `/harness-release` → đóng gói evidence, preflight

Domain rules per-subproject ở `.claude/rules/project-rules.md` (tiếng Việt, no-commit, task-sizing, codegraph-first, Shopify). codegraph query-first khi subproject có `.codegraph/`.

## Subprojects

<!-- chỉ generate nếu có subprojects -->

Workspace này gồm các dự án con, mỗi dự án có git repo riêng. Harness/codegraph là **overlay LOCAL** (đã thêm vào `.git/info/exclude`, không commit vào repo team):

| Folder | Repo | Stack | Harness wiring |
|--------|------|-------|----------------|
| `backend/` | https://gitlab.com/...backend.git | NestJS + TypeORM (detected) | ✅ codegraph + harness.toml + rules |
| `frontend/` | https://gitlab.com/...frontend.git | ReactJS + Polaris | ✅ codegraph + harness.toml + rules |
| `<folder>/` | — | ⚠️ Clone failed — chưa có data | — |

### Tổng quan từng subproject

#### `backend/` — <Detected name / App Backend>
<Từ README / package.json description: 2-3 câu mô tả>
- Tech stack: <framework chính + key libraries>
- Entry points: <nếu phát hiện được từ package.json scripts>

### Mối tương quan giữa các subprojects

<!-- Claude suy luận dựa trên stack detected -->
- `backend/` cung cấp API cho `frontend/`; cấu hình qua `.env`.
- Mỗi subproject deploy/release độc lập.

> **Lưu ý:** Phân tích ban đầu từ metadata. Xác nhận/cập nhật khi làm việc thực tế với code.

## Commit rules cho workspace

- Commit workspace (boilerplate scaffold) tách khỏi commit subproject.
- Commit subproject: `cd <subproject>/` rồi commit (git repo riêng). **KHÔNG commit overlay harness/codegraph** (đã ở `.git/info/exclude`).
- **No auto-commit:** luôn `/harness-work --no-commit`; user commit khi sẵn sàng.

<!-- Nếu có subproject detect là Shopify app (@shopify/polaris, @shopify/shopify-api, @shopify/app-bridge-react), THÊM block sau: -->

## Shopify domain conventions

Workspace có subproject Shopify app. Đọc `docs/shopify-conventions.md` trước khi `/harness-plan` hoặc `/harness-work` code đụng Shopify:
- UI dùng **Polaris React** (`@shopify/polaris`), KHÔNG web components `<s-*>`.
- Validate Admin GraphQL qua `shopify-dev-mcp`; tra Polaris API qua `context7`.
- App embedded trong Shopify Admin iframe. Bug UI → repro `playwright-cli --headed` trong Admin iframe + lưu `evidence/`.

<!-- Copy nguyên section "Workflow rules that override defaults" từ boilerplate CLAUDE.md -->
```

**Chi tiết thêm:**

- Subproject fail clone → bảng ghi `⚠️ Clone failed`, bỏ qua "Tổng quan" cho nó.
- Cột "Harness wiring": ghi rõ codegraph (✅/⚠️ skipped) + harness.toml/rules (✅ seeded / đã có sẵn của team).
- Không detect được stack → ghi `(Không rõ — kiểm tra README)`.
- Section "Mối tương quan" chỉ viết khi có ≥ 2 subprojects clone thành công.
- **Luôn copy section "Workflow rules that override defaults"** từ boilerplate CLAUDE.md để workspace giữ contract harness.

#### 3.7 Init git cho workspace

```bash
git init -b main "$WORKSPACE_DIR"
git -C "$WORKSPACE_DIR" add -A
git -C "$WORKSPACE_DIR" commit -m "Initial commit from megamind-ai-boilerplate

Workspace: $WORKSPACE_NAME
App: $APP_NAME"
```

**Lưu ý:** dùng `git -C <path>` thay vì `cd`, vì `cd` không persist giữa Bash calls.

#### 3.8 Set remote và push

**Chỉ thực hiện nếu REMOTE_URL != none.**

```bash
git -C "$WORKSPACE_DIR" remote add origin "$REMOTE_URL"
git -C "$WORKSPACE_DIR" push -u origin main
```

**Khuyến nghị:** dùng HTTPS URL cho remote. Nếu user nhập SSH URL, vẫn dùng nguyên (không tự convert ở bước này — remote là long-lived config, để user chủ động chọn).

- Nếu push fail (timeout, repo chưa tồn tại trên GitLab, auth fail, etc.):
  - Nếu URL là SSH → thử HTTPS fallback (convert SSH→HTTPS như ở bước 3.5) bằng cách đổi remote URL và push lại.
  - Nếu URL là HTTPS → thử lại 1 lần (có thể là transient). Không tự fallback sang SSH (SSH cần key setup).
  - Vẫn fail → log warning, KHÔNG dừng flow:
    ```
    ⚠️ Push failed (cả SSH và HTTPS).
    Bạn có thể push sau bằng: git -C <workspace-path> push -u origin main
    ```

- Nếu REMOTE_URL = none → skip hoàn toàn. Log:
  ```
  Skip remote — chưa có URL. Thêm sau bằng:
    git -C <workspace-path> remote add origin <url>
    git -C <workspace-path> push -u origin main
  ```

#### 3.9 Cập nhật .gitignore của boilerplate

Thêm workspace folder vào `.gitignore` của boilerplate (nếu chưa có):

- Đọc `$BOILERPLATE_DIR/.gitignore`
- Nếu đã có dòng `$WORKSPACE_NAME/` → skip
- Nếu chưa có → append:
  ```
  
  # Workspace
  <workspace-name>/
  ```

### Bước 4: Hiển thị kết quả

```
Workspace initialized!

  Location:     /path/to/boilerplate/age-workspace/
  App name:     Age Verification
  Remote:       https://gitlab.com/megamind/age-workspace.git (pushed)
                (hoặc: "— chưa cấu hình" / "⚠️ push failed")
  Branch:       main
  Subprojects:
    backend/    ✅ cloned (HTTPS) — NestJS — codegraph ✅ + harness seeded
    frontend/   ✅ cloned (SSH fallback) — ReactJS + Polaris — codegraph ✅ + harness seeded
                (hoặc: "⚠️ failed" / "codegraph ⚠️ skipped" / "— không có subproject")

  Boilerplate:  giữ nguyên tại /path/to/boilerplate/ (đã thêm vào .gitignore)

Next steps:
  1. Cài plugin harness (1 lần/máy, cần restart Claude Code):
       /plugin marketplace add Chachamaru127/claude-code-harness
       /plugin install claude-code-harness@claude-code-harness-marketplace
  2. cd <workspace-path>
  3. Tạo resources.md (TASK_LIST_URL, LARK_NOTIFY_URL, ...)
  4. Bật harness trong từng subproject:  cd <subproject> && /harness-setup
  5. Bắt đầu loop:  cd <subproject> && /harness-plan
  <!-- chỉ hiển thị nếu có clone failed -->
  6. Khi VPN ổn, clone lại các subproject failed (lệnh đã in ở trên), rồi chạy lại wiring 3.5b cho nó
  <!-- chỉ hiển thị nếu REMOTE_URL = none -->
  7. git remote add origin <url> && git push -u origin main
```

**Logic hiển thị next steps:**
- Luôn hiển thị step cài plugin + cd + resources.md + harness-setup + harness-plan
- Chỉ hiển thị step "re-clone failed subprojects" nếu có clone failed
- Chỉ hiển thị step push nếu chưa push
- Đánh số lại tuần tự, bỏ các step không áp dụng
- Nhắc rõ: **cài plugin + /harness-setup là USER step** — Claude session không tự cài plugin được.

## Xử lý lỗi

| Tình huống | Xử lý |
|-----------|-------|
| User trả lời "skip"/"không có"/trống cho câu tuỳ chọn | Ghi nhận skip, tiếp tục |
| Workspace name không hợp lệ | Giải thích regex, hỏi lại |
| Folder workspace đã tồn tại | Báo lỗi, hỏi chọn tên khác hoặc xác nhận ghi đè |
| Subproject input format sai | Parse nới lỏng (space / `:`), strip trailing `:`, thử lại |
| User nhập SSH URL cho subproject | Convert sang HTTPS trước khi clone, giữ SSH gốc làm fallback |
| HTTPS clone fail | Nếu user cung cấp SSH gốc → thử SSH fallback. Nếu chỉ có HTTPS → log warning |
| Cả HTTPS và SSH fail | Warning, tiếp tục clone project khác, gợi ý lệnh manual |
| Push fail | Thử HTTPS fallback (nếu URL là SSH), sau đó warning |
| User "no" ở confirm | Hỏi muốn sửa gì, quay lại câu hỏi đó |
| Copy file fail | Log warning, tiếp tục các file còn lại |
| `package.json` / `README.md` trong subproject không đọc được | Ghi "(Không rõ stack — kiểm tra README)" vào CLAUDE.md, tiếp tục |
| `codegraph init` fail/timeout (npx chậm, repo lớn) | Log warning, ghi `codegraph: skipped`, **KHÔNG dừng**. Subproject vẫn dùng được (thiếu codegraph), không thêm entry .mcp.json cho nó. |
| `harness.toml`/`project-rules.md` đã tồn tại trong subproject | Skip seed (giữ file team), log "đã có, skip". |
| `.git/info/exclude` không tồn tại | Tạo file (`mkdir -p "$SUB/.git/info"` rồi ghi). |

## Quy tắc quan trọng khi thực thi

- **Luôn dùng absolute path và `git -C <path>`** trong tool Bash. `cd` không persist giữa các tool call nên tránh hoàn toàn giữa các call riêng lẻ.
- **Chỉ chạy song song các clone** (không có dependency). Wiring 3.5b (exclude/codegraph/seed/.mcp.json) chạy SAU clone cho từng subproject success. Các bước copy / git init / commit / push phải tuần tự.
- **KHÔNG làm bẩn git của subproject team.** Mọi file overlay (harness.toml, Plans.md, spec.md, .claude/state/, .codegraph/, evidence/) phải vào `.git/info/exclude` của subproject TRƯỚC khi tạo, để `git status` subproject sạch. KHÔNG tạo CLAUDE.md tracked trong subproject.
- **Không cài plugin harness, không chạy `/harness-setup`.** Đó là USER step (cần restart Claude Code). init-workspace chỉ wire sẵn + in hướng dẫn.
- **Initial commit (workspace) phải sau khi clone + wire subproject xong**, để CLAUDE.md commit ban đầu phản ánh đúng trạng thái thật (codegraph/harness wiring status).
