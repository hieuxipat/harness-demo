# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (port {{port}}, watch mode)
- **Build:** `npm run build`
- **Start:** `npm start`
- **Test:** `npm test` / `npm run test:watch` / `npm run test:coverage`
- **Lint:** `npm run lint` / `npm run lint:fix`
- **Format:** `npm run format` / `npm run format:check`
- **TypeORM CLI:** `npm run typeorm`

## Architecture

NestJS REST API with TypeScript. Includes both TypeORM (SQL) and Mongoose (MongoDB) setups — use whichever fits your database choice.

- `src/` — Module-based structure (one directory per domain)
- `src/<module>/` — Module, Controller, Service, DTOs
- `src/entities/` — TypeORM entities (SQL)
- `src/models/` — Mongoose schemas/models (MongoDB)
- `src/config/` — Database and environment config
- `tests/` — Jest tests with supertest

### Conventions

- Module → Controller → Service pattern with dependency injection
- Controllers handle HTTP concerns only (decorators, params, status codes)
- Services contain all business logic, injected via constructor
- Consistent response format: `{ data, error, meta }`
- Use NestJS built-in exceptions (NotFoundException, BadRequestException, etc.)
- DTOs for request validation
