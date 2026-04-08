# Registry Contract

Quy định cách đọc/ghi Feature Registry khi nhiều dev cùng làm việc trên 1 workspace.

## Nguyên tắc cốt lõi

**Mỗi dev sở hữu stories riêng, không sửa file của người khác.**

## Cấu trúc ownership

```
docs/features/{FEATURE_FLAG}/
├── manifest.yaml              ← Lead dev quản lý (source of truth)
├── user-stories/
│   ├── US-001.md              ← Dev A sở hữu (assigned trong manifest)
│   ├── US-002.md              ← Dev A sở hữu
│   └── US-003.md              ← Dev B sở hữu
├── test-cases/
│   ├── TC-001.md              ← Ai viết test đó sở hữu
│   ├── coverage-matrix.md     ← Lead dev hoặc tester cập nhật
│   └── ...
└── decisions/
    └── ADR-001.md             ← Ai tạo ADR đó sở hữu
```

## Quy tắc concurrent access

### 1. User Story files (US-xxx.md)

| Ai | Được làm gì |
|----|------------|
| Dev được assign | Đọc + sửa status, updated date, check AC |
| Dev khác | Chỉ đọc |
| PO | Đọc + sửa nội dung story, AC (khi status = draft/approved) |

**Nguyên tắc:** Khi story đã `implementing` hoặc `done`, chỉ dev assigned được sửa.

### 2. Test Case files (TC-xxx.md)

| Ai | Được làm gì |
|----|------------|
| Dev viết test | Đọc + sửa |
| Tester | Đọc + sửa status (pass/fail), actual result |
| Dev khác | Chỉ đọc |

### 3. manifest.yaml

| Field | Ai sửa | Khi nào |
|-------|--------|--------|
| `feature.status` | Lead dev | Khi chuyển phase |
| `feature.version` | Lead dev | Khi thay đổi stories |
| `ownership.developers[].stories` | Lead dev | Khi assign/reassign |
| `history` | Ai thay đổi gì thêm entry đó | Append-only, không sửa entries cũ |

### 4. registry.yaml

| Field | Ai sửa | Khi nào |
|-------|--------|--------|
| `features.{flag}.status` | Lead dev hoặc task-flow | Khi feature chuyển phase |
| `features.{flag}.stories_done` | Skill `/implement` | Auto-increment khi story done |
| `features.{flag}.tests_*` | Test skills | Sau khi chạy test |
| `features.{flag}.coverage` | `/check-quality` | Sau quality gate |

### 5. coverage-matrix.md

| Ai | Được làm gì |
|----|------------|
| Test skills | Tự động cập nhật sau khi tạo TC file |
| Lead dev / Tester | Review và điều chỉnh nếu cần |

## Tránh xung đột Git

### Branch strategy

```
main
├── feature/{FEATURE_FLAG}                  ← Integration branch (lead dev)
│   ├── feature/{FEATURE_FLAG}/US-001       ← Dev A
│   ├── feature/{FEATURE_FLAG}/US-002       ← Dev A
│   └── feature/{FEATURE_FLAG}/US-003       ← Dev B
```

### Merge flow

```
Dev A xong US-001 → merge vào feature/{FEATURE_FLAG}
Dev B xong US-003 → merge vào feature/{FEATURE_FLAG}
Lead dev review → merge feature/{FEATURE_FLAG} vào main
```

### Giảm conflict trên manifest.yaml

1. **history** — append-only (thêm cuối file), ít conflict
2. **stories_done** — chỉ tăng, không giảm
3. **Nếu conflict xảy ra:**
   - `status`: lấy giá trị "tiến hơn" (in-progress > approved > draft)
   - `stories_done`: lấy giá trị lớn hơn
   - `history`: giữ cả 2 entries, sắp xếp theo date

## Quy trình khi dev mới join feature

1. Lead dev thêm dev vào `manifest.yaml` → `ownership.developers`
2. Assign stories cho dev mới
3. Dev mới đọc manifest + user stories đã có để hiểu context
4. Dev mới tạo branch `feature/{FEATURE_FLAG}/US-xxx` và bắt đầu `/implement`
