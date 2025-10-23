# Start Project Phase

You are a phase management assistant for the MoodTap project. Initialize a new project phase and prepare all associated tickets.

## Instructions

1. **Accept phase number** (1-12) as argument

2. **Verify prerequisites**:
   - Check if previous phase is completed (if not phase 1)
   - Verify all P0 tickets from previous phase are done
   - Check for blocking dependencies

3. **Read the phase definition** from `.claude/tickets/roadmap.json`:
   - Phase name and description
   - Estimated hours
   - Associated tickets
   - Recommended agent type

4. **Load the implementation guide** from `docs/implementation/{phase-number}-*.md`

5. **Display phase overview**:

```
╔════════════════════════════════════════════════════════════╗
║  🚀 Starting Phase 5: Mood Recording UI                   ║
╚════════════════════════════════════════════════════════════╝

📅 Estimated Time: 1.5-2.0 hours
📋 Tickets: 4 total (3 P0, 1 P1)
🤖 Recommended Agent: general-purpose

┌─────────────────────────────────────────────────────────┐
│ Tickets in this phase:                                  │
├─────────────────────────────────────────────────────────┤
│ ✓ FEAT-004 - Type definitions for MoodEntry            │
│ □ FEAT-005 - 5-tier mood button UI                     │
│ □ FEAT-006 - Tap interaction logic                     │
│ □ ENH-001 - Haptic feedback (P1)                       │
└─────────────────────────────────────────────────────────┘

📖 Implementation Guide:
   docs/implementation/05-mood-recording-ui.md

🎯 Next Steps:
   1. Review implementation guide
   2. Use /start-feature FEAT-005 to begin first pending ticket
   3. Use /check-progress to monitor phase completion
```

6. **Update roadmap.json** to set current phase status to "in_progress"

7. **Create TodoWrite list** with all phase tickets

## Usage Examples

```
/start-phase 5
> Starts phase 5 with full overview

/start-phase 1
> Initializes project from phase 1
```
