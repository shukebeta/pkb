# Immich图片压缩代理：透明节省存储空间

Immich总是存储原始照片/视频，很快就会塞满硬盘。本教程展示如何在上传时自动压缩图片，完全不需要修改Immich本身。

*本方案基于 [JamesCullum](https://gist.github.com/JamesCullum/6604e504318dd326a507108f59ca7dcd) 的出色工作。没有他创新的代理方案，这一切都不可能实现。*

## 工作原理

在上传和Immich服务器之间放一个代理容器：
- 拦截图片上传请求
- 将图片压缩到指定尺寸
- 转发压缩后的图片给Immich
- 对客户端完全透明

## 配置步骤

### 1. 在Docker Compose中添加代理

在你的 `docker-compose.yml` 中添加这个服务：

```yaml
services:
  upload-proxy:
    container_name: upload_proxy
    image: shukebeta/multipart-upload-proxy-with-compression:latest
    environment:
      - IMG_MAX_NARROW_SIDE=1600  # 智能缩放：约束较小维度（推荐）
      - JPEG_QUALITY=85           # JPEG压缩质量 (1-100，平衡文件大小和质量)
      - FORWARD_DESTINATION=http://immich-server:2283/api/assets
      - FILE_UPLOAD_FIELD=assetData
      - LISTEN_PATH=/api/assets
    ports:
      - "6743:6743"
    restart: always
    depends_on:
      - immich-server
```

### 2. 更新Nginx配置

**关键**：简单的路由不会工作，因为代理只处理上传，不处理图片获取。使用这个精确的配置：

```nginx
# 只匹配完全等于 /api/assets 的请求（上传端点）
location = /api/assets {
    # 方法判断：只有 POST 走上传代理
    if ($request_method = POST) {
        proxy_pass http://你的服务器:6743;
        break;  # 关键：防止继续处理其他location
    }
    # 非 POST（例如 GET 列表）走主服务
    proxy_pass http://你的服务器:2283;
}

# /api/assets/xxxxx（带后缀 - 缩略图、原图、ID访问）全部走主服务
location /api/assets/ {
    proxy_pass http://你的服务器:2283;
}

# 其他所有请求
location / {
    proxy_pass http://你的服务器:2283;
}
```

**为什么这个配置是必需的：**
- 代理只处理 `multipart/form-data` 上传
- 图片的GET请求**必须**绕过代理
- `location = /api/assets` 精确匹配上传请求
- `location /api/assets/` 匹配图片获取URL
- `break` 防止nginx处理额外的location块

### 3. 部署更改

```bash
# 停止容器
docker compose down

# 使用新配置启动
docker compose up -d

# 重新加载nginx
nginx -t && nginx -s reload
```

## 缩放策略

### 智能窄边约束（推荐）

新的 `IMG_MAX_NARROW_SIDE` 参数提供更智能的缩放，只约束较小的维度：

```yaml
- IMG_MAX_NARROW_SIDE=1600  # 将较窄的边约束到1600像素
```

**示例：**
- **全景图 (4000×1200)** → **4000×1200** (无变化，窄边已经≤1600)
- **竖图 (1200×3000)** → **1200×3000** (无变化，窄边已经≤1600)
- **方图 (2400×2400)** → **1600×1600** (两边都被约束)

### 传统边界框策略

原有的宽高约束创建一个边界框：

```yaml
- IMG_MAX_WIDTH=1080
- IMG_MAX_HEIGHT=1920
```

### 常用预设

**通用用途（推荐）：**
```yaml
- IMG_MAX_NARROW_SIDE=1600
- JPEG_QUALITY=85
```

**专业高质量：**
```yaml
- IMG_MAX_NARROW_SIDE=2400
- JPEG_QUALITY=90
```

**注意：** 当 `IMG_MAX_NARROW_SIDE` 设置为正值时，优先级高于 `IMG_MAX_WIDTH`/`IMG_MAX_HEIGHT`。

## 验证设置

1. 检查代理运行状态：`docker ps | grep upload_proxy`
2. 通过Immich应用上传大图片
3. 检查存储文件夹 - 图片应该比原图小
4. 验证图片质量符合要求

## 为什么能成功

- **安全性**：所有身份验证信息原样转发
- **兼容性**：使用标准HTTP协议 - 支持任何客户端
- **透明性**：Immich完全不知道发生了压缩

## 故障排除

**上传失败：** 检查nginx路由和代理容器日志
**图片未压缩：** 检查nginx路由配置 - 请求可能绕过了代理
**质量太差：** 提高 `IMG_MAX_WIDTH` 和 `IMG_MAX_HEIGHT` 数值

## 为什么选择代理方案？

Immich开发者已明确拒绝在核心应用中添加压缩功能。这个代理方案是目前唯一可行的存储节省方法，同时保持与所有Immich客户端的完全兼容性。