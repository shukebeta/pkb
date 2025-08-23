# eed - Enhanced Ed Editor with Preview-Confirm Workflow

## Overview

`eed` (Enhanced Ed) is a production-grade, non-interactive wrapper for the `ed` line editor, designed for AI agents and programmatic use. It provides atomic file editing operations 
with built-in safety features.

**Key Features:**
- **Preview-Confirm Workflow** - See changes before applying (default)
- **Atomic Operations** - All-or-nothing transactions
- **Automatic Backup/Restore** - Never lose data
- **Smart Command Classification** - Distinguishes view vs modify operations

## Quick Start

```bash
# View operations execute immediately
eed file.txt ',p
q'

# Modify operations show preview by default
eed file.txt '5d
w
q'

# Use --force to edit directly (old behavior)
eed --force file.txt '5d
w
q'
```

## Usage Syntax

```bash
eed [--debug] [--force] <file> <ed_script>
```

**Options:**
- `--debug` - Show detailed execution info, preserve temp files
- `--force` - Skip preview mode, edit file directly

## The Preview-Confirm Workflow

### Default Behavior for Modifications

When you run a modifying operation, eed:

1. **Executes on a copy** - Original file stays untouched
2. **Shows unified diff** - See exactly what changed
3. **Provides clear instructions** - Copy-paste commands to apply/discard

Example:
```bash
$ eed sample.txt '2c
new content
.
w
q'

✓ Edits applied to a temporary backup. Review the changes below:

--- sample.txt	2025-08-23 14:30:15.000000000 +1200
+++ sample.txt.eed.bak	2025-08-23 14:30:20.000000000 +1200
@@ -1,3 +1,3 @@
 line1
-line2
+new content
 line3

To apply these changes, run:
  mv 'sample.txt.eed.bak' 'sample.txt'

To discard these changes, run:
  rm 'sample.txt.eed.bak'
```

### View Operations Execute Directly

Read-only operations bypass preview mode:
```bash
eed file.txt ',p    # Shows content immediately
q'

eed file.txt 'g/pattern/p    # Searches and displays
q'
```

## Ed Command Reference

### Basic Line Addressing
```bash
5           # Line 5
$           # Last line
.           # Current line
1,5         # Lines 1 through 5
1,$         # Entire file
```

### Essential Commands
```bash
# View
,p          # Print all lines
1,5p        # Print lines 1-5
=           # Show line count
n           # Print with line numbers

# Edit
5d          # Delete line 5
1,5d        # Delete lines 1-5
5i          # Insert before line 5 (end with .)
5a          # Append after line 5 (end with .)
5c          # Change line 5 (end with .)

# Search & Replace
/pattern/   # Find pattern
s/old/new/g # Replace all on current line
1,$s/old/new/g  # Replace all in file

# Global Operations
g/pattern/d     # Delete all lines with pattern
g/pattern/p     # Print all lines with pattern
v/pattern/d     # Delete all lines WITHOUT pattern

# File Operations
w           # Write (save)
q           # Quit
```

## Best Practices

### 1. Use Heredoc for Complex Operations

```bash
eed file.txt "$(cat <<'EOF'
/function/
a
// New comment added
.
s/oldName/newName/g
w
q
EOF
)"
```

### 2. Always End with w and q

```bash
# Correct - saves and exits
eed file.txt '5d
w
q'

# Wrong - changes not saved
eed file.txt '5d
q'
```

### 3. Work Backwards for Line Operations

```bash
# Good - work from end to beginning
eed file.txt '10d
5d
1d
w
q'

# Bad - line numbers shift unexpectedly
eed file.txt '1d
5d
10d
w
q'
```

### 4. Use --debug for Development

```bash
eed --debug file.txt 'complex script here'
# Shows temp file contents and ed execution details
```

## Shell Safety Rules

### Critical: Quote Content Properly

```bash
# DANGEROUS - shell expands variables and commands
eed file.txt "content with $HOME and `date`"

# SAFE - single quotes preserve literally
eed file.txt 'content with $HOME and `date`'
```

### Heredoc is Safest for Complex Content

```bash
eed file.txt "$(cat <<'EOF'
1a
Content with 'quotes', $variables, and `backticks`
All preserved literally inside heredoc
.
w
q
EOF
)"
```

## Common Patterns

### Adding Import Statements
```bash
eed file.js "$(cat <<'EOF'
1i
import newModule from 'library';
.
w
q
EOF
)"
```

### Global Find and Replace
```bash
eed file.txt "$(cat <<'EOF'
1,$s/oldFunction/newFunction/g
w
q
EOF
)"
```

### Remove Debug Statements
```bash
eed file.js "$(cat <<'EOF'
g/console\.log/d
w
q
EOF
)"
```

### Multi-Step Editing
```bash
eed file.txt "$(cat <<'EOF'
/TODO/
c
DONE: Task completed
.
/FIXME/
d
w
q
EOF
)"
```

## Error Recovery

If something goes wrong:

```bash
# Check for backup
ls -la yourfile.eed.bak

# Restore if needed
mv yourfile.eed.bak yourfile.txt

# Or use git
git checkout HEAD -- yourfile.txt
```

## Advanced Usage

### Preview Mode vs Force Mode

```bash
# Preview mode (default) - safe for experimentation
eed file.txt 'risky changes here'

# Force mode - direct editing like traditional tools
eed --force file.txt 'trusted changes here'
```

### Combining with Other Tools

```bash
# First examine the file
cat file.txt | head -20

# Then edit with eed
eed file.txt "$(cat <<'EOF'
10,15d
w
q
EOF
)"

# Verify results
git diff file.txt
```

## Why eed over Edit/MultiEdit Tools?

- **Atomic Operations** - All changes succeed or all fail
- **Built-in Safety** - Automatic backup and restore
- **Preview Changes** - See before you commit
- **Shell Integration** - Works with any text processing pipeline
- **Reliable** - Based on proven ed editor

## Troubleshooting

### Common Issues

1. **Unexpected shell expansion** - Use single quotes or heredoc
2. **Missing terminator** - Always end input mode with lone `.`
3. **Line number confusion** - Work backwards, use preview mode
4. **Backup files left behind** - Normal in preview mode, clean up manually

### Getting Help

Use `--debug` flag to see exactly what eed is doing:

```bash
eed --debug file.txt 'your commands here'
```

This shows the temporary command file contents and ed's actual output.

---

**Remember: eed's preview mode makes experimentation safe. Try complex edits with confidence\!**

