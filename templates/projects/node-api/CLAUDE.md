# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (port {{port}})
- **Build:** `npm run build`
- **Start:** `npm start`
- **Test:** `npm test` / `npm run test:watch` / `npm run test:coverage`
- **Lint:** `npm run lint` / `npm run lint:fix`
- **Format:** `npm run format` / `npm run format:check`
- **TypeORM CLI:** `npm run typeorm`

## Architecture

Express REST API with TypeScript. Includes both TypeORM (SQL) and Mongoose (MongoDB) setups — use whichever fits your database choice.

- `src/routes/` — Route definitions
- `src/controllers/` — Request handling (thin — validate, call service, respond)
- `src/services/` — Business logic (no req/res objects)
- `src/middleware/` — Auth, error handling, validation
- `src/entities/` — TypeORM entities (SQL)
- `src/models/` — Mongoose models (MongoDB)
- `src/config/` — Database and environment config
- `tests/` — Jest tests with supertest

### Conventions

- Controllers are thin: validate input, call service, send response
- Services contain all business logic
- Consistent response format: { data, error, meta }
- Use AppError class for typed errors
