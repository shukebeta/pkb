# /eed - Enhanced Ed Editor Command


## CRITICAL SHELL SAFETY WARNING

**ALWAYS use single quotes for content to prevent shell interpretation\!**

```bash
# DANGEROUS - shell interprets backticks, variables, etc.
eed file.txt 'content with `date` and $HOME'

# SAFE - shell passes content literally
eed file.txt 'content with backticks and $variables'
```

**Golden Rule: Single quotes for content, double quotes only for ed commands**

## Purpose
Introduces the powerful `eed` (Enhanced Ed) tool - a production-grade, non-interactive wrapper for the `ed` line editor. This tool is specifically designed for AI agents and programmatic use, providing atomic, composable file editing operations.

**Stop using Edit/MultiEdit tools - use `eed` instead!**

## 📚 Ed Editor Quick Reference

### Basic Navigation & Operations
```bash
# Line addressing
5           # Go to line 5
$           # Last line
.           # Current line
1,5         # Lines 1 through 5
1,$         # Entire file (line 1 to last line)
```

### Core Editing Commands
```bash
# Delete
5d          # Delete line 5
1,5d        # Delete lines 1-5
2,$d        # Delete from line 2 to end

# Insert/Append
5i          # Insert before line 5 (end with .)
5a          # Append after line 5 (end with .)

# Change/Replace
5c          # Replace line 5 (end with .)
1,3c        # Replace lines 1-3 (end with .)

# Search & Replace
s/old/new/g              # Replace all old with new on current line
1,$s/old/new/g          # Replace all old with new in entire file

# Search Navigation
/pattern/                  # Find next line containing pattern
?pattern?                 # Find previous line containing pattern

# Global Operations (AI Powerhouse!)
g/pattern/d               # Delete all lines containing pattern
g/pattern/s/old/new/g     # Replace in all matching lines
v/pattern/d               # Delete all lines NOT containing pattern

# Line Operations
5m0                       # Move line 5 to beginning
1,3t$                     # Copy lines 1-3 to end
u                         # Undo last operation
u                         # Undo (NOT needed in eed - see below)

# Display Enhancement
=                         # Show current line number
n                         # Print with line numbers
```

## 🚀 The eed Tool

### Why eed Over Edit/MultiEdit?

- **Atomic Operations**: All-or-nothing transactions vs individual operations
- **Backup/Restore**: Automatic on failure vs manual
- **Special Characters**: Perfect handling vs shell interpretation issues
- **Error Recovery**: Complete rollback vs partial failures
- **Debug Support**: Full debug mode vs limited visibility

### Basic Usage
```bash
# Simple operations
eed file.txt '5d'                    # Delete line 5
eed file.txt '1,$s/old/new/g'        # Global replace
# Multi-step operations (atomic)
eed file.txt '3c' 'new content' '.'  # Replace line 3
eed file.txt '5a' 'new line' '.'      # Insert after line 5

### Debug Mode
```bash
# When things go wrong
eed --debug file.txt 'command'
```
## 🎯 Common Patterns

### Function Renaming
```bash
eed file.js '1,$s/oldName/newName/g'
```

### Adding Imports
```bash
eed file.js '1i' 'import newModule from 'library';' '.'
```

### Global Replace
```bash
eed file.txt '1,$s/old pattern/new pattern/g'
```

## 🏆 Why eed is Superior

eed myfile.js '10a' '// New comment' 'newFunction();' 'more code' '.'
- **Auto backup/restore** - Never lose data
- **Debug mode** - See exactly what failed

### 5. Global Delete Patterns
```bash
# Remove all debug statements
eed file.js 'g/console\.log/d'

# Remove all comments
eed file.js 'g/^[[:space:]]*\/\//d'

# Remove empty lines
eed file.txt 'g/^[[:space:]]*$/d'
```

### 6. Search and Navigate
```bash
# Find and then edit
eed file.txt '/TODO/' 'c' 'DONE: Fixed the issue' '.'
```

### 7. Move and Copy Lines
```bash
# Move imports to top
eed file.js 'g/^import/m0'

# Copy function to end
eed file.js '/function myFunc/,/^}/t$'
```
- **Perfect for AI** - Multi-argument API ideal for programmatic use

**Start using eed today for reliable, atomic file editing\!**
```

## ⚡ CRITICAL: Correct Usage Patterns

### ✅ RIGHT: Multi-line insertion
```bash
# Ed supports multi-line input until lone '.'
eed file.txt '5a' 'line1' 'line2' 'line3' '.'

# Add entire sections efficiently
eed file.txt '10a' '## New Section' '' 'Content here' 'More content' '.'
```

### ❌ WRONG: One line per command
```bash
# DON'T do this - slow and error-prone
eed file.txt '5a' 'line1' '.' '6a' 'line2' '.' '7a' 'line3' '.'
```

### ✅ RIGHT: Mixed operations (atomic)
```bash
# Combine different operations in one call
eed file.txt '5d' '1,$s/old/new/g' '10a' 'new content' 'more lines' '.'
```


## 🧠 Think Before You Execute

### Why eed Doesn't Need Undo
Unlike interactive ed, eed operates in **atomic sessions**:
- Each eed call is a complete transaction
- Success = all changes applied permanently
- Failure = complete rollback to original state
- No partial/intermediate states exist

### Best Practice: Mental Planning
1. **Read** the file first to understand structure
2. **Plan** your complete editing sequence mentally
3. **Self-review** your ed commands for correctness

## ⚠️ CRITICAL: Shell Quoting Rules

### The Root Cause of All Problems
Most eed issues stem from ONE simple mistake: **using double quotes instead of single quotes**.

```bash
# ❌ DANGEROUS - shell interprets metacharacters
eed file.txt 'content with `date` and $HOME'
# Result: date command executes, $HOME expands

# ✅ SAFE - shell passes literally
eed file.txt 'content with \ and \/c/Users/David.Wei'
# Result: literal backticks and dollar signs preserved
```

### Golden Rule
**Always use single quotes for eed content arguments\!**

### When You Must Use Double Quotes
Only use double quotes when you INTENTIONALLY want shell expansion:
```bash
# Intentional variable expansion
eed file.txt 'path: $HOME/documents'  # OK if you want $HOME expanded
```

### Mixed Quoting Strategy
```bash
# Combine single quotes for safety with double quotes for ed commands
eed file.txt '1a' 'content with `backticks` safely' ''
```

## ⚠️ Important Gotchas

### Shell Metacharacter Escaping
When calling eed, be careful with shell special characters:

```bash
# ❌ DANGEROUS - shell interprets backticks
eed file.txt 'text with `command` in it'

# ✅ SAFE - use single quotes
eed file.txt 'text with \ in it'

# ❌ DANGEROUS - shell expands variables
eed file.txt 'path: $HOME/file'

# ✅ SAFE - escape or quote properly
eed file.txt 'path: \/c/Users/David.Wei/file'
```

### Common Problematic Characters
- Backticks: \
- Variables: \
- Command substitution: \
- Single quotes inside double quotes

**Rule of thumb**: When in doubt, use single quotes around your content.
4. **Execute** with confidence - eed handles success/failure

### No Manual w/q Required
eed automatically appends 'w' (write) and 'q' (quit) to every command sequence.
Focus on your editing logic - eed handles the session management.
### 🔧 Pro Tips
- Use  tool first to understand file structure
- Multi-line content goes between command and terminating 
- All operations in one eed call = atomic transaction
- Use  when developing complex commands
- Remember: line numbers, content lines, then  to end input mode

### Real-World Examples
```bash
# Adding code with backticks - SAFE
eed script.js '1a' 'console.log(\);' '.'

# Adding paths with dollars - SAFE
eed config.txt '5a' 'export PATH=\/mingw64/bin:/usr/bin:/c/Users/David.Wei/bin:/c/oracle/product/ODAC1120320_x64:/c/oracle/product/ODAC1120320_x64/bin:/c/oracle/product/ODAC1120320_x32:/c/oracle/product/ODAC1120320_x32/bin:/c/Program Files (x86)/Common Files/Oracle/Java/java8path:/c/Program Files (x86)/Common Files/Oracle/Java/javapath:/c/Python313/Scripts:/c/Python313:/c/Windows/system32:/c/Windows:/c/Windows/System32/Wbem:/c/Windows/System32/WindowsPowerShell/v1.0:/c/Program Files/Amazon/cfn-bootstrap:/c/Program Files/Microsoft SQL Server/130/Tools/Binn:/c/Program Files/Microsoft SQL Server/150/Tools/Binn:/c/Program Files/Microsoft SQL Server/Client SDK/ODBC/170/Tools/Binn:/c/Users/David.Wei/AppData/Roaming/nvm:/c/Program Files/nodejs:/c/Choco/bin:/c/WINDOWS/system32:/c/WINDOWS:/c/WINDOWS/System32/Wbem:/c/WINDOWS/System32/WindowsPowerShell/v1.0:/c/WINDOWS/System32/OpenSSH:/c/Program Files/dotnet:/c/Program Files (x86)/dotnet-core-uninstall:/c/Program Files (x86)/Yarn/bin:/c/Program Files/Puppet Labs/Puppet/bin:/c/Program Files/TortoiseSVN/bin:/c/Program Files/Microsoft VS Code/bin:/c/Users/David.Wei/AppData/Local/Microsoft/WindowsApps:/c/Users/David.Wei/AppData/Roaming/nvm:/c/Users/David.Wei/.dotnet/tools:/c/Program Files/7-Zip:/c/Program Files (x86)/NUnit.org/nunit-console:/c/Users/David.Wei/AppData/Roaming/npm:/cmd:/c/oracle/instantclient/instantclient_19_15:/c/Users/David.Wei/apps/meld:/c/Program Files/GitHub CLI:/c/Program Files/nodejs:/c/Users/David.Wei/scoop/shims:/c/oracle/product/ODAC1120320_x64:/c/oracle/product/ODAC1120320_x64/bin:/c/oracle/product/ODAC1120320_x32:/c/oracle/product/ODAC1120320_x32/bin:/c/Program Files (x86)/Common Files/Oracle/Java/java8path:/c/Program Files (x86)/Common Files/Oracle/Java/javapath:/c/Python313/Scripts:/c/Python313:/c/Windows/system32:/c/Windows:/c/Windows/System32/Wbem:/c/Windows/System32/WindowsPowerShell/v1.0:/c/Program Files/Amazon/cfn-bootstrap:/c/Program Files/Microsoft SQL Server/130/Tools/Binn:/c/Program Files/Microsoft SQL Server/150/Tools/Binn:/c/Program Files/Microsoft SQL Server/Client SDK/ODBC/170/Tools/Binn:/c/Users/David.Wei/AppData/Roaming/nvm:/c/Program Files/nodejs:/c/Choco/bin:/c/WINDOWS/system32:/c/WINDOWS:/c/WINDOWS/System32/Wbem:/c/WINDOWS/System32/WindowsPowerShell/v1.0:/c/WINDOWS/System32/OpenSSH:/c/Program Files/dotnet:/c/Program Files (x86)/dotnet-core-uninstall:/c/Program Files (x86)/Yarn/bin:/c/Program Files/Puppet Labs/Puppet/bin:/c/Program Files/TortoiseSVN/bin:/c/Program Files/Microsoft VS Code/bin:/c/Users/David.Wei/AppData/Local/Microsoft/WindowsApps:/c/Users/David.Wei/AppData/Roaming/nvm:/c/Users/David.Wei/.dotnet/tools:/c/Program Files/7-Zip:/c/Program Files (x86)/NUnit.org/nunit-console:/c/Users/David.Wei/AppData/Roaming/npm:/cmd:/c/oracle/instantclient/instantclient_19_15:/c/Users/David.Wei/apps/meld:/c/Program Files/GitHub CLI:/c/Program Files/nodejs:/c/Users/David.Wei/.local/bin:/c/Users/David.Wei/.dotnet/tools:~/bin:/c/Program Files (x86)/GnuWin32/bin:/c/Python313/  :~/.dotnet/tools  :~/bin/bats:/c/Program Files/WinMerge/ :/new/path' '.'

# Complex regex patterns - SAFE
eed file.txt '1,\/old_\(.*\)_pattern/new_\1_replacement/g'

# Multiple operations with mixed content - SAFE
eed complex.js 'g/TODO/d' '1a' 'const API_URL = \;' '.'
```

### Emergency Recovery
If you accidentally used double quotes and got unexpected results:
```bash
# Check if backup exists
ls -la yourfile.eed.bak

# Manual recovery if needed
cp yourfile.eed.bak yourfile.txt
```

**Remember: eed creates automatic backups, but prevention is better than recovery\!**
