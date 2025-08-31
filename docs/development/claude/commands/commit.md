# Commit Current Changes

Create a meaningful commit message and commit current changes to the repository.

## Instructions:

1. Stage relevant untracked files if needed:
   - `git add` relevant files (avoid adding temp/build files)

2. Analyze changes and create commit message:
   - Extract ticket number from branch name if available
   - Summarize the nature of changes (add/update/fix/refactor/test/docs)
   - Focus on "why" rather than "what"
   - Keep it concise (1-2 sentences)
   - Use conventional format: `type: description`

3. Create commit with proper message:
   ```bash
   git commit -m "$(cat <<'EOF'
   [ticket-number] type: brief description of changes

   Additional context if needed.
   EOF
   )"
   ```

4. (Optional) Push to remote if needed:
   - `git push -u`

## Commit Message Guidelines:

- **Types**: feat, fix, refactor, test, docs, style, chore
- **Format**: `[ticket] type: description` (if ticket exists)
- **Examples**:
  - `fix: resolve pagination UI issue in MemoriesOnDay`
  - `feat: add left swipe delete functionality`
  - `refactor: extract common provider base class`
  - `test: add comprehensive pagination control tests`

## Important Rules:

- NEVER mention Claude or AI assistance in commit messages
- Extract ticket number from branch name automatically
- Stage only relevant files (no temp/build artifacts)
- Use present tense, imperative mood
- Keep first line under 70 characters
- Add body for complex changes

## Error Handling:

- If no changes to commit, display "No changes to commit"
- If commit fails, show error and suggest fixes
- Never force commit or ignore pre-commit hooks
- Retry once if pre-commit hooks modify files
