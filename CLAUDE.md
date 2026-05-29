# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is **not a product codebase** — it is a **boilerplate** that installs an AI-assisted development workflow into host projects. The workflow is built from two third-party tools wired together:

1. **`claude-code-harness`** (plugin, pinned `v4.12.3`) — a discipline loop `plan → work → review → sync → release`. `spec.md`/`Plans.md` are the source-of-truth contracts; work happens in small gated slices. Enforcement (permissions, sandbox, protected-branch, TDD) is a Go binary (`bin/harness`) + hooks that Claude Code runs automatically once the plugin is installed.
2. **`codegraph`** — a local semantic code index per subproject, so agents read-and-understand code with fewer tokens/tool-calls.

The boilerplate's job is to **configure** these tools for the host project — it does not contain the product source. `/init-workspace` clones the host's subprojects into a workspace and wires everything up.

> Migration context: this boilerplate previously shipped a custom 4-phase superpowers workflow (`sp-*`, `explore-story`, `create-test-case`, `self-test`, ...). That has been **fully replaced** by harness + codegraph. See `docs/harness-codegraph-migration-plan.md` for the rationale and the spike findings that shaped this design.

## Enabled plugins (`.claude/settings.json`)

- `claude-code-harness@claude-code-harness-marketplace` — the workflow engine. Declared via `extraKnownMarketplaces` (github `Chachamaru127/claude-code-harness`, **pinned to ref `v4.12.3`**, `autoUpdate: false`) so the whole team installs the same version. When a teammate trusts the workspace folder, Claude Code prompts them to install it.
- `atlassian@claude-plugins-official` — fetch Jira stories when planning from a Jira link.
- `context7@claude-plugins-official` — current library/framework docs (incl. Polaris React API).

Installing the harness is a **user step** (cannot be done from inside a Claude session): `/plugin marketplace add Chachamaru127/claude-code-harness` → `/plugin install claude-code-harness@claude-code-harness-marketplace` → restart → `/harness-setup` (per subproject).

## The harness loop (per-subproject)

Harness keeps state **per git repo** (`harness.toml`, `Plans.md`, `spec.md`, `.claude/state/` at `projectRoot`). Each subproject in a workspace is its own git repo, so **harness runs per-subproject** — you `cd backend/` (or `frontend/`, `storefront/`) and run the verbs there.

| Verb | Purpose |
|---|---|
| `/harness-plan` | Research → write `spec.md` (product contract) + `Plans.md` (task ledger). User approves. |
| `/harness-work [--no-commit]` | TDD slice per task. Always pass `--no-commit` (see Commit rules). |
| `/harness-review` | Independent review; blocks on critical/major findings. |
| `/harness-sync` | Reconcile `spec.md`/`Plans.md`/code across sessions. |
| `/harness-release` | Package evidence, run preflight. |

Harness ships agents (`advisor`, `reviewer`, `scaffolder`, `worker`) — no custom review agent needed. The plugin bundles ~37 skills total (it is `strict`, so individual skills can't be pruned); only the verbs above are used. Skill bodies are written in Japanese with English descriptions — Claude reads them fine; **all output to the user must be Vietnamese** (see rules).

After the host UI is touched, verify the real system with **`playwright-cli`** (`--headed --profile=chrome-profile`) inside the Shopify Admin iframe.

## Where configuration actually lives (v4.12.3 reality)

There is **no** `claude-code-harness.config.json` and **no** `docs/constitution.md` — those keys exist in a legacy schema but nothing in v4.12.3 reads them. The real customization surfaces, all **per-subproject**:

| Surface | Read by | Holds |
|---|---|---|
| `harness.toml` (subproject root) | Go binary (`bin/harness`) | permissions allow/deny/ask, sandbox `denyRead`, `protectedBranchPush`, `tdd.enforce`. Edit → run `bin/harness sync`. |
| `.claude/rules/project-rules.md` (subproject) | agent context (via `/harness-setup localize`) | **all domain rules:** Vietnamese output, no-auto-commit, task-sizing, codegraph-first, Shopify, bug intake. |
| `CLAUDE.md` (subproject) | agent | per-subproject guidance + pointer to rules. |
| `spec.md` + `Plans.md` (subproject root) | harness verbs | the contracts (source of truth). |

Seed templates live in **`templates/harness/`** (`harness.toml`, `project-rules.md`); `/init-workspace` copies them into each subproject.

## Project-scoped MCP servers (`.mcp.json`)

- `shopify-dev-mcp` (`@shopify/dev-mcp`) — `learn_shopify_api`, `search_docs_chunks`, `validate_graphql_codeblocks`, `validate_component_codeblocks`, `validate_theme`. Essential for any Shopify subproject.
- **codegraph (per-subproject)** — added by `/init-workspace`, one entry per cloned subproject: `npx -y @colbymchenry/codegraph serve --mcp --path <subproject>`. The `--path` flag scopes each MCP server to one subproject's `.codegraph/` DB. Tools: `codegraph_search/context/trace/callers/callees/impact/node/explore`. Query codegraph **before** grep when `.codegraph/` exists.

`/init-workspace` copies `.mcp.json` into each new workspace. First open prompts the user to approve each server.

## Per-subproject overlay — never dirty the team's repo

Subprojects are other teams' git repos. Harness/codegraph artifacts (`harness.toml`, `Plans.md`, `spec.md`, `.claude/state/`, `.codegraph/`, `evidence/`) live at the subproject root but are **local-only**: `/init-workspace` adds them to each subproject's **`.git/info/exclude`** (per-clone, never committed, doesn't touch the team's tracked `.gitignore`). The subproject's `git status` stays clean.

## Shopify domain conventions

If a subproject is a Shopify app (detected via `@shopify/polaris`, `@shopify/shopify-api`, or `@shopify/app-bridge-react` in `package.json`), `.claude/rules/project-rules.md` points to **`docs/shopify-conventions.md`** — read it before `/harness-plan` and `/harness-work` on anything touching Shopify UI/API. Key constraints: **Polaris React** (`@shopify/polaris`, not web components `<s-*>`); validate Admin GraphQL via `shopify-dev-mcp`; app runs embedded in the Admin iframe.

## Commit rules

**No auto-commit.** Harness's `/harness-work` auto-commits by default — always pass **`--no-commit`**. `harness.toml` also puts `git commit`/`git push` under `ask`. The user commits when ready (manual `git` or `/ship-it`), inside the correct subproject. Commit style: short lowercase prefixes (`feat:`, `fix:`, `chore:`, ...).

## Custom skills kept

Only two local skills remain (everything else is provided by the harness plugin):

- **`init-workspace`** — create a workspace, clone subprojects, set `.git/info/exclude`, `codegraph init` per subproject, seed `harness.toml` + `project-rules.md`, write `.mcp.json` + workspace `CLAUDE.md`, print `/harness-setup` next-steps. Boilerplate git is left untouched.
- **`playwright-cli`** — headed browser (`--headed --profile=chrome-profile --browser=chrome`) for verifying real UI inside the Shopify Admin iframe.

## Workflow rules that override defaults

1. **Harness runs per-subproject.** `cd <subproject>` before any `/harness-*` verb. Each subproject is its own git repo with its own `harness.toml`/`Plans.md`/`spec.md`.
2. **No auto-commit anywhere.** Always `/harness-work --no-commit`; user commits manually in the right subproject.
3. **`spec.md`/`Plans.md` are source-of-truth.** Don't invent data not observed ("not_observed ≠ absent"). Fix scope gaps in the plan, not downstream.
4. **codegraph query-first** when a subproject has `.codegraph/` — only Read/Grep to confirm details.
5. **All user-facing output is Vietnamese** (harness i18n has no VN; enforced via `.claude/rules`/CLAUDE.md). Technical tokens stay English.
6. **Task-sizing routing** (defined in `.claude/rules/project-rules.md`): Trivial (≤2 files, no product-behavior/API/data/permissions/billing change) → prompt directly, skip ceremony; Small → Solo `--auto-mode --no-commit`; Medium → `--parallel` with plan gate; Large → full loop with mandatory spec + review.
7. **Selective auto-mode** — on for Trivial/Small, off for Medium/Large. Independent of no-auto-commit.
8. **Shopify UI bugs must be reproduced** with `playwright-cli --headed` in the Admin iframe + evidence saved to `evidence/` before fixing.
9. **Never commit harness/codegraph overlay files** into a subproject's tracked git — they belong only in `.git/info/exclude`.
10. **Installing the harness plugin + `/harness-setup` are user steps** — a Claude session cannot install marketplace plugins.
