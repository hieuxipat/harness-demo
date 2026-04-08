---
name: explore-codebase
description: >
  Khám phá codebase hiện tại: structure, patterns, conventions, tech stack.
  Dùng khi onboard dự án mới, trước khi implement, hoặc user nói
  "explore codebase", "conventions", "code rules", "code pattern", "cấu trúc project".
  Hỗ trợ Backend (NestJS), Frontend (React), Storefront (Theme extension).
---

# Explore Codebase

Trước khi viết bất kỳ dòng code nào, cần hiểu conventions của dự án. Code mới phải nhất quán với code hiện tại — không phải vì "đẹp" mà vì team dễ đọc, dễ maintain, dễ review.

## Trigger

```
/explore-codebase [--path <subdir>]
```

- `--path backend/` → chỉ scan backend
- `--path frontend/` → chỉ scan frontend
- `--path storefront/` → chỉ scan storefront
- Không có `--path` → scan tất cả

## Quy trình

### Step 1: Scan directory structure

Đọc cấu trúc thư mục của scope được chỉ định. Xác định:
- Folder organization (feature-based, layer-based, hybrid)
- File naming conventions (kebab-case, camelCase, PascalCase)
- Test file placement (co-located hay tách riêng)

### Step 2: Detect tech stack & versions

Đọc `package.json` (hoặc tương đương) để xác định:
- Framework và version
- Key dependencies
- Scripts có sẵn (test, lint, build, sonar...)

### Step 3: Xác định patterns theo scope

#### Backend (NestJS)

| Aspect | Xem ở đâu |
|--------|-----------|
| Module structure | Cách tổ chức module, imports/exports |
| Controller patterns | Route naming, decorators, response format |
| Service patterns | Business logic, dependency injection |
| DTO patterns | Validation, class-validator decorators |
| Entity patterns | TypeORM/Prisma entities, relations |
| Error handling | Exception filters, custom exceptions |
| Auth/Guards | Authentication, authorization patterns |

#### Frontend (React Admin Dashboard)

| Aspect | Xem ở đâu |
|--------|-----------|
| Folder structure | Cấu trúc thư mục `src/` |
| State management | Cách dùng store, context, hooks |
| API patterns | Cách gọi API, handle response/error |
| Component patterns | Cách tách component, props pattern |
| Error handling & notifications | Toast, error boundary, fallback UI |
| Styling | CSS modules, styled-components, Tailwind, Polaris |
| Routing | Cấu trúc routes, lazy loading |
| i18n | Cách dùng translation keys, file ngôn ngữ |

#### Storefront (Theme Extension / Widget)

| Aspect | Xem ở đâu |
|--------|-----------|
| Theme structure | Liquid templates, sections, snippets |
| JS patterns | Vanilla JS, Web Components, hoặc framework |
| CSS patterns | Tailwind, custom CSS, CSS variables |
| Asset management | Cách load scripts/styles |
| App Bridge | Integration patterns với Shopify admin |

### Step 4: UI/UX Guidelines

Khi scope có frontend hoặc storefront, tham khảo `/ui-shopify` để nắm:
- Shopify Polaris component patterns và best practices
- App Bridge integration patterns
- Accessibility requirements
- Touch & interaction patterns

### Step 5: Output conventions report

Tạo markdown report tóm tắt conventions tìm được. Report này sẽ được các skill khác (`implement`, `review-code`) sử dụng làm reference.

```markdown
## Conventions Report — {scope}

### Tech Stack
- Framework: ...
- Key deps: ...

### Patterns
- Module structure: ...
- Naming: ...
- Error handling: ...
- Testing: ...

### Rules
- ...
```

## Nguyên tắc

- Không đoán — grep, đọc file, xem các module đã implement để rút ra pattern thực tế
- Khi có conflict giữa "best practice chung" và "convention hiện tại của dự án" → ưu tiên convention hiện tại, trừ khi có lý do rõ ràng để thay đổi (và user đồng ý)
- Không tự ý thêm library/pattern mới mà dự án chưa dùng
- Nếu thấy pattern không nhất quán trong codebase, hỏi user pattern nào là chuẩn
