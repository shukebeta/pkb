# Git Smart Add Alias

Automatically removes trailing whitespace from modified files and stages them.

## Setup

```bash
git config --global alias.smartadd '!git -c color.status=false status -s | grep -v "^D\|^.D" | cut -c4- | while read file; do [ -f "$file" ] && sed -i "s/[[:space:]]*$//" "$file"; done && git add -A'
```

## Usage

```bash
git smartadd
```

## What it does

1. Lists all modified/new files (excludes deleted files)
2. Strips trailing whitespace from each existing file
3. Stages all changes with `git add -A`

## Key features

- Handles empty file lists gracefully
- Skips non-existent files
- Works on subsequent runs without errors
- Processes files with spaces in names correctly