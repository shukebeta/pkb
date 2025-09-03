# CLI Development with Seq Logging

5-minute setup for complete command-line development debugging environment.

## 1. Start Seq Server

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  seq:
    image: datalust/seq:latest
    ports:
      - "5341:80"
    environment:
      - ACCEPT_EULA=Y
      - SEQ_PASSWORD=dev123
    volumes:
      - seq-data:/data
    restart: unless-stopped

volumes:
  seq-data:
```

Start services:
```bash
docker-compose up -d seq
# Access http://localhost:5341
# Username: admin, Password: dev123
```

## 2. C# Project Integration

### Serilog Approach
```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Seq
```

**Method 1: Code Configuration**
```csharp
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.Seq("http://localhost:5341")
    .CreateLogger();

builder.Host.UseSerilog();
// ... other configurations
```

**Method 2: appsettings.json Configuration**
```json
{
  "Serilog": {
    "WriteTo": [
      { "Name": "Console" },
      {
        "Name": "Seq",
        "Args": {
          "serverUrl": "http://localhost:5341",
          "apiKey": ""
        }
      }
    ],
    "Enrich": ["FromLogContext"],
    "Properties": {
      "Environment": "Development"
    }
  }
}
```

```csharp
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Host.UseSerilog();
// ... other configurations
```

### NLog Approach
```bash
dotnet add package NLog.Web.AspNetCore
dotnet add package NLog.Targets.Seq
```

**Method 1: Hardcoded Configuration**
```xml
<?xml version="1.0" encoding="utf-8" ?>
<nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <targets>
    <target xsi:type="Console" name="console" />
    <target xsi:type="Seq" name="seq" serverUrl="http://localhost:5341" />
  </targets>
  <rules>
    <logger name="*" minlevel="Info" writeTo="console,seq" />
  </rules>
</nlog>
```

**Method 2: Configuration from appsettings**
```xml
<?xml version="1.0" encoding="utf-8" ?>
<nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <targets>
    <target xsi:type="Console" name="console" />
    <target xsi:type="Seq" name="seq" 
            serverUrl="${configsetting:name=Logging.Seq.ServerUrl}" 
            apiKey="${configsetting:name=Logging.Seq.ApiKey}" />
  </targets>
  <rules>
    <logger name="*" minlevel="Info" writeTo="console,seq" />
  </rules>
</nlog>
```

```json
// appsettings.json
{
  "Logging": {
    "Seq": {
      "ServerUrl": "http://localhost:5341",
      "ApiKey": ""
    }
  }
}

// appsettings.Production.json
{
  "Logging": {
    "Seq": {
      "ServerUrl": "http://prod-seq:5341",
      "ApiKey": "prod-api-key"
    }
  }
}
```

```csharp
using NLog.Web;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseNLog();
// ... other configurations
```

### Usage Example (Common to Both Approaches)
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

### NLog Structured Logging
```csharp
// Use NLog native API for more control
private static readonly NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

// Structured logging
logger.Info("User {userId} performed {action} at {timestamp}", 
    user.Id, "login", DateTime.UtcNow);

// Scope context
using (NLog.ScopeContext.PushProperty("OrderId", orderId))
{
    logger.Info("Processing started");
    // Processing logic
    logger.Info("Processing completed");
}
```

## 3. Flutter Project Integration

### Add Dependencies
```yaml
dependencies:
  http: ^1.1.0
  logging: ^1.2.0
```

### Simple Log Sending
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:logging/logging.dart';

void main() {
  Logger.root.level = Level.ALL;
  Logger.root.onRecord.listen((record) {
    // Console output
    print('${record.level.name}: ${record.time}: ${record.message}');
    
    // Send to Seq
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

## 4. CLI Debugging Tips

### Alternative to Breakpoint Debugging
```csharp
// Log variable states
_logger.LogDebug("Processing user {@User} with settings {@Settings}", user, settings);

// Performance monitoring
var sw = Stopwatch.StartNew();
await DoWork();
_logger.LogInformation("Work completed in {ElapsedMs}ms", sw.ElapsedMilliseconds);

// Conditional logging
if (order.Total > 1000)
    _logger.LogWarning("High value order {OrderId}: {Total}", order.Id, order.Total);
```

### Seq Query Tips
- Search: `UserId = 123`
- Time range: Last 1 hour
- Level filter: Warning and above
- Property view: Expand `@Properties`

## 5. Development Commands

```bash
# Hot reload development
dotnet watch run

# Flutter hot reload
flutter run

# View Seq logs
open http://localhost:5341

# Stop services
docker-compose down
```

That's it. No need for GUI debugger - Seq provides richer runtime insights.