# TC-SP25: Dispute Management UI/UX Optimization

- **ID:** TC-SP25-dispute-ui-optimization
- **Group:** dispute
- **Linked Story:** [US-SP25-dispute-ui-optimization.md](./US-SP25-dispute-ui-optimization.md)

---

## TC-SP25-01: Sticky Details column is always visible

- **test-result:** PENDING
- **test-result-note:**
- **type:** happy_path
- **description:** Verify the "Details" button is always visible as a sticky column on the right side of the disputes table without hovering or scrolling.
- **precondition:** Merchant has at least one dispute in the list. Viewport is standard desktop width (1280px).

### Steps

1. Navigate to the Disputes tab
2. Observe the dispute table
3. Scroll the table horizontally to the left (if applicable)
4. Check if the "Details" button is visible in the last column for all rows

### Expected Result

The "Details" button is always visible as a fixed/sticky column on the right side. It does not require hover or horizontal scrolling to appear.

---

## TC-SP25-02: Details button visible on narrow viewport

- **test-result:** PENDING
- **test-result-note:**
- **type:** edge_case
- **description:** Verify the sticky Details column remains visible when the browser viewport is narrow and the table overflows horizontally.
- **precondition:** Merchant has disputes. Viewport resized to 1024px width.

### Steps

1. Resize browser to 1024px width
2. Navigate to Disputes tab
3. Observe the table -- it should overflow horizontally
4. Verify the "Details" column stays pinned to the right

### Expected Result

Even on a narrow viewport, the "Details" column is sticky/fixed on the right and visible without scrolling.

---

## TC-SP25-03: Account column truncates long email addresses

- **test-result:** PENDING
- **test-result-note:**
- **type:** happy_path
- **description:** Verify that long email addresses in the Account column are automatically truncated with ellipsis to save horizontal space.
- **precondition:** Merchant has disputes with PayPal accounts that have long email addresses.

### Steps

1. Navigate to Disputes tab
2. Observe the Account column in the table
3. Check if long email addresses are truncated (e.g., "haidan1311@gm..." or similar)
4. Hover over a truncated email to see the full address (tooltip)

### Expected Result

Long email addresses are truncated with ellipsis. Amount and Status columns have adequate space. Full email is shown on hover via tooltip.

---

## TC-SP25-04: Timeline/Chat UI displays conversation history

- **test-result:** PENDING
- **test-result-note:**
- **type:** happy_path
- **description:** Verify the dispute detail page shows conversation history in a Timeline/Chat UI format instead of a table.
- **precondition:** Merchant has a dispute with at least one conversation message.

### Steps

1. Navigate to Disputes tab
2. Click "Details" on a dispute that has conversation history
3. Scroll to "Your conversation with the buyer" section
4. Observe the conversation display format

### Expected Result

Conversation messages are displayed in a Timeline/Chat UI format. Each message shows sender, timestamp, and content in a visually clear layout. No horizontal scrolling is needed to read messages. The "received" status is clearly visible.

---

## TC-SP25-05: Empty conversation shows appropriate empty state

- **test-result:** PENDING
- **test-result-note:**
- **type:** edge_case
- **description:** Verify that disputes with no conversation show a meaningful empty state in the Timeline UI.
- **precondition:** Merchant has a dispute with no conversation messages.

### Steps

1. Navigate to Disputes tab
2. Click "Details" on a dispute with no conversation
3. Scroll to the conversation section

### Expected Result

An empty state message is displayed (e.g., "No conversation has been found yet. It is recommended to try resolving dispute by talking to the buyer first") with appropriate visual indicator.

---

## TC-SP25-06: Action buttons displayed directly (not in dropdown)

- **test-result:** PENDING
- **test-result-note:**
- **type:** happy_path
- **description:** Verify that action buttons (Provide Evidence, Accept Claim, Send Offer) are displayed as direct buttons at the top of the response section, not hidden in a dropdown.
- **precondition:** Merchant has an open dispute that allows actions.

### Steps

1. Navigate to Disputes tab
2. Click "Details" on an open dispute
3. Look for the action section at the top of the detail page (or conversation section)
4. Verify action buttons are directly visible

### Expected Result

"Provide Evidence", "Accept Claim", and "Send Offer" buttons are displayed as direct, prominent action buttons. They are not hidden inside a dropdown menu. The action section is positioned at the top of the response area.

---

## TC-SP25-07: Provide Evidence modal opens correctly

- **test-result:** PENDING
- **test-result-note:**
- **type:** happy_path
- **description:** Verify that clicking "Provide Evidence" opens a modal with text input and file upload (Dropzone).
- **precondition:** Merchant has an open dispute.

### Steps

1. Navigate to dispute detail for an open dispute
2. Click "Provide Evidence" action button
3. Observe the modal that appears

### Expected Result

A modal/popup opens with:
- "Add more details" text input field
- File upload area (Dropzone) for attaching evidence
- Submit and Cancel buttons
- The modal functions correctly (can type text, upload files)

---

## TC-SP25-08: Disabled "Write a message" input is removed

- **test-result:** PENDING
- **test-result-note:**
- **type:** happy_path
- **description:** Verify there is no disabled/grayed-out "Write a message" text input at the bottom of the dispute detail page.
- **precondition:** Merchant views a dispute detail page.

### Steps

1. Navigate to dispute detail page
2. Scroll through the entire page
3. Check for any disabled text input fields

### Expected Result

No disabled "Write a message" input field is visible on the page. Text input is only available inside a modal after selecting an action.

---

## TC-SP25-09: Action buttons not shown for resolved disputes

- **test-result:** PENDING
- **test-result-note:**
- **type:** edge_case
- **description:** Verify that action buttons are not shown (or appropriately disabled) for disputes that are already resolved.
- **precondition:** Merchant has a resolved dispute.

### Steps

1. Navigate to Disputes tab
2. Click "Details" on a dispute with "Resolved" status
3. Check the action section

### Expected Result

Action buttons (Provide Evidence, Accept Claim, Send Offer) are either hidden or disabled for resolved disputes. The merchant is not misled into thinking they can take action on a closed dispute.

---

## TC-SP25-10: Table is accessible without horizontal scroll for key columns

- **test-result:** PENDING
- **test-result-note:**
- **type:** edge_case
- **description:** Verify that key columns (Amount, Status, Due date, Details) are visible without horizontal scrolling on standard desktop width.
- **precondition:** Standard desktop viewport (1280px+).

### Steps

1. Navigate to Disputes tab at 1280px width
2. Observe the table without scrolling horizontally
3. Check which columns are visible

### Expected Result

Amount, Status, Due date, and Details columns are visible without horizontal scrolling. Account column is truncated if needed to make room. Less critical columns (Store, Order ID) may be scrollable.

---

## TC-SP25-11: Submit evidence with empty fields

- **test-result:** PENDING
- **test-result-note:**
- **type:** error_case
- **description:** Verify that submitting the "Provide Evidence" modal without filling required fields shows validation errors.
- **precondition:** Merchant has an open dispute and clicked "Provide Evidence".

### Steps

1. Open "Provide Evidence" modal on an open dispute
2. Leave all fields empty
3. Click Submit

### Expected Result

Validation error message is displayed. The form is not submitted. The merchant is guided to fill required fields.

---

## TC-SP25-12: File upload in evidence modal handles invalid file types

- **test-result:** PENDING
- **test-result-note:**
- **type:** error_case
- **description:** Verify that the Dropzone in the evidence modal rejects unsupported file types gracefully.
- **precondition:** Merchant has the "Provide Evidence" modal open.

### Steps

1. Open "Provide Evidence" modal
2. Attempt to upload an unsupported file type (e.g., .exe, .bat)
3. Observe the response

### Expected Result

The upload is rejected with a clear error message indicating supported file types. The form remains functional.
