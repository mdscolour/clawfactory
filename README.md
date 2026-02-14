# ClawFactory

OpenClaw Copy Registry - Share and discover pre-configured OpenClaw copies.

🌐 **Website**: [clawfactory.ai](https://clawfactory.ai) (coming soon)

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
- 📦 One-command installation (placeholder)
- 🚀 Upload your own copies
- 📄 Preview configuration files before installing

## Categories

- 📈 **Trading** - Market and trading focused copies
- 💻 **Development** - Coding and development tools
- ⚡ **Productivity** - Personal productivity systems
- 🤖 **Automation** - Home and workflow automation

## Quick Start

Open `index.html` in your browser:

```bash
# Option 1: Direct file open
open index.html

# Option 2: Local server
python3 -m http.server 8080
# Then open http://localhost:8080
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

- Pure HTML/CSS/JavaScript (MVP)
- No build step required
- Follows ClawHub design patterns
- Responsive dark theme

## Development

```bash
# Install dependencies (optional)
npm install

# Start dev server
npm run dev

# Preview in browser
npm run preview
```

## Roadmap

- [x] Basic browse functionality
- [x] Search and filter
- [x] Memory toggle
- [x] Upload form (MVP)
- [ ] CLI installation command (real implementation)
- [ ] User authentication
- [ ] Copy ratings and reviews
- [ ] Backend for persistent storage
- [ ] Copy versioning
- [ ] Featured copies

## Contributing

1. Fork the repository
2. Create a copy in `examples/`
3. Submit a pull request

## License

MIT
