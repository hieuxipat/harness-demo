---
name: hotfix-flow
description: >
  Workflow orchestrator rút gọn cho hotfix/bug fix gấp.
  Dùng khi user cần fix bug gấp, hoặc nói
  "hotfix", "fix bug gấp", "urgent fix", "hotfix flow".
  Bỏ qua explore-task, break-task, docs-api, test-e2e — tập trung vào fix nhanh và đảm bảo quality.
---

# Hotfix Flow — Quick Fix Orchestrator

Workflow rút gọn cho hotfix. Tập trung vào: hiểu bug → fix → review → quality → commit. Không cần phân tích task hay E2E test.

## Trigger

```
/hotfix-flow
```

Input: Bug description hoặc issue link.

## Các bước

### [1] Hiểu context bug → `/explore-codebase`

Scan codebase để hiểu context xung quanh bug:
- Tìm root cause
- Xác định files liên quan
- Hiểu impact scope

### [2] Fix + Test → `/implement`

Implement fix theo TDD:
1. Viết failing test reproduce bug
2. Fix code tối thiểu để test pass
3. Verify không break test cũ

### [3] Quick review → `/review-code`

Agent riêng review changes. Focus vào:
- Fix đúng root cause (không chỉ fix symptom)
- Không introduce regression
- Không break gì khác

### [4] Quality check → `/check-quality`

Unit tests + SonarQube scan. Đảm bảo fix không break quality gate.

### [5] Commit & Notify (URGENT)

1. Xác nhận với user trước khi commit
2. Commit message: `fix: {mô tả bug}` (conventional commits)
3. Gọi `/notify` với **URGENT flag** (template `red`) qua Larkbot

## SKIP trong hotfix

- `/explore-task` — không cần lấy từ board
- `/break-task` — bug fix thường đủ nhỏ
- `/docs-api` — hotfix hiếm khi thay đổi API contract
- `/test-e2e` — ưu tiên speed, E2E test sau nếu cần

## Nguyên tắc

- Speed quan trọng nhưng KHÔNG bỏ qua quality gate
- Luôn có test reproduce bug trước khi fix
- Notify team ngay sau khi commit (URGENT)
- Nếu hotfix scope lớn hơn dự kiến → chuyển sang `/task-flow`
