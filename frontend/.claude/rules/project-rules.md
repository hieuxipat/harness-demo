# Project Rules (harness `.claude/rules/`)

> Template do `/init-workspace` copy vào `<subproject>/.claude/rules/project-rules.md`.
> Harness đọc `.claude/rules/` làm rule per-project (qua `/harness-setup localize`). Đây là nơi đặt
> MỌI domain rule — thay vai trò `constitution.md` (file đó KHÔNG được harness v4.12.3 đọc).
> Agent đọc file này trước khi `/harness-plan` và `/harness-work`.

## 1. Ngôn ngữ output

- Mọi message hỏi user, summary, plan rationale, review finding → **tiếng Việt có dấu**.
- Giữ tiếng Anh: tên path/lệnh, slash command, tên framework/lib, key config, code/test.
- (Skill body của harness viết tiếng Nhật — Claude đọc được; output cho user vẫn tiếng Việt.)

## 2. No auto-commit (BẮT BUỘC)

- **Luôn gọi `/harness-work` với `--no-commit`.** Harness mặc định auto-commit sau review — ta tắt.
- User tự commit khi sẵn sàng (`git commit` thủ công hoặc `/ship-it`).
- Commit trong **đúng subproject** (mỗi subproject là git repo riêng). Không commit chéo.
- Commit style: prefix lowercase ngắn (`feat:`, `fix:`, `chore:`...).

## 3. Routing theo độ lớn task

| Loại | Tiêu chí | Đường đi |
|---|---|---|
| **Trivial** | ≤ 2 file, KHÔNG đổi product behavior / API / data / permissions / billing (sửa text, config, bump dep, docs) | **Prompt thẳng**, bỏ ceremony spec/Plans/review. Hook PreToolUse/permission của harness vẫn chạy. |
| **Nhỏ** | 1 task, đổi behavior nhẹ | `/harness-work` Solo `--auto-mode --no-commit`. |
| **Vừa** | 2-3 task độc lập | `/harness-plan` → `/harness-work --parallel --no-commit`. Giữ gate duyệt plan. Auto-mode tắt. |
| **Lớn** | 4+ task / đổi product behavior/API/data/billing | Full loop: `/harness-plan` (spec bắt buộc) → breezing → `/harness-review` → `/harness-sync` → `/harness-release`. `--no-commit`, gate giữ. |

- **Auto-mode selective:** bật cho Trivial/Nhỏ (chạy tới xong, bớt hỏi permission); tắt cho Vừa/Lớn.
- Auto-mode ĐỘC LẬP với no-auto-commit: `--auto-mode` = bớt hỏi giữa chừng, vẫn `--no-commit`.

## 4. CodeGraph query-first

- Subproject có `.codegraph/` → **query codegraph trước** (`codegraph_search` / `codegraph_context` / `codegraph_trace` / `codegraph_callers` / `codegraph_callees` / `codegraph_impact` / `codegraph_node` / `codegraph_explore`) thay vì grep/đọc cả file.
- Chỉ dùng Read/Grep để **xác nhận chi tiết** sau khi codegraph đã định vị.
- Nguyên tắc: không bịa data chưa quan sát ("not_observed ≠ absent").

## 5. Shopify (nếu subproject là Shopify app)

Đọc **`docs/shopify-conventions.md`** (ở workspace root, từ subproject là `../docs/shopify-conventions.md`) làm constraint checklist chi tiết. Tóm tắt cứng:

- **UI: Polaris React** (`@shopify/polaris`, PascalCase). **KHÔNG** web components `<s-*>`. Tra API qua `context7` (`@shopify/polaris`).
- **Admin GraphQL:** validate qua `mcp__shopify-dev-mcp__validate_graphql_codeblocks` trước khi commit; search field qua `search_docs_chunks`. Đừng đoán field name — API bump quý.
- **Stack Division:** BE NestJS + TypeORM + MySQL; FE React + Polaris + App Bridge React. App embedded trong Shopify Admin iframe.
- `spec.md` phải ghi: API version, scopes, Polaris components, webhook topics, TypeORM migration.

## 6. Fix bug

- Trong task (chưa done) → fix ngay nếu in-scope.
- Sau done → `failure-reticketing` (`.claude/state/pending-fix-proposals.jsonl`), chỉ vào Plans.md sau khi user duyệt.
- CI đỏ → skill `ci`.
- Bug QA/PO báo (sau release) → triage: trivial thì fast-lane, đổi behavior thì `/harness-plan`.
- **Bug UI Shopify: BẮT BUỘC repro `playwright-cli --headed` trong Admin iframe + lưu `evidence/` TRƯỚC khi fix.**
- Cùng lỗi fail 3 lần → dừng + escalate kèm evidence.

## 7. Artifact per-subproject

- `spec.md` + `Plans.md` ở **root subproject** (harness projectRoot). `evidence/` cho screenshot/log verify.
- Các file harness/codegraph (`harness.toml`, `Plans.md`, `spec.md`, `.claude/state/`, `.codegraph/`, `evidence/`) là **overlay local** — đã được `/init-workspace` thêm vào `.git/info/exclude`, KHÔNG commit vào repo của team.
