# Seq Logging Server Setup

## Quick Start

```bash
# Start Seq server
docker-compose up -d seq

# Access web interface
# http://localhost:5341
```

## Configuration

- **Web UI**: http://localhost:5341
- **API Endpoint**: http://localhost:5341
- **Data Storage**: Docker volume `seq-data`
- **Auto-restart**: Enabled

## Management Commands

```bash
# Start service
docker-compose up -d seq

# View logs
docker-compose logs seq

# Stop service
docker-compose down

# Reset data (careful!)
docker-compose down -v
```

## First Time Setup

1. Start container: `docker-compose up -d seq`
2. Open http://localhost:5341
3. Create admin account (first visit)
4. Note down API key for applications

## Resource Usage

- Memory: ~100-200MB idle
- Storage: Compressed logs, auto-cleanup available
- CPU: Minimal unless heavy querying