---
name: {{skill_name}}
description: "Review code changes for quality, correctness, security, and performance"
---

# Code Review

Review code changes with focus on quality, correctness, and maintainability.

## When to use

Use when reviewing PRs or code changes before merge.

## Instructions

### Review Checklist

**Correctness:**
- Does the code do what it's supposed to?
- Are edge cases handled?
- Are error states handled gracefully?

**Code Quality:**
- Are names descriptive and accurate?
- Is there unnecessary duplication?
- Are functions/components focused (single responsibility)?

**Security:**
- No hardcoded secrets or credentials
- Input validation on API boundaries
- SQL injection / XSS prevention

**Performance:**
- No unnecessary re-renders (React)
- No N+1 queries (backend)
- No blocking operations in hot paths

**Testing:**
- Are new features covered by tests?
- Do tests verify behavior, not implementation?

**Style:**
- Follows ESLint + Prettier config
- Consistent with existing codebase patterns

### Output Format

For each issue found:
1. File and line reference
2. Severity: Critical / Important / Minor
3. Description of the issue
4. Suggested fix
