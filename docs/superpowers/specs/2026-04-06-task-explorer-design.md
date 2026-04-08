# Task Explorer Skill Design

## Overview

A Claude Code skill that explores and filters tasks from external task management tools (Lark, Jira, etc.) using browser automation via `playwright-cli`. Saves task details as individual markdown files for local reference.

## Trigger

When the user wants to check, explore, or filter tasks from their task management tool.

## Dependencies

- `playwright-cli` skill (global install of `@playwright/cli@latest`)
- Persistent Chrome profile at `./chrome-profile`

## Flow

### 1. First-time setup

1. Check if `./tasks/.config.json` exists
2. If not: ask user for task board URL (e.g., Lark, Jira), explain this should be the URL to their task list
3. Save to `./tasks/.config.json`:
   ```json
   { "taskBoardUrl": "https://..." }
   ```
4. If config exists: show current URL, ask if user wants to change it

### 2. Filter selection

Present 3 options:

1. **Investigate pending tasks** — filter by status = "pending" (or equivalent variants)
2. **Investigate upcoming tasks** — filter by status = "to do" or "in progress" AND due date <= 5 days from now
3. **Custom filter** — user describes filter fields and values

For option 3: ask user to specify field names and values, then proceed.

### 3. Browser automation

1. Open task board URL with playwright-cli:
   ```bash
   playwright-cli open <taskBoardUrl> --profile=./chrome-profile --headed
   ```
2. Take snapshot, check login state
3. If not logged in or verification required: notify user to log in/verify manually, wait for user confirmation before continuing
4. Identify the logged-in account (from profile/avatar on page)
5. Apply filters:
   - **Always**: Assignee = logged-in account (search for field name variants: "Assignee", "Assigned to", "Owner", "Responsible", etc.)
   - **Option 1**: Status = "pending" (variants: "Pending", "Backlog", "Open", etc.)
   - **Option 2**: Status = "to do" or "in progress" (variants: "To Do", "Todo", "In Progress", "In Development", "Doing", etc.) AND Due date <= 5 days from current date (field variants: "Due date", "Deadline", "End date", "Due", etc.)
   - **Option 3**: User-specified fields + values (also search for field name variants)
6. Navigate into each matching task to collect full details

### 4. Output

For each task, create a markdown file at `./tasks/<TASK-ID>.md` with:

```markdown
# <Task Title>

- **ID**: <task-id>
- **Status**: <status>
- **Assignee**: <assignee>
- **Due date**: <due-date>
- **Priority**: <priority, if available>
- **Labels/Tags**: <labels, if available>

## Description

<task description/requirements>

## Comments

<comments, if any>
```

If `./tasks/` directory does not exist, create it.

### 5. Display results

After saving, display a summary list of all found tasks (ID, title, status, due date) in a table format.

Then offer generic suggestions, such as:
- "You can pick a task to read in detail"
- "Start implementing one of these tasks"
- "Run the explorer again with a different filter"
- "Review task priorities and plan your work"

## Config file schema

`./tasks/.config.json`:

```json
{
  "taskBoardUrl": "https://example.atlassian.net/jira/software/projects/PROJ/board"
}
```

## Constraints

- MUST use `playwright-cli` (never Playwright MCP or npx)
- MUST use `--profile=./chrome-profile` and `--headed` mode
- MUST always filter by Assignee = logged-in account
- Field names vary across platforms — always search for common variants, not just exact matches
- Task files are individual markdown files, one per task
- Suggestions must be generic — no references to specific slash commands or skills
