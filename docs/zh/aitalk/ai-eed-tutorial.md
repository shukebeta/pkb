## Enhanced Ed (eed) Usage Guidelines

### Why Use eed
- **Atomic commits**: Every edit is automatically committed, making it safe to experiment
- **Easy rollback**: `eed --undo` instantly reverts the last change
- **Precision editing**: When you know line numbers, no need to re-read entire files
- **Consistent workflow**: Every edit follows the same pattern with clear commit messages

### Basic eed Syntax
```bash
eed -m "commit message" /path/to/file - <<'EOF'
# ed commands here
.
w  # write (save)
q  # quit
EOF
```

### Essential ed Commands
- `a` - append (add lines after current line)
- `i` - insert (add lines before current line)
- `c` - change (replace lines)
- `d` - delete (remove lines)
- `s/old/new/` - substitute (replace text within a line)
- `.` - end input mode (when adding/changing text)
- `w` - write (save file)
- `q` - quit editor

### Line Addressing
- `5` - line 5
- `10,20` - lines 10 through 20
- `$` - last line
- `1,$` - entire file
- `/pattern/` - first line matching pattern

### Common Patterns

#### Add lines after specific line number:
```bash
eed -m "add method" file.dart - <<'EOF'
45a
void newMethod() {
// implementation
}
.
w
q
EOF
```

#### Replace specific lines:
```bash
eed -m "fix bug" file.dart - <<'EOF'
12,15c
// new implementation
return corrected_value;
.
w
q
EOF
```

#### Delete lines:
```bash
eed -m "remove unused code" file.dart - <<'EOF'
20,25d
w
q
EOF
```

#### String substitution:
```bash
eed -m "rename variable" file.dart - <<'EOF'
s/oldName/newName/
w
q
EOF
```

### Best Practices

1. **Always use commit messages**: Use descriptive `-m "message"` for every edit
2. **One logical change per edit**: Don't mix unrelated changes in single eed command
3. **Use absolute paths**: Always provide full file paths to avoid confusion
4. **End with w and q**: Always write and quit - never forget these commands
5. **Test after complex edits**: Run `flutter analyze` after significant changes
6. **Leverage undo**: Don't hesitate to experiment - `eed --undo` makes it safe

### Recovery Strategies

#### If edit goes wrong:
```bash
eed --undo  # Reverts last eed operation immediately
```

#### If multiple edits need reverting:
```bash
git log --oneline -10  # See recent commits
git reset --hard COMMIT_HASH  # Reset to specific commit
```

### Common Mistakes to Avoid

1. **Missing `.` in input mode**: When using `a`, `i`, or `c`, always end with `.` on new line
2. **Forgetting `w` and `q`**: File won't be saved without `w`, editor won't exit without `q`
3. **Complex nested heredocs**: Keep it simple - use multiple sequential edits instead
4. **Wrong line numbers**: Double-check line numbers before editing - use Read tool first
5. **Batch unrelated changes**: Each eed should have one clear purpose

### Pro Tips

- **Know your line numbers**: Use Read tool to identify exact line numbers before editing
- **Sequential edits**: For complex changes, break into multiple simple eed commands
- **Commit message discipline**: Write clear, actionable commit messages
- **Trust the tool**: eed with git integration makes experimentation safe
- **Check the result**: Always verify edits with Read or flutter analyze

### When NOT to Use eed

- **Creating new files**: Use Write tool for new file creation
- **Reading files**: Use Read tool for file inspection
- **Large refactoring**: Consider manual editing for extensive restructuring
- **Binary files**: eed is text-only, use appropriate tools for binary content

