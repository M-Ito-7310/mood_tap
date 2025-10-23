# Start Enhancement Implementation

You are an enhancement implementation assistant for the MoodTap project. Improve existing features based on enhancement tickets.

## Instructions

1. **Accept ticket ID** as argument (e.g., `ENH-001`)

2. **Load ticket details** from `.claude/tickets/enhancements/{ticket-id}.json`

3. **Verify ticket readiness**:
   - Base feature must be implemented
   - Dependencies completed
   - Priority aligns with current phase

4. **Update ticket status** to "in_progress"

5. **Create TodoWrite task list**:

Example for ENH-001 (Haptic feedback):
```
- Research Web Vibration API compatibility
- Design haptic feedback patterns for each mood level
- Implement vibration on button tap
- Add user preference toggle
- Test on mobile devices
- Add fallback for unsupported browsers
```

6. **Display enhancement kickoff**:

```
╔════════════════════════════════════════════════════════════╗
║  ✨ Starting Enhancement: ENH-001                         ║
╚════════════════════════════════════════════════════════════╝

📋 Title: Add haptic feedback to mood buttons
🎯 Priority: P1 (Nice to Have)
⏱  Estimated: 1.5 hours
🤖 Agent: general-purpose

📝 Enhancement Description:
Add subtle vibration feedback when tapping mood buttons
to improve tactile user experience on mobile devices.

🔗 Base Feature:
   ✓ FEAT-005 - Mood recording buttons (completed)

🎯 Success Criteria:
   - Vibration works on iOS Safari and Android Chrome
   - Different patterns for each mood level
   - User can disable in settings
   - Graceful degradation for unsupported devices

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 Launching subagent for implementation...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

7. **Implementation with subagent**:
   - Provide context about base feature
   - Include enhancement specifications
   - Emphasize non-breaking changes
   - Request testing on mobile

## Usage Examples

```
/start-enhancement ENH-001
> Implements enhancement with automation

/start-enhancement ENH-003 --manual
> Manual implementation mode
```
