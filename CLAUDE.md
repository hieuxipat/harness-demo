# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is **not a product codebase** — it is a **boilerplate** that installs an AI-assisted development workflow into a host project. It ships four custom skills (`explore-story`, `create-test-case`, `self-test`, `playwright-cli`) and a `docs/` scaffold (`superpowers/`, `features/`) that together drive a 4-phase workflow: Explore Story → Create Test Case → Implement → Verify & Sync.

The host project that consumes this boilerplate is expected to provide the actual source code. This repo does not contain it. Code-level tests (unit tests, E2E specs) live inside the host project and are maintained exclusively by the superpowers `test-driven-development` flow during Phase 3 — none of the skills in this repo read, write, or run them.

See `README.md` for the full workflow narrative (written in Vietnamese).

## Enabled plugins

`.claude/settings.json` enables three plugins that the workflow depends on:

- `superpowers@claude-plugins-official` — brainstorming, planning, TDD, verification-before-completion, executing-plans, etc. Phase 3 of the workflow is built on these.
- `atlassian@claude-plugins-official` — used by `explore-story` to fetch Jira stories when given a Jira link.
- `context7@claude-plugins-official` — fetch current library/framework docs instead of relying on training data.

Changes to enabled plugins should be made in `.claude/settings.json`.

## The four workflow phases

Each phase corresponds to a skill in `.claude/skills/` (except Phase 3, which is driven by the superpowers plugin). Invoke them as slash commands:

| Phase | Command | Skill file | Purpose |
|---|---|---|---|
| 1. Explore Story | `/explore-story <story or Jira link>` | `.claude/skills/explore-story/SKILL.md` | Read the request → explore the current app (browser via Playwright optional, plus existing docs / Jira / targeted source reading) → **verify feasibility as a hard-stop gate**: if BLOCKED, return reason + concrete proof and write no story file; otherwise → split the story per Agile INVEST if too big → write one `US-<id>-<name>.md` per resulting story with `status: DRAFT` → append an `## Open questions for PO` section (business-logic only, with best-guess + blocking flag) at the **end** of each story. Does not wait in chat for answers — the human forwards stories to the PO, edits the answers into the file, then runs `/create-test-case`. |
| 2. Create Test Case | `/create-test-case <path to US-*.md>` | `.claude/skills/create-test-case/SKILL.md` | Take one validated user story and generate a matching `TC-<id>-<name>.md` with three sections: **HAPPY**, **EDGE**, **ERROR**. All cases start as `PENDING`. Stops for human review. |
| 3. Implement | `/brainstorming read @docs/features/<group>/US-<id>-<name>/US-<id>-<name>.md and test cases @docs/features/<group>/US-<id>-<name>/TC-<id>-<name>.md` | superpowers plugin | Brainstorm → plan → TDD cycle → review checkpoints. Tests are written before implementation. |
| 4. Verify & Sync | `/self-test` | `.claude/skills/self-test/SKILL.md` | Run the Phase 2 **manual** test cases against the real running system and sync the story + TC file + indexes with the shipped code, in ordered re-runnable checkpoints (run → write results → sync docs → smoke → indexes → flip status). Picks mode per story: **Browser mode** (headed Playwright at localhost) for UI-facing stories; **Integration mode** (real HTTP calls via `curl`/HTTP client + real DB / queue / log inspection) for backend-only stories. Integration mode does **not** clean up — if the environment is dirty on entry, `/self-test` stops and asks the human to reset. Records PASS/FAIL/BYPASS for each case (does not halt on failure), and flips story `status` to `DONE` only when every non-BYPASS manual case passes. A regression on a previously-`DONE` story drops it back to `DRAFT`. Does not touch unit tests or E2E specs — those are Phase 3 territory. Never auto-fixes production code. |

**Full vs. light workflow** — the README defines when to run all four phases vs. a trimmed version. The default is **full**. **Light** means *skip Phase 1 only* (i.e. Phases 2 + 3 + 4) — Phase 2 is still required because `/self-test` runs against `TC-*.md`. Use light only for clearly trivial changes (copy, styling, config, obvious bug fix with existing coverage) where the story is already rock-solid and the incremental cost of `/explore-story` is not worth it.

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
- Each user story has a **two-state** `status` field: `DRAFT | DONE`. `explore-story` writes `DRAFT`. Only `/self-test` is allowed to flip it to `DONE`, and only when every non-BYPASS test case in that story passes in the same run. A regression on a previously-`DONE` story drops it back to `DRAFT` (tagged **REGRESSION** in the self-test report). There is no `IN_PROGRESS`.
- Each test case has a `test-result` of `PENDING | PASS | FAIL | BYPASS` and a `test-result-note`. `/self-test` updates these in place. `BYPASS` cases are skipped and their result is carried forward.
- **Test case IDs are section-prefixed:** `TC-<id>-<name>-H01`, `-H02`, … for HAPPY cases; `-E01`, `-E02`, … for EDGE; `-R01`, `-R02`, … for ERROR. Numbering is dense within each section, append-only, and never renumbered.
- When `/self-test` reconciles a story with shipped code and a case's expected behavior changes, it must re-run that updated case in the same invocation — never leave a case's text edited but its result stale.
- Two index layers must stay in sync: `docs/features/index.md` (top-level) and `docs/features/<group>/index.md` (per group). Story status is surfaced there.

The full output schema for a user story is documented in `.claude/skills/explore-story/SKILL.md`. The schema and section layout for a test case file is documented in `.claude/skills/create-test-case/SKILL.md`.

## Workflow rules that override defaults

These come from `README.md` and the skill definitions — follow them even when they conflict with general instincts:

1. **This workflow owns manual tests only.** Unit tests (Vitest) and E2E specs (Playwright) are **fully owned by superpowers** during Phase 3 via the `test-driven-development` skill. None of the skills in this repo (`explore-story`, `create-test-case`, `self-test`) read, write, or run them. If a code-level test is out of sync with the shipped code, that is a Phase 3 bug — flag it, do not fix it in Phase 4.
2. **Human review is mandatory between phases.** Phases 1, 2, and 3 each stop and wait. Do not proceed without explicit approval. Phase 1 specifically waits for **Product Owner validation** that the story is feasible and right-sized before Phase 2 generates test cases.
3. **Tests before code** in Phase 3. This is enforced by the superpowers `test-driven-development` skill — do not write implementation without a failing test first.
4. **`/self-test` picks its mode per story.** Browser mode (headed Playwright) for UI-facing stories; Integration mode (real HTTP calls, real DB/queue inspection, no mocks) for backend-only stories. Browser usage is therefore **optional** — backend-only stories never open a browser. Mixed stories can use both tools within the same run.
5. **`/self-test` uses real data and real calls.** No mocked databases, no stubbed HTTP clients, no fake fixtures substituted for the real thing. If the environment cannot support real calls, stop and ask the user. **Integration mode does not auto-clean up** — on a dirty environment (unique-constraint conflicts, leftover test records, schema drift), `/self-test` stops and the human resets manually. It never silently deletes or renames records to work around the conflict.
6. **`/self-test` never halts on the first failing case.** Run every non-BYPASS case, record PASS/FAIL individually, then compute the story-level verdict. Failures are reported, never auto-fixed.
7. **`/self-test` is the only skill that can mark a story `DONE`.** The flip happens only when every non-BYPASS manual test case passes in the same run. One FAIL keeps the story at `DRAFT`. A regression on a previously-`DONE` story drops it back to `DRAFT` and is tagged **REGRESSION** in the report. `DONE` regressions are only detected when the human explicitly points `/self-test` at the affected story — there is no automatic regression detection.
8. **`/self-test` also syncs story docs to reality.** In the same run it reconciles the user story, test case file, and indexes with the shipped code. If a reconciliation edit changes what a case tests, the updated case must be re-run in the same invocation — never leave docs edited but results stale.
9. **`explore-story` researches the app as an end-user first.** Browser exploration via Playwright is the preferred lens but is **optional** — pick whichever combination of browser, existing docs, Jira, and (narrow, intentional) source reading actually answers the question. Do not invent behavior.
10. **`explore-story` treats feasibility as a hard-stop gate.** Order is fixed: explore → verify feasibility → split → write. If the verdict is `BLOCKED`, the skill writes **no story file** and instead returns a reason + concrete proof (clickable file paths, routes, Jira comments, screenshots) so the user can verify the claim themselves. Fabricated "I think it is blocked" verdicts are forbidden.
11. **`explore-story` may split a request into several stories.** Apply the Agile INVEST checklist — only split when the story is too big, bundles independent goals, or cannot be cleanly tested. Do not split small stories, and never split along technical layers (FE/BE); each resulting story must deliver observable value end-to-end. If the right split line is unclear, ask the PO via the story's open-questions section — do not guess.
12. **`explore-story` captures open questions at the end of each story, not in chat.** Every written story must have an `## Open questions for PO` section at the bottom. Questions are restricted to **business logic** (rules, policies, state transitions, domain terms, scope boundaries, business-judgement edge cases) — never technical implementation, framework choices, or UX micro-copy. Each entry has: the question, why it matters, a best-guess, and a blocking / non-blocking flag. If there are genuinely no questions, the section still exists and reads "None — ready for `/create-test-case`". The skill does **not** block in chat waiting for answers — the human sends stories to the PO, edits answers into the file, then runs `/create-test-case`.
13. **`create-test-case` never explores or invents.** It only works off a story that already exists on disk. If the story is missing, has unresolved **blocking** entries in its `## Open questions for PO` section, was written despite a BLOCKED feasibility, or the PO answers have shifted scope beyond what the `feasibility` block covers — stop and route back to `/explore-story` (refine mode for the last case). If during test-case generation an obvious case is missing from the story, do **not** chat-block and do **not** invent — stop and send the user back to `/explore-story` to update the story itself.
14. **Test cases always have three sections, with section-prefixed IDs.** `create-test-case` must output **HAPPY**, **EDGE**, and **ERROR** as top-level groupings, in that order. IDs use `-H`, `-E`, `-R` prefixes (e.g. `TC-SP25-export-H01`, `-E01`, `-R01`), dense within each section, append-only. For backend-only stories, steps and expected results express HTTP calls and observable side effects (status codes, response bodies, DB rows, queue entries) — not internal function calls.
15. **`/explore-story` has a refine mode.** When invoked on an existing `US-*.md` path after the PO has edited answers into the file, it re-verifies feasibility against the updated acceptance criteria (same BLOCKED hard-stop rules apply). Required whenever PO answers introduce new capability needs, change the actor, expand scope, or force a split the original did not consider. Not required when the PO only clarified wording.
16. **`/self-test` detects the default branch dynamically.** Never hardcode `master` or `main`. Use `git symbolic-ref refs/remotes/origin/HEAD` with fallback to `git config init.defaultBranch` and existence checks.
17. **`/self-test` runs in ordered, re-runnable checkpoints.** Run tests (A) → write TC results (B) → sync story+TC (C) → regression smoke (D) → update indexes (E) → flip status (F). A crash in a later checkpoint must not destroy earlier work; a re-run resumes from the first incomplete checkpoint.

## Commit conventions

Recent history uses short, lowercase prefixes: `workflow:`, `ci:`, etc. Match this style. The current feature branch is `workflow-with-superpowers`; `main` is the PR target.
