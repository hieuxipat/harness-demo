# AI-Assisted Development Workflow

Cách dùng Claude Code để build feature — từ story đến implementation đã được verify.

## Overview

```
Story/Task
    |
    v
Phase 1: PREPARE (/task-explore)
    Explore app in browser -> Write user story -> Write E2E test cases -> Human review
    |
    v
Phase 2: IMPLEMENT (/superpowers — TDD)
    Brainstorm -> Plan -> Write tests first -> Implement -> Verify
    |
    v
Phase 3: VERIFY (/self-test)
    Run test cases in real browser -> Record results -> Report
    |
    v
Phase 4: SYNC DOCS (/sync-docs)
    Sync user stories, test cases, unit tests, E2E tests with code changes
    |
    v
Done (or loop back to Phase 2 if failures)
```

## Prerequisites

- [Claude Code](https://claude.ai/code) CLI đã được cài đặt
- Playwright đã được cài đặt + login vào current user profile
- Project đang chạy ở local (frontend + backend)
- Đã cấu hình Jira access (tùy chọn, để link story)

## Quick Reference

```bash
# Phase 1: Prepare
/task-explore <paste story description or Jira link>

# Phase 2: Implement (chỉ cần mô tả cần build gì — superpowers tự kích hoạt)
/brainstorming read @docs/features/[group]/US-[id]-[name]/US-[id]-[name].md and test cases @docs/features/[group]/US-[id]-[name]/TC-[id]-[name].md

# Phase 3: Verify
/self-test

# Phase 4: Sync docs & tests
/sync-docs
```

## Phase 1: Prepare (`/task-explore`)

**Goal:** Hiểu rõ đang build gì và xác định cách test — trước khi viết bất kỳ dòng code nào.

**Trigger:** Chạy `/task-explore` với mô tả story hoặc Jira link.

**What happens:**

1. Claude đọc các requirements của story/task
2. **Research current app** — chọn cách phù hợp nhất: mở browser thật bằng Playwright (tuỳ chọn, ưu tiên khi feature đã có trong app đang chạy), đọc docs hiện có trong `docs/features/`, xem Jira/linked tickets, hoặc đọc source code có chủ đích nếu cần. Không bắt buộc phải dùng tất cả phương pháp.
3. **Hỏi lại để làm rõ** — nếu có bất kỳ điểm nào chưa rõ (actor/role, success criteria, error handling, edge case, business rule…), Claude phải dừng và hỏi user trước khi viết story. Mỗi câu hỏi đi kèm guess để user xác nhận nhanh.
4. Tạo hoặc cập nhật **User Story** tại `docs/features/[group]/US-[id]-[name]/US-[id]-[name].md`
5. Viết **E2E Test Cases** tại `docs/features/[group]/US-[id]-[name]/TC-[id]-[name].md` (cùng folder với story) bao gồm:
   - Happy path (luồng thành công tiêu chuẩn)
   - Edge cases (dữ liệu biên, điều kiện đặc biệt)
   - Error cases (lỗi validation, truy cập không được phép)
6. **Dừng lại và chờ human review** — không bắt đầu implement cho đến khi bạn approve

**Output artifacts:**

```
docs/
  superpowers/                              <-- plans, brainstorms từ superpowers
  features/
    index.md                                <-- top-level index of all groups
    [group]/
      index.md                              <-- per-group index
      US-[id]-[name]/                       <-- one folder per story
        US-[id]-[name].md                   <-- user story
        TC-[id]-[name].md                   <-- test cases (all PENDING)
```

**Your role:** Review user story và test cases. Xác nhận chúng khớp với kỳ vọng, điều chỉnh nếu cần, rồi cho phép tiếp tục.

## Phase 2: Implement (`/superpowers` — TDD)

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

## Phase 3: Verify (`/self-test`)

**Goal:** Chạy tất cả test cases từ Phase 1 trên implementation thực tế trong browser thật.

**Trigger:** Chạy `/self-test` sau khi implementation hoàn tất.

**What happens:**

1. Claude đọc test cases từ `docs/features/[group]/US-[id]-[name]/TC-[id]-[name].md`
2. Mở headed browser (Playwright) và thực thi từng test case theo từng bước
3. So sánh kết quả thực tế với expected results
4. Kiểm tra regression risk với các story liên quan
5. Xuất test report:

```
Self-Test Report
------------------------------
Status:           PASS | FAIL
Cases passed:     N
Cases bypassed:   N
Cases failed:     N
Regression risk:  LOW | MEDIUM | HIGH

Details:
  TC-001-01 (happy_path):  PASS
  TC-001-02 (edge_case):   PASS
  TC-001-03 (error_case):  FAIL - [description]
```

6. Nếu có failures — báo cáo kèm gợi ý debug nhưng **không tự động fix**

**Your role:** Review test report. Nếu có failures, quyết định fix và chạy lại, điều chỉnh test case, hoặc đánh dấu BYPASS.

## Phase 4: Sync Docs (`/sync-docs`)

**Goal:** Giữ toàn bộ documentation và test artifact đồng bộ với code vừa được ship.

**Trigger:** Chạy `/sync-docs` sau khi Phase 3 pass (hoặc sau khi merge, fix bug, hoặc bất kỳ thay đổi code nào có thể ảnh hưởng đến behavior đã được document).

**What happens:**

1. Phân tích git diff để xác định feature/story nào bị ảnh hưởng
2. Cập nhật **User Stories** — điều chỉnh acceptance criteria, các bước, hoặc ghi chú để khớp với implementation thực tế
3. Cập nhật **Test Cases** — sửa expected results, thêm case mới cho edge case phát hiện được, reset kết quả bị ảnh hưởng về `PENDING`
4. Sync **Unit Tests** — tạo hoặc cập nhật test file trong `src/__tests__/` để khớp với thay đổi code, sau đó chạy chúng
5. Sync **E2E Tests** — tạo hoặc cập nhật spec file trong `tests/e2e/` để khớp với thay đổi flow, sau đó chạy chúng
6. Cập nhật **Index Files** — đảm bảo `docs/features/index.md` (top-level) và mỗi `docs/features/[group]/index.md` chính xác
7. Cross-reference check — xác minh tất cả link giữa stories, test cases và index file còn nguyên vẹn
8. Xuất sync report:

```
Sync-docs complete
---------------------------------
Changes analyzed:    N files changed, N commits
Stories updated:     [list or "none"]
Stories created:     [list or "none"]
Test cases updated:  [list or "none"]
Test cases added:    N new cases
Test results reset:  [list of TC IDs reset to PENDING]
Unit tests synced:   [list or "none"]
Unit tests result:   PASS / FAIL
E2E tests synced:    [list or "none"]
E2E tests result:    PASS / FAIL
Index files:         updated / no changes
Cross-references:    OK / issues found
```

**Your role:** Review sync report. Nếu có test result nào bị reset về PENDING, chạy lại `/self-test` để verify.

## When to Use Which Workflow

Không phải task nào cũng cần đủ 4 phase. Chọn mức độ phù hợp dựa trên độ phức tạp:

### Full Workflow (all 4 phases)

Dùng cho: feature mới, multi-screen flow, business logic phức tạp, bất kỳ thứ gì liên quan đến payment/sync.

```
/task-explore -> implement (TDD) -> /self-test -> /sync-docs
```

### Light Workflow (Phase 2 + 4 only)

Dùng cho: bug fix đơn giản, thay đổi copy, styling tweak, config update, refactor nhỏ khi behavior đã rõ ràng và đã có test case.

```
implement (TDD) -> /sync-docs
```

Bỏ qua Phase 1 vì scope đã rõ và test case đã tồn tại (hoặc không cần thiết).  
Bỏ qua Phase 3 vì thay đổi đủ nhỏ để verify thủ công hoặc qua unit test.

### How to decide

| Câu hỏi                                        | Yes -> Full | No -> Light |
| ---------------------------------------------- | ----------- | ----------- |
| Đây có phải là user-facing behavior mới không? | Full        | Light       |
| Có thay đổi existing user flow không?          | Full        | Light       |
| Có thể gây ra lỗi non-obvious không?           | Full        | Light       |
| Chỉ thay đổi một file với scope hiển nhiên?    | Light       | Full        |

**Khi không chắc, dùng full workflow.** Chi phí chạy `/task-explore` cho một task đơn giản là thấp. Chi phí bỏ qua nó cho một task phức tạp thì rất cao.

## Workflow Rules

1. **Mặc định dùng full workflow.** Chỉ dùng light workflow khi task rõ ràng là đơn giản (xem bảng quyết định ở trên).
2. **Human review là bắt buộc** giữa tất cả các Phase đều được prompt để chờ review, hãy đọc kĩ và yêu cầu AI chỉnh sửa trước khi qua bước tiếp theo.
3. **Tests trước code.** Phase 2 theo TDD. Nếu bạn thấy mình đang viết implementation mà chưa có test, hãy dừng lại.
4. **Self-test dùng browser thật.** Không phải mocked unit test — nó click qua UI thực tế như cách Tester thường làm. Có thể thay localhost bằng app thật.
5. **Failures được báo cáo, không tự fix.** Bạn quyết định cách xử lý failures từ Phase 3.
6. **Luôn sync docs sau khi ship.** Phase 4 giữ documentation không bị lỗi thời. Nếu test result reset về PENDING, chạy lại `/self-test`.
