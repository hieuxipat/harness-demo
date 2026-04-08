---
name: review-code
description: >
  Review toàn bộ code đã implement, đưa ra feedback và chờ xác nhận trước khi sửa.
  Dùng khi implement xong và cần review, hoặc user nói
  "review code", "check lại code", "xem code có ổn không".
  Sử dụng agent riêng để đảm bảo review khách quan.
---

# Code Review

Review toàn bộ code vừa implement trước khi chuyển sang bước tiếp theo. Lý do dùng agent riêng: agent review không có context về quá trình implement, nên sẽ đọc code với con mắt "người mới" — giống như reviewer thật.

## Trigger

```
/review-code
```

## Quy trình

### Step 1: Spawn review agent

Mở 1 agent riêng để review code. Agent cần nhận:
- Danh sách file đã thay đổi: `git diff --name-only`
- Nội dung thay đổi: `git diff` (staged + unstaged)
- Feature manifest: `docs/features/{FEATURE_FLAG}/manifest.yaml`
- User stories và acceptance criteria: `docs/features/{FEATURE_FLAG}/user-stories/US-xxx.md`
- Coverage matrix: `docs/features/{FEATURE_FLAG}/test-cases/coverage-matrix.md`

Agent review sẽ verify code match với acceptance criteria trong user stories — nếu có AC chưa được cover bởi code, báo là Blocker.

### Step 2: Agent review và phân loại feedback

Agent review sẽ kiểm tra và phân loại feedback:

#### 🔴 Blockers — phải fix
- Bugs, logic errors
- Security vulnerabilities (injection, XSS, auth bypass...)
- Data loss risks
- Breaking changes không backward-compatible

#### 🟡 Warnings — nên fix
- Performance issues (N+1 queries, unnecessary re-renders...)
- Maintainability concerns (phức tạp quá, coupling cao)
- Missing error handling ở boundaries
- Inconsistent với conventions hiện tại

#### 🔵 Suggestions — tuỳ chọn
- Code style, naming improvements
- Minor refactoring opportunities
- Documentation gaps
- Test coverage gaps

### Step 3: Trình bày và chờ xác nhận

Gửi toàn bộ feedback cho user với phân loại rõ ràng. Format:

```markdown
## Code Review Results

### 🔴 Blockers (X items)
1. **[file:line]** — Mô tả vấn đề
   → Suggestion: ...

### 🟡 Warnings (X items)
1. **[file:line]** — Mô tả vấn đề
   → Suggestion: ...

### 🔵 Suggestions (X items)
1. **[file:line]** — Mô tả
   → Suggestion: ...
```

Hỏi user:
- Muốn fix những items nào?
- Có item nào muốn bỏ qua?

**Chỉ tiến hành sửa code sau khi user đồng ý.** Không tự ý sửa — vì user có thể có context mà reviewer không biết.

### Step 4: Áp dụng fixes

Fix theo thứ tự: Blockers → Warnings → Suggestions (nếu user chọn).

Sau khi fix, báo lại user:
```markdown
## Fixes Applied
- ✅ [Blocker 1] — đã fix: mô tả ngắn
- ✅ [Warning 2] — đã fix: mô tả ngắn
- ⏭️ [Suggestion 3] — skipped theo yêu cầu
```

### Step 5: Cập nhật manifest (nếu có thay đổi sau review)

Nếu review dẫn đến fix code → cập nhật `manifest.yaml`:
- `history` — thêm entry: "Code review fixes for US-xxx"

## Lưu ý

- Review phải dựa trên git diff thực tế, không phải assumptions
- Nếu không có changes (git diff trống) → báo user và skip
- Không review generated files (lock files, build output...)
- Focus vào logic và behavior, không nitpick formatting nếu project có linter
- Đối chiếu code với acceptance criteria trong user stories — đây là tiêu chí quan trọng nhất
