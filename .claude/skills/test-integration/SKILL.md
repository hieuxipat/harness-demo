---
name: test-integration
description: >
  Chạy integration test kiểm tra tương tác giữa các module/layer thật (API, service, database).
  Dùng khi cần verify API endpoint hoạt động đúng với database thật, hoặc user nói
  "integration test", "test API", "test service layer".
  Điều kiện: task có backend scope.
---

# Integration Test

Kiểm tra sự tương tác giữa các layer thật: controller → service → repository → database. Điểm khác biệt với unit test: không mock database — vì mock che giấu những bug chỉ xảy ra khi query thật (sai relation, migration thiếu column, constraint violation).

## Trigger

```
/test-integration
```

Điều kiện: Task có backend scope.

## Quy trình

### Step 1: Xác định scope

1. Lấy user stories từ `docs/{FEATURE_FLAG}/user-stories/`
2. Xác định API endpoints và modules liên quan
3. Liệt kê integration points cần test:
   - Controller → Service → Repository → Database
   - Service → External API (nếu có)
   - Middleware / Guards / Interceptors
4. **Confirm scope với user** trước khi viết test

### Step 2: Viết integration test

Đặt file trong `backend/` theo convention: `*.integration.spec.ts` hoặc trong thư mục `test/`.

Tuân theo TDD (`/implement`): viết failing test → verify fail → implement → pass.

**Nguyên tắc:**
- Database thật (test database), không mock DB — đây là điểm cốt lõi
- Chỉ mock external services nằm ngoài kiểm soát (3rd party API, email service...)
- Test full request lifecycle: HTTP request → controller → service → DB → response
- Setup data riêng cho mỗi test, cleanup sau mỗi test (tránh test depend lẫn nhau)

```typescript
describe('FeatureController (integration)', () => {
  beforeAll(async () => {
    // Setup test module với real DB connection
  });

  afterEach(async () => {
    // Cleanup test data
  });

  it('POST /api/feature — tạo mới thành công', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/feature')
      .send(payload)
      .expect(201);

    expect(response.body).toMatchObject({...});

    // Verify data thật trong DB
    const record = await repository.findOne({...});
    expect(record).toBeDefined();
  });
});
```

### Step 3: Chạy test

```bash
cd backend && npx jest --testPathPattern=integration --coverage
```

**Điều kiện pass:**
- 100% test pass
- Không có side effects còn sót (data cleanup đúng)

### Step 4: Báo cáo

```
Integration Test: [PASSED/FAILED]
- Total: X | Passed: X | Failed: X
- Coverage: XX.X%
- Chi tiết:
  ✓ POST /api/feature — tạo mới thành công
  ✗ GET /api/feature/:id — lý do fail
```

Nếu có test fail → fix theo TDD cycle hoặc báo user.

## Lưu ý

- Cần test database chạy sẵn (hoặc in-memory DB nếu project hỗ trợ)
- Mỗi test tự tạo và tự dọn data — không rely vào data từ test khác
- Khi test flaky (pass/fail không ổn định) → thường do cleanup không sạch hoặc race condition
