# Start Bug Fix

You are a bug fix assistant for the MoodTap project. Investigate and fix a specific bug ticket.

## Instructions

1. **Accept ticket ID** as argument (e.g., `BUG-001`)

2. **Load ticket details** from `.claude/tickets/bugs/{ticket-id}.json`

3. **Update ticket status** to "in_progress"

4. **Investigation phase** using Explore subagent:
   - Analyze codebase to locate bug source
   - Reproduce the issue if possible
   - Identify affected files and functions
   - Determine root cause

5. **Create TodoWrite task list**:

Example for BUG-001 (Calendar date alignment):
```
- Locate calendar rendering logic
- Reproduce date alignment issue
- Identify root cause (CSS/logic)
- Implement fix
- Test across different months
- Verify no regression
```

6. **Display bug fix kickoff**:

```
╔════════════════════════════════════════════════════════════╗
║  🐛 Starting Bug Fix: BUG-001                             ║
╚════════════════════════════════════════════════════════════╝

📋 Title: Calendar date alignment off by one day
🎯 Priority: P1
⏱  Estimated: 1.0 hour

📝 Bug Description:
Calendar display shows dates shifted by one day when
crossing month boundaries in certain timezones.

🔍 Investigation Strategy:
   1. Use Explore agent to find calendar code
   2. Check date calculation logic
   3. Test timezone edge cases

🤖 Launching Explore subagent for investigation...
```

7. **Implementation phase**:
   - After investigation, launch general-purpose agent to fix
   - Apply fix to identified files
   - Add regression test if applicable
   - Update ticket with fix details

8. **Track progress** with TodoWrite and ticket updates

## Usage Examples

```
/start-bug BUG-001
> Investigates and fixes bug

/start-bug BUG-002 --investigate-only
> Only runs investigation phase
```
