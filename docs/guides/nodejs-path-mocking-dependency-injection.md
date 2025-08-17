# Mocking Node.js Path Separators: The Dependency Injection Solution

## The Problem

Node.js path utilities like `path.sep`, `path.join()` are hardcoded to the current platform and readonly - you can't mock them for cross-platform testing:

```javascript
// This fails - path.sep is readonly
path.sep = '\\'; // Error: Cannot redefine property

// This ignores your wishes - always uses current platform
path.join('a', 'b'); // Always 'a/b' on Linux, 'a\\b' on Windows
```

## The Solution

Don't mock the global path - inject platform-specific implementations using `path.win32` and `path.posix`:

```javascript
// Instead of this brittle approach:
function createTempFile(name: string, separator: string) {
  return 'tmp' + separator + name; // Manual string manipulation
}

// Use dependency injection:
function createTempFile(name: string, pathImpl = path) {
  return pathImpl.join('tmp', name);
}

// Now you can test both platforms reliably:
createTempFile('data.json', path.win32)  // → tmp\data.json
createTempFile('data.json', path.posix)  // → tmp/data.json
```

## Why This Works

Node.js provides `path.win32` and `path.posix` as separate implementations. Instead of fighting the platform dependency, embrace it through clean dependency injection. Test Windows logic on Linux, test Unix logic on Windows - no mocking needed.