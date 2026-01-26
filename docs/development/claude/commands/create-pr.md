# Create Pull Request

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

5. **Create PR using gh CLI**:
   - **MUST follow template structure exactly** - copy all sections, checklists, and formatting from the template
   - Fill in all required sections with appropriate content
   - Check applicable checklist items based on the changes made
   - Use `--draft` flag if work is incomplete
   - Include ticket number in title (e.g., `MT-1234 Feature description`)
   - Use HEREDOC for the body to preserve formatting:
   ```bash
  gh pr create --draft --base <base-branch> --title "TICKET-123 Description" --body "$(cat <<'EOF'
   ## Description
   ...template content here...

   ## Checklist
   - [x] Item that applies
   - [ ] Item that doesn't apply
   EOF
   )"
   ```

6. **Return the PR URL** so user can access it directly

## Template Compliance Checklist

Before creating the PR, verify:
- [ ] Read `.github/pull_request_template.md` (or equivalent)
- [ ] PR body includes ALL sections from template
- [ ] All checklists from template are included
- [ ] Applicable items are checked `[x]`
- [ ] Non-applicable items remain unchecked `[ ]`
- [ ] Title format matches template requirements (ticket number, etc.)

## Safety Rules
- If `gh auth` fails, suggest switching accounts with `gh auth switch`
- **When in doubt, leave unchecked**
- **Better to have empty checkboxes than incorrect ones**
- **State assumptions explicitly** in description if making inferences
- **NEVER guess** about things that require external verification (code reviews, approvals, etc.)
