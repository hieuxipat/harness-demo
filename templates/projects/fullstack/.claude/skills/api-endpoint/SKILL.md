---
name: api-endpoint
description: "Create REST API endpoints with route-controller-service pattern"
---

# API Endpoint

Create REST API endpoints following team conventions.

## When to use

When adding new API routes/endpoints.

## Instructions

### Structure

For each resource:

routes/<resource>.routes.ts      ← Route definitions
controllers/<resource>.controller.ts  ← Request handling
services/<resource>.service.ts        ← Business logic
middleware/                           ← Auth, validation

### Conventions

- Routes: RESTful naming (GET /resources, POST /resources, etc.)
- Controllers: thin — validate input, call service, send response
- Services: all business logic here, no req/res objects
- Error handling: throw typed errors, catch in errorHandler middleware
- Validation: validate request body/params at controller level
- Response format: consistent JSON shape { data, error, meta }

### HTTP Status Codes

| Code | When |
|---|---|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 204 | No content (DELETE) |
| 400 | Bad request (validation failed) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (no permission) |
| 404 | Not found |
| 500 | Internal server error |

### Testing

- Test each endpoint: success + error cases
- Use supertest for HTTP testing
- Mock service layer for unit tests
- Test validation: bad input should return 400
