# Write Session Takeover

Create takeover document with proactive directory creation.

## Instructions:

1. `mkdir -p takeover` (always create directory first)
2. Generate filename: `takeover/takeover-YYYYMMDD-HHMMSS.txt`
3. Write comprehensive session summary
4. Confirm file created

## Document Template:

```
# Session Takeover - YYYY-MM-DD HH:MM
# Project: [context]

## COMPLETED
- [task]: [what was done]

## IN PROGRESS  
- [task]: [current state, what's left]

## FILES CHANGED
- `path/file`: [changes made]

## NEXT PRIORITIES
1. [first thing to do]
2. [second priority]

## BLOCKERS/ISSUES
- [problem]: [description]

---
Status: [COMPLETE/IN-PROGRESS] - [one-line summary]
```

## Critical:
- Always create `takeover/` directory first
- Write file immediately, don't ask
- Include specific file paths and next actions
- Keep descriptions brief but actionable