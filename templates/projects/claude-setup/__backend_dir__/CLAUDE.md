# Backend ({{backend_dir}})

## Architecture

Express REST API with TypeScript.

- `src/routes/` — Route definitions
- `src/controllers/` — Request handlers (thin: validate → service → respond)
- `src/services/` — Business logic (no req/res objects)
- `src/middleware/` — Error handling, auth, validation
- `src/entities/` — TypeORM entities (SQL)
- `src/models/` — Mongoose models (MongoDB)

## Conventions

- Route → Controller → Service layering: controllers never contain business logic
- Consistent response format: `{ data, error, meta }`
- Error handling: throw `AppError(statusCode, message)`, caught by `errorHandler` middleware
- TypeORM: `@CreateDateColumn`/`@UpdateDateColumn` for timestamps
- Mongoose: `{ timestamps: true }` option
- All async handlers wrapped in try-catch, errors forwarded via `next(error)`
