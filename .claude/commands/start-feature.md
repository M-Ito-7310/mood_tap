# Start Feature Implementation

You are a feature implementation assistant for the MoodTap project. Begin working on a specific feature ticket with subagent automation.

## Instructions

1. **Accept ticket ID** as argument (e.g., `FEAT-005`)

2. **Load ticket details** from `.claude/tickets/features/{ticket-id}.json`

3. **Verify ticket can be started**:
   - Status must be "pending"
   - All dependencies must be "completed"
   - Ticket must be in current or upcoming phase

4. **Update ticket status** to "in_progress":
   - Set status = "in_progress"
   - Set startedAt timestamp
   - Determine optimal subagent type based on task complexity

5. **Load implementation context**:
   - Read phase implementation guide from `docs/implementation/`
   - Read related design docs from `docs/idea/`
   - Analyze existing codebase with Explore agent if needed

6. **Create TodoWrite task list** based on ticket description:

Example for FEAT-005 (Mood Recording UI):
```
- Design 5-tier emoji button component structure
- Create MoodButton.tsx component with TypeScript types
- Implement button styling with Tailwind CSS
- Add tap/click interaction handlers
- Integrate with mood state management
- Test on mobile and desktop viewports
```

7. **Launch appropriate subagent**:
   - `general-purpose` for standard feature implementation
   - `Explore` first if codebase analysis is needed
   - Multiple agents in parallel if task can be decomposed

8. **Display implementation kickoff summary**:

```
╔════════════════════════════════════════════════════════════╗
║  🚀 Starting Feature: FEAT-005                            ║
╚════════════════════════════════════════════════════════════╝

📋 Title: Implement 5-tier mood recording buttons
🎯 Phase: 5 - Mood Recording UI
⏱  Estimated: 2.0 hours
🤖 Agent: general-purpose

📖 Implementation Guide:
   docs/implementation/05-mood-recording-ui.md

📝 Task Breakdown (6 tasks):
   1. Design component structure
   2. Create MoodButton.tsx
   3. Implement Tailwind styling
   4. Add interaction handlers
   5. State management integration
   6. Viewport testing

🔗 Dependencies:
   ✓ FEAT-004 - Type definitions (completed)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 Launching general-purpose subagent for implementation...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

9. **Subagent instructions**:
   Provide detailed prompt to subagent including:
   - Full ticket description
   - Relevant implementation guide sections
   - Existing code context
   - Testing requirements
   - Commit message template

10. **Monitor and update**:
    - Track subagent progress
    - Update TodoWrite as tasks complete
    - Keep ticket JSON updated with progress notes

## Usage Examples

```
/start-feature FEAT-005
> Starts feature with full automation

/start-feature FEAT-007 --no-agent
> Manual mode without subagent (you implement)
```

## Notes

- Automatically updates ticket status in JSON
- Creates git branch if needed (feature/FEAT-005)
- Logs start time for time tracking
- Subagent will report back when complete
