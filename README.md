# AI-Assisted Development Workflow

Boilerplate cài đặt quy trình phát triển hỗ trợ bởi AI vào một dự án host. Từ story đến implementation đã được verify — 4 phase, mỗi phase dừng chờ human review.

## Quick Reference

```bash
# Phase 1: Explore Story — xác minh feasibility, clarify, split nếu cần
/explore-story <mô tả story hoặc Jira link>
# → Gửi story cho PO, nhận câu trả lời, tự edit vào file

# Phase 2: Create Test Case — sinh test case từ story đã validate
/create-test-case docs/features/[group]/US-[id]-[name]/US-[id]-[name].md

# Phase 3: Implement — brainstorm + plan + TDD, đọc cả US và TC làm input
/brainstorming read @docs/features/[group]/US-[id]-[name]/US-[id]-[name].md \
  and test cases @docs/features/[group]/US-[id]-[name]/TC-[id]-[name].md

# Phase 4: Verify & Sync — test manual + sync docs
/self-test

# Commit khi sẵn sàng (không tự động commit ở bất kỳ phase nào)
/ship-it
```

## Prerequisites

- [Claude Code](https://claude.ai/code) CLI đã được cài đặt
- Playwright đã được cài đặt (cần cho Phase 1 browser exploration và Phase 4 browser mode)
- Project đang chạy ở local (frontend + backend)
- Jira access đã cấu hình (tuỳ chọn, cho `/explore-story` link story)

## Overview

```
Story/Task
    │
    ▼
PHASE 1: EXPLORE STORY (/explore-story)
    Khám phá app (browser/docs/Jira/source)
    → Xác minh feasibility (BLOCKED → HALT + proof, không ghi file)
    → Split nếu quá lớn (Agile INVEST)
    → Viết US-*.md + "Open questions for PO" ở cuối
    → Human gửi PO, edit câu trả lời vào file
    │
    ▼
PHASE 2: CREATE TEST CASE (/create-test-case)
    Đọc story → Sinh TC-*.md (HAPPY / EDGE / ERROR)
    → Human review test cases
    │
    ▼
PHASE 3: IMPLEMENT (/brainstorming + superpowers skills)
    Đọc US-*.md + TC-*.md → Brainstorm → Design spec
    → Implementation plan → TDD (test trước, code sau)
    → Review checkpoints → KHÔNG auto-commit
    │
    ▼
PHASE 4: VERIFY & SYNC (/self-test)
    Chạy manual test cases trên hệ thống thực
    → Sync docs với code đã ship
    → Flip status DONE (chỉ khi all non-BYPASS pass)
    │
    ▼
COMMIT (/ship-it hoặc manual git)
```

## Cấu trúc artifacts

Mọi artifact của một story nằm gọn trong cùng một folder:

```
docs/features/
  index.md                              ← top-level index
  [group]/
    index.md                            ← per-group index
    US-[id]-[name]/                     ← folder cho story
      US-[id]-[name].md                 ← user story (Phase 1)
      TC-[id]-[name].md                 ← test cases (Phase 2)
      specs/                            ← design docs (Phase 3 brainstorming)
        [topic]-design.md
      plans/                            ← implementation plans (Phase 3 writing-plans)
        [feature-name].md
```

## Phase 1: Explore Story (`/explore-story`)

**Goal:** Hiểu story, xác minh app có build được hay không, chia nhỏ nếu cần, để lại câu hỏi business-logic cho PO.

**Trigger:** `/explore-story <mô tả story hoặc Jira link>`

### Flow

```
1. Đọc & hiểu story/task
2. Explore app: browser (tuỳ chọn) / docs / Jira / source có chủ đích
3. Verify feasibility:
   ├─ BLOCKED → HALT, show reason + proof, KHÔNG tạo file
   └─ FEASIBLE → đi tiếp
4. Split nếu quá to (Agile INVEST, không chia theo FE/BE)
5. Viết story: docs/features/[group]/US-[id]-[name]/US-[id]-[name].md
6. Append "## Open questions for PO" ở CUỐI mỗi story
7. Bàn giao → user gửi PO → edit câu trả lời vào file → Phase 2
```

### Rules

- **BLOCKED = hard-stop.** Không tạo file, trả về proof (file path / route / screenshot / Jira comment) mà user tự verify được.
- **Open questions chỉ về business logic** — rules, policies, state transitions, domain terms, scope. KHÔNG hỏi technical/framework/UX.
- **Claude không block chat chờ PO** — ghi câu hỏi vào file rồi dừng.
- **Refine mode:** Nếu PO trả lời mở rộng scope / đổi actor / thêm capability → chạy lại `/explore-story <path to US-*.md>`.

### Your role

1. Nếu BLOCKED → xử lý chỗ bị chặn, chạy lại
2. Nếu có story → gửi PO, nhận câu trả lời, tự edit vào file
3. Khi mọi blocking question đã resolve → chạy `/create-test-case`

## Phase 2: Create Test Case (`/create-test-case`)

**Goal:** Sinh file test case thủ công từ story đã validate.

**Trigger:** `/create-test-case docs/features/[group]/US-[id]-[name]/US-[id]-[name].md`

### What happens

1. Đọc story file (acceptance criteria, steps, actor, feasibility)
2. Sinh test cases chia 3 section:
   - **HAPPY** — luồng thành công
   - **EDGE** — dữ liệu biên, concurrent, async
   - **ERROR** — validation failure, unauthorized, system failure
3. Ghi ra `TC-[id]-[name].md` cùng folder với story, tất cả case `PENDING`
4. ID prefix: `-H01, -H02, …` (HAPPY), `-E01, …` (EDGE), `-R01, …` (ERROR)
5. Cập nhật indexes
6. **Dừng chờ human review**

### Rules

- Một story → một file TC
- Không bịa behavior — nếu story thiếu info → dừng, yêu cầu `/explore-story` refine
- Steps là hành động user ("Click **Export**"), không reference hàm/API
- Nếu PO answers đã thay đổi scope vượt feasibility cũ → dừng, yêu cầu refine

### Your role

Review test cases, xác nhận bao phủ đủ, điều chỉnh nếu cần, rồi sang Phase 3.

## Phase 3: Implement (superpowers skills — TDD)

**Goal:** Build feature với Test-Driven Development, đọc cả user story và test cases làm đầu vào.

**Trigger:**

```bash
/brainstorming read @docs/features/[group]/US-[id]-[name]/US-[id]-[name].md \
  and test cases @docs/features/[group]/US-[id]-[name]/TC-[id]-[name].md
```

### Luồng chi tiết

Phase 3 sử dụng chuỗi superpowers skills, mỗi skill tự gọi skill tiếp theo:

#### Step 1: Brainstorming (`sp-brainstorming`)

**Input bắt buộc:** file `US-*.md` + file `TC-*.md` — cả hai đều phải có.

- Đọc story: acceptance criteria, business rules, actors
- Đọc test cases: extract tất cả TC IDs (H01, E01, R01...)
- Explore source code liên quan đến story
- Hỏi clarifying questions (1 câu/lần)
- Đề xuất 2-3 approaches với trade-offs
- Present design → user approve
- **Viết spec** vào `docs/features/[group]/US-[id]-[name]/specs/[topic]-design.md`
- **Spec self-review:** cross-check spec với MỌI TC ID từ file test case. Mọi HAPPY/EDGE/ERROR case đều phải được cover bởi design. Gap = fix trước khi tiếp.
- User review spec → approve → tự gọi Step 2

#### Step 2: Writing Plans (`sp-writing-plans`)

**Input:** spec từ Step 1 (đã chắt lọc toàn bộ US + TC).

- Tạo plan chi tiết (bite-sized tasks, TDD steps, exact file paths, exact code)
- **Viết plan** vào `docs/features/[group]/US-[id]-[name]/plans/[feature-name].md`
- Hỏi user chọn execution mode:
  - **Option 1: Subagent-Driven** (recommended) — dispatch subagent cho mỗi task
  - **Option 2: Inline Execution** — chạy trong session hiện tại

#### Step 3: Execution

**Nếu Option 1 — Subagent-Driven (`sp-subagent-driven-development`):**

Với mỗi task trong plan:
1. Dispatch implementer subagent → viết failing test → implement → verify → self-review
2. Dispatch spec reviewer subagent → verify code khớp spec
3. Dispatch code quality reviewer subagent → verify chất lượng
4. Mark task complete → next task

**Nếu Option 2 — Inline (`sp-executing-plans`):**

Execute từng task inline với checkpoints cho user review.

**Cả hai đều dùng `sp-test-driven-development`:**
- Red: viết failing test
- Green: implement tối thiểu để pass
- Refactor: clean up
- **KHÔNG commit** — user tự commit khi sẵn sàng

#### Step 4: Finishing (`sp-finishing-a-development-branch`)

- Verify tất cả tests pass
- Hỏi user: merge / PR / keep / discard

### Data flow — tại sao TDD không cần đọc lại TC-*.md

```
US-*.md + TC-*.md
       ↓
sp-brainstorming (đọc CẢ HAI, cross-check ALL TC IDs)
       ↓
specs/design.md (single source of truth — đã "tiêu hóa" US + TC)
       ↓
plans/plan.md (sinh từ spec — có exact tasks + exact tests)
       ↓
sp-test-driven-development (chạy từ plan — đủ thông tin)
```

Brainstorming là điểm nối giữa Phase 1+2 (US + TC) và Phase 3 (superpowers). Nếu brainstorming bỏ sót edge case từ TC → fix ở brainstorming, không cần sửa TDD.

### Your role

- Review design trước khi approve
- Review plan trước khi execution bắt đầu
- Theo dõi tiến độ tại checkpoints
- Commit khi sẵn sàng (`/ship-it`)

## Phase 4: Verify & Sync (`/self-test`)

**Goal:** Chạy tất cả manual test cases từ Phase 2 trên hệ thống thực, sync docs, và flip story status.

> **Scope:** Phase 4 chỉ lo manual tests (`TC-*.md`). Unit tests và E2E specs do superpowers TDD ở Phase 3 sở hữu.

**Trigger:** `/self-test` sau khi implementation hoàn tất.

### Hai chế độ (pick-per-story)

- **Browser mode** — story có UI. Dùng Playwright mở headed browser tại localhost.
- **Integration mode** — story backend-only. HTTP thật + DB/queue/log thật, không mock. **Không tự dọn dẹp** — environment bẩn → dừng, yêu cầu human reset.
- **Mixed** — story vừa FE vừa BE: dùng cả hai.

### Checkpoints (ordered, re-runnable)

| Checkpoint | Mô tả |
|---|---|
| A | Chạy mọi manual test case (không dừng khi fail) |
| B | Ghi kết quả (PASS/FAIL + note) xuống `TC-*.md` |
| C | Sync story + TC với code đã ship. Nếu case bị sửa → chạy lại case đó |
| D | Regression smoke trên adjacent stories |
| E | Cập nhật indexes + cross-refs |
| F | Flip status: all non-BYPASS pass → `DONE`, any FAIL → `DRAFT` |

Crash ở checkpoint sau không phá checkpoint trước. Re-run resume từ checkpoint đầu tiên chưa hoàn tất.

### Output

```
Self-Test + Sync Report
─────────────────────────────────
Story:               docs/features/[group]/US-[id]-[name]/US-[id]-[name].md
Mode:                Browser | Integration | Mixed
Story status:        DONE | DRAFT
Previous status:     DRAFT | DONE
Verdict:             PASS | FAIL

Manual test cases:
  Passed:            N
  Failed:            N
  Bypassed:          N

Docs synced:
  Story updated:     yes | no
  Test cases edited: [list of TC IDs] | none
  Test cases added:  N new cases
  Indexes updated:   yes | no

Checkpoints completed: A B C D E F

Details:
  TC-[id]-[name]-H01: PASS
  TC-[id]-[name]-E01: PASS
  TC-[id]-[name]-R01: FAIL — [symptom]
```

### Your role

Review report. Nếu có failures → bạn quyết định: fix code, điều chỉnh test case, hay BYPASS. Chạy lại `/self-test` để sync và flip status.

## Khi nào dùng workflow nào

### Full Workflow (4 phases)

Dùng cho: feature mới, multi-screen flow, business logic phức tạp.

```
/explore-story → /create-test-case → /brainstorming (với US + TC) → /self-test
```

### Light Workflow (skip Phase 1, vẫn chạy 2 + 3 + 4)

Dùng cho: bug fix đơn giản, copy/styling, config, refactor nhỏ khi story đã rõ.

```
/create-test-case → /brainstorming (với US + TC) → /self-test
```

Phase 2 vẫn bắt buộc — `/self-test` cần `TC-*.md` để verify.

### How to decide

| Câu hỏi | Yes → Full | No → Light |
|---|---|---|
| Đây là user-facing behavior mới? | Full | Light |
| Thay đổi existing user flow? | Full | Light |
| Có thể gây lỗi non-obvious? | Full | Light |
| Chỉ thay đổi 1 file, scope hiển nhiên? | Light | Full |

**Khi không chắc, dùng full workflow.**

## Workflow Rules

1. **Manual tests only.** Unit test + E2E thuộc superpowers Phase 3. Phase 1/2/4 không đụng.
2. **Human review bắt buộc** giữa các phase.
3. **Tests trước code** ở Phase 3 (TDD).
4. **Phase 3 brainstorming bắt buộc đọc cả US + TC.** Spec self-review phải cross-check mọi TC ID.
5. **Không auto-commit.** Không skill nào tự commit. User dùng `/ship-it` hoặc git manual.
6. **Feasibility là hard-stop gate** ở Phase 1. BLOCKED = không tạo file.
7. **Open questions ở cuối story file**, không ở chat. Business-logic only.
8. **Split chỉ khi cần** (INVEST). Không chia theo FE/BE.
9. **`/create-test-case` không bịa.** Thiếu info → dừng, route lại `/explore-story`.
10. **TC IDs prefix theo section.** `-H01` HAPPY, `-E01` EDGE, `-R01` ERROR. Append-only.
11. **`/self-test` chọn mode theo story.** Browser / Integration / Mixed. Không mock.
12. **Integration mode không tự dọn dẹp.** Dirty env → dừng, human reset.
13. **`/self-test` không halt khi fail.** Chạy hết, ghi từng case, rồi tính verdict.
14. **Status 2-state: DRAFT | DONE.** Chỉ `/self-test` flip DONE. Regression → DRAFT.
15. **`/self-test` sync docs cùng lần chạy.** Case bị sửa → chạy lại case đó.
16. **`/self-test` detect default branch động.** Không hardcode master/main.
17. **Failures được báo cáo, không tự fix.** Claude không sửa production code.
18. **Mọi artifact nằm trong folder story.** Không có `docs/superpowers/` riêng.
