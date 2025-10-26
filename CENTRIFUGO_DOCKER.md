# Centrifugo Docker Setup

## Quick Start

### Start Centrifugo Only
```bash
docker-compose -f docker-compose.centrifugo.yml up -d
```

### Start All Services (Centrifugo + OpenSearch)
```bash
docker-compose up -d
```

### Stop Services
```bash
# Stop Centrifugo only
docker-compose -f docker-compose.centrifugo.yml down

# Stop all services
docker-compose down
```

## Access Points

- **Centrifugo Admin UI**: http://localhost:8000
- **Centrifugo WebSocket**: ws://localhost:8000/connection/websocket
- **Centrifugo API**: http://localhost:8000/api
- **OpenSearch**: http://localhost:9200
- **OpenSearch Dashboards**: http://localhost:5601

## Useful Commands

### View Logs
```bash
# Centrifugo logs
docker logs -f worklab-centrifugo

# All services logs
docker-compose logs -f
```

### Check Status
```bash
docker-compose ps
```

### Restart Centrifugo
```bash
docker-compose restart centrifugo
```

### Health Check
```bash
curl http://localhost:8000/health
```

## Configuration

Centrifugo configuration is in `centrifugo.json`:
- **API Key**: `worklab_centrifugo_api_key_2024`
- **Secret Key**: `worklab_centrifugo_secret_key_2024`
- **Admin UI**: Enabled (insecure mode for development)

## Troubleshooting

### Port Already in Use
If port 8000 is already in use:
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or stop any running Centrifugo
pkill centrifugo
```

### Check Container Status
```bash
docker ps -a | grep centrifugo
```

### Remove and Recreate
```bash
docker-compose down
docker-compose up -d --force-recreate
```

### View Real-time Stats
Open browser: http://localhost:8000
- See connected clients
- See active subscriptions
- Monitor messages in real-time
