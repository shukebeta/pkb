# CLI C# Development Workflow

## Quick Project Setup

```bash
# Create new project from template
./templates/csharp-api/create-project.sh MyApi
cd MyApi

# Start Seq logging server (if not running)
docker-compose up -d seq

# Build and run
dotnet restore
dotnet run
```

## Development Commands

```bash
# Hot reload development
dotnet watch run

# Build only
dotnet build

# Run tests
dotnet test

# Publish release
dotnet publish -c Release
```

## Debugging with Seq

### Structured Logging Examples

```csharp
// Simple logging
_logger.LogInformation("User {UserId} performed action {Action}", userId, action);

// With timing
using (_logger.BeginScope("Processing order {OrderId}", orderId))
{
    var stopwatch = Stopwatch.StartNew();
    // ... processing logic
    _logger.LogInformation("Order processed in {ElapsedMs}ms", stopwatch.ElapsedMilliseconds);
}

// Error with context
try
{
    // risky operation
}
catch (Exception ex)
{
    _logger.LogError(ex, "Failed to process {ItemType} with ID {ItemId}", "Order", orderId);
    throw;
}
```

### Debugging Variables

```csharp
// Log complex objects
_logger.LogDebug("Request received: {@Request}", request);

// Performance tracking
var timer = Stopwatch.StartNew();
var result = await SomeOperation();
_logger.LogInformation("Operation completed in {ElapsedMs}ms with result {@Result}", 
    timer.ElapsedMilliseconds, result);
```

## Seq Web Interface

- **URL**: http://localhost:5341
- **Search**: Use properties like `UserId = 123`
- **Filter**: Level, time range, source context
- **Dashboards**: Create custom views for monitoring

## CLI Debugging Tips

1. **Use structured properties** instead of string concatenation
2. **Add correlation IDs** for request tracing
3. **Log entry/exit points** for complex methods
4. **Include timing information** for performance analysis
5. **Log variable states** at decision points