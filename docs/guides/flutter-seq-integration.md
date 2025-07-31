# Flutter Seq Integration

## Setup

1. Add dependencies to `pubspec.yaml`:
```yaml
dependencies:
  http: ^1.1.0
  logging: ^1.2.0
```

2. Copy `seq_logger.dart` to your `lib/` directory

3. Initialize in `main()`:
```dart
import 'seq_logger.dart';

void main() {
  SeqLogger.initialize(
    seqUrl: 'http://localhost:5341',
    logLevel: Level.ALL,
  );
  runApp(MyApp());
}
```

## Usage Examples

### Basic Logging
```dart
final logger = Logger('MyWidget');

logger.info('User action performed');
logger.warning('Validation failed');
logger.severe('Network error', error);
```

### Structured Logging
```dart
// With properties
logger.infoWithProperties(
  'User login successful',
  {
    'UserId': user.id,
    'LoginMethod': 'email',
    'Timestamp': DateTime.now().toIso8601String(),
  }
);

// Error with context
logger.errorWithProperties(
  'API call failed',
  error,
  {
    'Endpoint': '/api/users',
    'StatusCode': response.statusCode,
    'RetryCount': 3,
  }
);
```

### Performance Tracking
```dart
final stopwatch = Stopwatch()..start();
await performOperation();
logger.infoWithProperties(
  'Operation completed',
  {
    'Operation': 'data_sync',
    'ElapsedMs': stopwatch.elapsedMilliseconds,
    'RecordCount': records.length,
  }
);
```

## Development Workflow

```bash
# Start Seq server
docker-compose up -d seq

# Run Flutter app
flutter run

# View logs at http://localhost:5341
```

## Log Levels Mapping

- `Level.SEVERE` → Error
- `Level.WARNING` → Warning  
- `Level.INFO` → Information
- `Level.CONFIG` → Debug
- `Level.FINE` → Verbose

## Best Practices

1. Use structured properties instead of string interpolation
2. Include correlation IDs for request tracing
3. Log user actions with context
4. Track performance metrics
5. Use appropriate log levels