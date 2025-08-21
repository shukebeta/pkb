# Commit and Push Changes

Create a meaningful commit message, commit changes, and push to remote repository.

## Instructions:

1. Run parallel git commands to understand current state:
   - `git status -s` to see staged/unstaged changes
   - `git diff --cached` to see staged changes
   - `git diff` to see unstaged changes
   - `git log --oneline -5` to see recent commit style

2. Stage relevant untracked files if needed:
   - `git add` relevant files (avoid adding temp/build files)


3. Analyze changes and create commit message:
   - Extract ticket number from branch name if available
   - Summarize the nature of changes (add/update/fix/refactor/test/docs)
   - Focus on "why" rather than "what"
   - Keep it concise (1-2 sentences)
   - Use conventional format: `type: description`

4. Create commit with proper message:
   ```bash
   git commit -m "$(cat <<'EOF'
   [ticket-number] type: brief description of changes

   Additional context if needed.
   EOF
   )"
   ```

5. Push to remote:
   - Always use `git push -u`

6. Confirm success with `git status -s`

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
- Always push after successful commit

## Error Handling:

- If no changes to commit, display "No changes to commit"
- If commit fails, show error and don't attempt push
- If push fails, show remote status and suggest pull/merge
- Never force push unless explicitly requested
- Retry once if pre-commit hooks modify files
