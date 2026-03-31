---
name: {{skill_name}}
description: "Create Mongoose schemas, models, and indexes for MongoDB"
---

# Mongoose Model

Create Mongoose schemas and models.

## When to use

When adding new MongoDB collections or modifying schema.

## Instructions

### Schema

File: `models/<ModelName>.ts`

- Define interface for document type (extends Document)
- Use schema validation: required, enum, min/max, match
- Add indexes: schema.index({ field: 1 })
- Use timestamps: { timestamps: true }
- Add virtual fields for computed properties
- Add pre/post hooks for lifecycle events

### Patterns

**Embedded vs Reference:**
| Pattern | When | Example |
|---|---|---|
| Embed | Small, always accessed together | Address in User |
| Reference | Large, independent lifecycle | Comments on Post |

**Population:** Use .populate() sparingly — prefer embedding for read-heavy data

**Indexes:**
- Compound indexes for frequent multi-field queries
- Text indexes for search
- TTL indexes for expiring data (sessions, logs)

### Query Patterns

- Use .lean() for read-only queries (faster, plain objects)
- Use projection to select only needed fields
- Use cursor for large datasets
- Use bulkWrite for batch operations
