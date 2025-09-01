# shukebeta's scribbles - Repository Instructions

This is the source repository for [pkb.shukebeta.com](https://pkb.shukebeta.com) - a bilingual tech notes site.

## Communication Style Preferences

- **Ultra-concise**: Keep responses short and to the point
- **No fluff**: Skip introductions, explanations, and elaborations unless specifically requested
- **Direct answers**: Answer the question immediately, avoid preamble/postamble
- **Actionable content**: Provide copy-paste ready solutions when applicable

## Content Creation Guidelines

When creating documentation/guides:
- Use clear, scannable headings
- Include practical examples with code blocks
- Keep it brief but complete
- Focus on "how-to" rather than "why"
- **Content is auto-indexed** - no need to manually update README.md
- **Both languages welcome** - place Chinese content in `docs/zh/`

## File Organization

- Place guides in `docs/guides/`
- Use descriptive, kebab-case filenames
- Follow existing directory structure patterns

## Writing Style

- Bullet points over paragraphs
- Code examples over descriptions
- One-sentence explanations maximum
- No unnecessary pleasantries or confirmations

## Publication Workflow

### Site Auto-Updates
- **Site deploys automatically** on git push to master
- **Search index updates** automatically - no manual intervention needed
- **Navigation updates** automatically based on file structure

### Content Workflow
1. Create/edit content in appropriate directory
2. For bilingual content, create both `docs/path/file.md` and `docs/zh/path/file.md` 
3. Commit and push - site updates automatically
4. **No need to update README.md** - it stays as pure repository documentation

### Technical Notes
- 总是在子shell里工作以避免不小心破坏当前路径的值
- VitePress handles all indexing and navigation automatically