# 修复 Rider WinForms 设计器构建锁定

## 问题描述
Rider 的 WinForms 设计器锁定文件，阻止构建。

## 解决方案

1. **File → Settings** (Ctrl+Alt+S)
2. **Tools → Windows Forms Designer**
3. **取消勾选 "Enable Windows Forms Designer"**
4. **Apply 并重启 Rider**

## 紧急修复

终止锁定进程：
```bash
taskkill /IM dotnet.exe /F
```

## 替代方案
使用 Visual Studio 进行窗体设计，Rider 进行代码编写。