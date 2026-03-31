# Boilerplate Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the boilerplate `templates/` directory to be CLI-compatible: flatten project templates, add standalone skills/hooks/mcp-servers, and create `claude-setup` for existing projects.

**Architecture:** Replace the entire `templates/` directory. Old structure uses `templates/projects/<name>/template/` nesting; new structure places files directly in `templates/projects/<name>/`. Add `templates/skills/`, `templates/hooks/`, `templates/mcp-servers/` for standalone components. Add `claude-setup` project template with boolean conditionals for frontend/backend and dynamic directory names.

**Tech Stack:** File operations only — no code compilation. Template engine uses `{{var}}` for content, `__var__` for filenames, boolean conditionals for directory exclusion.

**Spec:** `docs/superpowers/specs/2026-03-31-boilerplate-restructure-design.md`

---

### Task 1: Backup old templates and create new structure

**Files:**
- Move: `templates/` → `templates-old/`
- Create: `templates/projects/`, `templates/skills/`, `templates/hooks/`, `templates/mcp-servers/`

- [ ] **Step 1: Rename existing templates directory**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
mv templates templates-old
```

- [ ] **Step 2: Create new directory structure**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
mkdir -p templates/projects
mkdir -p templates/skills
mkdir -p templates/hooks
mkdir -p templates/mcp-servers
```

- [ ] **Step 3: Verify**

```bash
ls templates/
```

Expected: `hooks/ mcp-servers/ projects/ skills/`

---

### Task 2: Flatten react-app template

**Files:**
- Source: `templates-old/projects/react-app/`
- Create: `templates/projects/react-app/` (flattened)

- [ ] **Step 1: Copy template.json**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
mkdir -p templates/projects/react-app
cp templates-old/projects/react-app/template.json templates/projects/react-app/
```

- [ ] **Step 2: Copy template contents (flatten — skip the template/ nesting)**

```bash
cp -R templates-old/projects/react-app/template/ templates/projects/react-app/
```

This copies everything inside `template/` directly into `react-app/`, alongside `template.json`.

- [ ] **Step 3: Verify structure**

```bash
ls templates/projects/react-app/
```

Expected: `CLAUDE.md  e2e/  index.html  jest.config.ts  package.json  playwright.config.ts  src/  template.json  tsconfig.json  vite.config.ts  .claude/  .eslintrc.json  .prettierrc`

- [ ] **Step 4: Verify template.json is at same level as source files**

```bash
cat templates/projects/react-app/template.json | head -5
```

Expected: starts with `{ "name": "react-app"`

- [ ] **Step 5: Verify no spurious template/ directory**

```bash
test -d templates/projects/react-app/template && echo "ERROR: template/ dir exists" || echo "OK: no template/ nesting"
```

Expected: `OK: no template/ nesting`

---

### Task 3: Flatten node-api template

**Files:**
- Source: `templates-old/projects/node-api/`
- Create: `templates/projects/node-api/` (flattened)

- [ ] **Step 1: Copy template.json and flatten template contents**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
mkdir -p templates/projects/node-api
cp templates-old/projects/node-api/template.json templates/projects/node-api/
cp -R templates-old/projects/node-api/template/ templates/projects/node-api/
```

- [ ] **Step 2: Verify structure**

```bash
ls templates/projects/node-api/
```

Expected: `CLAUDE.md  jest.config.ts  package.json  src/  template.json  tests/  tsconfig.json  .claude/  .env.example  .eslintrc.json  .prettierrc`

- [ ] **Step 3: Verify no template/ nesting**

```bash
test -d templates/projects/node-api/template && echo "ERROR" || echo "OK"
```

Expected: `OK`

---

### Task 4: Flatten fullstack template

**Files:**
- Source: `templates-old/projects/fullstack/`
- Create: `templates/projects/fullstack/` (flattened)

- [ ] **Step 1: Copy template.json and flatten template contents**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
mkdir -p templates/projects/fullstack
cp templates-old/projects/fullstack/template.json templates/projects/fullstack/
cp -R templates-old/projects/fullstack/template/ templates/projects/fullstack/
```

- [ ] **Step 2: Verify structure**

```bash
ls templates/projects/fullstack/
```

Expected: `CLAUDE.md  client/  package.json  server/  template.json  .claude/`

- [ ] **Step 3: Verify no template/ nesting**

```bash
test -d templates/projects/fullstack/template && echo "ERROR" || echo "OK"
```

Expected: `OK`

---

### Task 5: Flatten shopify-app template

**Files:**
- Source: `templates-old/projects/shopify-app/`
- Create: `templates/projects/shopify-app/` (flattened)

- [ ] **Step 1: Copy template.json and flatten template contents**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
mkdir -p templates/projects/shopify-app
cp templates-old/projects/shopify-app/template.json templates/projects/shopify-app/
cp -R templates-old/projects/shopify-app/template/ templates/projects/shopify-app/
```

- [ ] **Step 2: Verify structure**

```bash
ls templates/projects/shopify-app/
```

Expected: `CLAUDE.md  extensions/  package.json  shopify.app.toml  template.json  web/  .claude/`

- [ ] **Step 3: Verify no template/ nesting**

```bash
test -d templates/projects/shopify-app/template && echo "ERROR" || echo "OK"
```

Expected: `OK`

- [ ] **Step 4: Commit flatten work**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
git add templates/projects/
git commit -m "refactor: flatten 4 project templates — remove template/ nesting

Move contents of templates/projects/<name>/template/ directly into
templates/projects/<name>/ so CLI renderTemplate works correctly."
```

---

### Task 6: Create claude-setup project template

**Files:**
- Create: `templates/projects/claude-setup/template.json`
- Create: `templates/projects/claude-setup/.claude/settings.json`
- Create: `templates/projects/claude-setup/.claude/settings-frontend.json`
- Create: `templates/projects/claude-setup/.claude/settings-backend.json`
- Create: `templates/projects/claude-setup/.claude/skills/.gitkeep`
- Create: `templates/projects/claude-setup/CLAUDE.md`
- Create: `templates/projects/claude-setup/__frontend_dir__/CLAUDE.md`
- Create: `templates/projects/claude-setup/__backend_dir__/CLAUDE.md`

- [ ] **Step 1: Create directory structure**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
mkdir -p templates/projects/claude-setup/.claude/skills
mkdir -p templates/projects/claude-setup/__frontend_dir__
mkdir -p templates/projects/claude-setup/__backend_dir__
touch templates/projects/claude-setup/.claude/skills/.gitkeep
```

- [ ] **Step 2: Create template.json**

Create file `templates/projects/claude-setup/template.json`:

```json
{
  "name": "claude-setup",
  "description": "AI-agent structure for existing projects (CLAUDE.md, skills, settings)",
  "type": "project",
  "variables": [
    {
      "name": "project_name",
      "prompt": "Project name?",
      "default": "my-project",
      "type": "input",
      "required": true
    },
    {
      "name": "description",
      "prompt": "Project description?",
      "default": "",
      "type": "input",
      "required": false
    },
    {
      "name": "include_frontend",
      "prompt": "Include frontend conventions?",
      "default": true,
      "type": "confirm"
    },
    {
      "name": "frontend_dir",
      "prompt": "Frontend directory name?",
      "default": "frontend",
      "type": "input",
      "required": false
    },
    {
      "name": "include_backend",
      "prompt": "Include backend conventions?",
      "default": true,
      "type": "confirm"
    },
    {
      "name": "backend_dir",
      "prompt": "Backend directory name?",
      "default": "backend",
      "type": "input",
      "required": false
    }
  ],
  "conditionals": {
    "__frontend_dir__": "include_frontend",
    "__backend_dir__": "include_backend",
    ".claude/settings-frontend.json": "include_frontend",
    ".claude/settings-backend.json": "include_backend"
  }
}
```

- [ ] **Step 3: Create .claude/settings.json (base permissions)**

Create file `templates/projects/claude-setup/.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test*)",
      "Bash(npm run lint*)",
      "Bash(npm run format*)"
    ]
  }
}
```

- [ ] **Step 4: Create .claude/settings-frontend.json**

Create file `templates/projects/claude-setup/.claude/settings-frontend.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run dev)",
      "Bash(npm run build)",
      "Bash(npx playwright*)"
    ]
  }
}
```

- [ ] **Step 5: Create .claude/settings-backend.json**

Create file `templates/projects/claude-setup/.claude/settings-backend.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run dev)",
      "Bash(npm run build)",
      "Bash(npm start)",
      "Bash(npm run typeorm*)"
    ]
  }
}
```

- [ ] **Step 6: Create root CLAUDE.md**

Create file `templates/projects/claude-setup/CLAUDE.md`:

```markdown
# {{project_name}}

{{description}}

## Commands

<!-- Add your project's build/test/lint commands here -->

## Architecture

<!-- Describe your project structure here -->

## Conventions

- TypeScript strict mode
- Conventional commits: `<type>(<scope>): <subject>`
- Types: feat, fix, refactor, docs, style, test, chore, perf, ci
- Subject: imperative mood, lowercase, no period, max 72 chars
```

- [ ] **Step 7: Create __frontend_dir__/CLAUDE.md**

Create file `templates/projects/claude-setup/__frontend_dir__/CLAUDE.md`:

```markdown
# Frontend ({{frontend_dir}})

## Architecture

React app with Redux Toolkit + RTK Query + Styled-components.

- `src/app/` — Redux store config and typed hooks
- `src/features/` — Feature-based modules (page, slice, api, styles, tests)
- `src/components/` — Shared UI components
- `src/styles/` — Theme definition and styled-components types

## Conventions

- Functional components with TypeScript, named exports only
- Feature structure: `features/<name>/` with `<Name>Page.tsx`, `<name>Slice.ts`, `<name>Api.ts`, `<Name>Page.styles.ts`
- Component structure: `components/<Name>/` with `.tsx`, `.styles.ts`, optional `.types.ts`
- Styled-components use theme values — never hardcode colors, spacing, or fonts
- RTK Query for server state, Redux slices for UI state, local `useState` for forms
- React Testing Library for unit tests, Playwright for E2E
```

- [ ] **Step 8: Create __backend_dir__/CLAUDE.md**

Create file `templates/projects/claude-setup/__backend_dir__/CLAUDE.md`:

```markdown
# Backend ({{backend_dir}})

## Architecture

Express REST API with TypeScript.

- `src/routes/` — Route definitions
- `src/controllers/` — Request handlers (thin: validate → service → respond)
- `src/services/` — Business logic (no req/res objects)
- `src/middleware/` — Error handling, auth, validation
- `src/entities/` — TypeORM entities (SQL)
- `src/models/` — Mongoose models (MongoDB)

## Conventions

- Route → Controller → Service layering: controllers never contain business logic
- Consistent response format: `{ data, error, meta }`
- Error handling: throw `AppError(statusCode, message)`, caught by `errorHandler` middleware
- TypeORM: `@CreateDateColumn`/`@UpdateDateColumn` for timestamps
- Mongoose: `{ timestamps: true }` option
- All async handlers wrapped in try-catch, errors forwarded via `next(error)`
```

- [ ] **Step 9: Commit claude-setup**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
git add templates/projects/claude-setup/
git commit -m "feat: add claude-setup template for existing projects

Provides AI-agent structure (.claude/, CLAUDE.md hierarchy) for
existing projects. Supports frontend/backend flags with custom
directory names via boolean conditionals."
```

---

### Task 7: Create standalone skills — Core (7 skills)

**Files:**
- Create: `templates/skills/{code-review,git-commit,debugging,refactoring,documentation,security-audit,performance-review}/template.json`
- Create: `templates/skills/{code-review,git-commit,debugging,refactoring,documentation,security-audit,performance-review}/SKILL.md`

Source: `templates-old/projects/react-app/template/.claude/skills/`

- [ ] **Step 1: Create code-review skill**

Create `templates/skills/code-review/template.json`:

```json
{
  "name": "code-review",
  "description": "Review code changes for quality, correctness, security, and performance",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "code-review",
      "required": true
    }
  ]
}
```

Copy SKILL.md from source, replacing the frontmatter `name:` value with `{{skill_name}}`:

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
mkdir -p templates/skills/code-review
cp templates-old/projects/react-app/template/.claude/skills/code-review/SKILL.md templates/skills/code-review/
sed -i '' 's/^name: code-review$/name: {{skill_name}}/' templates/skills/code-review/SKILL.md
```

- [ ] **Step 2: Create git-commit skill**

```bash
mkdir -p templates/skills/git-commit
cp templates-old/projects/react-app/template/.claude/skills/git-commit/SKILL.md templates/skills/git-commit/
sed -i '' 's/^name: git-commit$/name: {{skill_name}}/' templates/skills/git-commit/SKILL.md
```

Create `templates/skills/git-commit/template.json`:

```json
{
  "name": "git-commit",
  "description": "Write conventional commit messages following team standards",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "git-commit",
      "required": true
    }
  ]
}
```

- [ ] **Step 3: Create debugging skill**

```bash
mkdir -p templates/skills/debugging
cp templates-old/projects/react-app/template/.claude/skills/debugging/SKILL.md templates/skills/debugging/
sed -i '' 's/^name: debugging$/name: {{skill_name}}/' templates/skills/debugging/SKILL.md
```

Create `templates/skills/debugging/template.json`:

```json
{
  "name": "debugging",
  "description": "Systematic approach to finding and fixing bugs in React + Node.js",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "debugging",
      "required": true
    }
  ]
}
```

- [ ] **Step 4: Create refactoring skill**

```bash
mkdir -p templates/skills/refactoring
cp templates-old/projects/react-app/template/.claude/skills/refactoring/SKILL.md templates/skills/refactoring/
sed -i '' 's/^name: refactoring$/name: {{skill_name}}/' templates/skills/refactoring/SKILL.md
```

Create `templates/skills/refactoring/template.json`:

```json
{
  "name": "refactoring",
  "description": "Improve code structure without changing behavior",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "refactoring",
      "required": true
    }
  ]
}
```

- [ ] **Step 5: Create documentation skill**

```bash
mkdir -p templates/skills/documentation
cp templates-old/projects/react-app/template/.claude/skills/documentation/SKILL.md templates/skills/documentation/
sed -i '' 's/^name: documentation$/name: {{skill_name}}/' templates/skills/documentation/SKILL.md
```

Create `templates/skills/documentation/template.json`:

```json
{
  "name": "documentation",
  "description": "Write clear documentation for code, APIs, and components",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "documentation",
      "required": true
    }
  ]
}
```

- [ ] **Step 6: Create security-audit skill**

```bash
mkdir -p templates/skills/security-audit
cp templates-old/projects/react-app/template/.claude/skills/security-audit/SKILL.md templates/skills/security-audit/
sed -i '' 's/^name: security-audit$/name: {{skill_name}}/' templates/skills/security-audit/SKILL.md
```

Create `templates/skills/security-audit/template.json`:

```json
{
  "name": "security-audit",
  "description": "Review code for security vulnerabilities and OWASP issues",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "security-audit",
      "required": true
    }
  ]
}
```

- [ ] **Step 7: Create performance-review skill**

```bash
mkdir -p templates/skills/performance-review
cp templates-old/projects/react-app/template/.claude/skills/performance-review/SKILL.md templates/skills/performance-review/
sed -i '' 's/^name: performance-review$/name: {{skill_name}}/' templates/skills/performance-review/SKILL.md
```

Create `templates/skills/performance-review/template.json`:

```json
{
  "name": "performance-review",
  "description": "Audit code for frontend rendering and backend performance issues",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "performance-review",
      "required": true
    }
  ]
}
```

- [ ] **Step 8: Commit core skills**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
git add templates/skills/code-review/ templates/skills/git-commit/ templates/skills/debugging/ templates/skills/refactoring/ templates/skills/documentation/ templates/skills/security-audit/ templates/skills/performance-review/
git commit -m "feat: add 7 standalone core skills

Extract code-review, git-commit, debugging, refactoring, documentation,
security-audit, performance-review as standalone templates for
megamind-ai generate skill <name>."
```

---

### Task 8: Create standalone skills — Frontend (3 skills)

**Files:**
- Create: `templates/skills/{react-component,redux-slice,styled-component}/template.json`
- Create: `templates/skills/{react-component,redux-slice,styled-component}/SKILL.md`

Source: `templates-old/projects/react-app/template/.claude/skills/`

- [ ] **Step 1: Create react-component skill**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
mkdir -p templates/skills/react-component
cp templates-old/projects/react-app/template/.claude/skills/react-component/SKILL.md templates/skills/react-component/
sed -i '' 's/^name: react-component$/name: {{skill_name}}/' templates/skills/react-component/SKILL.md
```

Create `templates/skills/react-component/template.json`:

```json
{
  "name": "react-component",
  "description": "Create React components with TypeScript, styled-components, and tests",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "react-component",
      "required": true
    }
  ]
}
```

- [ ] **Step 2: Create redux-slice skill**

```bash
mkdir -p templates/skills/redux-slice
cp templates-old/projects/react-app/template/.claude/skills/redux-slice/SKILL.md templates/skills/redux-slice/
sed -i '' 's/^name: redux-slice$/name: {{skill_name}}/' templates/skills/redux-slice/SKILL.md
```

Create `templates/skills/redux-slice/template.json`:

```json
{
  "name": "redux-slice",
  "description": "Create Redux Toolkit slices and RTK Query API services",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "redux-slice",
      "required": true
    }
  ]
}
```

- [ ] **Step 3: Create styled-component skill**

```bash
mkdir -p templates/skills/styled-component
cp templates-old/projects/react-app/template/.claude/skills/styled-component/SKILL.md templates/skills/styled-component/
sed -i '' 's/^name: styled-component$/name: {{skill_name}}/' templates/skills/styled-component/SKILL.md
```

Create `templates/skills/styled-component/template.json`:

```json
{
  "name": "styled-component",
  "description": "Create styled-components following theme conventions",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "styled-component",
      "required": true
    }
  ]
}
```

- [ ] **Step 4: Commit frontend skills**

```bash
git add templates/skills/react-component/ templates/skills/redux-slice/ templates/skills/styled-component/
git commit -m "feat: add 3 standalone frontend skills

Extract react-component, redux-slice, styled-component as standalone
templates."
```

---

### Task 9: Create standalone skills — Backend (3 skills)

**Files:**
- Create: `templates/skills/{api-endpoint,typeorm-entity,mongoose-model}/template.json`
- Create: `templates/skills/{api-endpoint,typeorm-entity,mongoose-model}/SKILL.md`

Source: `templates-old/projects/node-api/template/.claude/skills/`

- [ ] **Step 1: Create api-endpoint skill**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
mkdir -p templates/skills/api-endpoint
cp templates-old/projects/node-api/template/.claude/skills/api-endpoint/SKILL.md templates/skills/api-endpoint/
sed -i '' 's/^name: api-endpoint$/name: {{skill_name}}/' templates/skills/api-endpoint/SKILL.md
```

Create `templates/skills/api-endpoint/template.json`:

```json
{
  "name": "api-endpoint",
  "description": "Create REST API endpoints with route-controller-service pattern",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "api-endpoint",
      "required": true
    }
  ]
}
```

- [ ] **Step 2: Create typeorm-entity skill**

```bash
mkdir -p templates/skills/typeorm-entity
cp templates-old/projects/node-api/template/.claude/skills/typeorm-entity/SKILL.md templates/skills/typeorm-entity/
sed -i '' 's/^name: typeorm-entity$/name: {{skill_name}}/' templates/skills/typeorm-entity/SKILL.md
```

Create `templates/skills/typeorm-entity/template.json`:

```json
{
  "name": "typeorm-entity",
  "description": "Create TypeORM entities, relations, and migrations for SQL databases",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "typeorm-entity",
      "required": true
    }
  ]
}
```

- [ ] **Step 3: Create mongoose-model skill**

```bash
mkdir -p templates/skills/mongoose-model
cp templates-old/projects/node-api/template/.claude/skills/mongoose-model/SKILL.md templates/skills/mongoose-model/
sed -i '' 's/^name: mongoose-model$/name: {{skill_name}}/' templates/skills/mongoose-model/SKILL.md
```

Create `templates/skills/mongoose-model/template.json`:

```json
{
  "name": "mongoose-model",
  "description": "Create Mongoose schemas, models, and indexes for MongoDB",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "mongoose-model",
      "required": true
    }
  ]
}
```

- [ ] **Step 4: Commit backend skills**

```bash
git add templates/skills/api-endpoint/ templates/skills/typeorm-entity/ templates/skills/mongoose-model/
git commit -m "feat: add 3 standalone backend skills

Extract api-endpoint, typeorm-entity, mongoose-model as standalone
templates."
```

---

### Task 10: Create standalone skills — Testing (2 skills)

**Files:**
- Create: `templates/skills/{jest-testing,playwright-testing}/template.json`
- Create: `templates/skills/{jest-testing,playwright-testing}/SKILL.md`

Source: `templates-old/projects/react-app/template/.claude/skills/`

- [ ] **Step 1: Create jest-testing skill**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
mkdir -p templates/skills/jest-testing
cp templates-old/projects/react-app/template/.claude/skills/jest-testing/SKILL.md templates/skills/jest-testing/
sed -i '' 's/^name: jest-testing$/name: {{skill_name}}/' templates/skills/jest-testing/SKILL.md
```

Create `templates/skills/jest-testing/template.json`:

```json
{
  "name": "jest-testing",
  "description": "Write unit and integration tests with Jest and React Testing Library",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "jest-testing",
      "required": true
    }
  ]
}
```

- [ ] **Step 2: Create playwright-testing skill**

```bash
mkdir -p templates/skills/playwright-testing
cp templates-old/projects/react-app/template/.claude/skills/playwright-testing/SKILL.md templates/skills/playwright-testing/
sed -i '' 's/^name: playwright-testing$/name: {{skill_name}}/' templates/skills/playwright-testing/SKILL.md
```

Create `templates/skills/playwright-testing/template.json`:

```json
{
  "name": "playwright-testing",
  "description": "Write E2E tests with Playwright for user flows",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "playwright-testing",
      "required": true
    }
  ]
}
```

- [ ] **Step 3: Commit testing skills**

```bash
git add templates/skills/jest-testing/ templates/skills/playwright-testing/
git commit -m "feat: add 2 standalone testing skills

Extract jest-testing, playwright-testing as standalone templates."
```

---

### Task 11: Create pre-commit hook template

**Files:**
- Create: `templates/hooks/pre-commit/template.json`
- Create: `templates/hooks/pre-commit/hook.sh`

- [ ] **Step 1: Create directory**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
mkdir -p templates/hooks/pre-commit
```

- [ ] **Step 2: Create template.json**

Create file `templates/hooks/pre-commit/template.json`:

```json
{
  "name": "pre-commit",
  "description": "Pre-commit hook that runs lint and type-check before committing",
  "type": "hook",
  "variables": [
    {
      "name": "hook_name",
      "prompt": "Hook name?",
      "default": "pre-commit",
      "type": "input",
      "required": true
    },
    {
      "name": "lint_command",
      "prompt": "Lint command?",
      "default": "npm run lint",
      "type": "input"
    }
  ]
}
```

- [ ] **Step 3: Create hook.sh**

Create file `templates/hooks/pre-commit/hook.sh`:

```bash
#!/bin/bash
set -e

echo "Running pre-commit checks..."
{{lint_command}}
echo "Pre-commit checks passed."
```

- [ ] **Step 4: Commit**

```bash
git add templates/hooks/pre-commit/
git commit -m "feat: add pre-commit hook template

Sample hook template for megamind-ai generate hook pre-commit."
```

---

### Task 12: Create basic MCP server template

**Files:**
- Create: `templates/mcp-servers/basic/template.json`
- Create: `templates/mcp-servers/basic/__server_name__.ts`
- Create: `templates/mcp-servers/basic/package.json`
- Create: `templates/mcp-servers/basic/tsconfig.json`

- [ ] **Step 1: Create directory**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate
mkdir -p templates/mcp-servers/basic
```

- [ ] **Step 2: Create template.json**

Create file `templates/mcp-servers/basic/template.json`:

```json
{
  "name": "basic",
  "description": "Basic MCP server skeleton with TypeScript",
  "type": "mcp-server",
  "variables": [
    {
      "name": "server_name",
      "prompt": "Server name?",
      "default": "my-mcp-server",
      "type": "input",
      "required": true
    },
    {
      "name": "description",
      "prompt": "Server description?",
      "default": "A custom MCP server",
      "type": "input"
    }
  ]
}
```

- [ ] **Step 3: Create __server_name__.ts**

Create file `templates/mcp-servers/basic/__server_name__.ts`:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "{{server_name}}", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "hello",
      description: "Say hello",
      inputSchema: {
        type: "object" as const,
        properties: {
          name: { type: "string", description: "Name to greet" },
        },
        required: ["name"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "hello") {
    const name = request.params.arguments?.name as string;
    return {
      content: [{ type: "text", text: `Hello, ${name}!` }],
    };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

- [ ] **Step 4: Create package.json**

Create file `templates/mcp-servers/basic/package.json`:

```json
{
  "name": "{{server_name}}",
  "version": "0.1.0",
  "description": "{{description}}",
  "type": "module",
  "main": "dist/{{server_name}}.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/{{server_name}}.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

- [ ] **Step 5: Create tsconfig.json**

Create file `templates/mcp-servers/basic/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 6: Commit**

```bash
git add templates/mcp-servers/basic/
git commit -m "feat: add basic MCP server template

TypeScript MCP server skeleton with hello tool example for
megamind-ai generate mcp-server basic."
```

---

### Task 13: Update boilerplate root CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update the Repository Structure section**

Read the current `CLAUDE.md` and update the structure section to reflect the new layout. The key changes:

Replace the old structure diagram with:

```markdown
## Repository Structure

```
boilerplate/
├── CLAUDE.md                          ← you are here
├── templates/
│   ├── projects/
│   │   ├── react-app/                 ← React SPA (Redux, RTK Query, Styled-components)
│   │   ├── node-api/                  ← Express REST API (TypeORM + Mongoose)
│   │   ├── fullstack/                 ← Monorepo: client/ (React) + server/ (Express)
│   │   ├── shopify-app/              ← Shopify embedded app (Polaris + Express + webhooks)
│   │   └── claude-setup/             ← AI-agent structure for existing projects
│   ├── skills/                        ← 15 standalone skills for generate command
│   ├── hooks/                         ← Hook templates (pre-commit)
│   └── mcp-servers/                   ← MCP server templates (basic)
└── docs/superpowers/                  ← Implementation plans and specs
```
```

- [ ] **Step 2: Update Inside Each Template section**

Replace to show the flat structure (no `template/` nesting):

```markdown
### Inside Each Project Template

```
<project>/
├── template.json                      ← Scaffolding variables & conditionals
├── .claude/
│   ├── settings.json                  ← Claude Code permissions for this project
│   └── skills/<name>/SKILL.md         ← Claude Code skills (YAML frontmatter)
├── CLAUDE.md                          ← Root-level project guidance
├── <subdir>/CLAUDE.md                 ← Directory-scoped guidance (client/, server/, etc.)
├── package.json
├── tsconfig.json
└── src/...                            ← Source code boilerplate
```

### Inside Each Standalone Skill

```
<skill>/
├── template.json                      ← Skill metadata & variables
└── SKILL.md                           ← Skill content with {{skill_name}} variable
```
```

- [ ] **Step 3: Add claude-setup to Project Templates section**

Add after the shopify-app description:

```markdown
### claude-setup
AI-agent structure for existing projects. Prompts for project name, optional frontend/backend directory names. Outputs `.claude/` with settings, `CLAUDE.md` hierarchy with conventions. Use `megamind-ai generate skill <name>` after init to add specific skills.
```

- [ ] **Step 4: Add standalone templates section**

Add after Skills section:

```markdown
## Standalone Templates

For use with `megamind-ai generate <type> <name>` on existing projects:

| Type | Templates |
|------|-----------|
| skill | code-review, git-commit, debugging, refactoring, documentation, security-audit, performance-review, react-component, redux-slice, styled-component, api-endpoint, typeorm-entity, mongoose-model, jest-testing, playwright-testing |
| hook | pre-commit |
| mcp-server | basic |
```

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for new template structure

Reflect flattened project templates, claude-setup, and standalone
skills/hooks/mcp-servers."
```

---

### Task 14: Remove old templates and final verification

**Files:**
- Remove: `templates-old/`

- [ ] **Step 1: Verify new templates structure is complete**

```bash
cd /Users/binhnt/Coding/megamind-ai/boilerplate

echo "=== Project templates ==="
for d in templates/projects/*/; do
  echo "$d: $(test -f "${d}template.json" && echo "template.json OK" || echo "MISSING template.json")"
done

echo "=== Standalone skills ==="
ls templates/skills/ | wc -l
# Expected: 15

echo "=== Hooks ==="
ls templates/hooks/

echo "=== MCP servers ==="
ls templates/mcp-servers/
```

Expected:
- 5 project templates with template.json
- 15 standalone skills
- 1 hook (pre-commit)
- 1 mcp-server (basic)

- [ ] **Step 2: Verify no template/ nesting in any project**

```bash
for d in templates/projects/*/; do
  test -d "${d}template" && echo "ERROR: $d has template/ nesting" || echo "OK: $d"
done
```

Expected: all OK

- [ ] **Step 3: Verify all standalone skills have template.json + SKILL.md**

```bash
for d in templates/skills/*/; do
  skill=$(basename "$d")
  test -f "${d}template.json" && test -f "${d}SKILL.md" && echo "OK: $skill" || echo "ERROR: $skill missing files"
done
```

Expected: all 15 OK

- [ ] **Step 4: Remove old templates backup**

```bash
rm -rf templates-old/
```

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: remove old templates-old backup directory"
```

- [ ] **Step 6: Verify final file count**

```bash
find templates -name "template.json" | wc -l
```

Expected: 22 (5 projects + 15 skills + 1 hook + 1 mcp-server)
