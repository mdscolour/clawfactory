# ClawFactory Progress Checklist

## 📋 To-Do List (Prioritized)

### High Priority
- [x] Add "Copy" page - show uploaded copies (needs localStorage or file-based persistence)
- [x] Add copy search by tags
- [x] Implement real CLI installation command generation (shell script template)

### Medium Priority
- [x] Add copy rating system (stars)
- [x] Add "Featured Copies" section on homepage
- [x] Implement copy version history
- [x] Add copy author profile page
- [x] Add social sharing (copy link)

### Low Priority ✅ ALL COMPLETED
- [x] Add copy comments/discussions
- [x] Implement copy forking
- [x] Add copy analytics (view count, install count)
- [x] Dark/Light theme toggle
- [x] **CLI Tools** - install.sh, uninstall.sh, cli.js
- [x] **NPM Package** - clawfactory@1.0.0 published

### ✅ COMPLETED (Just Now!)
- [x] **NPM Package Published!** - clawfactory@1.0.0

### Not Implemented
- [x] **Homebrew** - Skipped (requires separate tap repo, npm is sufficient)

### Future Ideas
- [ ] AI-powered copy recommendations
- [x] Copy comparison tool
- [x] Bulk import/export
- [x] Integration with GitHub repos
- [ ] Collaborative copy editing
- [x] **Private copies** (🔒 Owner-only visibility)
- [x] **Star system** (⭐ Star/unstar copies)
- [x] **Forking** (🍴 Fork copies with history)
- [x] **Version control** (📜 Save versions on upload, simple list only)
- [x] **Auto-fork** (🔄 Logged-in users auto-fork on install)
- [x] **Auto-version** (📝 Upload auto-creates new version)
- [x] **Category system** (📁 12 presets + custom)
- [x] **Complete Snapshot** (📦 files + memory restoration)
- [x] **AI API Page** (🤖 API docs for AI agents)

## 🚀 Development Phases

### Phase 1: MVP (Done ✓)

### Phase 2: Persistence (Done ✓)

### Phase 3: Real CLI Integration (Done ✓)

### Phase 4: Community Features (Done ✓)

### Phase 5: Backend (Done ✓)
- ✅ Self-hosted SQLite backend server
- ✅ Frontend API client with sync support
- ✅ User authentication (register, login, logout)
- ✅ Cloud sync page (download/upload)
- ✅ Copy marketplace (publish/browse API + page)
- ✅ Real-time sync (WebSocket events)
- ✅ Private copies (🔒 Owner-only visibility)
- ✅ Star system (⭐ Star/unstar copies)
- ✅ Forking (🍴 Fork copies with history)
- ✅ Version control (📜 Save versions on upload)
- ✅ Auto-fork (🔄 Logged-in users auto-fork)
- ✅ Category system (📁 12 presets + custom)

## 🎯 Next Action

**🤖 AI API Page Implemented!**

✅ AI Features:
- **AI Page** (🤖) - New nav item with low opacity (human-friendly)
- **API Endpoints** - /api/copies, /api/search, /api/categories
- **AI Manifest** - GET /.well-known/ai-manifest.json
- **CLI Integration** - clawfactory install <copy-id>

✅ All Features Complete:
- Complete Snapshot (files + memory)
- Auto-fork + Auto-version
- Category system (12 presets + custom)
- Star system, Forking, Version control

Phase 5 COMPLETED! 🎉

Last Updated: 2026-02-14 (CLI tools + Railway deployment)

## 🔧 Recent Fixes (2026-02-14)
- ✅ CLI tools (install.sh, uninstall.sh, cli.js)
- ✅ Homebrew formula
- ✅ Railway port configuration (PORT=8080)
- ✅ Static file serving (backend serves frontend)
- ✅ Seed data (auto-add example copies)
- ✅ Admin API (stats, delete)

## 🔧 Recent Fixes (2026-02-14)
- ✅ Railway port configuration (PORT=8080)
- ✅ Static file serving (backend serves frontend)
- ✅ Same-domain API configuration
- ✅ Seed data (auto-add example copies on empty DB)

## 🚀 Phase 6: User System & New UI (Completed!)

### ✅ User Authentication
- Username/password registration
- Login/logout
- Token-based sessions
- Google OAuth support

### ✅ New CLI Commands
- `clawfactory login` - Login
- `clawfactory register` - Register  
- `clawfactory copy <id>` - Alias for install
- `clawfactory hottest` - Install top-rated copy
- `clawfactory upload` - Upload new copy

### ✅ New Web UI
- Light theme (default)
- Homepage redesign
- Category pages
- User login/register
- Copy grid layout
- Simplified navigation

### ✅ Backend Updates
- Password authentication
- Username in copies
- User pages API

Last Updated: 2026-02-15

## 🚀 Phase 6 Continuation (2026-02-15)

### ✅ Added This Session
- User page URL: `/{username}/{copy-slug}`
- Auto-version on upload (patch +1)
- Hash-based routing for SPA
- User copy detail page
- Copy owner link from detail page

### Remaining
- Google OAuth flow
- CLI upload with version selection
- Frontend copy detail modal enhancement
- 5 seed copies display fix

Last Updated: 2026-02-15
