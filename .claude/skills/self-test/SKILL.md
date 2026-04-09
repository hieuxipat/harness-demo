---
name: self-test
description: >
  Use this skill to run automated E2E testing after a feature has been implemented. Trigger when the user mentions "self-test", "run tests", "test feature", "E2E test", "verify implementation", "run test cases", or after completing the implementation of a story/task. Always use this skill before moving to the next workflow step (review, release), even if the user doesn't explicitly ask for testing.
---

# self-test

Run E2E tests after implementation — follow existing test cases, record results, report failures.

---

## Input

- A feature that has been implemented
- The corresponding test cases at `docs/test-cases/[group]/TC-[id]-[name].md`

---

## Output

Updated test-result, test-result-note on test cases file

---

## Steps

### Step 1 — Read test cases

- Find the file `docs/test-cases/[group]/TC-[id]-[name].md` corresponding to the feature
- If it doesn't exist, notify that `task-explore` needs to be run first
- Parse all test cases: happy path, edge case, error case
- **Skip any test case marked `BYPASS`** — these are known limitations or intentionally excluded. Do not execute them; carry forward their existing result as-is.

### Step 2 — Run tests with Playwright CLI

Use /playwright-cli skill to open a **headed** browser and explore the app at localhost.

Testing priority order:

1. **Happy path** — run all of these first
2. **Edge case** — after all happy paths PASS
3. **Error case** — last

For each test case:

- Execute exactly according to the `steps` in the TC file
- Compare actual results with `expected_result`
- Record: `PASS`, `FAIL + brief description`, or `BYPASS` (carried forward, not executed)

### Step 3 — Regression check

- Check related stories in `docs/user-stories/index.md`
- If there are potentially affected stories, mark `regression_risk: HIGH`
- Run a quick smoke test on adjacent stories if needed

### Step 4 — Compile results

Update test-result

```
Self-Test Report
------------------------------
Status:           PASS | FAIL
Cases passed:     N
Cases bypassed:   N
Cases failed:     N
Regression risk:  LOW | MEDIUM | HIGH
Notes:            ...

Details:
  TC-[id]-[name]-01 (happy_path): PASS
  TC-[id]-[name]-02 (edge_case):  PASS
  TC-[id]-[name]-03 (error_case): FAIL — [error description]
```

### Step 5 — If there are failures

- List each FAIL case clearly with symptom description
- **Do not fix code automatically** — report so the human decides the next step
- Suggest debugging direction if the cause is obvious
