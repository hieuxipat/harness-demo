---
name: task-explore
description: >
  Use this skill when starting a new story or feature that requires understanding the current app, clarifying requirements, and preparing E2E test cases before writing any implementation code. Trigger when the user mentions "task-explore", "explore feature", "analyze story", "write test cases", "create user story", or provides a Jira link / story description to analyze. Always use this skill before starting to implement any new feature, even if the user doesn't explicitly ask for it.
---

# task-explore

Analyze a story, research the current app, clarify unknowns with the user, and generate E2E test cases — run **before any implementation**.

---

## Input

- Story description as text (from chat), **or**
- Jira link / Issue ID to fetch story details

---

## Output

| Artifact          | Path                                                               |
| ----------------- | ------------------------------------------------------------------ |
| User Story        | `docs/features/[group]/US-[id]-[name]/US-[id]-[name].md`           |
| Test Cases        | `docs/features/[group]/US-[id]-[name]/TC-[id]-[name].md`           |
| Group Index       | `docs/features/[group]/index.md`                                   |
| Features Index    | `docs/features/index.md`                                           |

The user story file and its test case file live **side by side** inside a folder named after the story (`US-[id]-[name]/`). Keep this co-location — the rest of the workflow assumes it.

---

## Output Schema

```
user_story:
  - id: US-[id]-[name]
  - group: [group]
  - title: string
  - goal: string
  - acceptance_criteria: list[string]
  - steps: list[string]
  - notes: string (optional)

test_cases:
  - id: TC-[id]-[name]
  - group: [group]
  - linked_story: US-[id]-[name]
  - cases:
      - id: TC-[id]-[name]-[N]
        test-result: PENDING | PASS | FAIL | BYPASS
        test-result-note: string
        type: happy_path | edge_case | error_case
        description: string
        precondition: string
        steps: list[string]
        expected_result: string
```

---

## Mindset

**Think like an end-user, not a developer.** You are exploring the app as a visitor would — clicking, scrolling, reading. Your goal is to understand what the user sees and does, not how the code is structured.

- What does the user **see**?
- What can the user **click/tap**?
- What **happens** when they interact?
- What is **missing** from the user's perspective?

You should also be honest about what you do **not** know. If a requirement is ambiguous, do not invent an answer — ask the human. The cost of one clarifying question is small; the cost of writing a story around the wrong assumption costs the entire downstream workflow.

---

## Steps

### Step 1 — Read & understand the story

- If input is a **Jira link**: fetch the issue, read description + acceptance criteria
- If input is **text**: parse directly from chat
- Identify: actor, goal, main flow, alternate flows, potential edge cases

### Step 2 — Research the current app

Pick the lightest research approach that gives you enough context to write a faithful story. You do **not** have to use every method — use what fits the task.

**Available research methods:**

1. **Browser exploration with Playwright CLI _(optional, preferred when the feature is visible in the running app)_** — Use the `/playwright-cli` skill to open a headed browser at localhost. Navigate to relevant screens, click buttons, fill forms, take screenshots. This is the most faithful way to capture _what the user actually sees_, but it is not mandatory — skip it when the app is not running, the screen does not yet exist, or the change is non-visual.
2. **Existing docs** — Read `docs/features/index.md` and any related `docs/features/[group]/index.md` to find related stories already documented.
3. **Jira / linked tickets** — Re-read the Jira issue, comments, attachments, and any linked tickets for context the chat message did not include.
4. **Targeted source reading** — Allowed only when needed to disambiguate (e.g., to find a route, an API contract, or an existing schema). Keep it narrow; do not start architecting from the codebase.

Record what you observe and what you are still uncertain about. Save screenshots if you took any.

### Step 3 — Clarify unknowns with the user (mandatory if anything is unclear)

Before writing the user story, scan everything you have gathered for gaps. For each gap, decide whether you can answer it from observation or whether only the human can.

**Ask the user — do not guess — when any of the following is unclear:**

- Who the actor is, or what permissions/role they have
- What the trigger or entry point for the flow is
- What the success criteria look like (what the user should see after the action)
- What should happen on error, validation failure, or empty state
- Which existing screen, route, or component the change attaches to
- Edge cases the story description does not cover (limits, concurrency, offline, etc.)
- Any business rule, calculation, or terminology that is not self-explanatory

**How to ask:**

- Group questions into a short numbered list — do not drip-feed one question at a time
- For each question, state your **best guess** so the user can confirm with a single word instead of writing prose
- Mark which questions are **blocking** (you cannot write the story without an answer) vs **non-blocking** (you can write the story but want to confirm an assumption)
- Wait for the user's answers before continuing. Do not write the story on top of unanswered blocking questions.

**Example:**

```
I need a few clarifications before drafting the story:

1. (blocking) Who triggers this export — any logged-in user, or only admins?
   My guess: admins only.
2. (blocking) On an empty result set, should we show an empty CSV or block the export?
   My guess: block with a toast "no rows to export".
3. (non-blocking) Is the filename format `export-YYYY-MM-DD.csv`?
   My guess: yes.
```

If everything is already clear from Step 1 and Step 2, say so explicitly (e.g., "No clarifications needed — proceeding to draft the story.") and move on.

### Step 4 — Check & update User Stories

- Read `docs/features/index.md` and the relevant `docs/features/[group]/index.md` to find related stories
- **If a story already exists:** update `docs/features/[group]/US-[id]-[name]/US-[id]-[name].md` to align with the new requirements
- **If no story exists:** create the folder `docs/features/[group]/US-[id]-[name]/` and write a new `US-[id]-[name].md` inside it
- Write stories from the **user's perspective** — describe what they see and do, not how the code works
- Update `docs/features/[group]/index.md` and `docs/features/index.md` if a new story or group was added

### Step 5 — Write E2E Test Cases

Create `docs/features/[group]/US-[id]-[name]/TC-[id]-[name].md` (in the **same folder** as the user story) covering all 3 types:

1. **Happy path** — standard successful flow
2. **Edge case** — boundary data, special conditions
3. **Error case** — error handling, validation failures, unauthorized access

Test cases must be written from the **user's perspective** — steps describe what a user does and sees, not what the code should do internally.

- Update `docs/features/[group]/index.md` to reflect the new test case file if needed.

### Step 6 — Human Review Checkpoint

**Stop. Do not continue to implementation.**

Present the following summary for human review:

- User story(s) created or updated
- Number of test cases by type
- Any non-blocking assumptions that the user has not yet confirmed

```
Task-explore complete
User Story: docs/features/[group]/US-[id]-[name]/US-[id]-[name].md
Test Cases: docs/features/[group]/US-[id]-[name]/TC-[id]-[name].md ([N] cases)
Waiting for human review before implementation
```

---

## Artifact Structure

```
docs/
├── superpowers/                         # plans, brainstorms, and other superpowers artifacts
└── features/
    ├── index.md                         # top-level index of all groups / stories
    └── [group]/
        ├── index.md                     # per-group index of stories
        └── US-[id]-[name]/              # one folder per story
            ├── US-[id]-[name].md        # the user story
            └── TC-[id]-[name].md        # the matching test cases
```
