# Quick Tip: Get GitHub PR Diffs Easily

Need to share changes from a GitHub PR (even closed ones)? Just add `.diff` or `.patch` to the PR URL:

**Original URL:**
```
https://github.com/owner/repo/pull/123
```

**For diff format:**
```
https://github.com/owner/repo/pull/123.diff
```

**For patch format:**
```
https://github.com/owner/repo/pull/123.patch
```

Both work for open, closed, or merged PRs. Perfect for code reviews, investigations, or sharing changes with others.

**For LLM/AI analysis:** Use `.diff` format - it's cleaner and more standardized than `.patch` which includes extra email headers.