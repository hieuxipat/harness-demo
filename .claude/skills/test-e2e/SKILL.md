---
name: test-e2e
description: >
  Chạy E2E test bằng Playwright CLI, kiểm tra luồng người dùng end-to-end trên trình duyệt thật.
  Dùng khi cần verify toàn bộ luồng từ UI → API → DB → UI, hoặc user nói
  "e2e test", "test trên browser", "test luồng người dùng".
  Hỗ trợ cả admin (frontend) và storefront.
---

# E2E Test

Kiểm tra luồng người dùng end-to-end trên trình duyệt thật bằng Playwright CLI. E2E test bắt được những bug mà unit test và integration test bỏ sót — UI không render đúng, flow navigation bị gãy, data không hiển thị sau khi API trả về.

## Trigger

```
/test-e2e
```

Điều kiện: Task có frontend hoặc storefront scope.

## E2E strategy theo scope

| Scope | Test gì | Session |
|---|---|---|
| Frontend (admin) | Merchant flow trong Shopify admin | Playwright + chrome-profile |
| Storefront | Customer-facing widget/banner | Playwright + store URL |
| Fullstack | Cả admin flow + storefront | Playwright (2 sessions) |

## Thư mục E2E

```
e2e-tests/
├── admin/                # Tests cho frontend (Shopify admin)
│   └── {feature}.spec.ts
├── storefront/           # Tests cho storefront
│   └── {feature}.spec.ts
└── fixtures/             # Shared test data
```

## Quy trình

### Step 1: Chuẩn bị scenarios

1. Đọc manifest từ `docs/features/{FEATURE_FLAG}/manifest.yaml`
2. Lấy user stories từ `docs/features/{FEATURE_FLAG}/user-stories/`
3. Lấy test cases từ `docs/features/{FEATURE_FLAG}/test-cases/`
4. Đọc coverage matrix từ `docs/features/{FEATURE_FLAG}/test-cases/coverage-matrix.md` để biết stories nào chưa có E2E test
3. Xác định luồng chính cần test:
   - **Happy path** — luồng người dùng chuẩn, kỳ vọng thành công
   - **Edge cases** — input không hợp lệ, trạng thái rỗng, lỗi mạng
4. Liệt kê scenarios và **confirm với user** trước khi chạy

### Step 2: Chạy test bằng Playwright CLI

Tham khảo `/playwright-cli` cho CLI reference đầy đủ.

Với mỗi scenario, thực hiện tuần tự:

```bash
# Mở trình duyệt với persistent profile (giữ session login)
playwright-cli open {APP_URL} --profile=chrome-profile

# Snapshot để xem trạng thái hiện tại
playwright-cli snapshot

# Tương tác theo luồng test
playwright-cli fill {ref} "value"
playwright-cli click {ref}
playwright-cli snapshot

# Screenshot kết quả
playwright-cli screenshot --filename=e2e-tests/{scope}/{scenario}-result.png
```

Mỗi bước:
1. Mô tả action đang thực hiện
2. Thực hiện thao tác trên browser
3. Snapshot/screenshot để verify kết quả
4. Ghi nhận PASS hoặc FAIL (kèm lý do)

### Step 3: Verify sau mỗi action

- UI hiển thị đúng data và trạng thái
- Không có console errors: `playwright-cli console`
- Network requests thành công: `playwright-cli network`
- Navigation đúng flow

### Step 4: Tạo test case files và cập nhật coverage

Với mỗi E2E scenario:

1. Tạo file `docs/features/{FEATURE_FLAG}/test-cases/TC-xxx.md` từ template `docs/templates/test-case.template.md`:
   - `type: e2e`
   - `covers: [US-xxx]` — liên kết user stories
   - `covers_ac: [AC-x]` — liên kết acceptance criteria
   - `status: pass | fail`
   - `last_run: {ngày hiện tại}`

2. Cập nhật `docs/features/{FEATURE_FLAG}/test-cases/coverage-matrix.md`:
   - Điền TC-xxx vào cột E2E tương ứng
   - Cập nhật Status

3. Cập nhật `docs/registry.yaml`:
   - `tests_total`, `tests_pass`, `coverage`

### Step 5: Báo cáo

```
E2E Test: [PASSED/FAILED]
- Scope: admin | storefront | fullstack
- Total scenarios: X
- Passed: X | Failed: X
- Test Case Files: docs/features/{FEATURE_FLAG}/test-cases/TC-xxx.md
- Chi tiết:
  ✓ [Scenario 1] — mô tả (TC-E01 → US-001/AC-2)
  ✗ [Scenario 2] — lý do fail (TC-E02 → US-002/AC-1)
- Screenshots: e2e-tests/{scope}/
```

Nếu có test fail → báo user chi tiết và hỏi: fix code hay skip scenario.

## Lưu ý

- Luôn `playwright-cli close` sau khi test xong
- Nếu cần đăng nhập, dùng `playwright-cli state-save auth.json` sau lần login đầu, rồi `state-load auth.json` cho các test sau
- Dùng `playwright-cli network` để debug khi API call không trả về kỳ vọng
- APP_URL lấy từ `resources.md` hoặc hỏi user nếu chưa có
- Persistent profile tại `chrome-profile/` giữ session login giữa các lần test
- Mọi test case phải có file TC-xxx.md liên kết với user story — đảm bảo traceability
