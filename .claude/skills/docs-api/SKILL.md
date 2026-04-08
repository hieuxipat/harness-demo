---
name: docs-api
description: >
  Tạo hoặc cập nhật API documentation bằng Swagger decorators cho NestJS backend.
  Dùng sau khi implement xong feature có thay đổi API (controller, DTO, entity),
  hoặc user nói "docs api", "swagger", "update api docs", "thêm swagger decorators".
  Tham khảo skill /swagger-ref cho OpenAPI specification chi tiết.
---

# API Documentation (Swagger)

Thêm hoặc cập nhật Swagger decorators vào NestJS controllers và DTOs để API documentation luôn đồng bộ với code. API không có docs thì người dùng (frontend dev, partner, QA) phải đọc code hoặc đoán — Swagger giải quyết việc này.

## Trigger

```
/docs-api
```

## Khi nào dùng

- Sau khi implement feature có thay đổi API endpoints
- Khi thêm/sửa controller, DTO, hoặc response format
- Được gọi tự động trong `/task-flow` sau bước code review

## Quy trình

### Step 1: Xác định scope thay đổi

Tìm các files API đã thay đổi:

```bash
git diff --name-only -- backend/ | grep -E '\.(controller|dto|entity)\.ts$'
```

Nếu không có changes (đã commit) thì dùng:
```bash
git diff --name-only HEAD~1..HEAD -- backend/ | grep -E '\.(controller|dto|entity)\.ts$'
```

### Step 2: Đọc code và xác định cần docs gì

Với mỗi file thay đổi, kiểm tra:

**Controllers** — mỗi endpoint cần:
- `@ApiTags('group-name')` — nhóm endpoints theo module
- `@ApiOperation({ summary: '...' })` — mô tả ngắn endpoint làm gì
- `@ApiResponse({ status: 200, description: '...', type: ResponseDto })` — response thành công
- `@ApiResponse({ status: 4xx/5xx, description: '...' })` — error cases
- `@ApiBearerAuth()` — nếu endpoint cần auth
- `@ApiParam()` / `@ApiQuery()` — nếu có path params hoặc query params

**DTOs** — mỗi property cần:
- `@ApiProperty({ description: '...', example: '...' })` — mô tả field
- `@ApiPropertyOptional()` — cho optional fields
- `@ApiProperty({ enum: EnumType })` — cho enum fields
- `@ApiProperty({ type: [ItemDto] })` — cho array fields

### Step 3: Thêm/cập nhật decorators

Đọc conventions Swagger hiện tại trong codebase (xem các controller/DTO đã có docs) để giữ nhất quán.

Đảm bảo import đúng từ `@nestjs/swagger`:

```typescript
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
  ApiPropertyOptional,
  ApiBearerAuth,
} from '@nestjs/swagger';
```

### Step 4: Verify

- Không có lỗi TypeScript sau khi thêm decorators
- Mỗi public endpoint đều có `@ApiOperation` và ít nhất 1 `@ApiResponse`
- Mỗi DTO property dùng trong request/response đều có `@ApiProperty`
- Examples trong `@ApiProperty` phản ánh đúng data type và format thực tế

### Step 5: Báo cáo

```
API Docs: [UPDATED]
- Controllers updated: X
- DTOs updated: X
- Endpoints documented: X
- Chi tiết:
  - FeatureController: 3 endpoints (GET, POST, PATCH)
  - CreateFeatureDto: 5 properties
  - FeatureResponseDto: 8 properties
```

## Tham khảo

Khi cần tra cứu OpenAPI specification chi tiết, đọc references trong skill `/swagger-ref`:
- `references/specification.md` — OpenAPI 3.0 spec đầy đủ
- `references/api.md` — Swagger API docs

## Lưu ý

- Không thay đổi logic code — chỉ thêm/sửa decorators và imports
- Giữ summary ngắn gọn (1 dòng), dùng description cho giải thích dài
- Example values phải realistic (không dùng "string", "test", "abc")
- Nếu project chưa setup Swagger module, thông báo user cần setup trước
