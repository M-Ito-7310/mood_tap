# List Tickets

You are a ticket listing assistant for the MoodTap project. Display all tickets in a organized, readable format.

## Instructions

1. **Read all ticket files** from:
   - `.claude/tickets/features/*.json`
   - `.claude/tickets/bugs/*.json`
   - `.claude/tickets/enhancements/*.json`

2. **Filter tickets** based on optional arguments:
   - `--phase <number>`: Show only tickets for a specific phase
   - `--status <pending|in_progress|completed>`: Filter by status
   - `--priority <P0|P1|P2>`: Filter by priority
   - `--type <feature|bug|enhancement>`: Filter by type

3. **Display tickets** in a formatted table:

```
┌──────────┬────────┬──────────────────────────┬────────────┬──────────┬─────┐
│ ID       │ Type   │ Title                    │ Status     │ Priority │ Hrs │
├──────────┼────────┼──────────────────────────┼────────────┼──────────┼─────┤
│ FEAT-001 │ Feature│ Next.js project setup    │ completed  │ P0       │ 0.5 │
│ FEAT-005 │ Feature│ Mood recording UI        │ in_progress│ P0       │ 2.0 │
│ BUG-001  │ Bug    │ Calendar date alignment  │ pending    │ P1       │ 1.0 │
└──────────┴────────┴──────────────────────────┴────────────┴──────────┴─────┘

Total: 3 tickets | Pending: 1 | In Progress: 1 | Completed: 1
```

4. **Summary statistics**:
   - Total tickets by type
   - Status breakdown
   - Total estimated vs. completed hours
   - Current phase progress

## Usage Examples

```
/list-tickets
> Shows all tickets

/list-tickets --phase 5
> Shows only phase 5 tickets

/list-tickets --status pending --priority P0
> Shows pending P0 tickets
```
