# Features Index

Danh sách các tính năng được tổ chức theo thứ tự triển khai.

## Cấu trúc thư mục

```
docs/
├── index.md                          # File này - index tổng hợp
├── _example-feature/                 # Template mẫu (prefix _ = không phải feature thật)
│   ├── user-story-01/
│   │   ├── user-story.md             # Mô tả user story
│   │   ├── test-case.md              # Test cases cho story này
│   │   ├── plans/                    # Implementation plans (superpower sinh)
│   │   │   └── plan-v1.md
│   │   └── specs/                    # Technical specs (superpower sinh)
│   │       └── spec-v1.md
│   └── user-story-02/
│       ├── user-story.md
│       ├── test-case.md
│       ├── plans/
│       └── specs/
└── 001-feature-name/                 # Feature thật, đánh số thứ tự
    └── ...
```

## Quy ước đặt tên

- **Feature folder**: `{số-3-chữ-số}-{tên-feature-kebab-case}/` (vd: `001-add-carrier`)
- **User story folder**: `user-story-{số-2-chữ-số}/` (vd: `user-story-01`)
- **Plans/Specs**: versioned files bên trong folder `plans/`, `specs/`

## Danh sách Features

| # | Feature | Status | User Stories |
|---|---------|--------|--------------|
| - | [_example-feature](./_example-feature/) | Template | 2 stories mẫu |
