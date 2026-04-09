---
name: task-explore
description: >
  Use this skill when starting a new story or feature that requires exploring the current app flow and preparing E2E test cases before writing any implementation code. Trigger when the user mentions "task-explore", "explore feature", "analyze story", "write test cases", "create user story", or provides a Jira link / story description to analyze. Always use this skill before starting to implement any new feature, even if the user doesn't explicitly ask for it.
---

# task-explore

Analyze a story, explore the current app, and generate E2E test cases — run **before any implementation**.

---

## Input

- Story description as text (from chat), **or**
- Jira link / Issue ID to fetch story details

---

## Output

| Artifact           | Path                                          |
| ------------------ | --------------------------------------------- |
| User Story         | `docs/user-stories/[group]/US-[id]-[name].md` |
| Test Cases         | `docs/test-cases/[group]/TC-[id]-[name].md`   |
| Index User Stories | `docs/user-stories/index.md`                  |
| Index Test Cases   | `docs/test-cases/index.md`                    |

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

**Think like an end-user, not a developer.** You are exploring the app as a visitor would — clicking, scrolling, reading. Do NOT read source code, analyze components, inspect implementation details, or check architecture. Your only research tool is the browser.

- What does the user **see**?
- What can the user **click/tap**?
- What **happens** when they interact?
- What is **missing** from the user's perspective?

---

## Steps

### Step 1 — Read & understand the story

- If input is a **Jira link**: fetch the issue, read description + acceptance criteria
- If input is **text**: parse directly from chat
- Identify: actor, goal, main flow, alternate flows, potential edge cases

### Step 2 — Explore the app as an end-user with Playwright CLI

Use /playwright-cli skill to open a **headed** browser and explore the app at localhost.

**IMPORTANT: Only use the browser. Do NOT read source code, component files, config files, or any codebase files. Research is limited to what the user can see and do in the browser.**

- Navigate to screens related to the story
- Click buttons, open menus, fill forms, scroll — interact like a real user
- Record what you **see**: layout, text, buttons, current behavior, visual state
- Take screenshots of relevant screens for reference
- If the story does not yet exist in the app, note "new story, not yet implemented" based on what's **visible** (or not visible) in the UI

### Step 3 — Check & update User Stories

- Read `docs/user-stories/index.md` to find related stories
- **If a story already exists:** update `US-[id]-[name].md` to align with the story
- **If no story exists:** create a new `docs/user-stories/[group]/US-[id]-[name].md`
- Write stories from the **user's perspective** — describe what they see and do, not how the code works
- Update `docs/user-stories/index.md`

### Step 4 — Write E2E Test Cases

Create `docs/test-cases/[group]/TC-[id]-[name].md` covering all 3 types:

1. **Happy path** — standard successful flow
2. **Edge case** — boundary data, special conditions
3. **Error case** — error handling, validation failures, unauthorized access

Test cases must be written from the **user's perspective** — steps describe what a user does and sees, not what the code should do internally.

- Update `docs/test-cases/index.md`

### Step 5 — Human Review Checkpoint

**Stop. Do not continue to implementation.**

Present the following summary for human review:

- User story(s) created or updated
- Number of test cases by type
- Any unclear points that need confirmation

```
Task-explore complete
User Story: docs/user-stories/[group]/US-[id]-[name].md
Test Cases: docs/test-cases/[group]/TC-[id]-[name].md ([N] cases)
Waiting for human review before implementation
```

---

## Artifact Structure

```
docs/
├── user-stories/
│   ├── index.md
│   └── [group]/
│       └── US-[id]-[name].md
└── test-cases/
    ├── index.md
    └── [group]/
        └── TC-[id]-[name].md
```
