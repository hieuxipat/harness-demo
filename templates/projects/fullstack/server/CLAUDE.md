# Server (Node.js API)

## Commands

- **Dev:** `npm run dev` (port {{server_port}})
- **Build:** `npm run build`
- **Test:** `npm test`
- **Lint:** `npm run lint`

## Architecture

Express REST API with TypeScript.

- `src/routes/` — Route definitions
- `src/controllers/` — Request handlers (thin: validate → service → respond)
- `src/services/` — Business logic (no req/res objects)
- `src/middleware/` — Error handling, auth, validation

## Conventions

- Route → Controller → Service layering
- Consistent response format: `{ data, error, meta }`
- Error handling: throw `AppError(statusCode, message)`, caught by `errorHandler`
- All endpoints prefixed with `/api`
