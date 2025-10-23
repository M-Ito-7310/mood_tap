# Check Ticket Status

You are a ticket status checker for the MoodTap project. Display detailed information about a specific ticket.

## Instructions

1. **Accept ticket ID** as argument (e.g., `FEAT-005`, `BUG-001`)

2. **Locate the ticket file**:
   - Check `.claude/tickets/features/` if starts with FEAT-
   - Check `.claude/tickets/bugs/` if starts with BUG-
   - Check `.claude/tickets/enhancements/` if starts with ENH-

3. **Display comprehensive ticket information**:

```
═══════════════════════════════════════════════════════════
📋 Ticket: FEAT-005
═══════════════════════════════════════════════════════════

Type:         Feature
Title:        Implement 5-tier mood recording buttons
Status:       🟡 In Progress
Priority:     🔴 P0 (Must Have)
Phase:        5 - Mood Recording UI

📝 Description:
Create emoji buttons for 5 mood levels (1=worst, 5=best)
with tap interaction and visual feedback.

⏱️  Timeline:
Created:      2025-10-23 10:00
Updated:      2025-10-23 14:30
Estimated:    2.0 hours
Completed:    -

🤖 Assignment:
Agent:        general-purpose
Dependencies: FEAT-002, FEAT-004

📂 File Path:
.claude/tickets/features/FEAT-005.json

═══════════════════════════════════════════════════════════
```

4. **Show related information**:
   - Dependencies (if any)
   - Blocked tickets (tickets waiting on this one)
   - Related commits (if completed)

## Usage Examples

```
/ticket-status FEAT-005
> Shows detailed status of FEAT-005

/ticket-status BUG-001
> Shows bug ticket details
```
