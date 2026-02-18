# ClawFactory

OpenClaw Copy Registry - Share and discover pre-configured OpenClaw copies.

🌐 **Website**: [clawfactory.ai](https://clawfactory.ai)

## Overview

ClawFactory is a registry for sharing **copies** - integrated OpenClaw configurations that bundle:
- Skills (SKILL.md + supporting files)
- Workspace configuration
- SOUL.md, AGENTS.md, HEARTBEAT.md files
- Optional long-term memory

## Features

- 📋 Browse available copies with categories
- 🔍 Search by name, description, or skills
- 🧠 Memory toggle - filter copies with/without long-term memory
- 📦 One-command installation via CLI
- 🚀 Upload your own copies
- 👤 User profiles with dedicated copy pages (`/{username}/{copy-slug}`)
- 🔐 User authentication (local + Google OAuth ready)

## Categories

- 💰 **Financial** - Trading and market focused
- 🎨 **Frontend Dev** - Frontend development
- ⚙️ **Backend Dev** - Backend development
- 🚀 **Productivity** - Personal productivity
- ✍️ **Content** - Content creation
- 🔬 **Research** - Academic research
- And more...

## Quick Start

### Web Interface

Visit [clawfactory.ai](https://clawfactory.ai)

### CLI Installation

```bash
# Via npm (recommended)
npm install -g clawfactory

# Commands
clawfactory search <query>  # Search copies
clawfactory install <id>    # Install a copy
clawfactory copy <id>       # Alias for install
clawfactory hottest          # Install top-rated copy
clawfactory mine            # List your copies
clawfactory mine --private  # List your private copies
clawfactory upload          # Upload a copy (requires token)
clawfactory secret upload   # Upload with .env secrets
clawfactory secret install <id> <key>  # Install encrypted copy
```

### Authentication (Token-Based)

Get your token from [clawfactory.ai](https://clawfactory.ai):

```bash
# Option 1: Set environment variable
export CLAWFACTORY_TOKEN=your-token-here

# Option 2: Save to file
echo your-token-here > ~/.clawfactory/token

# Option 3: Pass token directly
clawfactory upload TOKEN=your-token-here
```

### Upload a Copy

```bash
# Interactive upload
clawfactory upload TOKEN=your-token

# Or with token saved
clawfactory upload

# You'll be prompted for:
# - Copy ID name (auto-generated from display name)
# - Display name
# - Description
# - Author
# - Category (financial/frontend-dev/backend-dev/pm/...)
# - Skills (comma-separated)
# - Tags (comma-separated)
# - Model (optional)
# - Private? (y/n)
# - Version (auto or custom)

### Local Development

```bash
# Backend
cd backend
npm install
node server.js

# Frontend (in another terminal)
cd ..
# Open index.html in browser or serve locally
python3 -m http.server 8080
```

## API Endpoints

```bash
# Copies
GET  /api/copies                    # List all public copies
GET  /api/copies/:id                # Get copy details
GET  /api/featured                  # Featured copies
GET  /api/search?q=...              # Search copies
GET  /api/categories                # List categories
GET  /api/recommendations           # AI-powered recommendations

# Users
GET  /api/users/:username           # User profile with copies
GET  /api/users/:username/:copySlug # User copy page
GET  /api/auth/me                   # Current user info (requires auth)

# Authentication
POST /api/auth/register             # Register
POST /api/auth/login               # Login

# Copy Operations (require auth token)
POST /api/copies                   # Create/update copy
POST /api/copies/:id/install       # Track installation
POST /api/copies/:id/rate          # Rate a copy

# Collaborative Features
GET  /api/copies/:id/contributors  # List contributors
GET  /api/copies/:id/changes       # Change history
POST /api/copies/:id/change        # Record a change
POST /api/copies/:id/comment       # Add comment
GET  /api/copies/:id/comments       # Get comments
```

### API Authentication

Include token in Authorization header:

```bash
curl -H "Authorization: Bearer your-token" https://clawfactory.ai/api/auth/me
```

## Copy Structure

A copy is defined as a JSON object matching `copy.schema.json`:

```json
{
  "id": "unique-copy-id",
  "name": "Human Readable Name",
  "description": "Brief description",
  "hasMemory": true,
  "author": "Author Name",
  "version": "1.0.0",
  "category": "trading",
  "skills": ["skill1", "skill2"],
  "installCommand": "clawfactory install copy-id",
  "features": ["Feature 1", "Feature 2"],
  "preview": {
    "SOUL.md": "Brief preview content...",
    "AGENTS.md": "..."
  }
}
```

## Project Structure

```
clawfactory/
├── index.html          # Main page
├── styles.css          # Dark theme styles
├── app.js              # Frontend logic
├── copy.schema.json    # JSON Schema for copy validation
├── package.json        # NPM config
├── README.md           # This file
└── examples/           # Example copy files
    └── polymarket-trader.json
```

## Tech Stack

- **Backend**: Node.js + sql.js (WebAssembly SQLite)
- **Frontend**: Pure HTML/CSS/JavaScript
- **Deployment**: Railway
- **API**: REST + WebSocket

## Project Structure

```
clawfactory/
├── index.html          # Main page (SPA)
├── styles.css           # Light/dark theme
├── app.js               # Frontend SPA logic
├── api.js               # API client
├── cli.js               # CLI tool
├── copy.schema.json     # JSON Schema
├── package.json         # NPM + CLI config
├── README.md            # This file
├── install.sh           # Shell install script
├── backend/
│   ├── server.js        # API server
│   └── data/            # SQLite database
```

## Development

```bash
# Backend development
cd backend
npm install
node server.js

# Frontend (in another terminal)
cd ..
python3 -m http.server 8080
# Open http://localhost:8080
```

## Roadmap

### Completed ✅
- [x] Basic browse functionality
- [x] Search and filter
- [x] Memory toggle
- [x] Upload form
- [x] CLI installation
- [x] User authentication
- [x] Backend persistence
- [x] Copy versioning
- [x] Featured copies
- [x] User pages (`/{username}/{copy-slug}`)

### In Progress
- [ ] Google OAuth
- [ ] Copy ratings
- [ ] Social features

## Contributing

1. Fork the repository
2. Create/update copies via CLI or web
3. Submit a pull request

## License

MIT
