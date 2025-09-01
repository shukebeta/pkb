# Git 智能添加别名

自动清除修改文件的尾随空白字符并暂存它们。

## 设置

```bash
git config --global alias.smartadd '!git -c color.status=false status -s | grep -v "^D\|^.D" | cut -c4- | while read file; do [ -f "$file" ] && sed -i "s/[[:space:]]*$//" "$file"; done && git add -A'
```

## 使用方法

```bash
git smartadd
```

## 功能说明

1. 列出所有修改/新增文件（排除已删除文件）
2. 清除每个现有文件的尾随空白字符
3. 使用 `git add -A` 暂存所有变更

## 核心特性

- 优雅处理空文件列表
- 跳过不存在的文件
- 多次运行不会出错
- 正确处理文件名包含空格的情况