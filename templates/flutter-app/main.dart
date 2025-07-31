import 'package:flutter/material.dart';
import 'package:logging/logging.dart';
import 'seq_logger.dart';

void main() {
  // Initialize Seq logging
  SeqLogger.initialize(
    seqUrl: 'http://localhost:5341',
    logLevel: Level.ALL,
  );

  final logger = Logger('App');
  logger.info('Application starting');

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  final Logger _logger = Logger('MyApp');

  MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    _logger.info('Building MyApp widget');
    
    return MaterialApp(
      title: 'Flutter Seq Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Seq Logging Demo'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final Logger _logger = Logger('MyHomePage');
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
    
    // Example structured logging
    _logger.infoWithProperties(
      'Counter incremented',
      {
        'Counter': _counter,
        'Timestamp': DateTime.now().toIso8601String(),
        'UserId': 'demo-user',
      }
    );

    // Log different levels based on counter
    if (_counter % 5 == 0) {
      _logger.warning('Counter reached multiple of 5: $_counter');
    }
    
    if (_counter > 10) {
      _logger.errorWithProperties(
        'Counter exceeded threshold',
        'High counter value',
        {
          'Counter': _counter,
          'Threshold': 10,
          'Action': 'user_notification_required',
        }
      );
    }
  }

  @override
  void initState() {
    super.initState();
    _logger.info('MyHomePage initialized');
  }

  @override
  void dispose() {
    _logger.info('MyHomePage disposing');
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    _logger.fine('Building MyHomePage with counter: $_counter');
    
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                _logger.debugWithProperties(
                  'Test button pressed',
                  {
                    'ButtonType': 'test',
                    'Screen': 'home',
                  }
                );
                
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Check Seq logs!')),
                );
              },
              child: const Text('Test Logging'),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}