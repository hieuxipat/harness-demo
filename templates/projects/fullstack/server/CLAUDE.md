# Server (NestJS API)

## Commands

- **Dev:** `npm run dev` (port {{server_port}}, watch mode)
- **Build:** `npm run build`
- **Test:** `npm test`
- **Lint:** `npm run lint`

## Architecture

NestJS REST API with TypeScript.

- `src/app.module.ts` — Root module
- `src/<module>/` — Feature modules (module, controller, service, DTOs)
- `src/health.controller.ts` — Health check endpoint

## Conventions

- Module → Controller → Service pattern with dependency injection
- Controllers handle HTTP concerns only (decorators, params, status codes)
- Services contain all business logic, injected via constructor
- Consistent response format: `{ data, error, meta }`
- Use NestJS built-in exceptions (NotFoundException, BadRequestException, etc.)
- All endpoints prefixed with `/api`
