---
name: security-audit
description: "Review code for security vulnerabilities and OWASP issues"
---

# Security Audit

Review code for security vulnerabilities.

## When to use

When reviewing authentication, authorization, user input handling, or sensitive data operations.

## Instructions

### Checklist

**Authentication & Authorization:**
- [ ] Passwords hashed with bcrypt (cost >= 10)
- [ ] JWT tokens have expiration
- [ ] Refresh tokens are rotated
- [ ] Session invalidation on password change
- [ ] Role-based access control on all protected routes

**Input Validation:**
- [ ] All user input validated and sanitized
- [ ] SQL/NoSQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding, CSP headers)
- [ ] File upload validation (type, size, content)
- [ ] Rate limiting on auth endpoints

**Data Protection:**
- [ ] No secrets in code or git history
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] No sensitive data in logs

**Shopify-Specific:**
- [ ] HMAC validation on webhooks
- [ ] Session tokens verified with Shopify
- [ ] App proxy requests authenticated
- [ ] Billing API checks before premium features
- [ ] GDPR endpoints implemented (data request, erasure)

**Dependencies:**
- [ ] No known vulnerabilities (npm audit)
- [ ] Dependencies pinned to specific versions
