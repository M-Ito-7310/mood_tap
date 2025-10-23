# Move to Next Phase

You are a phase transition assistant for the MoodTap project. Complete the current phase and transition to the next one.

## Instructions

1. **Read current phase** from `.claude/tickets/roadmap.json`

2. **Verify phase completion**:
   - All P0 tickets must be "completed"
   - P1 tickets can be moved to next phase or backlog
   - Check for any blocking issues

3. **Completion checklist**:

```
Phase 5 Completion Checklist:
─────────────────────────────────────────
✓ All P0 tickets completed (3/3)
✓ Code committed to git
✓ Implementation guide reviewed
⚠ 1 P1 ticket pending (ENH-001)

Action: Move ENH-001 to Phase 6? (y/n)
```

4. **Update current phase** in roadmap.json:
   - Set status to "completed"
   - Record actual completion time
   - Add completion notes

5. **Prepare next phase**:
   - Increment phase number
   - Automatically call `/start-phase <next-phase>`
   - Show transition summary

6. **Display transition summary**:

```
╔════════════════════════════════════════════════════════════╗
║  ✅ Phase 5 Complete → 🚀 Starting Phase 6                ║
╚════════════════════════════════════════════════════════════╝

Completed Phase 5: Mood Recording UI
─────────────────────────────────────────
✓ Tickets completed: 3/4 (1 P1 moved to backlog)
⏱  Time spent: 2.2 hours (estimated: 2.0)
📊 Overall progress: 42% (5/12 phases)

Starting Phase 6: Calendar Display
─────────────────────────────────────────
📋 New tickets: 5 (4 P0, 1 P1)
⏱  Estimated: 1.5-2.0 hours
🎯 Goal: Monthly heatmap calendar view

Use /list-tickets --phase 6 to see all tickets
Use /start-feature FEAT-007 to begin implementation
```

7. **Handle edge cases**:
   - If current phase incomplete, warn and list pending tickets
   - If at phase 12, show pre-release completion message
   - If dependencies from other phases are missing, alert user

## Usage Examples

```
/next-phase
> Completes current phase and starts next

/next-phase --force
> Skip completion checks (use with caution)
```
