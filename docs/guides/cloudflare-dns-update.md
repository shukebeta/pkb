# Improved Cloudflare DNS Update Script

## Get API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use "Edit zone DNS" template
4. Select your domain in "Zone Resources"
5. Copy the generated token

## Setup API Token in bashrc

Add to `~/.bashrc`:

```bash
export CF_API_TOKEN="your_api_token_here"
```

Reload: `source ~/.bashrc`

## Enhanced Update Script

Create `update-dns.sh`:

```bash
#!/bin/bash

# Usage function
usage() {
    echo "Usage: $0 <record_name> [ip_address]"
    echo "       $0 <domain> <subdomain> [ip_address]"
    echo "Examples:"
    echo "  $0 home.example.com                    # Uses Tailscale IP"
    echo "  $0 example.com                         # Root domain with Tailscale IP"
    echo "  $0 server.example.com 192.168.1.100   # Uses specified IP"
    echo "  $0 example.com home                    # Legacy format"
    echo "  $0 example.com @ 1.2.3.4              # Legacy root domain"
    exit 1
}

# Check parameters
if [ $# -lt 1 ]; then
    usage
fi

# Check if API token is set
if [ -z "$CF_API_TOKEN" ]; then
    echo "Error: CF_API_TOKEN not set. Add it to ~/.bashrc"
    exit 1
fi

# Parse arguments - detect format
FIRST_ARG="$1"
SECOND_ARG="$2"
THIRD_ARG="$3"

# Check if first argument contains multiple dots (FQDN format)
if [[ "$FIRST_ARG" == *.*.* ]] || ([[ "$FIRST_ARG" == *.* ]] && [[ "$SECOND_ARG" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]); then
    # FQDN format: script.sh home.example.com [ip]
    RECORD_NAME="$FIRST_ARG"
    CUSTOM_IP="$SECOND_ARG"
    
    # Extract domain by removing first subdomain part
    DOMAIN=$(echo "$RECORD_NAME" | cut -d'.' -f2-)
elif [[ "$FIRST_ARG" == *.* ]] && [ -z "$SECOND_ARG" ]; then
    # Root domain format: script.sh example.com
    RECORD_NAME="$FIRST_ARG"
    DOMAIN="$FIRST_ARG"
    CUSTOM_IP=""
elif [[ "$FIRST_ARG" == *.* ]] && [ -n "$SECOND_ARG" ] && [[ ! "$SECOND_ARG" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    # Legacy format: script.sh example.com home [ip]
    DOMAIN="$FIRST_ARG"
    SUBDOMAIN="$SECOND_ARG"
    CUSTOM_IP="$THIRD_ARG"
    
    if [ "$SUBDOMAIN" = "@" ]; then
        RECORD_NAME="$DOMAIN"
    else
        RECORD_NAME="$SUBDOMAIN.$DOMAIN"
    fi
else
    echo "Error: Invalid arguments format"
    usage
fi

# Get IP address
if [ -n "$CUSTOM_IP" ]; then
    NEW_IP="$CUSTOM_IP"
    echo "Using provided IP: $NEW_IP"
else
    if command -v tailscale >/dev/null 2>&1; then
        NEW_IP=$(tailscale ip -4)
        echo "Using Tailscale IP: $NEW_IP"
    else
        echo "Error: tailscale not found and no IP provided"
        exit 1
    fi
fi

# Validate IP format
if ! echo "$NEW_IP" | grep -E '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$' >/dev/null; then
    echo "Error: Invalid IP address format: $NEW_IP"
    exit 1
fi

echo "Updating DNS record: $RECORD_NAME -> $NEW_IP"

# Get Zone ID
echo "Getting Zone ID for $DOMAIN..."
ZONE_RESPONSE=$(curl -s -H "Authorization: Bearer $CF_API_TOKEN" \
    "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN")

ZONE_ID=$(echo "$ZONE_RESPONSE" | jq -r '.result[0].id')

if [ "$ZONE_ID" = "null" ] || [ -z "$ZONE_ID" ]; then
    echo "Error: Could not find zone for domain $DOMAIN"
    echo "Response: $ZONE_RESPONSE"
    exit 1
fi

echo "Zone ID: $ZONE_ID"

# Get Record ID
echo "Getting Record ID for $RECORD_NAME..."
RECORD_RESPONSE=$(curl -s -H "Authorization: Bearer $CF_API_TOKEN" \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=$RECORD_NAME&type=A")

RECORD_ID=$(echo "$RECORD_RESPONSE" | jq -r '.result[0].id')

if [ "$RECORD_ID" = "null" ] || [ -z "$RECORD_ID" ]; then
    echo "Error: Could not find A record for $RECORD_NAME"
    echo "Available records:"
    echo "$RECORD_RESPONSE" | jq -r '.result[] | "\(.name) (\(.type))"'
    exit 1
fi

echo "Record ID: $RECORD_ID"

# Update DNS record
echo "Updating DNS record..."
UPDATE_RESPONSE=$(curl -s -X PUT \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "{\"type\":\"A\",\"name\":\"$RECORD_NAME\",\"content\":\"$NEW_IP\"}")

SUCCESS=$(echo "$UPDATE_RESPONSE" | jq -r '.success')

if [ "$SUCCESS" = "true" ]; then
    echo "✅ DNS record updated successfully!"
    echo "   $RECORD_NAME now points to $NEW_IP"
else
    echo "❌ Failed to update DNS record"
    echo "Response: $UPDATE_RESPONSE"
    exit 1
fi
```

Make executable: `chmod +x update-dns.sh`

## Usage Examples

```bash
# New FQDN format (recommended)
./update-dns.sh home.example.com                    # Uses Tailscale IP
./update-dns.sh server.example.com 192.168.1.100   # Uses custom IP
./update-dns.sh example.com                         # Root domain with Tailscale IP

# Legacy format (still supported)
./update-dns.sh example.com home                    # Subdomain with Tailscale IP
./update-dns.sh example.com @ 1.2.3.4              # Root domain with custom IP

# Multiple subdomains
./update-dns.sh web.example.com
./update-dns.sh api.example.com
./update-dns.sh db.example.com 10.0.0.5
```

## Cron Job Setup

```bash
# Edit crontab
crontab -e

# Update every 5 minutes (Tailscale IP might change)
*/5 * * * * /path/to/update-dns.sh home.example.com

# Update multiple records
*/5 * * * * /path/to/update-dns.sh home.example.com
*/5 * * * * /path/to/update-dns.sh server.example.com
```

## Features

- ✅ API token stored securely in `.bashrc`
- ✅ Auto-discovers Zone ID and Record ID
- ✅ Supports custom IP or auto-detects Tailscale IP
- ✅ Supports root domain updates with `@`
- ✅ Input validation and error handling
- ✅ Clear success/failure messages
- ✅ Usage help and examples

## Alternative: Using flarectl

```bash
# Install
go install github.com/cloudflare/cloudflare-go/cmd/flarectl@latest

# Update (simpler)
export CF_API_TOKEN="your_token"
flarectl dns update --zone yourdomain.com --name subdomain --content $(tailscale ip -4) --type A
```