# Source Code Guide

## Directory Structure

- `config/` — Database connections (`database.ts`) and environment config (`env.ts`)
- `routes/` — Express route definitions, one file per resource
- `controllers/` — Request handlers (thin layer: validate → call service → respond)
- `services/` — Business logic (no `req`/`res` objects — pure data in, data out)
- `middleware/` — Express middleware (auth, error handling, validation)
- `entities/` — TypeORM entities for SQL databases
- `models/` — Mongoose schemas/models for MongoDB
- `utils/` — Shared utility functions

## Conventions

- Route → Controller → Service layering: controllers never contain business logic
- Consistent response format: `{ data, error, meta }`
- Error handling: throw `AppError(statusCode, message)` in services, caught by `errorHandler` middleware
- TypeORM entities use `@CreateDateColumn`/`@UpdateDateColumn` for timestamps
- Mongoose schemas use `{ timestamps: true }` option
- All async route handlers wrapped in try-catch, errors forwarded via `next(error)`
