# Gửi Card Message qua Lark Custom Bot

> Webhook URL được lấy từ `resources.md` → key `LARK_NOTIFY_URL`

## Mục lục

- [1. Cấu trúc Payload](#1-cấu-trúc-payload)
- [2. Các field bắt buộc](#2-các-field-bắt-buộc)
- [3. Tùy chỉnh Header Card](#3-tùy-chỉnh-header-card)
- [4. Các loại Element](#4-các-loại-element)
- [5. Ví dụ hoàn chỉnh](#5-ví-dụ-hoàn-chỉnh)
- [6. Gửi request](#6-gửi-request)

---

## 1. Cấu trúc Payload
```json
{
  "msg_type": "interactive",
  "card": {
    "config": {
      "wide_screen_mode": true
    },
    "header": {
      "title": {
        "tag": "plain_text",
        "content": "Tiêu đề card"
      },
      "template": "blue"
    },
    "elements": []
  }
}
```

---

## 2. Các field bắt buộc

| Field | Kiểu | Giá trị bắt buộc | Mô tả |
|---|---|---|---|
| `msg_type` | string | `"interactive"` | Loại message, phải là `interactive` cho card |
| `card.config.wide_screen_mode` | boolean | `true` | Hiển thị card full width |
| `card.header.title.tag` | string | `"plain_text"` | Kiểu text của tiêu đề |
| `card.header.title.content` | string | Tuỳ ý | Nội dung tiêu đề |
| `card.header.template` | string | Xem bảng màu | Màu nền header |
| `card.elements` | array | Tối thiểu 1 item | Danh sách nội dung card |

---

## 3. Tùy chỉnh Header Card

### Màu `template`

| Giá trị | Màu |
|---|---|
| `blue` | Xanh dương |
| `green` | Xanh lá |
| `red` | Đỏ |
| `yellow` | Vàng |
| `grey` | Xám |
| `purple` | Tím |
| `turquoise` | Ngọc lam |
| `carmine` | Đỏ sẫm |

---

## 4. Các loại Element

Mỗi item trong mảng `elements` là một block nội dung.

### `div` — Văn bản
```json
{
  "tag": "div",
  "text": {
    "tag": "lark_md",
    "content": "Hỗ trợ **bold**, _italic_, [link](https://example.com)"
  }
}
```

### `hr` — Đường kẻ phân cách
```json
{
  "tag": "hr"
}
```

### `div` với nhiều cột
```json
{
  "tag": "div",
  "fields": [
    {
      "is_short": true,
      "text": { "tag": "lark_md", "content": "**Môi trường**\nProduction" }
    },
    {
      "is_short": true,
      "text": { "tag": "lark_md", "content": "**Phiên bản**\nv2.1.0" }
    }
  ]
}
```

### `action` — Nút bấm
```json
{
  "tag": "action",
  "actions": [
    {
      "tag": "button",
      "text": { "tag": "plain_text", "content": "Xem chi tiết" },
      "type": "primary",
      "url": "https://example.com"
    },
    {
      "tag": "button",
      "text": { "tag": "plain_text", "content": "Bỏ qua" },
      "type": "default",
      "url": "https://example.com"
    }
  ]
}
```

> Giá trị `type` cho button: `primary` (xanh) · `danger` (đỏ) · `default` (xám)

### `note` — Ghi chú nhỏ cuối card
```json
{
  "tag": "note",
  "elements": [
    {
      "tag": "plain_text",
      "content": "Gửi tự động bởi AI workflow"
    }
  ]
}
```

---

## 5. Ví dụ hoàn chỉnh

### Thông báo Deploy thành công
```json
{
  "msg_type": "interactive",
  "card": {
    "config": { "wide_screen_mode": true },
    "header": {
      "title": { "tag": "plain_text", "content": "Deploy thành công" },
      "template": "green"
    },
    "elements": [
      {
        "tag": "div",
        "fields": [
          {
            "is_short": true,
            "text": { "tag": "lark_md", "content": "**Môi trường**\nProduction" }
          },
          {
            "is_short": true,
            "text": { "tag": "lark_md", "content": "**Phiên bản**\nv2.1.0" }
          }
        ]
      },
      { "tag": "hr" },
      {
        "tag": "div",
        "text": { "tag": "lark_md", "content": "Triển khai hoàn tất, không có lỗi phát sinh." }
      },
      {
        "tag": "action",
        "actions": [
          {
            "tag": "button",
            "text": { "tag": "plain_text", "content": "Xem Log" },
            "type": "primary",
            "url": "https://your-dashboard.com/logs"
          }
        ]
      },
      {
        "tag": "note",
        "elements": [
          { "tag": "plain_text", "content": "Tự động gửi bởi CI/CD pipeline" }
        ]
      }
    ]
  }
}
```

### Thông báo lỗi / cảnh báo
```json
{
  "msg_type": "interactive",
  "card": {
    "config": { "wide_screen_mode": true },
    "header": {
      "title": { "tag": "plain_text", "content": "Phát hiện lỗi" },
      "template": "red"
    },
    "elements": [
      {
        "tag": "div",
        "text": { "tag": "lark_md", "content": "**Mô tả:** Server `prod-01` không phản hồi." }
      },
      { "tag": "hr" },
      {
        "tag": "div",
        "fields": [
          {
            "is_short": true,
            "text": { "tag": "lark_md", "content": "**Mức độ**\nCritical" }
          },
          {
            "is_short": true,
            "text": { "tag": "lark_md", "content": "**Thời gian**\n07/04/2026 14:30" }
          }
        ]
      },
      {
        "tag": "action",
        "actions": [
          {
            "tag": "button",
            "text": { "tag": "plain_text", "content": "Xem chi tiết" },
            "type": "danger",
            "url": "https://your-dashboard.com/alerts"
          }
        ]
      }
    ]
  }
}
```

---

## 6. Gửi request

### cURL
```bash
curl -X POST "$LARK_NOTIFY_URL" \
  -H "Content-Type: application/json" \
  -d '{ "msg_type": "interactive", "card": { ... } }'
```

### JavaScript
```javascript
const LARK_NOTIFY_URL = process.env.LARK_NOTIFY_URL; // hoặc lấy từ resources.md

async function sendCard(card) {
  const res = await fetch(LARK_NOTIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ msg_type: 'interactive', card }),
  });
  return res.json();
}
```

### Python
```python
import os, requests

LARK_NOTIFY_URL = os.environ["LARK_NOTIFY_URL"]  # hoặc lấy từ resources.md

def send_card(card: dict):
    payload = { "msg_type": "interactive", "card": card }
    return requests.post(LARK_NOTIFY_URL, json=payload).json()
```
