# Commit Current Changes

Create a meaningful commit message and commit current changes to the repository.

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

5. Run `git status` to confirm commit succeeded

6. (Optional) Push to remote if needed:
   - Check upstream: `git rev-parse --abbrev-ref @{upstream} 2>/dev/null`
   - If no upstream: `git push -u origin $(git branch --show-current)`
   - If has upstream: `git push`
   - Confirm: `git status -s`

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