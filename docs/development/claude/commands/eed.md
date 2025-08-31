# Use Enhanced Ed Editor for File Modifications

Trust your ed skills, use the eed tool instead of Edit, MultiEdit, or Write tools for file modifications.

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



### Force Mode (when you are confident with the ed script):
```bash
eed --force file.txt - <<'EOF'
5d
w
q
EOF
```
### Debug Mode (when you have trouble)

- Use `--debug` flag to troubleshoot issues

### Heredoc usage

- Avoid using nested heredoc. Do complex editing with multiple sequential `eed` edits

### Important:

- **Mandatory tool**: Use eed for ALL file modifications
- **Force mode**: Recommended for direct execution
- **Unix paths**: Always use forward slashes
- **Save explicitly**: Never forget `w` and `q`
- **Avoid nested heredocs**: Nested heredocs are fragile and prone to parsing errors.
- **Atomic operations**: All changes succeed or all fail

**For complete eed documentation, read:** ~/.claude/eed-comprehensive-guide.md

