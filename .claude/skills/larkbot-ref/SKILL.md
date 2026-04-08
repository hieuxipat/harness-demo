---
name: larkbot-ref
description: >
  Lark messaging reference — format và cách gửi card message qua Lark webhook.
  Dùng bởi skill /notify và bất kỳ skill nào cần gửi thông báo qua Lark.
---

# Larkbot Reference

Reference skill cho Lark card message format. Xem chi tiết đầy đủ tại file `larkbot.md` ở root project.

## Quick Reference

### Config
- **LARK_NOTIFY_URL** — lấy từ `resources.md`

### Gửi message

```bash
curl -X POST "$LARK_NOTIFY_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "msg_type": "interactive",
    "card": {
      "config": { "wide_screen_mode": true },
      "header": {
        "title": { "tag": "plain_text", "content": "Tiêu đề" },
        "template": "blue"
      },
      "elements": [
        {
          "tag": "div",
          "text": { "tag": "lark_md", "content": "Nội dung message" }
        }
      ]
    }
  }'
```

### Header colors
- `blue` — thông tin
- `green` — thành công
- `red` — lỗi
- `yellow` — cảnh báo
- `purple` — tím
- `grey` — xám

### Element types
- `div` (text) — văn bản markdown
- `div` (fields) — nhiều cột
- `hr` — đường kẻ
- `action` (buttons) — nút bấm
- `note` — ghi chú cuối card

Chi tiết đầy đủ: xem file `larkbot.md` ở root project.
