# Node.js 路径分隔符模拟：依赖注入解决方案

## 问题描述

Node.js 路径工具如 `path.sep`、`path.join()` 被硬编码为当前平台且只读 - 无法为跨平台测试进行模拟：

```javascript
// 这会失败 - path.sep 是只读的
path.sep = '\\'; // Error: Cannot redefine property

// 这会忽略你的意愿 - 始终使用当前平台
path.join('a', 'b'); // Linux 上始终是 'a/b'，Windows 上始终是 'a\\b'
```

## 解决方案

不要模拟全局 path - 使用 `path.win32` 和 `path.posix` 注入平台特定实现：

```javascript
// 不要用这种脆弱的方法：
function createTempFile(name: string, separator: string) {
  return 'tmp' + separator + name; // 手动字符串操作
}

// 使用依赖注入：
function createTempFile(name: string, pathImpl = path) {
  return pathImpl.join('tmp', name);
}

// 现在可以可靠地测试两个平台：
createTempFile('data.json', path.win32)  // → tmp\data.json
createTempFile('data.json', path.posix)  // → tmp/data.json
```

## 为什么有效

Node.js 提供了 `path.win32` 和 `path.posix` 作为独立的实现。不要与平台依赖性作斗争，通过干净的依赖注入拥抱它。在 Linux 上测试 Windows 逻辑，在 Windows 上测试 Unix 逻辑 - 无需模拟。