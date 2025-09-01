# 快速技巧：轻松获取 GitHub PR 差异

需要分享 GitHub PR 的变更内容（包括已关闭的）？只需在 PR URL 后面加 `.diff` 或 `.patch`：

**原始 URL：**
```
https://github.com/owner/repo/pull/123
```

**diff 格式：**
```
https://github.com/owner/repo/pull/123.diff
```

**patch 格式：**
```
https://github.com/owner/repo/pull/123.patch
```

对于已打开、已关闭或已合并的 PR 都适用。非常适合代码审查、问题调查或与他人分享变更。

**用于 LLM/AI 分析：** 使用 `.diff` 格式 - 比包含额外邮件头的 `.patch` 更干净、更标准化。