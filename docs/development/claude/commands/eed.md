# Use Enhanced Ed Editor for File Modifications

eed is an AI-oriented text editor designed for programmatic collaboration with AI: preview diffs, smart git integration, atomic apply semantics, and bulletproof safety.

## Key Features

- **Preview-Confirm Workflow (default)**: Edits are written to `<file>.eed.preview` for review; use `--force` to apply directly
- **Automatic Safety & Reordering**: Intelligently reorders line operations to avoid conflicts and detects unsafe patterns
- **Smart Git Integration**: Auto-stages changes in force mode, suggests staging commands in preview mode
- **Bulletproof Error Handling**: Original files are never corrupted, even when edit operations fail
- **Intelligent Diff Display**: Uses `git diff --no-index` for superior code movement visualization
- **Shell-Safe Invocation**: Use quoted heredocs to prevent shell expansion and preserve literal ed scripts

eed is available as an alternative to the built-in Edit, MultiEdit, and Write tools. Choose the tool that feels most appropriate for your task - eed excels in scenarios requiring precise edits, preview workflows, or when you want bulletproof undo capabilities.

## When to Consider eed

**eed works great for:**
- Complex multi-line edits or pattern-based modifications
- When you want to see a diff preview before applying changes
- Situations where you might need to undo changes easily
- Working with files where precision and safety are critical

**Built-in tools work great for:**
- Simple, straightforward text replacements
- Quick single-line modifications  
- When you want immediate results without preview steps
- Familiar string-based find-and-replace operations

Choose whichever feels more natural for your current task!

## Instructions:

**Use eed via Bash tool with quoted heredoc pattern**:
```bash
eed /unix/style/path/to/file - <<'EOF'
# ed commands here
w
q
EOF
```

3. **Always use Unix-style paths** (/path/to/file) - Don't use Windows paths (C:\path\to\file). Always use forward slashes (/), as backslashes will break shell commands.

4. **Always end ed commands with w and q** to save changes:
   - `w` - write (save) the file
   - `q` - quit editor



```bash
eed file.txt - <<'EOF'
5d
w
q
EOF

# Apply changes with git commit
commit file.txt "remove line 5"

# Undo if needed
eed --undo
```

### Local History Features:
- **Auto-save WIP**: Automatically saves uncommitted work in a special commit before edits
- **Atomic commits**: Use `commit` command to apply changes with git commit
- **Easy undo**: Use `eed --undo` to revert last eed-history commit
- **Safe**: All commits use "eed-history:" prefix for easy management

### Heredoc usage

- Avoid using nested heredoc. Do complex editing with multiple sequential `eed` edits

### Important:

- **Tool choice**: You can freely choose between eed and built-in tools based on your preference
- **Local history workflow**: Preview → commit → undo if needed
- **Unix paths**: Always use forward slashes
- **Save explicitly**: Never forget `w` and `q`
- **Avoid nested heredocs**: Nested heredocs are fragile and prone to parsing errors.
- **Atomic operations**: All changes succeed or all fail
- **Git integration**: Use `commit` command for applying changes
- **Easy recovery**: Use `eed --undo` to revert mistakes
