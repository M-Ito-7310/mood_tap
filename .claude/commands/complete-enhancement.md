# Complete Enhancement

You are an enhancement completion assistant for the MoodTap project. Finalize an enhancement and commit changes.

## Instructions

1. **Accept ticket ID** as argument (e.g., `ENH-001`)

2. **Load ticket details** from `.claude/tickets/enhancements/{ticket-id}.json`

3. **Verify enhancement completion**:
   - All success criteria met
   - Enhancement improves UX as intended
   - Base feature still works correctly
   - No performance degradation

4. **Run verification**:

```
Enhancement Verification for ENH-001:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Haptic feedback works on iOS/Android
✓ Different patterns for each mood level
✓ User preference toggle implemented
✓ Graceful fallback for unsupported browsers
✓ Base feature (mood buttons) unaffected
✓ No performance impact measured
```

5. **Create git commit**:

```bash
git commit -m "$(cat <<'EOF'
enhance(mood-ui): add haptic feedback to mood buttons

Implement Web Vibration API for tactile feedback when users
tap mood recording buttons. Enhances mobile UX with subtle
vibration patterns (100ms for positive, 200ms for negative).

- Add vibration support with browser detection
- Implement mood-level-specific patterns
- Create user preference toggle in settings
- Fallback gracefully on unsupported devices

Closes: ENH-001
Priority: P1
Time: 1.6 hours

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

6. **Update ticket** to completed status

7. **Display completion summary**:

```
╔════════════════════════════════════════════════════════════╗
║  ✅ Enhancement Complete: ENH-001                         ║
╚════════════════════════════════════════════════════════════╝

📋 Title: Add haptic feedback to mood buttons
✨ Impact: Improved mobile UX with tactile feedback
⏱  Time: 1.6 hours (estimated: 1.5 hours)
📦 Commit: c9d0e1f - "enhance(mood-ui): add haptic..."

✓ All success criteria met
✓ Enhancement tested on devices
✓ Code committed to git

Next Action:
  Use /list-tickets --status pending to see remaining work
```

## Usage Examples

```
/complete-enhancement ENH-001
> Completes enhancement with commit
```
