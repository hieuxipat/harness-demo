# Source Code Guide

## Directory Structure

- `main.ts` — Application entry point (NestFactory bootstrap)
- `app.module.ts` — Root module, imports all feature modules
- `health.controller.ts` — Health check endpoint
- `<module>/` — Feature modules (module, controller, service, DTOs)
- `config/` — Database connections (`database.ts`) and environment config (`env.ts`)
- `entities/` — TypeORM entities for SQL databases
- `models/` — Mongoose schemas/models for MongoDB
- `utils/` — Shared utility functions

## Conventions

- Module → Controller → Service pattern with NestJS dependency injection
- Controllers: use decorators (@Get, @Post, @Param, @Body), no business logic
- Services: pure business logic, injected into controllers via constructor
- Consistent response format: `{ data, error, meta }`
- Error handling: throw NestJS built-in exceptions (NotFoundException, BadRequestException)
- TypeORM entities use `@CreateDateColumn`/`@UpdateDateColumn` for timestamps
- Mongoose schemas use `{ timestamps: true }` option
- DTOs define request shape — one DTO per operation (CreateXDto, UpdateXDto)
