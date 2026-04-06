---
name: task-explorer
description: Explore and filter tasks from external task management tools (Lark, Jira). Use when the user wants to check pending tasks, upcoming deadlines, or filter tasks by custom criteria.
---

# Task Explorer

Explore and filter tasks from external task management tools using browser automation.

## Prerequisites

This skill depends on `playwright-cli`. Ensure it is installed globally:

```bash
npm install -g @playwright/cli@latest
```

NEVER use Playwright MCP or `npx playwright-cli`. Always use the globally installed `playwright-cli` binary.

## Flow

### Step 1: Configuration

Check if `./tasks/.config.json` exists in the project root.

**If it does NOT exist (first-time setup):**

Ask the user:

> "Please provide the URL to your task board (e.g., Lark, Jira). This should be the direct link to your task list."

After the user provides the URL:
1. Create the `./tasks/` directory if it does not exist
2. Save to `./tasks/.config.json`:
   ```json
   { "taskBoardUrl": "<user-provided-url>" }
   ```

**If it already exists:**

Read the URL from config and display it:

> "Using task board URL: `<url>`. Do you want to change it? (y/N)"

If user wants to change, ask for new URL and update the config file.

### Step 2: Filter selection

Present the following options to the user:

> Choose a filter:
> 1. **Investigate pending tasks** — tasks with status "pending"
> 2. **Investigate upcoming tasks** — tasks with status "to do" or "in progress" due within 5 days
> 3. **Custom filter** — specify your own filter fields and values

If the user chooses option 3, ask them to describe:
- Which fields to filter by
- What values to filter for

Example: "Filter by `Priority` = `High` and `Label` = `Backend`"

### Step 3: Browser automation

1. Open the task board URL:
   ```bash
   playwright-cli open <taskBoardUrl> --profile=./chrome-profile --headed
   ```

2. Take a snapshot and check the login state:
   ```bash
   playwright-cli snapshot
   ```

3. **If not logged in or verification is required:**

   Notify the user:

   > "The page requires login/verification. Please complete the login in the browser window. Let me know when you're done."

   Wait for the user to confirm, then take a new snapshot to verify login is complete.

4. **Identify the logged-in account** from the page (profile name, avatar, or account info visible on the task board).

5. **Apply filters.** The Assignee filter is ALWAYS required — filter by the logged-in account. Field names vary across platforms, so search for common variants:

   | Concept | Possible field names |
   |---------|---------------------|
   | Assignee | "Assignee", "Assigned to", "Owner", "Responsible", "Member" |
   | Status | "Status", "State", "Stage", "Workflow" |
   | Due date | "Due date", "Deadline", "End date", "Due", "Target date" |
   | Priority | "Priority", "Urgency", "Importance" |

   **For option 1 (pending tasks):**
   - Assignee = logged-in account
   - Status = "pending" (variants: "Pending", "Backlog", "Open", "Not started", "New")

   **For option 2 (upcoming tasks):**
   - Assignee = logged-in account
   - Status = "to do" OR "in progress" (variants: "To Do", "Todo", "To-Do", "In Progress", "In Development", "Doing", "Active", "Working")
   - Due date <= 5 days from current date (variants of the due date field)

   **For option 3 (custom filter):**
   - Assignee = logged-in account (ALWAYS applied)
   - Plus user-specified field/value pairs (search for field name variants as well)

6. **Collect task details.** For each matching task, navigate into the task detail page and collect:
   - Task ID
   - Title
   - Status
   - Assignee
   - Due date (if available)
   - Priority (if available)
   - Labels/Tags (if available)
   - Description/Requirements
   - Comments (if any)

### Step 4: Save results

For each task, create a markdown file at `./tasks/<TASK-ID>.md`:

```markdown
# <Task Title>

- **ID**: <task-id>
- **Status**: <status>
- **Assignee**: <assignee>
- **Due date**: <due-date or "N/A">
- **Priority**: <priority or "N/A">
- **Labels/Tags**: <labels or "N/A">

## Description

<task description/requirements>

## Comments

<comments if any, or "No comments">
```

Create the `./tasks/` directory if it does not exist.

### Step 5: Display results and suggestions

Display a summary table of all found tasks:

| # | ID | Title | Status | Due date |
|---|-----|-------|--------|----------|
| 1 | TASK-123 | Example task | In Progress | 2026-04-08 |

Then offer suggestions:

> Here are some things you can do next:
> - Pick a task to read in detail
> - Start implementing one of these tasks
> - Run the explorer again with a different filter
> - Review task priorities and plan your work

### Step 6: Close browser

After completing the exploration:
```bash
playwright-cli close
```
