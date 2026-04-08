---
name: notify
description: >
  Gửi notification qua Larkbot webhook.
  Dùng khi cần thông báo cho team: task hoàn thành, lỗi phát sinh, cần review, hotfix urgent.
  Được gọi bởi orchestrators (task-flow, hotfix-flow) hoặc chạy độc lập.
---

# Notify

Gửi notification qua Lark webhook. Được dùng ở cuối workflow hoặc khi cần thông báo cho team.

## Trigger

```
/notify
```

## Config

Lấy từ `resources.md`:
- **LARK_NOTIFY_URL** — Lark Bot webhook URL
- **APP_NAME** — Tên app

Format message: xem `/larkbot-ref` hoặc file `larkbot.md`

## Notification Types

### 1. Task Completed

```json
{
  "msg_type": "interactive",
  "card": {
    "config": { "wide_screen_mode": true },
    "header": {
      "title": { "tag": "plain_text", "content": "Task hoàn thành — {APP_NAME}" },
      "template": "green"
    },
    "elements": [
      {
        "tag": "div",
        "fields": [
          { "is_short": true, "text": { "tag": "lark_md", "content": "**Feature**\n{FEATURE_FLAG}" } },
          { "is_short": true, "text": { "tag": "lark_md", "content": "**Scope**\n{scope}" } }
        ]
      },
      { "tag": "hr" },
      {
        "tag": "div",
        "text": { "tag": "lark_md", "content": "**Summary:**\n{summary of changes}" }
      },
      {
        "tag": "div",
        "text": { "tag": "lark_md", "content": "**Quality:**\n- Tests: {pass_count} passed\n- Coverage: {coverage}%\n- SonarQube: {sonar_status}" }
      }
    ]
  }
}
```

### 2. Hotfix Urgent

```json
{
  "msg_type": "interactive",
  "card": {
    "config": { "wide_screen_mode": true },
    "header": {
      "title": { "tag": "plain_text", "content": "URGENT Hotfix — {APP_NAME}" },
      "template": "red"
    },
    "elements": [
      {
        "tag": "div",
        "text": { "tag": "lark_md", "content": "**Bug:** {bug_description}\n**Fix:** {fix_summary}" }
      },
      { "tag": "hr" },
      {
        "tag": "div",
        "fields": [
          { "is_short": true, "text": { "tag": "lark_md", "content": "**Commit**\n{commit_hash}" } },
          { "is_short": true, "text": { "tag": "lark_md", "content": "**Tests**\nPassed" } }
        ]
      }
    ]
  }
}
```

### 3. Missing User Stories (yêu cầu PO bổ sung)

```json
{
  "msg_type": "interactive",
  "card": {
    "config": { "wide_screen_mode": true },
    "header": {
      "title": { "tag": "plain_text", "content": "Cần bổ sung User Stories — {APP_NAME}" },
      "template": "yellow"
    },
    "elements": [
      {
        "tag": "div",
        "text": { "tag": "lark_md", "content": "PO cần bổ sung user stories cho feature flag **{FEATURE_FLAG}**" }
      }
    ]
  }
}
```

### 4. Review Request

```json
{
  "msg_type": "interactive",
  "card": {
    "config": { "wide_screen_mode": true },
    "header": {
      "title": { "tag": "plain_text", "content": "Code Review Request — {APP_NAME}" },
      "template": "blue"
    },
    "elements": [
      {
        "tag": "div",
        "text": { "tag": "lark_md", "content": "**Feature:** {FEATURE_FLAG}\n**Changes:** {file_count} files changed" }
      }
    ]
  }
}
```

## Gửi request

```bash
curl -X POST "$LARK_NOTIFY_URL" \
  -H "Content-Type: application/json" \
  -d '{payload}'
```

## Lưu ý

- Kiểm tra LARK_NOTIFY_URL có trong `resources.md` trước khi gửi
- Nếu LARK_NOTIFY_URL trống → báo user và skip (không fail workflow)
- Nội dung message phải rõ ràng, actionable — người đọc biết cần làm gì
- Hotfix notifications luôn dùng template `red`
