# US-SP25: Dispute Management UI/UX Optimization

- **ID:** US-SP25-dispute-ui-optimization
- **Group:** dispute
- **Jira:** [SP-25](https://synctrackreturns.atlassian.net/browse/SP-25)
- **Test Cases:** [TC-SP25-dispute-ui-optimization.md](./TC-SP25-dispute-ui-optimization.md)

## Goal

Optimize the Disputes tab to increase merchant win rate by streamlining the response workflow and improving information accessibility.

## User Stories

1. **As a Merchant,** I want to respond to disputes as quickly as possible without being confused about where to take action.
2. **As a Merchant,** I want the conversation with the buyer to be easy to follow and action buttons (e.g., Provide Evidence) to be placed in a prominent position.

## Current State (observed in browser)

- The "Details" button in the dispute table is hidden behind horizontal scroll and only appears on hover -- merchants may not discover it.
- The dispute detail page shows conversation history as an empty state section with no visible action buttons (Provide Evidence, Accept Claim, Send Offer).
- The Account column displays full email addresses, consuming horizontal space and contributing to table overflow.
- There is no Timeline/Chat UI for conversation -- the section title says "Your conversation with the buyer" but shows a flat empty state.

## Acceptance Criteria

1. **Sticky Details Column:** The "Details" column in the disputes IndexTable is always visible as a fixed/sticky column on the right side. The button is always visible without needing to hover.
2. **Timeline/Chat UI:** Replace the table-based conversation view with a Timeline/Chat UI. The "received" status is clearly visible without horizontal scrolling.
3. **Action-First Workflow:** Move "Other actions" to the top of the section. Replace the dropdown with direct action buttons: Provide Evidence, Accept Claim, Send Offer.
4. **UI Redundancy Cleanup:** Remove the disabled "Write a message" input field. Only show the text input inside a Popup/Modal after the merchant selects an action.
5. **Account Column Truncation:** Long email addresses in the Account column are automatically truncated to preserve space for Amount and Status columns.

## Steps (User Flow)

1. Merchant navigates to Disputes tab
2. Merchant views dispute analytics (statistics, top reasons chart)
3. Merchant sees the "Details" button always visible (sticky) in the table
4. Merchant clicks "Details" to open a dispute detail page
5. Merchant reads conversation history in Timeline UI format
6. Merchant clicks a response action button (e.g., "Provide Evidence")
7. Merchant fills in details and uploads files via a Modal/Popup
8. Merchant submits the response

## Notes

- Both test disputes are "Resolved" status, so active action buttons may not appear. Testing with "Open" disputes is needed to verify the full action workflow.
- The Due date field shows "Unconfimred" (typo in data) for one dispute.
- PayPal gives merchants only 20 days to respond -- the current UX friction is a real business risk.
