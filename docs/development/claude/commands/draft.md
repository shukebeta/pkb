# Draft Pull Request

Create a draft pull request using the `gh` CLI tool, following the project's PR template.

## Instructions

1. **Find and read PR template**:
   - Look for `.github/pull_request_template.md` or similar in the current repo
   - Read the template to understand the required structure
   - Note any specific checklist items or sections

2. **Gather context**:
   - Run `git status` to check for uncommitted changes
   - Run `git log <base-branch>..HEAD --oneline` to see commits to be included
   - Run `git diff <base-branch>..HEAD --stat` to see files changed
   - Identify the ticket number from branch name or commit messages

3. **Determine base branch**: Usually `main`, `master`, or `integration` - check with `git remote show origin` if unsure

4. **Push branch if needed**: Ensure the current branch is pushed to remote with `git push -u origin <branch-name>`

5. **Fill the PR template**:
   - **Description**: Summarize changes based on commit messages and diff
   - **Checkboxes**: ONLY check if definitively certain - leave uncertain ones unchecked
   - Use generic analysis rules (see below)

6. **Create PR using gh CLI**:
   - **MUST follow template structure exactly** - copy all sections, checklists, and formatting from the template
   - Fill in all required sections with appropriate content
   - Check applicable checklist items based on the changes made
   - Use `--draft` flag if work is incomplete
   - Include ticket number in title (e.g., `MT-1234 Feature description`)
   - Use HEREDOC for the body to preserve formatting:
   ```bash
   gh pr create --draft --title "TICKET-XXX Brief description" --body "$(cat <<'EOF'
   ## Description

   [Summary of changes based on commits and diff]

   ## Checklist
   - [x] Only checked if 100% certain
   - [ ] Left unchecked if uncertain
   EOF
   )"
   ```

7. **Output the PR URL** for user access

## Format Preservation

- Use HEREDOC with single quotes `'EOF'` to preserve formatting
- Keep original template structure exactly
- Copy ALL sections from template
- Preserve checklist indentation and ordering

## Safety Rules
- If `gh auth` fails, suggest switching accounts with `gh auth switch`
- **When in doubt, leave unchecked**
- **Better to have empty checkboxes than incorrect ones**
- **State assumptions explicitly** in description if making inferences
- **NEVER guess** about things that require external verification (code reviews, approvals, etc.)
