# VirtIO 剪贴板共享：Linux 主机 ↔ Windows 虚拟机

## 问题描述
在 virt-manager 中实现 Ubuntu 主机和 Windows VM 之间的双向剪贴板共享。

## 解决方案概述
需要 VirtIO 驱动 + Spice 协议 + 双端正确的代理服务。

## 设置步骤

### 1. 在 Windows VM 中安装 VirtIO 驱动

下载并挂载 VirtIO ISO：
```bash
wget https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/latest-virtio/virtio-win.iso
```

在 virt-manager 中：
- VM Settings → Add Hardware → Storage → 选择 virtio-win.iso 作为 CDROM
- 启动 Windows VM
- 运行挂载 ISO 中的 `virtio-win-gt-x64.msi`
- 重启 VM

### 2. 配置 VM 硬件

在 virt-manager VM 设置中：
- **Video**：Model = "QXL" 
- **Display**：Listen type = "None"
- **Add Channel**：Type = "spicevmc", Target = "com.redhat.spice.0"

### 3. 验证配置

检查 VM XML 是否有正确的 Spice 设置：
```bash
virsh dumpxml VM_NAME | grep -A5 -B5 "spice\|channel"
```

应该显示：
- `<channel type='spicevmc'>`
- `<graphics type='spice'>`
- `<target type='virtio' name='com.redhat.spice.0'>`

## 故障排除

### Windows 端
检查 Spice Agent 服务：
```cmd
sc query spice-agent
```

如果状态是 STOPPED，启动它：
```cmd
net start spice-agent
sc config spice-agent start= auto
```

### Linux 主机端  
安装并启动 spice-vdagent：
```bash
sudo apt install spice-client-gtk spice-vdagent
sudo /usr/bin/spice-vdagent
```

### 会话类型问题
Wayland 对剪贴板共享支持不佳，切换到 X11：
```bash
echo $XDG_SESSION_TYPE  # 检查当前类型
# 登录时选择 "Ubuntu on Xorg" 选项
```

## 重要说明

### Linux 剪贴板双重性
Linux 有两套剪贴板系统：
- **PRIMARY selection**：鼠标选择 → Shift+Insert
- **CLIPBOARD**：Ctrl+C/V → 右键粘贴

**Spice 只同步 CLIPBOARD**，不同步 PRIMARY selection。

**最佳实践**：跨平台复制粘贴使用 Ctrl+C/V。

### 常见问题
- 只能单向复制 = Linux 主机 spice-vdagent 没运行
- 完全无法复制 = Windows spice-agent 服务停止
- 行为不一致 = Wayland 会话或剪贴板管理器冲突

## 验证测试
测试双向复制：
1. Linux → Windows：Linux 中 Ctrl+C → Windows 中 Ctrl+V
2. Windows → Linux：Windows 中 Ctrl+C → Linux 中 Ctrl+V