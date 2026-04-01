# Backend ({{backend_dir}})

## Architecture

NestJS REST API with TypeScript.

- `src/app.module.ts` — Root module
- `src/<module>/` — Feature modules (module, controller, service, DTOs)
- `src/entities/` — TypeORM entities (SQL)
- `src/models/` — Mongoose schemas/models (MongoDB)
- `src/config/` — Database and environment config

## Conventions

- Module → Controller → Service pattern with NestJS dependency injection
- Controllers: use decorators (@Get, @Post, @Param, @Body), no business logic
- Services: pure business logic, injected into controllers via constructor
- Consistent response format: `{ data, error, meta }`
- Error handling: NestJS built-in exceptions (NotFoundException, BadRequestException, etc.)
- TypeORM: `@CreateDateColumn`/`@UpdateDateColumn` for timestamps
- Mongoose: `{ timestamps: true }` option
- DTOs define request shape — one DTO per operation (CreateXDto, UpdateXDto)
