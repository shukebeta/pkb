import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:logging/logging.dart';

class SeqLogger {
  static const String _defaultSeqUrl = 'http://localhost:5341';
  final String _seqUrl;
  final String? _apiKey;
  final http.Client _httpClient;

  SeqLogger({
    String seqUrl = _defaultSeqUrl,
    String? apiKey,
    http.Client? httpClient,
  }) : _seqUrl = seqUrl,
        _apiKey = apiKey,
        _httpClient = httpClient ?? http.Client();

  static void initialize({
    String seqUrl = _defaultSeqUrl,
    String? apiKey,
    Level logLevel = Level.INFO,
  }) {
    final seqLogger = SeqLogger(seqUrl: seqUrl, apiKey: apiKey);
    
    Logger.root.level = logLevel;
    Logger.root.onRecord.listen((record) {
      seqLogger._sendToSeq(record);
    });
  }

  Future<void> _sendToSeq(LogRecord record) async {
    try {
      final logEvent = _buildLogEvent(record);
      final response = await _httpClient.post(
        Uri.parse('$_seqUrl/api/events/raw'),
        headers: {
          'Content-Type': 'application/json',
          if (_apiKey != null) 'X-Seq-ApiKey': _apiKey!,
        },
        body: jsonEncode(logEvent),
      );

      if (response.statusCode != 201) {
        print('Failed to send log to Seq: ${response.statusCode}');
      }
    } catch (e) {
      print('Error sending log to Seq: $e');
    }
  }

  Map<String, dynamic> _buildLogEvent(LogRecord record) {
    return {
      '@t': record.time.toIso8601String(),
      '@l': _mapLogLevel(record.level),
      '@m': record.message,
      'Logger': record.loggerName,
      'Thread': Platform.currentPid,
      if (record.error != null) 'Exception': record.error.toString(),
      if (record.stackTrace != null) 'StackTrace': record.stackTrace.toString(),
      if (record.zone != null) 'Zone': record.zone.toString(),
    };
  }

  String _mapLogLevel(Level level) {
    if (level >= Level.SEVERE) return 'Error';
    if (level >= Level.WARNING) return 'Warning';
    if (level >= Level.INFO) return 'Information';
    if (level >= Level.CONFIG) return 'Debug';
    return 'Verbose';
  }

  void dispose() {
    _httpClient.close();
  }
}

// Convenience extensions for structured logging
extension StructuredLogging on Logger {
  void infoWithProperties(String message, Map<String, dynamic> properties) {
    info('$message {@Properties}', properties);
  }

  void errorWithProperties(String message, dynamic error, Map<String, dynamic> properties) {
    severe('$message {@Properties}', error, null, properties);
  }

  void debugWithProperties(String message, Map<String, dynamic> properties) {
    fine('$message {@Properties}', properties);
  }
}