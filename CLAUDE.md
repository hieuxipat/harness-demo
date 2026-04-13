# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is **not a product codebase** — it is a **boilerplate** that installs an AI-assisted development workflow into a host project. It ships custom skills (`.claude/skills/`) and a `docs/features/` scaffold that together drive a 4-phase workflow: Explore Story → Create Test Case → Implement → Verify & Sync.

The host project that consumes this boilerplate provides the actual source code. This repo does not contain it.

See `README.md` for the full workflow narrative (written in Vietnamese).

## Enabled plugins

`.claude/settings.json` enables two plugins the workflow depends on:

- `atlassian@claude-plugins-official` — used by `explore-story` to fetch Jira stories when given a Jira link.
- `context7@claude-plugins-official` — fetch current library/framework docs instead of relying on training data.

Superpowers skills are installed locally at `.claude/skills/sp-*` (not as a plugin). Changes to enabled plugins should be made in `.claude/settings.json`.

## Project-scoped MCP servers (`.mcp.json`)

`.mcp.json` at the repo root declares MCP servers that Claude Code loads automatically when the workspace is opened. `/init-workspace` copies this file into each new workspace so every subproject shares the same MCP baseline.

Currently configured:

- `shopify-dev-mcp` — Shopify Dev MCP (`@shopify/dev-mcp`). Provides `learn_shopify_api`, `search_docs_chunks`, `validate_graphql_codeblocks`, `validate_theme`, `validate_component_codeblocks`. Use for Admin/Storefront API queries, Polaris components, and theme code — essential for brainstorming and TDD on any Shopify app subproject.

When adding a new MCP server, edit `.mcp.json` and make sure `/init-workspace` still copies it to new workspaces. The first time a workspace opens, Claude Code prompts the user to approve each server.

## Shopify domain conventions

If a workspace contains a Shopify app subproject (detected via `@shopify/polaris`, `@shopify/shopify-api`, or `@shopify/app-bridge-react` in any subproject `package.json`), read `docs/shopify-conventions.md` before:

- Phase 1 `explore-story` on a story that touches Shopify UI or API
- Phase 3 `sp-brainstorming` — the spec must follow the decision-log template from that file
- Phase 3 `sp-test-driven-development` — UI tests must use Polaris React components (not web components `<s-*>`), GraphQL code must be validated via `shopify-dev-mcp`
- Phase 4 `/self-test` — browser mode runs inside Shopify Admin iframe, webhooks trigger via Shopify CLI

The file is a constraint checklist, not a workflow override. The 4-phase workflow still owns the execution order.

## The four workflow phases

| Phase | Command | Skill file | Purpose |
|---|---|---|---|
| 1. Explore Story | `/explore-story <story or Jira link>` | `.claude/skills/explore-story/SKILL.md` | Research app → verify feasibility (BLOCKED = hard-stop, no file written) → split per INVEST if needed → write `US-<id>-<name>.md` with `status: DRAFT` → append `## Open questions for PO` at the end. Human forwards to PO, edits answers into file, then runs Phase 2. |
| 1a. PO Q&A Loop (helper) | `/po-qa-loop <path to US-*.md or group folder>` | `.claude/skills/po-qa-loop/SKILL.md` | Walk through the `## Open questions for PO` section one question at a time, record the PO's answer, update the story body for in-scope changes, and flag scope-expanding answers for `/explore-story` refine mode. Optional helper between Phase 1 and Phase 2. |
| 2. Create Test Case | `/create-test-case <path to US-*.md>` | `.claude/skills/create-test-case/SKILL.md` | Read validated story → generate `TC-<id>-<name>.md` with HAPPY / EDGE / ERROR sections, all `PENDING`. Stop for human review. |
| 3. Implement | `/sp-brainstorming read @<US-*.md path> and test cases @<TC-*.md path>` | `.claude/skills/sp-brainstorming/SKILL.md` → `sp-writing-plans` → `sp-subagent-driven-development` or `sp-executing-plans` → `sp-test-driven-development` | Brainstorm (reads US + TC as input) → design spec → implementation plan → TDD cycle → review checkpoints. All artifacts saved inside the story folder. No auto-commit. |
| 4. Verify & Sync | `/self-test` | `.claude/skills/self-test/SKILL.md` | Run Phase 2 manual test cases against the real system. Pick mode per story: Browser (UI) or Integration (backend, real calls, no mocks). Record PASS/FAIL/BYPASS. Sync docs. Flip story to `DONE` only when all non-BYPASS cases pass. Never auto-fix code. |

### Full vs. light workflow

- **Full** (default): all 4 phases.
- **Light**: skip Phase 1 only (Phases 2 + 3 + 4). Use only for clearly trivial changes where the story is already rock-solid.

Phase 2 is always required — `/self-test` reads `TC-*.md` to verify.

## Phase 3 detailed flow

Phase 3 uses the superpowers skills chain. The user triggers it with one command, and the skills invoke each other automatically:

```
/sp-brainstorming read @docs/features/<group>/US-<id>-<name>/US-<id>-<name>.md \
  and test cases @docs/features/<group>/US-<id>-<name>/TC-<id>-<name>.md
```

```
┌──────────────────────────────────────────────────────────────────┐
│ Step 1: sp-brainstorming                                        │
│   Input: US-*.md + TC-*.md (MANDATORY — both files required)    │
│   - Read story: acceptance criteria, business rules, actors     │
│   - Read test cases: extract all TC IDs (H01, E01, R01...)      │
│   - Explore current source code relevant to the story           │
│   - Ask clarifying questions (1 per message)                    │
│   - Propose 2-3 approaches with trade-offs                     │
│   - Present design → user approves                              │
│   - Write spec to: .../US-<id>-<name>/specs/<topic>-design.md  │
│   - Spec self-review: cross-check against ALL TC IDs            │
│   - User reviews spec                                           │
│   → auto-invokes sp-writing-plans                               │
├──────────────────────────────────────────────────────────────────┤
│ Step 2: sp-writing-plans                                        │
│   Input: spec from Step 1                                       │
│   - Create bite-sized implementation plan (TDD steps)           │
│   - Write plan to: .../US-<id>-<name>/plans/<feature>.md       │
│   - Ask user to choose execution mode:                          │
│     Option 1: Subagent-Driven (recommended)                     │
│     Option 2: Inline Execution                                  │
│   → auto-invokes chosen execution skill                         │
├──────────────────────────────────────────────────────────────────┤
│ Step 3: sp-subagent-driven-development (Option 1)               │
│         or sp-executing-plans (Option 2)                        │
│   For EACH task in the plan:                                    │
│   - Implementer subagent: write failing test → implement →      │
│     verify → self-review (NO commit)                            │
│   - Spec reviewer subagent: verify code matches spec            │
│   - Code quality reviewer subagent: verify code quality         │
│   - Mark task complete → next task                              │
│   Uses sp-test-driven-development throughout (Red-Green-Refactor)│
├──────────────────────────────────────────────────────────────────┤
│ Step 4: sp-finishing-a-development-branch                       │
│   - Verify all tests pass                                       │
│   - Present options: merge / PR / keep / discard                │
├──────────────────────────────────────────────────────────────────┤
│ Step 5: User commits when ready (/ship-it or manual)            │
└──────────────────────────────────────────────────────────────────┘
```

### Data flow — why TDD does not need to read TC-*.md directly

```
US-*.md + TC-*.md
       ↓
sp-brainstorming (reads BOTH, cross-checks ALL TC IDs)
       ↓
specs/<topic>-design.md (single source of truth — digested from US + TC)
       ↓
plans/<feature>.md (generated from spec — has exact tasks, code, tests)
       ↓
sp-test-driven-development (works from plan — spec already covers all TC cases)
```

Brainstorming is the bridge between Phase 1+2 artifacts and Phase 3 superpowers. If brainstorming misses a TC edge case, that is a brainstorming bug — fix at that level, not by passing TC to TDD.

## Artifact layout and naming

The workflow is contract-driven — skills read and write specific paths, indexes must stay in sync.

```
docs/
  features/
    index.md                                    # top-level table of all groups / stories
    <group>/
      index.md                                  # per-group table of stories + test case files
      US-<id>-<name>/                           # one folder per story — ALL artifacts here
        US-<id>-<name>.md                       # user story (Phase 1)
        TC-<id>-<name>.md                       # manual test cases (Phase 2)
        specs/                                  # design docs (Phase 3 brainstorming)
          <topic>-design.md
        plans/                                  # implementation plans (Phase 3 writing-plans)
          <feature-name>.md
```

- `<group>` is a feature area (e.g. `dispute`).
- `<id>` typically encodes the Jira ticket (e.g. `SP25`) plus a slug.
- Story + TC + specs + plans all live in the same `US-<id>-<name>/` folder. No separate `docs/superpowers/` directory.
- Story status: `DRAFT | DONE`. Only `/self-test` flips to `DONE`.
- Test case result: `PENDING | PASS | FAIL | BYPASS`.
- Test case IDs: section-prefixed (`-H01`, `-E01`, `-R01`), dense within each section, append-only.
- Two index layers: `docs/features/index.md` (top-level) and `docs/features/<group>/index.md` (per group).

## Commit rules

**No auto-commit.** None of the superpowers skills (`sp-brainstorming`, `sp-writing-plans`, `sp-subagent-driven-development`, `sp-executing-plans`, `sp-test-driven-development`) commit automatically. The user decides when to commit using `/ship-it` or manual git commands.

Commit style: short, lowercase prefixes (`workflow:`, `ci:`, `feat:`, `fix:`, etc.).

## Workflow rules that override defaults

1. **This workflow owns manual tests only.** Unit tests and E2E specs are owned by `sp-test-driven-development` during Phase 3. Phase 1/2/4 skills do not read, write, or run them.
2. **Human review is mandatory between phases.** Each phase stops and waits. Phase 1 waits for PO validation before Phase 2.
3. **Tests before code** in Phase 3 — enforced by `sp-test-driven-development`.
4. **Phase 3 brainstorming MUST read both US-*.md and TC-*.md.** Both files are required input. The spec self-review must cross-check against every TC ID.
5. **`/self-test` picks its mode per story.** Browser (UI) or Integration (backend, real HTTP + DB, no mocks). Mixed stories use both.
6. **`/self-test` uses real data.** No mocks, no stubs. Integration mode does not auto-clean — dirty environment = stop and ask human.
7. **`/self-test` never halts on first failure.** Run all cases, record individually, then compute verdict.
8. **`/self-test` is the only skill that flips story to `DONE`.** One FAIL = stays `DRAFT`. Regression on `DONE` story = drop to `DRAFT` + tag REGRESSION.
9. **`/self-test` syncs docs in the same run.** Reconcile story + TC + indexes with shipped code. Re-run updated cases.
10. **`explore-story` feasibility is a hard-stop gate.** BLOCKED = no file written, return proof.
11. **`explore-story` splits only when needed.** INVEST checklist. Never split along FE/BE layers.
12. **`explore-story` captures open questions at end of story file, not in chat.** Business-logic only. Human owns the PO loop.
13. **`create-test-case` never explores or invents.** Missing info = stop and route back to `/explore-story`.
14. **Test case IDs are section-prefixed.** `-H01` HAPPY, `-E01` EDGE, `-R01` ERROR. Append-only, never renumber.
15. **`/self-test` detects default branch dynamically.** Never hardcode `master` or `main`.
16. **`/self-test` runs in ordered re-runnable checkpoints.** A→B→C→D→E→F. Crash-safe, resume from first incomplete.
17. **No auto-commit anywhere.** User controls when to commit.
