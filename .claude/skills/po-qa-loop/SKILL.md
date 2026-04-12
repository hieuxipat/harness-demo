---
name: po-qa-loop
description: Use this skill to walk through the `## Open questions for PO` section of one or more `US-*.md` story files — asking the user one question at a time, waiting for them to forward to the PO and paste the answer back, then updating the story file in place (marking questions `answered:`, editing acceptance criteria when the answer diverges from the best guess, and flagging scope-expanding answers for `/explore-story` refine mode). Trigger this skill whenever the user says `/po-qa-loop`, "ask PO questions", "resolve open questions", "loop through open questions", "trả lời câu hỏi PO", "hỏi PO", or any variation indicating they want to work through the open questions section of a user story. Also trigger it when the user references PO feedback / PO answers in the context of a story file, even without using the exact phrase — the contract-preserving update of that section is this skill's job. Do not use this skill for writing new stories (that is `/explore-story`) or for generating test cases (that is `/create-test-case`).
---

# po-qa-loop

Walk a user through the `## Open questions for PO` section of one or more story files, capture the PO's answer for each question (one at a time), and update the story file in place so it stays consistent with the 4-phase workflow's contract. The human owns the PO loop — this skill is the scribe that records what comes back.

## Why this skill exists

After `/explore-story` writes a story file, the bottom section lists every business-logic question the PO needs to answer. The human forwards those questions to the PO, gets answers, and then has to **edit the story file in place** — update acceptance criteria / steps / notes so the body matches the answer, mark the question `answered:`, and know when the answer is big enough to require an `/explore-story` refine-mode rerun.

Doing this by hand is tedious and easy to get wrong:

- It is easy to mark a question answered but forget to update the acceptance criteria that depended on it.
- It is easy to miss that an answer expands scope and needs refine mode — meaning downstream `/create-test-case` will inherit a stale feasibility block.
- It is easy to accidentally delete PO-authored content while rewriting a section.

This skill exists to make that loop safe, crash-recoverable, and consistent across every story in the workspace.

## Input modes

Pick the mode from how the user invoked the skill:

1. **Single file** — the user passed a path to a specific `US-*.md`. Process that one story.
2. **Story folder** — the user passed a folder like `docs/features/<group>/US-<id>-<name>/`. Find the `US-*.md` inside and treat it as mode 1.
3. **Group** — the user passed a group folder like `docs/features/<group>/`. Read that group's `index.md` to get the stories in **dependency order**, then process each story's `US-*.md` in sequence, confirming with the user between each file.
4. **No argument** — scan `docs/features/**/US-*.md`, filter to files that still have **at least one unresolved question** (a question without an `answered:` line and a section that is not "None — ready for `/create-test-case`"), show the list with counts, and ask the user which one(s) to work through.

If the path the user passed does not exist, stop with a clear error and do nothing.

## Parsing the "Open questions for PO" section

Every story written by `/explore-story` ends with a section shaped like this:

```markdown
## Open questions for PO

> Answer these and edit the story file in place ...

1. **(blocking) Who is allowed to trigger the export — any logged-in user, or only admins?**
   Why it matters: determines the actor and which ERROR cases are needed (403 vs 401).
   Best guess: admins only.

2. **(non-blocking) Does the export need to include soft-deleted rows?**
   Why it matters: affects the row count in every HAPPY case.
   Best guess: no, exclude soft-deleted.
```

Parse each numbered entry into a record with these fields:

- **number** — the leading `1.`, `2.`, ...
- **priority** — `blocking` or `non-blocking` (from `**(blocking) ...**` or `**(non-blocking) ...**`)
- **question** — the bold question text
- **why_it_matters** — the line starting with `Why it matters:`
- **best_guess** — the line starting with `Best guess:`
- **answered** — the line starting with `answered:` if it already exists, otherwise absent

Handle these three short-circuit cases up front:

- Section body is exactly `None — ready for /create-test-case` (or `None — ready for \`/create-test-case\``) → the story is already clear. Skip silently, move on to the next file (or finish).
- Section is missing entirely → warn the user: "`<path>` has no `## Open questions for PO` section — that is a contract violation of `/explore-story`. Skipping this file." Move on.
- Every parsed entry already has an `answered:` line → same as "None": rewrite the section to `None — ready for /create-test-case` and move on. (This cleans up a story the human finished manually.)

## The Q&A loop

Once you have the parsed list, **ask blocking questions first**, then non-blocking. Within each priority group, keep the original numeric order. This ordering matters — test cases cannot be written without blocking answers, so it respects the user's time if you get the blockers done before moving to polish.

For each still-unanswered question, send **one** message to the user. The message must include:

- Which story this is from (path + story ID) — especially important in group mode.
- The question's number and priority tag.
- The question text.
- The `Why it matters:` line.
- The `Best guess:` line.
- A hint reminding the user what a reply can look like.

Use this template (adapt wording for Vietnamese if the user is speaking Vietnamese):

```
📋 US-<id> — Question <N>/<total> (<priority>)

Q: <question>

Why it matters: <why_it_matters>
Best guess: <best_guess>

Reply:
  • "ok" or "ok best guess" → accept the best guess
  • Paste the PO's answer verbatim
  • "skip" → leave this question for later and move on
```

Then stop and wait for the user. Do not call any tool in the same turn that sends this message. Do not assume an answer.

### Interpreting the reply

- Reply is `ok`, `ok best guess`, `accept`, `đồng ý`, or similar unambiguous acceptance → treat the answer as exactly the best guess. This is the "PO confirmed" case.
- Reply is a new answer (paraphrase or verbatim from the PO) → treat it as the answer. Compare against the best guess and decide if it matches, diverges, or expands scope (rules below).
- Reply is `skip` → leave that question untouched. Do not mark it answered. Continue to the next question.
- Reply is ambiguous — you cannot tell if it is an answer, a comment, or a question back at you → ask the user to clarify. Do not guess. Do not mark anything answered.

### Applying the answer to the file

This is the contract. Apply these rules one question at a time, writing to disk **after every answer** so an interrupted session never loses progress and never leaves a half-updated file.

**Case A — PO confirmed the best guess.** The answer matches the best guess with no material change.
- Do not touch acceptance criteria / steps / notes in the story body.
- Add a single line to that question entry, indented to match the `Why it matters:` / `Best guess:` lines:
  ```
   answered: <best guess text> — confirmed by PO
  ```

**Case B — PO answered something different, but the change stays inside the current story's scope.** The answer changes a rule, a default, a limit, or an edge-case decision, but does not introduce a new capability, actor, integration, or data source.
- First, edit the relevant acceptance criteria / steps / notes so the body reflects the new answer. Be surgical — change only what the answer touches. Do not rewrite whole sections.
- Then mark the question answered:
  ```
   answered: <paraphrased answer> — story body updated
  ```

**Case C — PO's answer expands scope, changes the actor, or adds a capability not covered by the `feasibility` block.** Examples: "actually we also need X for admins", "add per-shop configuration", "must block on logging failure", "needs a new integration with service Y".
- Do **not** edit the story body. Touching acceptance criteria here would be editing past the feasibility evidence, which the user is explicitly trying to avoid.
- Still record the answer in the section:
  ```
   answered: <paraphrased answer> — ⚠ scope expansion, needs /explore-story refine mode
  ```
- Remember this file for the final summary so you can flag it to the user with the refine-mode pointer.

When deciding between Case B and Case C, err toward C if the answer could plausibly change the feasibility verdict or introduce a new gap. False-positive Case C is cheap (user reads the flag, decides it's fine, skips refine mode). False-negative Case C is expensive (stale feasibility leaks into test cases and implementation).

### Writing the file

Use `Edit` (string replace) rather than `Write` (full rewrite) for every update. This preserves everything else in the file exactly, which is critical because the story body may contain PO-authored content or unrelated notes that you must not disturb.

For each answer, do at most two edits:

1. If Case B, the edit(s) inside the story body for the affected acceptance criteria / steps / notes.
2. The edit that inserts the `answered:` line into the question entry in the `## Open questions for PO` section.

The `answered:` line goes on a new line directly after `Best guess: ...`, indented with three spaces so it aligns with the other attribute lines of that numbered entry. This keeps the visual pattern consistent and lets future runs of this skill detect "already answered" reliably.

### Closing out a story

After you have processed every unanswered question (including `skip`s), decide whether the section is now fully resolved:

- If **every** entry has an `answered:` line → rewrite the section. Replace everything after the `## Open questions for PO` heading (and the short instructional blockquote just below it, if present) with exactly:
  ```
  None — ready for `/create-test-case`.
  ```
  Preserve the heading itself.
- If any entry is still without `answered:` (because the user chose `skip` or stopped mid-loop) → leave the section as is. The remaining entries stay visible so the user can come back later.

Then emit a per-file summary to the user:

```
US-<id> — Resolved <answered>/<total> questions (<blocking-resolved> blocking, <nonblocking-resolved> non-blocking)
  ⚠ <K> answer(s) expanded scope → run /explore-story refine mode before /create-test-case   (only if K > 0)
  ✓ File updated: <absolute path>
```

In group or no-arg mode (multiple files), follow the per-file summary with:

```
Next: proceed to US-<next-id>? [y/n]
```

and wait for confirmation before starting the next file.

## Final summary (all files done)

When the user has either finished every story in the batch or stopped mid-way:

```
PO Q&A complete:
  US-AL01 — 5/5 resolved, ⚠ needs /explore-story refine mode
  US-AL02 — 6/6 resolved, ready for /create-test-case
  US-AL03 — 3/8 resolved (user stopped mid-loop)
  US-AL04 — already resolved (skipped)

Next steps:
  • For files flagged ⚠, run: /explore-story <path>   (refine mode re-verifies feasibility)
  • For files marked "ready", run: /create-test-case <path>
  • For files still partial, re-invoke this skill any time to continue
```

Never run `/explore-story` or `/create-test-case` yourself. This skill only records and flags — the user decides when to advance to the next phase.

## Mandatory rules (these override defaults)

These are non-negotiable because they protect the file-based contract the whole 4-phase workflow depends on. If you find yourself wanting to break one, the answer is to re-ask or to hand control back to the user — not to take a shortcut.

1. **Never guess an answer.** If the user's reply is ambiguous, ask a clarifying follow-up. Do not write anything to the file until you have a clear answer or an explicit `skip`.
2. **One question per message.** Never bundle several questions into one prompt. It turns the user's review into guesswork and breaks the write-through-per-answer safety.
3. **Blocking first, non-blocking second.** Same file, preserve original order inside each group.
4. **Write through after every answer.** Disk is the source of truth — progress must survive a session crash or a stopped user.
5. **Never auto-run another slash command.** Do not invoke `/explore-story` refine mode and do not invoke `/create-test-case`. Flag and suggest only.
6. **Never delete PO-authored content.** If the file already contains acceptance criteria or notes the PO added, those are sacred. Edit around them; do not overwrite.
7. **Scope-expansion answers do not edit the body.** The body is evidence frozen at the last feasibility check. Only refine mode is allowed to change it when scope has shifted.
8. **Respect `skip` literally.** A skipped question is neither an answer nor a refusal — it stays in the section exactly as it was, waiting for a future pass.

## Out of scope

The following are deliberate non-goals. If the user asks for them, redirect rather than silently take them on.

- **Sending questions to the PO** (Slack, email, Jira comment). The human forwards manually. This skill is the scribe, not the messenger.
- **Running `/explore-story` refine mode.** This skill flags the need; the user decides when to run it.
- **Running `/create-test-case`.** Same principle — this skill only signals readiness.
- **Validating the semantic correctness of an answer.** If the PO gives a business rule that contradicts another story, this skill does not catch it. That is a product-owner concern and surfaces in the next feasibility check.
- **Editing anything outside the target story file.** Indexes, other stories, specs, plans — all untouched.

## Edge cases worth remembering

- **File does not exist** → stop with a clear error, do not create anything.
- **Section missing entirely** → warn, skip the file, do not try to synthesize one.
- **Section says "None — ready for /create-test-case"** → silent skip.
- **Every question already has `answered:`** → rewrite to "None" and move on.
- **User stops mid-loop** → write-through means every answered question is already persisted; unanswered ones sit exactly as `/explore-story` left them.
- **`skip` on a question** → leave untouched, do not add `answered:`, continue to the next.
- **Duplicate question numbers in the source** (rare but possible from hand-editing) → treat them as distinct entries in encounter order; do not reorder or renumber the list.
- **User's reply is itself a question back at you** → answer briefly if it is about the skill, or ask them to clarify what the PO actually said. Do not record an `answered:` line from your own words.
