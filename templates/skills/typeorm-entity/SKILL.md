---
name: {{skill_name}}
description: "Create TypeORM entities, relations, and migrations for SQL databases"
---

# TypeORM Entity

Create TypeORM entities, relations, and migrations with NestJS integration.

## When to use

When adding new database tables or modifying schema (SQL databases).

## Instructions

### Entity

File: `entities/<EntityName>.ts`

- Use decorators: @Entity, @Column, @PrimaryGeneratedColumn
- Define relations explicitly: @OneToMany, @ManyToOne, @ManyToMany
- Add indexes on frequently queried columns
- Use enum types for constrained values
- Add createdAt/updatedAt with @CreateDateColumn/@UpdateDateColumn

### NestJS Integration

Register entity in module:
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([EntityName])],
  // ...
})
```

Inject repository in service:
```typescript
constructor(
  @InjectRepository(EntityName)
  private readonly repo: Repository<EntityName>,
) {}
```

### Migration

After creating/modifying entity:
1. Generate: `npx typeorm migration:generate -n <MigrationName>`
2. Review the generated SQL
3. Run: `npx typeorm migration:run`
4. Test: verify data integrity

### Relations

| Relation | When | Example |
|---|---|---|
| @OneToMany / @ManyToOne | Parent-child | User → Orders |
| @ManyToMany | N:N | Products ↔ Categories |
| @OneToOne | 1:1 extension | User → Profile |

### Query Patterns

- Use QueryBuilder for complex queries
- Always select only needed columns
- Use pagination (skip/take) for list endpoints
- Use transactions for multi-table writes
