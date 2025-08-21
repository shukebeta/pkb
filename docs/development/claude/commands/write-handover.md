# Write Session Handover Document

Create a short but comprehensive handover document for the current session.

## Instructions:

1. Generate timestamp-based filename: `handover/handover-YYYYMMDD-HHMMSS.txt`
2. Create handover document with session information
3. Save to project's handover directory

## Document Structure:

```
# HappyNotes Session Handover
# Date: YYYY-MM-DD HH:MM
# Context: [Brief session context/main topic]

## The issue you are working on

## COMPLETED TASKS/ATTEMPTS

### [Category 1]
1. **[Task Name] - [STATUS]**
   - Problem: [Description of issue/requirement]
   - Root Cause: [Technical root cause if bug fix]
   - Solution: [What was implemented]

### [Category 2]
- **[Task Name]**: [Brief description of what was completed]
- **[Another Task]**: [Brief description]

## TODO LIST with completed and incomplete Tasks

## TECHNICAL IMPLEMENTATION

### Key Files Modified
- `path/to/file1`: [What was changed]
- `path/to/another_file`: [What was changed]

### Critical Methods Added/Modified
```code
// Brief code examples if relevant
@override Future<SomeType> methodName()
```

## ARCHITECTURE INSIGHTS

### [Insight Category]
- [Key architectural decision or pattern discovered]
- [Important technical detail for future reference]

## CURRENT STATUS

### ✅ FULLY FUNCTIONAL
- [Feature/component]: [Status description]
- [Another feature]: [Status description]

### 🔧 TECHNICAL DEBT (Optional Future)
- [Potential improvement areas]

## NEXT SESSION PRIORITIES

**[Priority Level]**: [Description of what should be tackled next]

**Potential enhancements**:
1. [Enhancement 1]
2. [Enhancement 2]

---
**Session Status**: [COMPLETE/IN-PROGRESS] - [One-line summary]
```

## Content Guidelines:

- Focus on actionable information for the next session
- Include specific file paths and method names
- Highlight architectural decisions and patterns
- Note any unresolved issues or technical debt
- Keep descriptions concise but informative
- Use technical terminology appropriate for developers

## Important:
- Always save to `handover/` directory in project root
- Use timestamp format: YYYYMMDD-HHMMSS
- Focus on what future sessions need to know
- Include both completed work and next steps
