# ClawFactory Backend Server

Self-hosted backend for ClawFactory - OpenClaw Copy Registry.

## Features

- 📦 **Copy Storage** - Store and retrieve OpenClaw copies
- ⭐ **Ratings & Comments** - Community feedback system
- 📊 **Install Tracking** - Track copy installations
- 🔍 **Search & Categories** - Find copies easily
- 🛒 **Marketplace** - Publish and discover copies
- 🔄 **Cloud Sync** - Sync across devices
- ⚡ **Real-time Updates** - WebSocket live updates

## Quick Start

### Option 1: Direct Node.js

```bash
# Install dependencies
cd backend
npm install

# Start server (uses ./data directory)
npm start

# With custom settings
PORT=8080 DATA_DIR=/path/to/data npm start
```

### Option 2: Docker

```bash
# Build
docker build -t clawfactory-backend .

# Run
docker run -p 3000:3000 -v ./data:/app/data clawfactory-backend
```

### Option 3: Docker Compose

```bash
docker-compose up -d
```

## Testing

```bash
# Run tests
npm test
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | HTTP server port |
| WS_PORT | 3001 | WebSocket port |
| DATA_DIR | ./data | SQLite database directory |

## API Endpoints

### Health
```http
GET /health
```

### Authentication
```http
POST /api/auth/register  - Register {username, email?}
POST /api/auth/login    - Login {username}
GET  /api/auth/me       - Get user info (Header: Authorization: Bearer <token>)
```

### Copies
```http
GET  /api/copies          # List all copies
GET  /api/copies/:id      # Get single copy
POST /api/copies          # Create copy
POST /api/copies/:id/rate # Rate copy (1-5)
POST /api/copies/:id/star # Star/unstar copy
POST /api/copies/:id/fork # Fork a copy
POST /api/copies/:id/install   # Track install
```

### Stars & Forks
```http
GET /api/copies/:id/stars     # Get star count & status
GET /api/copies/:id/forks     # Get forks of a copy
GET /api/users/:id/stars      # Get user's starred copies
GET /api/users/:id/forks      # Get user's forks
```

### Version Control (Simple)
```http
POST /api/copies/:id/versions  # Save new version (auto on upload)
GET  /api/copies/:id/versions  # Get version history
```
```

### Marketplace
```http
GET  /api/marketplace           # Browse (sort=popular|rating|recent)
POST /api/marketplace/publish   # Publish {copy_id, user_id}
POST /api/marketplace/unpublish # Unpublish {copy_id, user_id}
```

### Search
```http
GET /api/search?q=        # Search copies
GET /api/categories       # List categories
GET /api/featured         # Featured copies
```

### Backup
```http
GET  /api/export  # Export all data (JSON)
POST /api/import  # Import data
```

## WebSocket (Real-time)

```javascript
const ws = new WebSocket('ws://localhost:3001');

// Events: copy_update, rating_update, new_comment
ws.onmessage = (event) => {
  const { event, data } = JSON.parse(event.data);
  console.log('Update:', event, data);
};
```

## Frontend Integration

Edit `config.js` to enable backend mode:

```javascript
window.CLAWFACTORY_CONFIG = {
  API_URL: 'http://localhost:3000',
  FEATURES: {
    useBackend: true,
    enableSync: true,
    enableRatings: true,
    enableComments: true
  }
};
```

## Deployment

### Railway (Recommended)
1. Connect GitHub repo
2. Set `PORT` in Railway dashboard
3. Deploy

### Render
1. Connect GitHub repo
2. Build: `cd backend && npm install`
3. Start: `cd backend && npm start`
4. Set `PORT` variable

### Fly.io
```bash
fly launch
fly deploy
```

## Database

- Location: `./data/clawfactory.db`
- Docker: `/app/data/clawfactory.db`

## Security ⚠️

For production:
- Use HTTPS reverse proxy (Caddy/Traefik)
- Add JWT authentication
- Implement rate limiting
- Validate all inputs
