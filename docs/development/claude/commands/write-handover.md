# Write Session Handover Document

Create a comprehensive handover document for the current development session.

## Instructions:

1. Create handover directory and generate timestamp:
   ```bash
   mkdir -p handover
   timestamp=$(date +%Y%m%d-%H%M%S)
   ```

2. Create handover document:
   ```bash
   cat > handover/handover-$timestamp.txt << 'HANDOVER_EOF'
   # Session Handover - $(date +%Y-%m-%d %H:%M)
   # Project: [Brief session context/main topic]

   ## ISSUE BEING WORKED ON

   ## COMPLETED TASKS

   ### [Category]
   - **[Task Name] - [STATUS]**
     - Problem: [Description]
     - Solution: [What was implemented]
     - Files: [Modified files]

   ## TODO LIST

   ### Incomplete Tasks
   - [ ] [Task]: [Description]

   ### Completed Tasks
   - [x] [Task]: [Description]

   ## TECHNICAL IMPLEMENTATION

   ### Key Files Modified
   - `path/to/file`: [Changes made]

   ### Critical Methods/Functions
   ```
   // Code examples if relevant
   methodName(): returnType
   ```

   ## ARCHITECTURE INSIGHTS

   - [Key architectural decision or pattern]
   - [Important technical detail for future reference]

   ## CURRENT STATUS

   ### Fully Functional
   - [Feature/component]: [Status description]

   ### Technical Debt (Future Improvements)
   - [Potential improvement areas]

   ## NEXT SESSION PRIORITIES

   1. [High Priority]: [Description]
   2. [Medium Priority]: [Description]

   ---
   Session Status: [COMPLETE/IN-PROGRESS] - [One-line summary]
   HANDOVER_EOF
   ```

3. Confirm file creation:
   ```bash
   ls -la handover/handover-$timestamp.txt
   echo "Handover document created: handover/handover-$timestamp.txt"
   ```

## Content Guidelines:

- **Focus on actionability**: What does next session need to know?
- **Include specifics**: File paths, method names, line numbers
- **Document decisions**: Why certain approaches were chosen
- **Note blockers**: Unresolved issues or dependencies
- **Keep concise**: Informative but scannable
- **Use developer terminology**: Technical accuracy over simplification

## Document Sections:

- **ISSUE**: Current problem/feature being worked on
- **COMPLETED**: What was finished this session
- **TODO**: Outstanding work with clear next steps
- **TECHNICAL**: Code changes and implementation details
- **ARCHITECTURE**: Design decisions and patterns
- **STATUS**: Current functionality state
- **PRIORITIES**: What to tackle next session

## Error Handling:

- If `handover/` directory creation fails, create in current directory
- If timestamp generation fails, use manual format: `handover-YYYYMMDD-HHMMSS.txt`
- Always confirm file was written successfully
- Include fallback for manual template completion

## Important:

- Save to `handover/` directory in project root
- Use timestamp format: YYYYMMDD-HHMMSS
- Write file immediately without asking for confirmation
- Focus on information continuity between sessions
- Include both completed work and clear next steps
