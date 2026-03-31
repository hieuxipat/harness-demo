---
name: {{skill_name}}
description: "Write clear documentation for code, APIs, and components"
---

# Documentation

Write clear documentation for code and APIs.

## When to use

When creating or updating documentation for modules, APIs, or components.

## Instructions

### API Documentation

For each endpoint document:
- Method + Path
- Description (one sentence)
- Request: headers, params, query, body (with types)
- Response: status codes + body shape
- Example request/response
- Error cases

### Component Documentation

For each React component document:
- Purpose (one sentence)
- Props table (name, type, required, default, description)
- Usage example
- Notes (edge cases, performance considerations)

### Code Comments

- Only add comments where the logic isn't self-evident
- Explain WHY, not WHAT
- Keep comments up to date with code changes
- Use JSDoc for public APIs and exported functions
