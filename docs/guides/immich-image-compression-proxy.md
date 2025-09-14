# Immich Image Compression Proxy: Save Storage Space Transparently

Immich always stores original photos/videos, which quickly fills up your disk. This guide shows how to automatically compress images during upload without modifying Immich itself.

*This solution is based on the excellent work by [JamesCullum](https://gist.github.com/JamesCullum/6604e504318dd326a507108f59ca7dcd). Without his innovative proxy approach, this wouldn't be possible.*

## How It Works

A proxy container sits between uploads and Immich server:
- Intercepts image uploads
- Resizes images to specified dimensions  
- Forwards compressed images to Immich
- Completely transparent to clients

## Setup

### 1. Add Proxy to Docker Compose

Add this service to your `docker-compose.yml`:

```yaml
services:
  upload-proxy:
    container_name: upload_proxy
    image: shukebeta/multipart-upload-proxy-with-compression:latest
    environment:
      - IMG_MAX_NARROW_SIDE=1600  # Smart resize: constrains the smaller dimension (recommended)
      - JPEG_QUALITY=85           # JPEG compression quality (1-100, balances size and quality)
      - FORWARD_DESTINATION=http://immich-server:2283/api/assets
      - FILE_UPLOAD_FIELD=assetData
      - LISTEN_PATH=/api/assets
    ports:
      - "6743:6743"
    restart: always
    depends_on:
      - immich-server
```

### 2. Update Nginx Configuration

**Critical:** Simple routing doesn't work because the proxy only handles uploads, not image retrieval. Use this precise configuration:

```nginx
# Only match exactly /api/assets (upload endpoint)
location = /api/assets {
    # Method check: only POST goes to upload proxy
    if ($request_method = POST) {
        proxy_pass http://your-server:6743;
        break;  # Critical: prevents fallthrough
    }
    # Non-POST (like GET lists) go to main service
    proxy_pass http://your-server:2283;
}

# /api/assets/xxxxx (with suffix - thumbnails, full images, ID access) all go to main service
location /api/assets/ {
    proxy_pass http://your-server:2283;
}

# Everything else
location / {
    proxy_pass http://your-server:2283;
}
```

**Why this configuration is essential:**
- Proxy only processes `multipart/form-data` uploads
- GET requests for images **must** bypass the proxy
- `location = /api/assets` matches uploads exactly  
- `location /api/assets/` matches image retrieval URLs
- `break` prevents nginx from processing additional location blocks

### 3. Deploy Changes

```bash
# Stop containers
docker compose down

# Start with new configuration
docker compose up -d

# Reload nginx
nginx -t && nginx -s reload
```

## Resize Strategies

### Smart Narrow-Side Constraint (Recommended)

The new `IMG_MAX_NARROW_SIDE` parameter provides more intelligent resizing by constraining only the smaller dimension:

```yaml
- IMG_MAX_NARROW_SIDE=1600  # Constrains the narrower side to 1600px
```

**Examples:**
- **Panorama (4000×1200)** → **4000×1200** (no change, narrow side already ≤1600)
- **Portrait (1200×3000)** → **1200×3000** (no change, narrow side already ≤1600)
- **Square (2400×2400)** → **1600×1600** (both sides constrained)

### Legacy Bounding Box Strategy

The original width/height constraints create a bounding box:

```yaml
- IMG_MAX_WIDTH=1080
- IMG_MAX_HEIGHT=1920
```

### Common Presets

**General purpose (recommended):**
```yaml
- IMG_MAX_NARROW_SIDE=1600
- JPEG_QUALITY=85
```

**High quality for professionals:**
```yaml
- IMG_MAX_NARROW_SIDE=2400  
- JPEG_QUALITY=90
```

**Note:** `IMG_MAX_NARROW_SIDE` takes priority over `IMG_MAX_WIDTH`/`IMG_MAX_HEIGHT` when set to a positive value.

## Verification

1. Check proxy is running: `docker ps | grep upload_proxy`
2. Upload a large image through your Immich app
3. Check storage folder - image should be smaller than original
4. Verify image quality meets your standards

## Why This Works

- **Security**: All authentication headers pass through untouched
- **Compatibility**: Uses standard HTTP - works with any client
- **Transparency**: Immich doesn't know compression happened

## Troubleshooting

**Uploads fail:** Check nginx routing and proxy container logs
**Images not compressed:** Check nginx routing - requests may be bypassing the proxy
**Poor quality:** Increase `IMG_MAX_WIDTH` and `IMG_MAX_HEIGHT` values

## Why This Proxy Approach?

Immich developers have explicitly rejected adding compression features to the core application. This proxy solution is currently the only practical way to reduce storage usage while maintaining full compatibility with all Immich clients.