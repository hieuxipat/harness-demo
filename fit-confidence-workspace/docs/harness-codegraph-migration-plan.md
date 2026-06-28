# Plan: Migrate boilerplate sang Harness (plugin) + CodeGraph

> **Trạng thái:** Phase B XONG (2026-05-26) — đã spike v4.12.3 + thực thi toàn bộ config/docs/cleanup. Còn Phase C (user cài plugin + smoke-test).
> **Branch:** `workflow-harness`
> **Tác giả:** Claude Code (theo yêu cầu của quangdn)

Tài liệu này là **plan thực thi**. Bản v2 viết lại sau khi clone & soi binary/skills/config của harness `v4.12.3` — bản v1 dựa trên giả định sai về cơ chế config.

---

## 0. Spike findings — vì sao v2 khác v1 (đọc trước)

Bản v1 giả định tùy biến harness qua `claude-code-harness.config.json` + `docs/constitution.md`. **Soi repo thật `v4.12.3` cho thấy cả hai đều sai:**

| v1 giả định | Thực tế v4.12.3 (bằng chứng) |
|---|---|
| `claude-code-harness.config.json` là config (auto_commit, paths.allowed_modify, i18n, git.*…) | **Vestigial.** `rg` không thấy file này được tham chiếu ở **bất kỳ đâu** trong `skills/` hay `go/`. Schema còn đó nhưng runtime không đọc. |
| Go binary đọc config đó | Binary đọc **`harness.toml`** ở `projectRoot` (`config.ParseFile`). Struct chỉ có `project / agent / env / safety / tdd`. KHÔNG có auto_commit/paths/i18n/constitution. |
| `constitution.md` được harness đọc làm quality-gate/DoD | **Không code/skill nào đọc `constitution`.** Customize per-project thật là **`.claude/rules/project-rules.md`** (qua `/harness-setup localize`) + **CLAUDE.md** + `Plans.md`/`spec.md`. |
| "Discipline nằm hết trong binary, no-auto-commit enforce bằng config" | Binary chỉ enforce **permissions / sandbox / protected-branch / TDD** (từ `harness.toml`). `/harness-work` **auto-commit mặc định** (step 11), suppress bằng flag `--no-commit`. → no-auto-commit là **policy mềm**, không phải hard gate. |

**Đã verify thêm (spike Phase A):**
- ✅ Binary `harness-darwin-arm64` chạy OK trên macOS arm64. Git-clone **không** dính `com.apple.quarantine` (chỉ `com.apple.provenance`) → Gatekeeper không chặn. `harness doctor` pass.
- ✅ Hooks resolve qua `CLAUDE_PLUGIN_ROOT`, fallback `~/.claude/plugins/cache/claude-code-harness-marketplace/...`.
- ✅ Install: `/plugin marketplace add Chachamaru127/claude-code-harness` → `/plugin install claude-code-harness@claude-code-harness-marketplace` → `/harness-setup`.
- ✅ codegraph scope per-subproject = `serve --mcp --path <subproject>` (mặc định lấy `rootUri` từ client nên PHẢI `--path`).
- ✅ Skill body harness viết **tiếng Nhật** (chỉ `description-en` là EN). Claude đọc được; output VN ép qua CLAUDE.md + rules.
- ✅ Plugin `strict: true` → skills về theo bundle (~37 skill), **không prune lẻ được** → chấp nhận noise, chỉ tài liệu hóa verb dùng.

→ **Quyết định mới:** cài harness như PLUGIN; tùy biến qua **`harness.toml` + `.claude/rules/project-rules.md` + `CLAUDE.md`** (KHÔNG `config.json`/`constitution.md`); chạy harness **per-subproject**.

---

## 1. Quyết định đã chốt (4 câu hỏi 2026-05-26)

| # | Quyết định | Chốt |
|---|---|---|
| 1 | **Topology** | **Per-subproject** — harness `projectRoot` = mỗi subproject (backend/frontend/storefront). Khớp model per-git-repo của harness. |
| 2 | **Hướng đi** | **Sửa plan trước (doc này) → bạn review → tôi làm config/docs/cleanup → bạn cài plugin + smoke-test.** |
| 3 | **Version** | **Pin `@v4.12.3`.** (Binary commit trong repo là 4.11.4; `harness sync` đồng bộ.) |
| 4 | **Atlassian** | **Giữ** atlassian + context7. |

**Giữ nguyên:** mô hình workspace (`init-workspace`), `playwright-cli` (`--headed --profile=chrome-profile`).

---

## 2. Cơ chế config thật của v4.12.3 (thay §4.2/§4.3 cũ)

Per-subproject, 4 bề mặt customize — không có file chết:

| Bề mặt | Ai đọc | Dùng cho |
|---|---|---|
| **`harness.toml`** (ở subproject root) | Go binary (hooks/guardrail) | permissions allow/deny/ask, sandbox denyRead (.env/secrets/keys), `protectedBranchPush`, `tdd.enforce`. Edit → `harness sync` regenerate `.claude-plugin/`. |
| **`.claude/rules/project-rules.md`** | Agent (đọc như context, qua `/harness-setup localize`) | **MỌI domain rule:** Shopify (Polaris React, validate GraphQL qua shopify-dev-mcp), **output tiếng Việt**, **no-auto-commit** (luôn `--no-commit`), codegraph query-first, ngưỡng task-sizing, rule repro bug UI Shopify. |
| **`CLAUDE.md`** (subproject) | Agent | harness loop + stack + trỏ tới rules. |
| **`Plans.md` + `spec.md`** (subproject root) | harness-plan/work/review | task ledger + product contract (source-of-truth). |

> ⚠️ `docs/shopify-conventions.md` cũ → nội dung chi tiết Polaris giữ làm file tham chiếu trong boilerplate; phần "luật" gom vào template `.claude/rules/project-rules.md`.

**No-auto-commit (policy mềm, đa lớp):**
1. `.claude/rules/project-rules.md`: "luôn gọi `/harness-work --no-commit`; user tự commit."
2. `harness.toml` `safety.permissions`: `protectedBranchPush = "ask"`; cân nhắc đẩy `Bash(git push:*)` vào `ask`.
3. CLAUDE.md nhắc lại.
→ Không phải hard gate; **verify hành vi thật ở smoke-test** (checkpoint §8 E2).

---

## 3. Topology per-subproject + nguyên tắc "không làm bẩn repo team khác"

Per-subproject sinh tension: harness ghi `harness.toml`, `Plans.md`, `spec.md`, `.claude/state/`, (có thể) `CLAUDE.md`, và codegraph ghi `.codegraph/` — **vào root của subproject** (repo của team khác). init-workspace hiện cấm làm bẩn subproject.

**Giải pháp đề xuất (open item §9.1):** overlay harness **LOCAL-only** — init-workspace ghi các artifact đó vào **`.git/info/exclude`** của từng subproject (per-clone, không commit, không đụng `.gitignore` tracked của team). Subproject git status sạch; harness vẫn có đủ projectRoot artifacts.

```
<workspace>/
  .claude/  docs/  CLAUDE.md  .mcp.json   ← workspace git (boilerplate scaffold)
  backend/        ← git repo team BE
    .git/info/exclude  += harness.toml, Plans.md, spec.md, .claude/state/, .codegraph/, evidence/
    harness.toml  Plans.md  spec.md  .claude/  .codegraph/   ← LOCAL overlay, không commit vào repo BE
  frontend/       ← tương tự
  storefront/     ← tương tự
```

**`spec.md`/`Plans.md` ở đâu (open item §9.2):** đề xuất **ở subproject root** (harness cần đúng `projectRoot`). Cross-subproject visibility: init-workspace có thể tạo `docs/features/<group>/<feature>/` trỏ (symlink/copy reference) — nhưng nguồn chính là subproject root.

---

## 4. Workflow mới — tổng quan

```
┌─ init-workspace (1 lần, ở workspace) ───────────────────────────┐
│ Clone subprojects → mỗi subproject:                             │
│   • git config local + .git/info/exclude (chống bẩn)            │
│   • codegraph init (+ index)                                    │
│ Ghi workspace: enabledPlugins(harness+atlassian+context7),      │
│   .mcp.json (codegraph per-subproject + shopify-dev-mcp),       │
│   CLAUDE.md (harness loop). In hướng dẫn chạy /harness-setup.   │
└──────────────────────────────────────────────────────────────────┘
        │  (user: cd <subproject> && /harness-setup  — per-subproject, 1 lần)
        ▼
┌── HARNESS LOOP (per-subproject, enforce bằng bin/harness) ───────┐
│  /harness-plan   → spec.md + Plans.md (user duyệt)               │
│        │   ▲ đọc .claude/rules/project-rules.md (Shopify, VN…)   │
│        ▼   │ query codegraph (--path subproject) thay grep        │
│  /harness-work [--no-commit] → TDD slice (Polaris React,         │
│        │        validate GraphQL qua shopify-dev-mcp)            │
│        ▼        PreToolUse/permission hook (harness.toml)         │
│  /harness-review → review độc lập, block major                  │
│  /harness-sync   → đồng bộ spec/Plans/code                       │
│  /harness-release→ đóng gói evidence, preflight                 │
└──────────────────────────────────────────────────────────────────┘
        │  playwright-cli (--headed + chrome-profile) verify UI thật trong Shopify Admin iframe
```

**Nguyên tắc nền:** `spec.md`/`Plans.md` source-of-truth; slice nhỏ có gate; codegraph query-first khi có `.codegraph/`; **no-auto-commit** (luôn `--no-commit`, user tự commit).

---

## 5. Routing theo độ lớn task + fix bug (giữ tư tưởng v1, dùng built-in harness)

> Dùng cơ chế **built-in** của harness, chỉ thêm policy/ngưỡng ở `.claude/rules/project-rules.md` (KHÔNG ở constitution như v1).

| Loại | Tiêu chí | Đường đi |
|---|---|---|
| **Trivial** | ≤ 2 file, KHÔNG đổi product behavior/API/data/permissions/billing | **Fast-lane: prompt thẳng.** Vẫn dính PreToolUse/permission hook (toàn cục). |
| **Nhỏ** (1 task) | behavior nhẹ | `/harness-work` Solo `--auto-mode --no-commit`. |
| **Vừa** (2-3 task) | nhiều task độc lập | `/harness-plan` → `/harness-work --parallel --no-commit`. Gate duyệt plan. |
| **Lớn** (4+ / đổi behavior lớn) | đổi product behavior/API/data/billing | Full loop plan→breezing→review→sync→release. `--no-commit`, gate giữ. |

**Auto-mode (selective):** bật Trivial/Nhỏ (`--auto-mode`); tắt Vừa/Lớn. **Độc lập no-auto-commit** — auto-mode = bớt hỏi giữa chừng, vẫn `--no-commit`.

**Fix bug:** in-task → fix ngay. Sau done → `failure-reticketing` (`.claude/state/pending-fix-proposals.jsonl`). CI đỏ → skill `ci`. **Bug UI Shopify (QA/PO báo): BẮT BUỘC repro playwright headed trong Admin iframe + lưu `evidence/` trước khi fix** (thay self-test browser mode đã bỏ). Cùng lỗi fail 3 lần → escalate.

---

## 6. Những gì XÓA

- `.claude/skills/sp-*` (toàn bộ superpowers clone).
- `.claude/skills/{explore-story, create-test-case, po-qa-loop, self-test, check-quality}`.
- `.claude/agents/code-reviewer.md` (harness có reviewer agent).
- Inject `sp-using-superpowers` trong `.claude/hooks/session-start.sh`.
- Mọi mô tả "4-phase workflow" trong `CLAUDE.md`, `README.md`.
- **KHÔNG tạo** `claude-code-harness.config.json` và `docs/constitution.md` (file chết — đây là sửa lớn so với v1).

---

## 7. Những gì SỬA / TẠO MỚI

| File | Hành động |
|---|---|
| `.claude/settings.json` | **Sửa** — `marketplace` + `enabledPlugins` harness (pin v4.12.3) + giữ atlassian + context7. |
| `harness.toml` (template seed) | **Tạo** — baseline permissions/sandbox/protectedBranchPush; init-workspace copy vào mỗi subproject. |
| `.claude/rules/project-rules.md` (template seed) | **Tạo** — Shopify + VN output + no-auto-commit + codegraph query-first + task-sizing + repro-bug rule. Thay vai trò constitution.md của v1. |
| `.mcp.json` | **Sửa** — giữ `shopify-dev-mcp`; thêm codegraph per-subproject `serve --mcp --path <sub>`. |
| `.claude/hooks/session-start.sh` | **Sửa** — bỏ inject superpowers; tối giản. |
| `.claude/skills/init-workspace/SKILL.md` | **Sửa** — per-subproject: `.git/info/exclude`, codegraph init, seed harness.toml + rules, ghi enabledPlugins + .mcp.json, CLAUDE.md harness loop, in hướng dẫn `/harness-setup` per-subproject. |
| `CLAUDE.md` (boilerplate) | **Viết lại** — harness loop + codegraph + Shopify + per-subproject + no-commit. |
| `README.md` | **Viết lại** — narrative tiếng Việt workflow mới. |
| `docs/features/` | **Tái cấu trúc** sang `spec.md`/`Plans.md`/`evidence/` (hoặc xóa `example`, §9.3). |
| `docs/shopify-conventions.md` | **Giữ** làm reference Polaris; rules trỏ tới. |
| `.gitignore` (boilerplate) | **Sửa** — thêm `.codegraph/`, `.claude/state/`; dọn rác. |

---

## 8. Thứ tự thực thi

**Phase A — Spike: ✅ XONG** (kết quả ở §0).

**Phase B — config/docs/cleanup: ✅ XONG (2026-05-26):**
- ✅ B1. `.claude/settings.json` — `extraKnownMarketplaces` pin ref `v4.12.3` + `autoUpdate:false` + `enabledPlugins` (harness + atlassian + context7).
- ✅ B2. Seed `templates/harness/harness.toml` + `templates/harness/project-rules.md`.
- ✅ B3. `.mcp.json` giữ `shopify-dev-mcp`; codegraph inject per-subproject do init-workspace (3.5b).
- ✅ B4. Viết lại `CLAUDE.md` + `README.md` theo harness loop.
- ✅ B5. `init-workspace`: per-subproject wiring (3.5b: `.git/info/exclude` + `codegraph init` + seed + inject `.mcp.json`), CLAUDE.md template harness, next-steps `/harness-setup`.
- ✅ B6. Xóa `sp-*`(14) + 4-phase(5) skill + `code-reviewer.md` + dir `agents/`; `session-start.sh` bỏ superpowers (reminder VN); `.gitignore` thêm `.codegraph/`/`.claude/state/`; `docs/features/` xóa example + index mới; `shopify-conventions.md` chuyển sang harness. KHÔNG tạo config.json/constitution.md.
- ✅ Verify: settings.json + .mcp.json + session-start.sh output đều JSON hợp lệ.

**Phase C — Bạn làm (runtime, cần restart CC):**
- C1. `/plugin marketplace add Chachamaru127/claude-code-harness` + `/plugin install ...@...marketplace` + restart.
- C2. `/init-workspace` tạo workspace mẫu → xác nhận plugin enable, codegraph init, .mcp.json load.
- C3. `cd <subproject> && /harness-setup` → xác nhận harness.toml/Plans.md/hooks sinh ra, `harness doctor` pass.
- C4. **Smoke-test E2**: 1 vòng `/harness-plan → /harness-work --no-commit → /harness-review` trên 1 feature Shopify nhỏ. Verify: no-auto-commit thật, codegraph query, rules được đọc (VN output).

> Mỗi phase là checkpoint review. No auto-commit — user commit khi sẵn sàng.

---

## 9. Open items còn lại (cần confirm trước/trong khi thực thi)

1. **Overlay LOCAL-only qua `.git/info/exclude`** (§3) — chấp nhận đổi nguyên tắc cũ "không đụng subproject repo" thành "overlay harness local, không commit vào git team"? *(đề xuất: chấp nhận)*
2. **Vị trí `spec.md`/`Plans.md`** — subproject root (đề xuất, harness cần đúng projectRoot) + reference trong `docs/features/`? Hay chỉ docs/features?
3. **`docs/features/example`** — xóa hay giữ tham khảo? *(đề xuất: xóa, thay bằng 1 README mô tả layout spec.md/Plans.md/evidence)*
4. **`harness sync` trong subproject** — sau khi sửa `harness.toml`, ai chạy `harness sync` để regenerate `.claude-plugin/`? init-workspace tự chạy hay để user? *(verify ở C3)*

---

## 10. Rủi ro & giảm thiểu

| Rủi ro | Giảm thiểu |
|---|---|
| Per-subproject làm bẩn git team | `.git/info/exclude` per-clone; verify `git status` sạch ở C2/C3. |
| no-auto-commit chỉ là policy mềm | rules + harness.toml ask + CLAUDE.md; **verify thật ở C4**, nếu lỏng → cân nhắc deny `git commit` trong harness.toml. |
| Skill body tiếng Nhật + i18n không có VN | Ép VN qua `.claude/rules` + CLAUDE.md; Claude đọc JP OK. |
| `npx codegraph` chậm khi nhiều subproject | Đo ở C2; cân nhắc cài binary 1 lần thay npx `-y`. |
| ~37 skill thừa của harness (strict, không prune) | Tài liệu hóa verb dùng trong CLAUDE.md. |
| Binary 4.11.4 vs VERSION 4.12.3 | `harness sync` / `harness doctor` cảnh báo; pin marketplace sẽ kéo đúng artifact. |
| Mất verify-real-system của self-test cũ | playwright headed gắn vào rule "repro bug UI Shopify" + C4. |

---

## 11. Definition of Done

- [ ] (B) settings.json: marketplace + enabledPlugins harness pin v4.12.3 + atlassian + context7.
- [ ] (B) `harness.toml` + `.claude/rules/project-rules.md` template seed xong (Shopify, VN, no-commit, codegraph, task-sizing, repro-bug).
- [ ] (B) `.mcp.json` codegraph per-subproject `--path`.
- [ ] (B) `sp-*` + skill 4-phase + `code-reviewer.md` đã xóa; `session-start.sh` không inject superpowers; KHÔNG có config.json/constitution.md.
- [ ] (B) `init-workspace` per-subproject (`.git/info/exclude`, codegraph init, seed, hướng dẫn `/harness-setup`); `CLAUDE.md`/`README.md` viết lại.
- [ ] (C) Plugin cài được, `harness doctor` pass per-subproject, `git status` subproject sạch.
- [ ] (C) Smoke-test 1 vòng harness loop; xác nhận no-auto-commit + codegraph + VN output.
- [ ] Open items §9 đã chốt.
