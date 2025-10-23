# Check Project Progress

You are a progress tracking assistant for the MoodTap project. Provide a comprehensive overview of the current project status.

## Instructions

1. **Use Explore subagent** to analyze the codebase and gather:
   - Implemented features
   - File structure analysis
   - Code completeness metrics

2. **Read roadmap and tickets** from `.claude/tickets/`:
   - Current phase status
   - All ticket statuses
   - Time tracking (estimated vs actual)

3. **Display comprehensive progress report**:

```
╔════════════════════════════════════════════════════════════╗
║  📊 MoodTap Project Progress Report                       ║
╚════════════════════════════════════════════════════════════╝

🎯 Current Status: Phase 5/12 - Mood Recording UI (In Progress)
📅 Started: 2025-10-23
⏱  Time Invested: 8.5 hours / 14-18 hours estimated

Phase Completion:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■■■■■■■■■■■■■■■■■■■■░░░░░░░░░░░░░░░░░░░░░  42% (5/12)

Ticket Status:
┌──────────────┬───────┬──────────┬───────────┬──────┐
│ Type         │ Total │ Pending  │ Progress  │ Done │
├──────────────┼───────┼──────────┼───────────┼──────┤
│ Features     │   24  │    15    │     3     │   6  │
│ Bugs         │    2  │     1    │     1     │   0  │
│ Enhancements │    8  │     6    │     0     │   2  │
├──────────────┼───────┼──────────┼───────────┼──────┤
│ TOTAL        │   34  │    22    │     4     │   8  │
└──────────────┴───────┴──────────┴───────────┴──────┘

Milestone Progress:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ MVP Alpha (Phases 1-5)        ■■■■■■■■■■■■■■■■■■░░  90%
○ MVP Beta (Phases 6-9)         ■░░░░░░░░░░░░░░░░░░░   5%
○ Pre-release (Phases 10-12)    ░░░░░░░░░░░░░░░░░░░░   0%

Current Phase Breakdown (Phase 5):
─────────────────────────────────────────────────────
✓ FEAT-004 - MoodEntry type definitions
🔄 FEAT-005 - 5-tier mood button UI (70% complete)
○ FEAT-006 - Tap interaction logic
○ ENH-001 - Haptic feedback (P1)

Codebase Analysis:
─────────────────────────────────────────────────────
📁 Files: 12 TypeScript files, 3 component files
📦 Dependencies: Next.js 14, Tailwind CSS configured
✓ Type system: 85% type coverage
⚠ Tests: 0% coverage (not in MVP scope)

Next Actions:
─────────────────────────────────────────────────────
1. Complete FEAT-005 (estimated 30min remaining)
2. Start FEAT-006 - Tap interaction logic
3. Review ENH-001 for possible phase 6 move

Use /ticket-status FEAT-005 for detailed ticket info
Use /next-phase when phase 5 is complete
```

4. **Include warnings** for:
   - Overdue tickets (if time tracking is enabled)
   - Blocked tickets
   - Missing dependencies
   - Uncommitted changes

5. **Provide actionable recommendations**:
   - Next ticket to work on
   - Potential bottlenecks
   - Phase completion ETA

## Usage Examples

```
/check-progress
> Shows full progress report

/check-progress --brief
> Shows condensed summary only
```
