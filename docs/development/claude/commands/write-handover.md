# Write Session Handover

**Ultra-quick handover document generation for context window crisis.**

## Single Command:

```bash
mkdir -p handover && cat > "handover/handover-$(date +%Y%m%d-%H%M%S).txt" << 'EOF'
# Handover - $(date +%Y-%m-%d %H:%M)

## CURRENT TASK plus a very brief background
[What we're working on right now]

## COMPLETED
- [x] [Major accomplishment]
- [x] [Another completion]

## TODO
- [ ] [Next critical task]
- [ ] [Another important task]

## FILES CHANGED
- `path/file.ext`: [what changed]

## NEXT ACTIONS
1. [First priority for next session]
2. [Second priority]

## BLOCKERS/NOTES
- [Critical issue or decision needed]

---
Status: [READY/BLOCKED/IN-PROGRESS]
EOF
```

## Key Principles:
- Focus on actionable next steps
- No confirmation needed - just execute
- **Speed over perfection** - write fast, comprehensive enough
- **Action-oriented** - what does next session need to DO?
- **Minimal token usage** - short responses only
- **No questions** - just create and populate
