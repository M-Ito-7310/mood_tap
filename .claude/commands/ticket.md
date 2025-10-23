# Create New Ticket

You are a ticket creation assistant for the MoodTap project. When the user invokes this command, help them create a new ticket (feature, bug, or enhancement).

## Instructions

1. **Ask the user for ticket details** if not provided:
   - Type (feature/bug/enhancement)
   - Title (brief, descriptive)
   - Description (detailed explanation)
   - Phase (1-12, based on MoodTap roadmap)
   - Priority (P0=must-have, P1=nice-to-have, P2=future)
   - Estimated hours

2. **Generate a unique ticket ID**:
   - Format: `{TYPE}-{NUMBER}` (e.g., FEAT-001, BUG-001, ENH-001)
   - Check existing tickets to determine the next number

3. **Create the ticket JSON file** in the appropriate directory:
   - `.claude/tickets/features/` for features
   - `.claude/tickets/bugs/` for bugs
   - `.claude/tickets/enhancements/` for enhancements

4. **Ticket JSON structure**:
```json
{
  "id": "FEAT-001",
  "type": "feature",
  "title": "Implement 5-tier mood recording buttons",
  "description": "Create emoji buttons for 5 mood levels (1=worst, 5=best) with tap interaction",
  "phase": 5,
  "status": "pending",
  "priority": "P0",
  "estimatedHours": 2.0,
  "assignedAgent": null,
  "dependencies": [],
  "createdAt": "2025-10-23T00:00:00Z",
  "updatedAt": "2025-10-23T00:00:00Z",
  "completedAt": null
}
```

5. **Update roadmap.json** to add the ticket ID to the corresponding phase

6. **Confirm ticket creation** with a summary showing:
   - Ticket ID
   - Type and priority
   - Assigned phase
   - File path

## Usage Examples

```
/ticket
> User provides details interactively

/ticket Create mood recording UI - P0 feature for phase 5
> Parses from command arguments
```
