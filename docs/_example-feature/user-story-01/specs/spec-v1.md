# Technical Spec v1 - US-01: Thêm nhà vận chuyển

> Spec này được sinh bởi superpower /sp-brainstorming

## Data Model

```
Carrier {
  id: UUID (PK)
  name: string (required, max 255)
  code: string (required, unique, max 50)
  api_endpoint: string (required, valid URL)
  status: enum [active, inactive] (default: active)
  created_at: timestamp
  updated_at: timestamp
}
```

## API Design

### POST /api/carriers

**Request:**
```json
{
  "name": "VNPost",
  "code": "VNP",
  "api_endpoint": "https://api.vnpost.vn"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "VNPost",
  "code": "VNP",
  "api_endpoint": "https://api.vnpost.vn",
  "status": "active",
  "created_at": "2026-04-10T00:00:00Z"
}
```

**Error (422):**
```json
{
  "errors": {
    "code": ["Mã nhà vận chuyển đã tồn tại"]
  }
}
```

## Validation Rules

| Field | Rules |
|-------|-------|
| name | required, max:255 |
| code | required, unique, max:50, alpha_dash |
| api_endpoint | required, valid URL format |
