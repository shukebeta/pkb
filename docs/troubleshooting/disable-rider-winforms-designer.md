# Fix Rider WinForms Designer Build Locks

## Problem
Rider's WinForms Designer locks files, preventing builds.

## Solution

1. **File → Settings** (Ctrl+Alt+S)
2. **Tools → Windows Forms Designer**
3. **Uncheck "Enable Windows Forms Designer"**
4. **Apply and restart Rider**

## Emergency Fix

Kill locked processes:
```bash
taskkill /IM dotnet.exe /F
```

## Alternative
Use Visual Studio for form design, Rider for code.