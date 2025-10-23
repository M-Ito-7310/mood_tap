# Complete Feature

You are a feature completion assistant for the MoodTap project. Finalize a feature ticket and commit changes.

## Instructions

1. **Accept ticket ID** as argument (e.g., `FEAT-005`)

2. **Load ticket details** from `.claude/tickets/features/{ticket-id}.json`

3. **Verify completion readiness**:
   - All TodoWrite tasks marked complete
   - Code implements ticket requirements
   - No blocking errors or warnings
   - Changes are tested (if applicable)

4. **Run verification checks**:

```
Feature Completion Checklist for FEAT-005:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Implementation complete
✓ TypeScript types defined
✓ No compilation errors
✓ Component renders correctly
✓ Responsive on mobile/desktop
⚠ No tests (acceptable for MVP)
✓ Code follows project style
```

5. **Create git commit** following project convention:

```bash
git add [relevant files]
git commit -m "$(cat <<'EOF'
feat(mood-ui): implement 5-tier mood recording buttons

- Add MoodButton component with emoji display (😭😟😐🙂😄)
- Implement tap interaction with visual feedback
- Integrate with mood state management
- Add Tailwind CSS styling for mobile-first design
- Support keyboard navigation (accessibility)

Closes: FEAT-005
Phase: 5/12 - Mood Recording UI
Time: 2.2 hours

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

6. **Update ticket JSON**:
   - Set status = "completed"
   - Set completedAt timestamp
   - Record actual hours spent
   - Add commit SHA reference

7. **Update roadmap.json**:
   - Mark ticket complete in phase
   - Update phase progress percentage
   - Check if phase is now complete

8. **Display completion summary**:

```
╔════════════════════════════════════════════════════════════╗
║  ✅ Feature Complete: FEAT-005                            ║
╚════════════════════════════════════════════════════════════╝

📋 Title: Implement 5-tier mood recording buttons
⏱  Time: 2.2 hours (estimated: 2.0 hours)
📦 Commit: a3b4c5d - "feat(mood-ui): implement 5-tier..."

✓ All acceptance criteria met
✓ Code committed to git
✓ Ticket status updated
✓ Phase progress: 75% (3/4 tickets complete)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 5 Status:
  ✓ FEAT-004 - Type definitions
  ✓ FEAT-005 - Mood buttons (JUST COMPLETED)
  ○ FEAT-006 - Tap interaction logic
  ○ ENH-001 - Haptic feedback (P1)

Next Action:
  Use /start-feature FEAT-006 to continue phase 5
  Or /check-progress for full project status
```

9. **Clean up**:
   - Clear TodoWrite list for this ticket
   - Merge feature branch if using branches
   - Notify of phase completion if last ticket

## Usage Examples

```
/complete-feature FEAT-005
> Completes feature with commit

/complete-feature FEAT-007 --no-commit
> Completes ticket without git commit
```

## Notes

- Automatically creates conventional commit
- Updates all tracking files (ticket JSON, roadmap)
- Checks phase completion status
- Suggests next action
