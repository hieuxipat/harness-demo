---
name: api-endpoint
description: "Create REST API endpoints with route-controller-service pattern"
---

# API Endpoint

Create REST API endpoints following NestJS conventions.

## When to use

When adding new API routes/endpoints.

## Instructions

### Structure

For each resource, create a module:

<resource>/
├── <resource>.module.ts        ← Module declaration
├── <resource>.controller.ts    ← HTTP handling (decorators, params)
├── <resource>.service.ts       ← Business logic (injectable)
└── <resource>.dto.ts           ← Request/response DTOs

### Conventions

- Generate with: `nest generate resource <name>`
- Controllers: use decorators (@Get, @Post, @Put, @Delete, @Param, @Body, @Query)
- Services: all business logic here, injected via constructor
- DTOs: define request shape for each operation (CreateXDto, UpdateXDto)
- Response format: consistent JSON shape `{ data, error, meta }`
- Register module in parent module's `imports` array

### HTTP Status Codes

| Code | When |
|---|---|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Created (POST) — use @HttpCode(HttpStatus.CREATED) |
| 204 | No content (DELETE) — use @HttpCode(HttpStatus.NO_CONTENT) |
| 400 | Bad request — throw BadRequestException |
| 401 | Unauthorized — throw UnauthorizedException |
| 403 | Forbidden — throw ForbiddenException |
| 404 | Not found — throw NotFoundException |
| 500 | Internal server error (automatic) |

### Testing

- Unit test services with mocked dependencies
- E2E test endpoints with @nestjs/testing TestingModule + supertest
- Test validation: bad input should return 400
