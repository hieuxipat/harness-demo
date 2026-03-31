# Boilerplate Restructure — Design Spec

> Date: 2026-03-31
> Status: Approved
> Goal: Restructure boilerplate templates to be CLI-compatible and support both new and existing projects

---

## Problem

Three structural mismatches between the boilerplate and the CLI prevent correct template distribution:

1. **Extra nesting:** Project templates use `templates/projects/<name>/template/` but the CLI's `renderTemplate` reads directly from `templates/projects/<name>/`, skipping only `template.json`. Result: output contains a spurious `template/` directory.
2. **Missing standalone templates:** CLI supports `megamind-ai generate skill/hook/mcp-server` but boilerplate has no `templates/skills/`, `templates/hooks/`, or `templates/mcp-servers/`. Existing projects cannot add components.
3. **No existing-project support:** No way to apply standard AI-agent structure (`.claude/`, `CLAUDE.md`, skills) to an existing project without scaffolding a full new project.

## Approach

**Rebuild from scratch (Approach B):** Create the `templates/` directory structure fresh, copying content from the old structure. This avoids artifacts from the old nesting and produces a clean baseline.

---

## 1. Flatten Project Templates

Move contents of `templates/projects/<name>/template/*` directly into `templates/projects/<name>/` alongside `template.json`. Apply to all 4 existing templates.

### Before:
```
react-app/
├── template.json
└── template/
    ├── .claude/
    ├── CLAUDE.md
    ├── package.json
    └── src/
```

### After:
```
react-app/
├── template.json
├── .claude/
├── CLAUDE.md
├── package.json
└── src/
```

### What stays the same:
- `template.json` content (variables, conditionals) — unchanged
- CLAUDE.md hierarchy — same relative paths
- Embedded skills in `.claude/skills/` — kept within project templates
- All file content — copied verbatim

### Templates to flatten:
- `react-app` — conditionals: `"e2e": "include_e2e"`
- `node-api` — no conditionals
- `fullstack` — conditionals: `"client/e2e": "include_e2e"`
- `shopify-app` — conditionals: `"extensions": "include_extensions"`

---

## 2. New Project Template: `claude-setup`

For applying AI-agent structure to existing projects.

### Variables:

| Variable | Type | Prompt | Default | Required |
|---|---|---|---|---|
| `project_name` | input | Project name? | `my-project` | yes |
| `description` | input | Project description? | `""` | no |
| `include_frontend` | confirm | Include frontend conventions? | true | — |
| `frontend_dir` | input | Frontend directory name? | `frontend` | — |
| `include_backend` | confirm | Include backend conventions? | true | — |
| `backend_dir` | input | Backend directory name? | `backend` | — |

### Structure:

```
claude-setup/
├── template.json
├── .claude/
│   ├── settings.json              ← Base permissions (always included)
│   ├── settings-frontend.json     ← Frontend permissions (conditional)
│   ├── settings-backend.json      ← Backend permissions (conditional)
│   └── skills/
│       └── .gitkeep
├── CLAUDE.md                      ← Root: project_name, description, commands placeholder
├── __frontend_dir__/
│   └── CLAUDE.md                  ← Frontend conventions (conditional)
└── __backend_dir__/
    └── CLAUDE.md                  ← Backend conventions (conditional)
```

### Conditionals:

```json
{
  "conditionals": {
    "__frontend_dir__/": "include_frontend",
    "__backend_dir__/": "include_backend",
    ".claude/settings-frontend.json": "include_frontend",
    ".claude/settings-backend.json": "include_backend"
  }
}
```

### Implementation note — conditional + filename rendering order:

The CLI's `shouldInclude()` checks conditional path prefixes against the raw relative path. The `renderFileName()` call happens separately. Verify during implementation whether conditionals match against pre-render names (`__frontend_dir__/`) or post-render names (`client/`). If conditionals run before filename rendering, use `__frontend_dir__/` as the conditional key. If after, use the rendered directory name — which is unknown at template-authoring time and would require a different approach. If the CLI processes conditionals before rendering, the current design works. If not, the conditional keys may need adjustment or the CLI's `renderTemplate` function may need a minor patch.

### Settings split:
- `settings.json` — base permissions common to all projects
- `settings-frontend.json` — frontend-specific permissions (npm run dev/build, Vite, Playwright)
- `settings-backend.json` — backend-specific permissions (npm run dev/build, TypeORM CLI)
- Developer merges into `settings.json` manually (template engine cannot merge file content)

### CLAUDE.md content:
- Root `CLAUDE.md`: `{{project_name}}`, `{{description}}`, placeholder sections for Commands, Architecture, Conventions
- `__frontend_dir__/CLAUDE.md`: React + Redux Toolkit + RTK Query + Styled-components conventions (from react-app template)
- `__backend_dir__/CLAUDE.md`: Express + Route→Controller→Service + TypeORM/Mongoose conventions (from node-api template)

---

## 3. Standalone Skills (15 total)

Extracted from project templates into `templates/skills/` for use with `megamind-ai generate skill <name>`.

### Categories:

**Core (7):** code-review, git-commit, debugging, refactoring, documentation, security-audit, performance-review

**Frontend (3):** react-component, redux-slice, styled-component

**Backend (3):** api-endpoint, typeorm-entity, mongoose-model

**Testing (2):** jest-testing, playwright-testing

### Each skill structure:

```
templates/skills/<skill-name>/
├── template.json
└── SKILL.md
```

### template.json format:

```json
{
  "name": "<skill-name>",
  "description": "<one-line description>",
  "type": "skill",
  "variables": [
    {
      "name": "skill_name",
      "prompt": "Skill name?",
      "default": "<skill-name>",
      "required": true
    }
  ]
}
```

### SKILL.md content:
- Copied from corresponding skill in project templates
- Hardcoded skill name in YAML frontmatter `name:` field replaced with `{{skill_name}}`
- Rest of content verbatim

### Output: `<project>/.claude/skills/<skill_name>/SKILL.md`

### Not extracted (kept embedded only):
- 5 Shopify skills: shopify-webhook, shopify-graphql, shopify-polaris, shopify-billing, shopify-extension

---

## 4. Hook Template: `pre-commit`

```
templates/hooks/pre-commit/
├── template.json
└── hook.sh
```

### Variables:

| Variable | Type | Prompt | Default | Required |
|---|---|---|---|---|
| `hook_name` | input | Hook name? | `pre-commit` | yes |
| `lint_command` | input | Lint command? | `npm run lint` | — |

### template.json:

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
      "required": true
    },
    {
      "name": "lint_command",
      "prompt": "Lint command?",
      "default": "npm run lint"
    }
  ]
}
```

### hook.sh:

```bash
#!/bin/bash
echo "Running pre-commit checks..."
{{lint_command}}
```

### Output: `<project>/.claude/hooks/<hook_name>/hook.sh`

---

## 5. MCP Server Template: `basic`

```
templates/mcp-servers/basic/
├── template.json
├── __server_name__.ts
├── package.json
└── tsconfig.json
```

### Variables:

| Variable | Type | Prompt | Default | Required |
|---|---|---|---|---|
| `server_name` | input | Server name? | `my-mcp-server` | yes |
| `description` | input | Server description? | `A custom MCP server` | — |

### Output: `<project>/mcp-servers/<server_name>/` containing `<server_name>.ts`, `package.json`, `tsconfig.json`

---

## 6. Updated Boilerplate Root CLAUDE.md

Update the repository structure section in `boilerplate/CLAUDE.md` to reflect the new layout. Add `claude-setup` to the project templates list. Add standalone skills/hooks/mcp-servers sections.

---

## 7. User Flows

### New project:
```bash
megamind-ai sync
megamind-ai init react-app
# → Full project with source code, skills, CLAUDE.md hierarchy
```

### Existing project — full setup:
```bash
cd existing-project
megamind-ai init claude-setup
# → Prompts: project name, description, include_frontend?, frontend_dir, include_backend?, backend_dir
# → Creates: .claude/, CLAUDE.md, <frontend_dir>/CLAUDE.md, <backend_dir>/CLAUDE.md
megamind-ai generate skill code-review
megamind-ai generate skill debugging
megamind-ai generate hook pre-commit
```

### Existing project — just add a skill:
```bash
cd existing-project
megamind-ai generate skill jest-testing
# → .claude/skills/jest-testing/SKILL.md
```

---

## 8. What Does NOT Change

- Template file content (CLAUDE.md, SKILL.md, settings.json) — copied from existing templates
- Template variables and conditionals logic — preserved
- `docs/` directory — unchanged
- CLI source code — no modifications needed
- Shopify skills — remain embedded only in shopify-app template
