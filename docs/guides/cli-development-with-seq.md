# CLI Development with Seq Logging

5分钟设置完整的命令行开发调试环境。

## 1. 启动Seq服务器

创建 `docker-compose.yml`:
```yaml
version: '3.8'
services:
  seq:
    image: datalust/seq:latest
    ports:
      - "5341:80"
    environment:
      - ACCEPT_EULA=Y
    volumes:
      - seq-data:/data
    restart: unless-stopped

volumes:
  seq-data:
```

启动服务：
```bash
docker-compose up -d seq
# 访问 http://localhost:5341
```

## 2. C# 项目集成

### 添加包
```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Seq
```

### 配置 Program.cs
```csharp
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.Seq("http://localhost:5341")
    .CreateLogger();

builder.Host.UseSerilog();
// ... 其他配置
```

### 使用示例
```csharp
public class OrderController : ControllerBase
{
    private readonly ILogger<OrderController> _logger;

    [HttpPost]
    public async Task<IActionResult> CreateOrder(Order order)
    {
        _logger.LogInformation("Creating order for user {UserId} with {ItemCount} items", 
            order.UserId, order.Items.Count);
        
        try
        {
            var result = await _orderService.CreateAsync(order);
            _logger.LogInformation("Order {OrderId} created successfully", result.Id);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create order for user {UserId}", order.UserId);
            throw;
        }
    }
}
```

## 3. Flutter 项目集成

### 添加依赖
```yaml
dependencies:
  http: ^1.1.0
  logging: ^1.2.0
```

### 简单日志发送
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:logging/logging.dart';

void main() {
  Logger.root.level = Level.ALL;
  Logger.root.onRecord.listen((record) {
    // 控制台输出
    print('${record.level.name}: ${record.time}: ${record.message}');
    
    // 发送到Seq
    http.post(
      Uri.parse('http://localhost:5341/api/events/raw'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        '@t': record.time.toIso8601String(),
        '@l': record.level.name,
        '@m': record.message,
      }),
    );
  });

  runApp(MyApp());
}
```

## 4. CLI 调试技巧

### 替代断点调试
```csharp
// 记录变量状态
_logger.LogDebug("Processing user {@User} with settings {@Settings}", user, settings);

// 性能监控
var sw = Stopwatch.StartNew();
await DoWork();
_logger.LogInformation("Work completed in {ElapsedMs}ms", sw.ElapsedMilliseconds);

// 条件日志
if (order.Total > 1000)
    _logger.LogWarning("High value order {OrderId}: {Total}", order.Id, order.Total);
```

### Seq 查询技巧
- 搜索: `UserId = 123`
- 时间范围: 最近1小时
- 级别过滤: Warning以上
- 属性查看: 展开 `@Properties`

## 5. 开发命令

```bash
# 热重载开发
dotnet watch run

# Flutter热重载
flutter run

# 查看Seq日志
open http://localhost:5341

# 停止服务
docker-compose down
```

就这些。无需GUI调试器，Seq提供了更丰富的运行时洞察。