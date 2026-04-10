# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is **not a product codebase** — it is a **boilerplate** that installs an AI-assisted development workflow into a host project. It ships four custom skills (`task-explore`, `self-test`, `sync-docs`, `playwright-cli`) and a `docs/` scaffold (`superpowers/`, `features/`) that together drive a 4-phase workflow: Prepare → Implement → Verify → Sync Docs.

The host project that consumes this boilerplate is expected to provide the actual source code (`src/`, `tests/e2e/`, etc.) — this repo does not contain it. Paths like `src/__tests__/` and `tests/e2e/` referenced in skills point into the host project, not here.

See `README.md` for the full workflow narrative (written in Vietnamese).

## Enabled plugins

`.claude/settings.json` enables three plugins that the workflow depends on:

- `superpowers@claude-plugins-official` — brainstorming, planning, TDD, verification-before-completion, executing-plans, etc. Phase 2 of the workflow is built on these.
- `atlassian@claude-plugins-official` — used by `task-explore` to fetch Jira stories when given a Jira link.
- `context7@claude-plugins-official` — fetch current library/framework docs instead of relying on training data.

Changes to enabled plugins should be made in `.claude/settings.json`.

## The four workflow phases

Each phase corresponds to a skill in `.claude/skills/`. Invoke them as slash commands:

| Phase | Command | Skill file | Purpose |
|---|---|---|---|
| 1. Prepare | `/task-explore <story or Jira link>` | `.claude/skills/task-explore/SKILL.md` | Research the current app (browser via Playwright optional, plus existing docs / Jira / targeted source reading), ask clarifying questions about anything unclear, write a user story, generate E2E test cases — stops for human review before any code is written. |
| 2. Implement | `/brainstorming read @docs/features/<group>/US-<id>-<name>/US-<id>-<name>.md and test cases @docs/features/<group>/US-<id>-<name>/TC-<id>-<name>.md` | superpowers plugin | Brainstorm → plan → TDD cycle → review checkpoints. Tests are written before implementation. |
| 3. Verify | `/self-test` | `.claude/skills/self-test/SKILL.md` | Run the Phase 1 test cases in a headed Playwright browser against real localhost. Reports PASS/FAIL/BYPASS — does not auto-fix. |
| 4. Sync Docs | `/sync-docs` | `.claude/skills/sync-docs/SKILL.md` | Analyze git diff, update user stories, test cases, index files, unit tests (Vitest), and E2E tests (Playwright) to match shipped code. Reset affected test results to `PENDING`. |

**Full vs. light workflow** — the README defines when to run all four phases vs. only phases 2+4. Default to full; use light only for clearly trivial changes (copy, styling, config, obvious bug fix with existing coverage). The decision table is in `README.md` under "When to Use Which Workflow".

## Artifact layout and naming

The workflow is contract-driven — the skills read and write specific paths, and the indexes must stay in sync. When creating or updating these files, preserve the schema exactly.

```
docs/
  superpowers/                                  # plans, brainstorms, and other superpowers artifacts
  features/
    index.md                                    # top-level table of all groups / stories
    <group>/
      index.md                                  # per-group table of stories + test case files
      US-<id>-<name>/                           # one folder per story
        US-<id>-<name>.md                       # the user story
        TC-<id>-<name>.md                       # the matching test cases (sibling of the story)
```

- `<group>` is a feature area (e.g. `dispute`).
- `<id>` typically encodes the Jira ticket (e.g. `SP25`) plus a slug.
- A story file `US-<id>-<name>.md` and its test case file `TC-<id>-<name>.md` live **side by side** in `docs/features/<group>/US-<id>-<name>/`. They share the `<id>-<name>` suffix and cross-reference each other via relative links.
- Each test case has a `test-result` of `PENDING | PASS | FAIL | BYPASS` and a `test-result-note`. `/self-test` updates these in place. `BYPASS` cases are skipped and their result is carried forward.
- When `sync-docs` touches a story, any test case whose behavior may have shifted must be reset to `PENDING` so `/self-test` re-runs it.
- Two index layers must stay in sync: `docs/features/index.md` (top-level) and `docs/features/<group>/index.md` (per group).

The full output schema for `task-explore` is documented in `.claude/skills/task-explore/SKILL.md`.

## Workflow rules that override defaults

These come from `README.md` and the skill definitions — follow them even when they conflict with general instincts:

1. **Human review is mandatory between phases.** Phases 1, 2, and 3 each stop and wait. Do not proceed to the next phase without explicit approval.
2. **Tests before code** in Phase 2. This is enforced by the superpowers `test-driven-development` skill — do not write implementation without a failing test first.
3. **`/self-test` uses a real headed browser via Playwright CLI**, not mocked unit tests. It clicks through the actual UI at localhost (or whatever host the user points it at).
4. **Phase 3 reports failures; it does not fix them.** The human decides whether to fix, adjust the test case, or mark `BYPASS`.
5. **Always run `/sync-docs` after shipping.** If it resets any test result to `PENDING`, re-run `/self-test` before calling the task done.
6. **`task-explore` researches the app as an end-user first.** Browser exploration via Playwright is the preferred lens but is **optional** — pick whichever combination of browser, existing docs, Jira, and (narrow, intentional) source reading actually answers the question. Whatever you do, do not invent behavior — if anything is unclear, stop and ask the user before drafting the story.

## Commit conventions

Recent history uses short, lowercase prefixes: `workflow:`, `ci:`, etc. Match this style. The current feature branch is `workflow-with-superpowers`; `main` is the PR target.
