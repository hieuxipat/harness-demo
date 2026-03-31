---
name: {{skill_name}}
description: "Write conventional commit messages following team standards"
---

# Git Commit

Write conventional commit messages following team standards.

## When to use

When creating git commits.

## Instructions

### Format

<type>(<scope>): <subject>

<body>

### Types

| Type | When to use |
|---|---|
| feat | New feature |
| fix | Bug fix |
| refactor | Code change that neither fixes nor adds feature |
| docs | Documentation only |
| style | Formatting, missing semicolons, etc |
| test | Adding or updating tests |
| chore | Maintenance tasks, deps update |
| perf | Performance improvement |
| ci | CI/CD changes |

### Rules

- Subject: imperative mood, lowercase, no period, max 72 chars
- Scope: component or area affected (e.g., auth, cart, api)
- Body: explain WHY, not WHAT (the diff shows what)
- Reference ticket/issue if available

### Examples

feat(cart): add quantity selector to cart items

fix(auth): prevent token refresh race condition

refactor(api): extract validation middleware from controllers
