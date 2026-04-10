# AI-Assisted Development Workflow

Cách dùng Claude Code để build feature — từ story đến implementation đã được verify.

## Quick Reference

```bash
# Phase 1: Explore Story — verify feasibility, clarify, split if needed
/explore-story <paste story description or Jira link>
# (Gửi story cho PO, nhận lại câu trả lời, tự edit vào file story)

# Phase 2: Create Test Case — chạy sau khi đã resolve hết blocking questions trong story
/create-test-case <User-story đã verified>

# Phase 3: Implement (chỉ cần mô tả cần build gì — superpowers tự kích hoạt)
/brainstorming read <User-story> and test cases <Test-case>

# Phase 4: Verify & Sync (test + sync docs trong cùng một lần chạy, chạy theo checkpoint)
/self-test
```

## Prerequisites

- [Claude Code](https://claude.ai/code) CLI đã được cài đặt
- Playwright đã được cài đặt + login vào current user profile
- Project đang chạy ở local (frontend + backend)
- Đã cấu hình Jira access (tùy chọn, để link story)

## Overview

```
# QUY TRÌNH PHÁT TRIỂN

Story/Task
    |
    v
PHASE 1: EXPLORE STORY (/explore-story)
    Khám phá ứng dụng (browser/docs/Jira/source)
      -> Xác minh tính khả thi
         (BLOCKED -> HALT + hiển thị lý do & bằng chứng, không ghi file)
      -> Chia nhỏ story nếu quá lớn (Agile INVEST)
      -> Viết story + thêm phần "Open questions for PO"
         (chỉ về business-logic) vào cuối mỗi story
      -> Người dùng gửi cho PO, tự cập nhật câu trả lời vào file bằng tay
      -> Nếu câu trả lời của PO làm thay đổi scope / phát sinh nhu cầu về capability mới,
         chạy lại /explore-story ở REFINE MODE trên cùng file đó
         (vẫn áp dụng dừng cứng nếu BLOCKED). Sau đó -> /create-test-case
    |
    v
PHASE 2: CREATE TEST CASE (/create-test-case)
    Đọc story đã được xác thực -> Tạo các test case
    (HAPPY / EDGE / ERROR, với các ID -H / -E / -R) -> Người dùng kiểm duyệt
    |
    v
PHASE 3: IMPLEMENT (/superpowers — TDD)
    Brainstorm -> Plan -> Viết tests trước -> Implement -> Verify
    |
    v
PHASE 4: VERIFY & SYNC (/self-test) — CHỈ MANUAL TESTS
    Chọn mode: Browser (UI) hoặc Integration (BE: HTTP thật + DB, không auto-cleanup)
    Chạy theo các checkpoint có thứ tự và có thể chạy lại:
      A) Chạy mọi manual test case (không dừng khi fail)
      B) Ghi kết quả test vào ổ đĩa
      C) Sync story + TC với code đã xuất bản
      D) Regression smoke đối với các story lân cận
      E) Cập nhật indexes + cross-refs
      F) Chuyển trạng thái story = DONE (chỉ khi mọi case không phải BYPASS đều pass)
    Trạng thái chỉ có 2 mức: DRAFT hoặc DONE. Không có IN_PROGRESS.
    Nếu xảy ra regression trên một story đã DONE, story đó sẽ bị hạ về DRAFT.
    |
    v
Hoàn thành (hoặc quay lại PHASE 3 nếu có bất kỳ lỗi nào)
```

> Note: unit tests (Vitest) and E2E specs (Playwright) are **not** part of this workflow. They are fully owned by the superpowers TDD cycle in Phase 3.

## Phase 1: Explore Story (`/explore-story`)

**Goal:** Hiểu story, xác minh app hiện tại có build được hay không (**hard-stop kèm proof nếu không**), chia nhỏ theo Agile nếu cần, và để lại danh sách **câu hỏi business-logic** ở cuối mỗi story cho PO trả lời.

**Trigger:** Chạy `/explore-story` với mô tả story hoặc Jira link.

### Flow

```
1. Đọc & hiểu story/task
2. Explore app: browser (tuỳ chọn) / docs / Jira / source đọc có chủ đích
3. Verify feasibility  ── BLOCKED? ──> HALT, show reason + proof, KHÔNG tạo file
                       └─ FEASIBLE / FEASIBLE_WITH_CHANGES: đi tiếp
4. Split nếu quá to (Agile INVEST) — không chia story đã nhỏ, không chia theo FE/BE
5. Viết story(s) tại docs/features/[group]/US-[id]-[name]/US-[id]-[name].md
6. Append "## Open questions for PO" ở CUỐI mỗi story (business-logic only)
7. Bàn giao cho user → PO trả lời → user tự tay edit vào file → /create-test-case
```

### Chi tiết từng bước

1. Claude đọc requirements (từ chat hoặc Jira link)
2. **Research current app** — chọn cách phù hợp: mở browser thật bằng Playwright (tuỳ chọn, ưu tiên khi feature đã có trong app đang chạy), đọc `docs/features/`, xem Jira/linked tickets, đọc source có chủ đích nếu cần. Mọi thứ quan sát được đều phải lưu lại làm **evidence** cho Step 3.
3. **Verify feasibility — hard-stop gate:**
   - `FEASIBLE` — app hiện tại đã đủ → đi tiếp
   - `FEASIBLE_WITH_CHANGES` — thiếu một vài chỗ cụ thể (liệt kê từng cái) → đi tiếp
   - `BLOCKED` — thiếu năng lực nền tảng (không có auth, thiếu data source, không integrate external system, …) → **KHÔNG tạo file**, KHÔNG split, trả về report:
     ```
     Explore-story BLOCKED
     Reason: ...
     Proof:
       - [file path / route / screenshot] — ...
       - [Jira comment URL] — ...
     What would unblock this: ...
     ```
     Proof phải là thứ user (hoặc PO) có thể **tự click/mở để verify** — không được phép "tao nghĩ là blocked". Sau report thì dừng hẳn.
4. **Split nếu cần (Agile INVEST)** — chỉ khi story quá to, bundle nhiều mục tiêu độc lập, hoặc không test gọn gàng được. Chia theo user flow / actor / capability / data scope. **Không** chia story đã nhỏ, **không** chia theo technical layer (FE/BE). Nếu không chắc chỗ cắt, KHÔNG đoán — ghi vào "Open questions for PO".
5. **Viết story(s)** tại `docs/features/[group]/US-[id]-[name]/US-[id]-[name].md`. Nếu đã split, mỗi story một folder.
6. **Append `## Open questions for PO` ở cuối mỗi story** — đây là điểm thay đổi lớn:
   - Chỉ hỏi về **business logic**: rules, policies, state transitions, domain terms, scope boundaries, edge cases cần business judgement, điểm cắt story nếu chưa chắc
   - **KHÔNG** hỏi về technical implementation, framework choices, UX micro-copy
   - Mỗi câu hỏi có: câu hỏi, why it matters, best-guess, và nhãn **blocking** / **non-blocking**
   - Nếu thực sự không có câu hỏi nào → vẫn phải có section này, ghi `None — ready for /create-test-case`
   - **Claude KHÔNG block chat chờ trả lời** — nó bàn giao file xong là dừng
7. Output: summary + đường dẫn các story file, kèm số lượng open questions (blocking / non-blocking).

**Output artifacts:**

```
docs/
  superpowers/                              <-- plans, brainstorms từ superpowers
  features/
    index.md                                <-- top-level index of all groups
    [group]/
      index.md                              <-- per-group index
      US-[id]-[name]/                       <-- one folder per story
        US-[id]-[name].md                   <-- user story + "## Open questions for PO" ở cuối
```

**Your role:**

1. Nếu Claude trả về **BLOCKED** → xem proof, xử lý chỗ bị chặn (thay đổi request hoặc fix app) rồi chạy lại `/explore-story`.
2. Nếu Claude trả về story(s) → gửi file cho PO (copy/paste, share link, print, whatever), xin PO trả lời phần `## Open questions for PO`.
3. Sau khi PO trả lời → **tự tay edit vào file story** (cập nhật acceptance criteria / steps / notes theo câu trả lời, rồi xoá câu hỏi đã giải quyết hoặc đánh dấu `answered: ...`).
4. **Nếu câu trả lời của PO mở rộng scope, đổi actor, hoặc thêm capability mới** → chạy lại `/explore-story <path to US-*.md>` (refine mode) để re-verify feasibility. Refine mode vẫn có thể trả về BLOCKED. Nếu PO chỉ làm rõ wording hoặc xác nhận best-guess thì bỏ qua bước này.
5. Khi mọi câu hỏi **blocking** đều đã được giải quyết → chạy `/create-test-case` trên file story đó.

Claude **không** tự gửi story cho PO, **không** chờ trong chat, và **không** tự đoán câu trả lời rồi update story.

## Phase 2: Create Test Case (`/create-test-case`)

**Goal:** Với một story đã được PO trả lời hết câu hỏi blocking (section `## Open questions for PO` đã được resolve), sinh ra file test case thủ công chia rõ 3 phần **HAPPY / EDGE / ERROR**.

**Trigger:** Sau khi Phase 1 đã được validate và mọi **blocking** question trong story đã được user edit vào file, chạy:

```bash
/create-test-case docs/features/[group]/US-[id]-[name]/US-[id]-[name].md
```

**What happens:**

1. Claude đọc story file và lấy acceptance criteria, steps, actor, và `feasibility` block
2. **Sinh test cases** chia thành đúng 3 section:
   - **HAPPY** — luồng thành công tiêu chuẩn cho mỗi acceptance criterion và mỗi entry point
   - **EDGE** — dữ liệu biên, collection rỗng/1 phần tử/nhiều, concurrent action, async edge… chỉ viết khi story có đề cập
   - **ERROR** — validation failure, unauthorized, prerequisite thiếu, system failure… mỗi case phải có expected result người dùng nhìn thấy được (cụ thể, không viết "hiện lỗi")
3. Ghi ra `docs/features/[group]/US-[id]-[name]/TC-[id]-[name].md` **cùng folder với user story**, tất cả case đều `PENDING`. ID case dùng prefix theo section: `-H01, -H02, …` cho HAPPY, `-E01, …` cho EDGE, `-R01, …` cho ERROR
4. Cập nhật `docs/features/[group]/index.md` và `docs/features/index.md` nếu cần
5. **Dừng lại và chờ human review** — chưa bắt đầu implement

**Rules:**

- Một story → một file TC. Nếu có nhiều story từ Phase 1, chạy `/create-test-case` một lần cho mỗi story.
- Không bịa behavior. Nếu story không nói rõ một trường hợp nào đó → **dừng và yêu cầu user chạy `/explore-story` refine mode** trên file story đó. Không chat-block, không đoán, không tự thêm case.
- Nếu PO đã trả lời xong và story có capability / actor / scope vượt quá `feasibility` block cũ → cũng dừng và yêu cầu refine mode. `/create-test-case` không được phép sinh test case dựa trên feasibility đã lỗi thời.
- Steps phải là hành động người dùng ("Click **Export**"), không được reference hàm / component / API route.

**Your role:** Review test case, xác nhận bao phủ đủ kỳ vọng, điều chỉnh nếu cần, rồi cho phép sang Phase 3.

## Phase 3: Implement (`/superpowers` — TDD)

**Goal:** Build feature sử dụng Test-Driven Development.

**Trigger:** Sau khi Phase 1 được approve, nói với Claude: `/brainstorming read @docs/features/[group]/US-[id]-[name]/US-[id]-[name].md and test cases @docs/features/[group]/US-[id]-[name]/TC-[id]-[name].md`

**What happens (typical flow):**

1. **Brainstorm** — Claude khám phá requirements, đặt câu hỏi làm rõ, cân nhắc các design option trước khi động vào code
2. **Write a plan** — Tạo implementation plan với các bước rõ ràng và checkpoint
3. **TDD cycle** — Với mỗi phần functionality:
   - Viết failing test trước
   - Implement code tối thiểu để test pass
   - Refactor nếu cần
4. **Review checkpoint** — Claude verify lại công việc theo plan trước khi tiếp tục
5. **Lặp lại** cho đến khi tất cả acceptance criteria được đáp ứng

**Key behaviors:**

- Test được viết _trước_ implementation code
- Implementation đi theo plan từng bước
- Claude dừng tại các review checkpoint — bạn có thể điều chỉnh hướng đi
- Parallel agent có thể được dispatch cho các task độc lập

**Your role:** Review plan trước khi implementation bắt đầu. Theo dõi tiến độ tại các checkpoint. Điều chỉnh nếu hướng tiếp cận có vấn đề.

## Phase 4: Verify & Sync (`/self-test`)

**Goal:** Trong **cùng một lần chạy**, chạy tất cả **manual test cases** từ Phase 2 trên hệ thống thực, đồng thời sync story + test case file + indexes với code đã ship. Đây là skill **duy nhất** được phép đánh dấu story là `DONE`.

> **Scope:** Phase 4 **chỉ lo manual tests** (file `TC-*.md`). Unit tests (Vitest) và E2E specs (Playwright) hoàn toàn do superpowers TDD ở Phase 3 sở hữu — Phase 4 không đọc, không sửa, không chạy chúng.

**Trigger:** Chạy `/self-test` sau khi implementation hoàn tất (hoặc sau khi merge / fix bug / bất kỳ thay đổi code nào có thể ảnh hưởng đến behavior đã document).

### Hai chế độ chạy (pick-per-story)

Self-test tự chọn chế độ dựa trên loại story:

- **Browser mode** — story có UI (frontend hoặc full-stack có màn hình). Dùng `/playwright-cli` mở headed browser tại localhost, click/gõ/điều hướng như người dùng thật.
- **Integration mode** — story **backend-only** (API endpoint, job, webhook, migration, SDK). **Không mở browser.** Thay vào đó, gọi HTTP thật qua `curl` / HTTP client của host project, đọc DB / queue / log thật để xác nhận side effects. Dùng **real data + real API calls**, không mock. **Integration mode không tự dọn dẹp** — nếu môi trường bẩn (unique-constraint conflict, record cũ sót lại), self-test sẽ **dừng ngay** và yêu cầu bạn reset thủ công. Nó sẽ không tự xoá record hay đổi identifier để né conflict.
- **Mixed** — story vừa có API vừa có UI: dùng browser cho UI case, integration call cho pure API case, trong cùng một lần chạy.

**What happens:**

1. Claude đọc story và test cases từ `docs/features/[group]/US-[id]-[name]/`
2. Detect default branch động (không hardcode `master`/`main`) rồi phân tích diff để biết code đã thay đổi gì
3. **Checkpoint A** — chọn chế độ (Browser / Integration / Mixed) và thực thi **từng manual test case** theo `steps`:
   - Integration mode làm pre-flight probe trước; nếu môi trường bẩn → dừng, yêu cầu reset thủ công
   - Happy path trước → edge → error
   - **Không dừng khi gặp fail** — ghi nhận FAIL (kèm mô tả ngắn triệu chứng) rồi tiếp tục case tiếp theo
   - BYPASS được bỏ qua và giữ nguyên kết quả cũ
4. **Checkpoint B** — ghi toàn bộ kết quả (PASS/FAIL + note) xuống `TC-*.md` ngay, trước khi đụng bất kỳ doc nào khác. Đây là safety net: nếu checkpoint sau fail thì kết quả test đã nằm trên disk.
5. **Checkpoint C** — sync story + test case với reality. Reconcile với implementation thực tế:
   - Nếu acceptance criteria / steps / expected_result đã khác → cập nhật để khớp
   - Nếu có behavior mới mà story chưa đề cập → thêm vào acceptance criteria và thêm test case mới ở section phù hợp (ID lấy số tiếp theo trong prefix `-H/-E/-R`)
   - Nếu một case được sửa → chạy lại case đó ngay trong cùng lần chạy này, ghi kết quả mới về lại TC file
6. **Checkpoint D** — regression smoke một happy path trên mỗi adjacent story mà diff có khả năng ảnh hưởng
7. **Checkpoint E** — cập nhật index files (`docs/features/index.md` + `docs/features/[group]/index.md`), cross-reference links
8. **Checkpoint F** — compute story verdict và flip status:
   - Mọi non-BYPASS case đều PASS → `status: DONE`
   - Có bất kỳ FAIL nào → `status: DRAFT`. Nếu story trước đó đã `DONE` thì tag **REGRESSION** trong report.
9. Xuất combined report:

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
  Regression risk:   LOW | MEDIUM | HIGH

Docs synced:
  Story updated:     yes | no
  Test cases edited: [list of TC IDs] | none
  Test cases added:  N new cases
  Indexes updated:   yes | no

Checkpoints completed: A B C D E F   (missing = interrupted, safe to re-run)

Details:
  TC-[id]-[name]-H01 (happy_path): PASS
  TC-[id]-[name]-E01 (edge_case):  PASS
  TC-[id]-[name]-R01 (error_case): FAIL — [short symptom]
```

Nếu checkpoint nào fail giữa chừng, chạy lại `/self-test` — nó sẽ resume từ checkpoint đầu tiên chưa hoàn tất, không chạy lại những gì đã landed on disk.

**Your role:** Review report. Nếu có failures, Claude đã dừng lại và **không** tự fix code — bạn quyết định: fix implementation, điều chỉnh test case, hay đánh dấu BYPASS. Sau khi xử lý, chạy lại `/self-test` để nó sync lại và (nếu đã xanh hết) flip `status: DONE`.

## When to Use Which Workflow

Không phải task nào cũng cần đủ 4 phase. Chọn mức độ phù hợp dựa trên độ phức tạp:

### Full Workflow (all 4 phases)

Dùng cho: feature mới, multi-screen flow, business logic phức tạp.

```
/explore-story -> /create-test-case -> implement (TDD) -> /self-test
```

### Light Workflow (skip Phase 1 — still run Phases 2 + 3 + 4)

Dùng cho: bug fix đơn giản, thay đổi copy, styling tweak, config update, refactor nhỏ khi story đã tồn tại và **rõ ràng đến mức không cần chạy lại `/explore-story`**.

```
/create-test-case -> implement (TDD) -> /self-test
```

**Phase 2 vẫn phải chạy** — `/self-test` ở Phase 4 đọc kết quả từ `TC-*.md`, nên không có test case thì Phase 4 không có gì để verify và status sẽ không được flip. Nếu story cũ đã có `TC-*.md` và chỉ cần thêm case mới → chạy `/create-test-case` lại trên cùng file story, nó sẽ append case mới với ID tiếp theo trong section `-H/-E/-R`.

Bỏ qua Phase 1 chỉ khi story đã rõ, feasibility đã verified, và PO không cần xác nhận lại gì. Khi nghi ngờ, dùng full workflow.

### How to decide

| Câu hỏi                                        | Yes -> Full | No -> Light |
| ---------------------------------------------- | ----------- | ----------- |
| Đây có phải là user-facing behavior mới không? | Full        | Light       |
| Có thay đổi existing user flow không?          | Full        | Light       |
| Có thể gây ra lỗi non-obvious không?           | Full        | Light       |
| Chỉ thay đổi một file với scope hiển nhiên?    | Light       | Full        |

**Khi không chắc, dùng full workflow.** Chi phí chạy `/explore-story` cho một task đơn giản là thấp. Chi phí bỏ qua nó cho một task phức tạp thì rất cao. Nhớ: Light chỉ skip Phase 1 — Phase 2 (`/create-test-case`) vẫn luôn chạy để Phase 4 có thứ để verify.

## Workflow Rules

1. **Workflow này chỉ lo manual tests.** Unit test (Vitest) và E2E spec (Playwright) **hoàn toàn thuộc superpowers** ở Phase 3 (`test-driven-development`). Không skill nào trong repo này đọc/ghi/chạy chúng. Nếu code-level test lệch với code đã ship → đó là bug của Phase 3, flag lại chứ không fix ở Phase 4.
2. **Mặc định dùng full workflow.** Light workflow = skip Phase 1 only (Phase 2 + 3 + 4 vẫn chạy). Chỉ dùng khi task rõ ràng là đơn giản và story đã stable (xem bảng quyết định ở trên).
3. **Human review là bắt buộc** giữa các Phase — mỗi phase đều dừng chờ review, hãy đọc kĩ và yêu cầu AI chỉnh sửa trước khi qua bước tiếp theo. Phase 1 đặc biệt đợi **Product Owner** trả lời phần `## Open questions for PO` ở cuối mỗi story, và user tự tay edit câu trả lời vào file trước khi sang Phase 2.
4. **Phase 1 feasibility là hard-stop gate.** Thứ tự cố định: explore → verify → split → write. Nếu BLOCKED thì KHÔNG tạo file story, chỉ trả về reason + proof (đường dẫn file / route / screenshot / Jira comment mà user tự click được để verify). "Tao nghĩ là blocked" không được chấp nhận.
5. **`/explore-story` có refine mode.** Khi PO đã trả lời và câu trả lời mở rộng scope / đổi actor / thêm capability mới, chạy lại `/explore-story <path to US-*.md>`. Nó re-verify feasibility chính block cũ và có thể trả về BLOCKED lần nữa (hard-stop gate vẫn áp dụng). Không cần refine khi PO chỉ làm rõ wording.
6. **Open questions ở cuối story, không ở chat.** Phase 1 chỉ hỏi về **business logic** (rules, policies, state transitions, domain terms, scope boundary, business-judgement edge cases). KHÔNG hỏi về technical implementation, framework, UX micro-copy. Claude không block chat chờ PO trả lời — user sở hữu loop PO-manual-edit.
7. **Không chia story khi không cần.** Phase 1 chỉ split story theo INVEST khi nó thật sự quá lớn hoặc bundle nhiều mục tiêu. Không split story nhỏ, và không split theo technical layer (FE/BE).
8. **`/create-test-case` không bịa và không chat-block.** Nếu thấy story thiếu case hiển nhiên hoặc feasibility đã lỗi thời so với PO answers → dừng, yêu cầu user chạy `/explore-story` refine mode. Không hỏi trong chat, không tự thêm case.
9. **Test case ID có prefix theo section.** `-H01, -H02, …` cho HAPPY, `-E01, …` cho EDGE, `-R01, …` cho ERROR. Dense trong mỗi section, append-only, không bao giờ renumber.
10. **Tests trước code.** Phase 3 theo TDD. Nếu bạn thấy mình đang viết implementation mà chưa có test, hãy dừng lại.
11. **Self-test chọn chế độ theo story.** Browser (UI-facing) hoặc Integration (backend-only: real HTTP + DB + queue + log, **không mock**). Browser là **tuỳ chọn** — BE-only story không cần mở browser. Story vừa có FE vừa có BE dùng cả hai trong một lần chạy.
12. **Integration mode không tự dọn dẹp.** Environment bẩn → self-test dừng, yêu cầu reset thủ công. Không tự xoá record, không đổi identifier ngầm, không che conflict.
13. **Self-test detect default branch động.** Không hardcode `master` hay `main`. Dùng `git symbolic-ref refs/remotes/origin/HEAD` kèm fallback.
14. **Self-test chạy theo ordered checkpoints, mỗi checkpoint re-runnable.** Run tests (A) → write TC results (B) → sync docs (C) → smoke (D) → indexes (E) → flip status (F). Crash ở checkpoint sau không được phá việc của checkpoint trước; re-run phải resume được.
15. **Self-test không halt khi gặp fail.** Nó chạy hết mọi case, ghi nhận PASS/FAIL cho từng case, rồi mới quyết định story-level verdict.
16. **Status 2-state: DRAFT hoặc DONE.** Không có `IN_PROGRESS`. `/self-test` là skill duy nhất flip sang `DONE`, chỉ khi mọi non-BYPASS manual case đều xanh trong cùng một lần chạy. Một FAIL → `DRAFT`. Regression trên story đã `DONE` → rớt về `DRAFT`, tag **REGRESSION** trong report.
17. **Regression không được auto-detect.** `/self-test` chỉ verify story mà user trỏ tới. Nếu một story `DONE` regress ở đâu đó khác, nó sẽ không được phát hiện tự động — đây là giới hạn đã biết.
18. **Self-test sync story docs trong cùng lần chạy đó.** Không có skill `/sync-docs` riêng — self-test reconcile story, test case, indexes với code đã ship, rồi chạy lại những case đã sửa để không để docs mới mà result cũ.
19. **Failures được báo cáo, không tự fix.** Claude không sửa production code để test pass. Bạn quyết định cách xử lý.
