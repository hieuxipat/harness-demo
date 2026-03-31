---
name: refactoring
description: "Improve code structure without changing behavior"
---

# Refactoring

Improve code structure without changing behavior.

## When to use

When code is hard to understand, modify, or test.

## Instructions

### Before refactoring

- Ensure tests exist for the code being refactored
- Run tests BEFORE and AFTER each change
- Make small, incremental changes — one refactoring at a time
- Commit after each successful refactoring step

### Common Refactorings

**Extract:** Long function → smaller functions with clear names
**Inline:** Unnecessary abstraction → simpler direct code
**Rename:** Unclear name → name that describes purpose
**Move:** Code in wrong place → closer to where it's used
**Simplify conditionals:** Nested if/else → early returns or guard clauses

### Red Flags to Refactor

- Function > 30 lines
- Component > 200 lines
- More than 3 levels of nesting
- Duplicated code in 3+ places
- Function takes > 3 parameters
- File imports from 10+ different modules

### Do NOT

- Refactor and add features in the same commit
- Refactor code you don't understand yet
- Over-abstract for hypothetical future needs (YAGNI)
