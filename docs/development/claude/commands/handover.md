# Complete Handover Workflow

Seamless session transition: write current session summary, clear context, then immediately resume with previous session context.

## Workflow:

1. **Write Current Session Handover**
   - Generate timestamp: `handover/handover-YYYYMMDD-HHMMSS.txt`
   - Document completed tasks, technical insights, and next priorities
   - Save comprehensive session summary

2. **Clear Context**
   - Reset conversation context for fresh start

3. **Load Previous Session Context**
   - Read latest handover document
   - Display previous session summary
   - **Automatically continue with pending tasks**

## Handover Document Structure:

```
# HappyNotes Session Handover
# Date: YYYY-MM-DD HH:MM
# Context: [Brief session context/main topic]

## COMPLETED TASKS

### [Category]
1. **[Task Name] - [STATUS]**
   - Problem: [Issue description]
   - Root Cause: [Technical cause if applicable]
   - Solution: [Implementation approach]

## TECHNICAL IMPLEMENTATION

### Key Files Modified
- `path/to/file.dart`: [Changes made]

### Critical Methods Added/Modified
```dart
// Code examples if relevant
```

## ARCHITECTURE INSIGHTS
- [Key architectural decisions]
- [Important patterns discovered]

## CURRENT STATUS

### ✅ FULLY FUNCTIONAL
- [Component]: [Status description]

### 🔧 TECHNICAL DEBT
- [Future improvement areas]

## NEXT SESSION PRIORITIES

**[Priority]**: [What should be tackled next]

**Pending tasks**:
1. [Task 1]
2. [Task 2]

---
**Session Status**: [COMPLETE/IN-PROGRESS] - [Summary]
```

## Post-Read Instructions:

After reading the handover document, **immediately analyze pending tasks and begin working on the highest priority item**. Do not wait for user confirmation.

If there are pending tasks listed in "NEXT SESSION PRIORITIES", start working on them automatically using this priority order:
1. Critical bugs or broken functionality
2. Failing tests that need fixes
3. High-priority features or improvements
4. Technical debt or optimizations

## Content Guidelines:

- Focus on actionable information for continuation
- Include specific file paths and method names
- Highlight architectural decisions and patterns
- Note unresolved issues or technical debt
- Use technical terminology for developers
- Keep descriptions concise but complete

## Important:
- Save to `handover/` directory in project root
- Use timestamp format: YYYYMMDD-HHMMSS
- After reading, immediately continue with pending work
- No user confirmation needed to proceed with documented priorities