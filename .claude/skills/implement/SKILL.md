---
name: implement
description: >
  Implement code theo phương pháp TDD: viết test trước, xem fail, viết code tối thiểu để pass.
  Dùng khi implement feature, fix bug, refactor, hoặc user nói
  "implement", "code feature", "fix bug", "viết code", "TDD".
  Skill này là bước implement chính trong workflow — mọi production code
  phải đi qua chu trình Red-Green-Refactor.
---

# Implement (TDD)

Viết test trước. Xem nó fail. Viết code tối thiểu để pass.

Nếu chưa thấy test fail, bạn không biết nó có test đúng thứ không. Test viết sau code dễ bị bias bởi implementation — bạn test cái bạn đã viết, không phải cái cần đúng.

## Trigger

```
/implement
```

Input: User story (từ `/break-task` hoặc manual)

## Khi nào dùng

**Luôn luôn:** new features, bug fixes, refactoring, behavior changes.

**Ngoại lệ (hỏi user trước):** throwaway prototypes, generated code, config files.

## Quy trình

### Step 0: Chuẩn bị context

1. Đọc conventions từ `/explore-codebase` (nếu đã chạy trước đó)
2. Đọc test cases từ `docs/{FEATURE_FLAG}/test-cases/` (nếu có)
3. Xác định scope: Backend / Frontend / Storefront

### Quy tắc sắt

```
KHÔNG VIẾT PRODUCTION CODE KHI CHƯA CÓ FAILING TEST
```

Đã viết code trước test? Xoá đi. Bắt đầu lại.

## Chu trình Red-Green-Refactor

### RED — Viết failing test

Viết **một** test cho **một** behavior:
- Tên test mô tả rõ hành vi được test (nếu có "and" trong tên → tách thành 2 test)
- Dùng real code, mock chỉ khi không thể tránh (external API, file system...)
- Test phải thể hiện API mong muốn — đây là lúc design interface

**Ví dụ tốt:**
```typescript
test('rejects empty email with validation error', async () => {
  const result = await submitForm({ email: '' });
  expect(result.error).toBe('Email required');
});
```

**Ví dụ xấu:**
```typescript
test('test email', async () => {
  const mock = jest.fn().mockResolvedValue(true);
  expect(mock).toHaveBeenCalled(); // testing mock, not behavior
});
```

### Verify RED — Xem test fail

**Bắt buộc, không bao giờ bỏ qua.**

```bash
npm test path/to/test.test.ts
```

Kiểm tra:
- Test **fail** (không phải error/crash)
- Fail message đúng lý do — vì feature chưa có, không phải typo hay import lỗi
- Nếu test pass ngay → bạn đang test behavior cũ, sửa lại test

### GREEN — Code tối thiểu

Viết code đơn giản nhất để test pass. Đừng:
- Thêm feature chưa có test
- Refactor code khác
- "Cải thiện" gì ngoài phạm vi test hiện tại
- Over-engineer với config/options chưa cần

### Verify GREEN — Xem test pass

**Bắt buộc.**

```bash
npm test path/to/test.test.ts
```

- Test mới pass
- Tất cả test cũ vẫn pass
- Output sạch (không error, không warning)
- Nếu test fail → sửa code, không sửa test

### REFACTOR — Dọn dẹp

Chỉ sau khi green: bỏ duplication, cải thiện naming, extract helpers. Tests phải giữ green xuyên suốt. Không thêm behavior mới trong bước này.

### Lặp lại

Quay lại RED cho behavior tiếp theo. User confirm mỗi cycle.

## Testing Anti-Patterns

| Anti-pattern | Vấn đề | Fix |
|-------------|---------|-----|
| Assert trên mock element | Test mock chứ không test code | Test real component hoặc bỏ mock |
| Test-only methods trong production class | Pollute production code | Chuyển vào test utilities |
| Mock mà không hiểu dependencies | Mock che side effects | Hiểu dependency chain trước |
| Incomplete mock data | Test pass nhưng integration fail | Mirror đầy đủ cấu trúc response thật |

**Nguyên tắc chung:** Mock là công cụ để isolate, không phải thứ cần test. Nếu đang assert trên mock behavior → đã đi sai hướng.

## Lưu ý quan trọng

- Không tạo test case với giá trị fixed chỉ để pass — test phải cover đủ trường hợp thực tế
- Bug found? Viết failing test reproduce bug trước, rồi mới fix
- Khi test khó viết → design có vấn đề. Lắng nghe test — hard to test = hard to use

## Checklist trước khi hoàn thành

- [ ] Mỗi function/method mới có test
- [ ] Đã xem mỗi test fail trước khi implement
- [ ] Test fail đúng lý do (feature thiếu, không phải typo)
- [ ] Code tối thiểu để pass mỗi test
- [ ] Tất cả test pass, output sạch
- [ ] Test dùng real code (mock chỉ khi bắt buộc)
- [ ] Edge cases và error cases được cover
