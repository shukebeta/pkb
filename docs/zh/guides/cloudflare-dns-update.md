# 改进的 Cloudflare DNS 更新脚本

## 获取 API Token

1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 "Create Token"
3. 使用 "Edit zone DNS" 模板
4. 在 "Zone Resources" 中选择你的域名
5. 复制生成的 token

## 在 bashrc 中设置 API Token

添加到 `~/.bashrc`：

```bash
export CF_API_TOKEN="your_api_token_here"
```

重新加载：`source ~/.bashrc`

## 增强的更新脚本

创建 `update-dns.sh`：

```bash
#!/bin/bash

# 使用说明函数
usage() {
    echo "使用方法: $0 <record_name> [ip_address]"
    echo "         $0 <domain> <subdomain> [ip_address]"
    echo "示例:"
    echo "  $0 home.example.com                    # 使用 Tailscale IP"
    echo "  $0 example.com                         # 根域名使用 Tailscale IP"
    echo "  $0 server.example.com 192.168.1.100   # 使用指定 IP"
    echo "  $0 example.com home                    # 旧格式"
    echo "  $0 example.com @ 1.2.3.4              # 旧格式根域名"
    exit 1
}

# 检查参数
if [ $# -lt 1 ]; then
    usage
fi

# 检查 API token 是否设置
if [ -z "$CF_API_TOKEN" ]; then
    echo "错误: CF_API_TOKEN 未设置。请添加到 ~/.bashrc"
    exit 1
fi

# 解析参数 - 检测格式
FIRST_ARG="$1"
SECOND_ARG="$2"
THIRD_ARG="$3"

# 检查第一个参数是否包含多个点（FQDN 格式）
if [[ "$FIRST_ARG" == *.*.* ]] || ([[ "$FIRST_ARG" == *.* ]] && [[ "$SECOND_ARG" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]); then
    # FQDN 格式: script.sh home.example.com [ip]
    RECORD_NAME="$FIRST_ARG"
    CUSTOM_IP="$SECOND_ARG"
    
    # 通过移除第一个子域名部分提取域名
    DOMAIN=$(echo "$RECORD_NAME" | cut -d'.' -f2-)
elif [[ "$FIRST_ARG" == *.* ]] && [ -z "$SECOND_ARG" ]; then
    # 根域名格式: script.sh example.com
    RECORD_NAME="$FIRST_ARG"
    DOMAIN="$FIRST_ARG"
    CUSTOM_IP=""
elif [[ "$FIRST_ARG" == *.* ]] && [ -n "$SECOND_ARG" ] && [[ ! "$SECOND_ARG" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    # 旧格式: script.sh example.com home [ip]
    DOMAIN="$FIRST_ARG"
    SUBDOMAIN="$SECOND_ARG"
    CUSTOM_IP="$THIRD_ARG"
    
    if [ "$SUBDOMAIN" = "@" ]; then
        RECORD_NAME="$DOMAIN"
    else
        RECORD_NAME="$SUBDOMAIN.$DOMAIN"
    fi
else
    echo "错误: 参数格式无效"
    usage
fi

# 获取 IP 地址
if [ -n "$CUSTOM_IP" ]; then
    NEW_IP="$CUSTOM_IP"
    echo "使用提供的 IP: $NEW_IP"
else
    if command -v tailscale >/dev/null 2>&1; then
        NEW_IP=$(tailscale ip -4)
        echo "使用 Tailscale IP: $NEW_IP"
    else
        echo "错误: 未找到 tailscale 命令且未提供 IP"
        exit 1
    fi
fi

# 验证 IP 格式
if ! echo "$NEW_IP" | grep -E '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$' >/dev/null; then
    echo "错误: IP 地址格式无效: $NEW_IP"
    exit 1
fi

echo "更新 DNS 记录: $RECORD_NAME -> $NEW_IP"

# 获取 Zone ID
echo "获取 $DOMAIN 的 Zone ID..."
ZONE_RESPONSE=$(curl -s -H "Authorization: Bearer $CF_API_TOKEN" \
    "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN")

ZONE_ID=$(echo "$ZONE_RESPONSE" | jq -r '.result[0].id')

if [ "$ZONE_ID" = "null" ] || [ -z "$ZONE_ID" ]; then
    echo "错误: 无法找到域名 $DOMAIN 的 zone"
    echo "响应: $ZONE_RESPONSE"
    exit 1
fi

echo "Zone ID: $ZONE_ID"

# 获取 Record ID
echo "获取 $RECORD_NAME 的 Record ID..."
RECORD_RESPONSE=$(curl -s -H "Authorization: Bearer $CF_API_TOKEN" \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=$RECORD_NAME&type=A")

RECORD_ID=$(echo "$RECORD_RESPONSE" | jq -r '.result[0].id')

if [ "$RECORD_ID" = "null" ] || [ -z "$RECORD_ID" ]; then
    echo "错误: 无法找到 $RECORD_NAME 的 A 记录"
    echo "可用记录:"
    echo "$RECORD_RESPONSE" | jq -r '.result[] | "\(.name) (\(.type))"'
    exit 1
fi

echo "Record ID: $RECORD_ID"

# 更新 DNS 记录
echo "更新 DNS 记录..."
UPDATE_RESPONSE=$(curl -s -X PUT \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "{\"type\":\"A\",\"name\":\"$RECORD_NAME\",\"content\":\"$NEW_IP\"}")

SUCCESS=$(echo "$UPDATE_RESPONSE" | jq -r '.success')

if [ "$SUCCESS" = "true" ]; then
    echo "✅ DNS 记录更新成功！"
    echo "   $RECORD_NAME 现在指向 $NEW_IP"
else
    echo "❌ DNS 记录更新失败"
    echo "响应: $UPDATE_RESPONSE"
    exit 1
fi
```

设置可执行权限：`chmod +x update-dns.sh`

## 使用示例

```bash
# 新的 FQDN 格式（推荐）
./update-dns.sh home.example.com                    # 使用 Tailscale IP
./update-dns.sh server.example.com 192.168.1.100   # 使用自定义 IP
./update-dns.sh example.com                         # 根域名使用 Tailscale IP

# 旧格式（仍支持）
./update-dns.sh example.com home                    # 子域名使用 Tailscale IP
./update-dns.sh example.com @ 1.2.3.4              # 根域名使用自定义 IP

# 多个子域名
./update-dns.sh web.example.com
./update-dns.sh api.example.com
./update-dns.sh db.example.com 10.0.0.5
```

## Cron 定时任务设置

```bash
# 编辑 crontab
crontab -e

# 每 5 分钟更新一次（Tailscale IP 可能会变化）
*/5 * * * * /path/to/update-dns.sh home.example.com

# 更新多个记录
*/5 * * * * /path/to/update-dns.sh home.example.com
*/5 * * * * /path/to/update-dns.sh server.example.com
```

## 功能特性

- ✅ API token 安全存储在 `.bashrc` 中
- ✅ 自动发现 Zone ID 和 Record ID
- ✅ 支持自定义 IP 或自动检测 Tailscale IP
- ✅ 支持使用 `@` 的根域名更新
- ✅ 输入验证和错误处理
- ✅ 清晰的成功/失败消息
- ✅ 使用帮助和示例

## 替代方案：使用 flarectl

```bash
# 安装
go install github.com/cloudflare/cloudflare-go/cmd/flarectl@latest

# 更新（更简单）
export CF_API_TOKEN="your_token"
flarectl dns update --zone yourdomain.com --name subdomain --content $(tailscale ip -4) --type A
```