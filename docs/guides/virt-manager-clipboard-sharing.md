# VirtIO Clipboard Sharing: Linux Host ↔ Windows Guest

## Problem
Enable bidirectional clipboard sharing between Ubuntu host and Windows VM in virt-manager.

## Solution Overview
Requires VirtIO drivers + Spice protocol + proper agent services on both sides.

## Setup Steps

### 1. Install VirtIO Drivers in Windows VM

Download and mount VirtIO ISO:
```bash
wget https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/latest-virtio/virtio-win.iso
```

In virt-manager:
- VM Settings → Add Hardware → Storage → Select virtio-win.iso as CDROM
- Boot Windows VM
- Run `virtio-win-gt-x64.msi` from mounted ISO
- Reboot VM

### 2. Configure VM Hardware

In virt-manager VM settings:
- **Video**: Model = "QXL" 
- **Display**: Listen type = "None"
- **Add Channel**: Type = "spicevmc", Target = "com.redhat.spice.0"

### 3. Verify Configuration

Check VM XML has proper Spice setup:
```bash
virsh dumpxml VM_NAME | grep -A5 -B5 "spice\|channel"
```

Should show:
- `<channel type='spicevmc'>`
- `<graphics type='spice'>`
- `<target type='virtio' name='com.redhat.spice.0'>`

## Troubleshooting

### Windows Side
Check Spice Agent service:
```cmd
sc query spice-agent
```

If STOPPED, start it:
```cmd
net start spice-agent
sc config spice-agent start= auto
```

### Linux Host Side  
Install and start spice-vdagent:
```bash
sudo apt install spice-client-gtk spice-vdagent
sudo /usr/bin/spice-vdagent
```

### Session Type Issue
Wayland has poor clipboard sharing support. Switch to X11:
```bash
echo $XDG_SESSION_TYPE  # Check current
# Login with "Ubuntu on Xorg" option
```

## Important Notes

### Linux Clipboard Duality
Linux has two clipboard systems:
- **PRIMARY selection**: Mouse selection → Shift+Insert
- **CLIPBOARD**: Ctrl+C/V → Right-click paste

**Spice only syncs CLIPBOARD**, not PRIMARY selection.

**Best Practice**: Use Ctrl+C/V for cross-platform copy-paste.

### Common Issues
- One-way copying only = Linux host spice-vdagent not running
- No copying at all = Windows spice-agent service stopped
- Inconsistent behavior = Wayland session or clipboard manager conflicts

## Verification
Test both directions:
1. Linux → Windows: Ctrl+C in Linux → Ctrl+V in Windows
2. Windows → Linux: Ctrl+C in Windows → Ctrl+V in Linux