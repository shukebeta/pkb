# Read Latest Handover Document

Read the most recent handover document and immediately begin working on priority tasks.

## Instructions:

1. Find and list recent handover documents:
   ```bash
   ls -t handover/handover-*.txt 2>/dev/null | head -3
   ```

2. Read the most recent handover document:
   ```bash
   latest_handover=$(ls -t handover/handover-*.txt 2>/dev/null | head -1)
   if [ -n "$latest_handover" ]; then
     echo "Reading: $latest_handover"
     cat "$latest_handover"
   fi
   ```

3. Analyze handover content and provide summary:
   - Understand current issue being worked on
   - Review completed tasks and current status
   - Identify next priority actions
   - Note any blockers or technical debt

4. Begin work immediately:
   - Start with the first item in "NEXT SESSION PRIORITIES"
   - If no priorities listed, continue with incomplete TODO items
   - Create new todo list based on handover content
   - Take action without asking for confirmation

## Summary Format:

```
Latest Handover: handover-YYYYMMDD-HHMMSS.txt
Date: YYYY-MM-DD HH:MM

Recent Handovers:
- handover-YYYYMMDD-HHMMSS.txt (latest)
- handover-YYYYMMDD-HHMMSS.txt
- handover-YYYYMMDD-HHMMSS.txt

Summary: [One paragraph describing current state and what needs to be done]

Starting work on: [First priority task from handover]
```

## Action Guidelines:

- **Immediate execution**: Begin work without asking permission
- **Priority-driven**: Follow handover priorities or TODO order
- **Context awareness**: Use technical details from handover
- **Continuity**: Pick up exactly where previous session left off
- **Todo integration**: Create new todo list based on handover content

## Error Handling:

- If no handover directory exists: "No handover directory found - starting fresh session"
- If no handover files found: "No handover documents found - ready for new tasks"
- If handover file is empty/corrupt: "Handover file invalid - proceeding with current context"
- If no clear next actions: "No specific priorities found - ready for instructions"

## Important:

- This is a read-and-execute command, not view-only
- Always start working immediately after reading
- Use handover technical details to inform approach
- Maintain session continuity and context
- Never modify existing handover files
