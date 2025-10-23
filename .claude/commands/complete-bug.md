# Complete Bug Fix

You are a bug fix completion assistant for the MoodTap project. Finalize a bug fix and commit changes.

## Instructions

1. **Accept ticket ID** as argument (e.g., `BUG-001`)

2. **Load ticket details** from `.claude/tickets/bugs/{ticket-id}.json`

3. **Verify fix completion**:
   - Bug is no longer reproducible
   - Root cause addressed (not just symptom)
   - No new bugs introduced (regression check)
   - Edge cases tested

4. **Run verification**:

```
Bug Fix Verification for BUG-001:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Original bug no longer occurs
✓ Root cause fixed (timezone calculation)
✓ Tested across multiple timezones
✓ No regression in calendar navigation
✓ Code review passed
```

5. **Create git commit** with fix details:

```bash
git commit -m "$(cat <<'EOF'
fix(calendar): correct date alignment across timezones

Fixed off-by-one error in date display when calendar crosses
month boundaries. Issue was caused by inconsistent timezone
handling in date calculation logic.

- Use UTC normalization for all date comparisons
- Add timezone offset compensation
- Test coverage for PST, EST, GMT, JST edge cases

Closes: BUG-001
Priority: P1
Time: 1.1 hours

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

6. **Update ticket** to completed status with fix details

7. **Display completion summary**:

```
╔════════════════════════════════════════════════════════════╗
║  ✅ Bug Fixed: BUG-001                                    ║
╚════════════════════════════════════════════════════════════╝

📋 Title: Calendar date alignment off by one day
🐛 Root Cause: Timezone calculation inconsistency
⏱  Time: 1.1 hours (estimated: 1.0 hour)
📦 Commit: b7c8d9e - "fix(calendar): correct date..."

✓ Bug verified fixed
✓ Regression tests passed
✓ Code committed to git

Next Action:
  Use /check-progress to see updated project status
```

## Usage Examples

```
/complete-bug BUG-001
> Completes bug fix with commit
```
