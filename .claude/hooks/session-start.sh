#!/usr/bin/env bash
# SessionStart hook — nhắc ngắn về workflow harness mỗi session.
# KHÔNG inject superpowers nữa (đã gỡ khi migrate sang claude-code-harness plugin).
# Discipline thật do plugin claude-code-harness (bin/harness + hooks) lo; hook này
# chỉ là reminder tối giản, trỏ tới rules/codegraph. CLAUDE.md là nguồn chính.

set -euo pipefail

reminder='Workflow: claude-code-harness (plugin) chạy PER-SUBPROJECT — loop /harness-plan → /harness-work → /harness-review → /harness-sync → /harness-release.\n\nNguyên tắc:\n- Domain rules ở .claude/rules/project-rules.md (Shopify Polaris React, output tiếng Việt, task-sizing). Đọc trước khi plan/work.\n- codegraph query-first: subproject có .codegraph/ thì dùng codegraph_search/context/trace/impact thay grep, chỉ Read/Grep để xác nhận.\n- NO AUTO-COMMIT: luôn gọi /harness-work với --no-commit; user tự commit khi sẵn sàng.\n- Trivial (≤2 file, không đổi product behavior/API/data/permissions/billing) → prompt thẳng, bỏ ceremony.\n- Bug UI Shopify: BẮT BUỘC repro playwright headed trong Admin iframe + lưu evidence/ trước khi fix.'

printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "%s"\n  }\n}\n' "$reminder"

exit 0
