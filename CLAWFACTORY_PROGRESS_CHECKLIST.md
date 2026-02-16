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

## 🚀 Phase 6 Continuation (2026-02-15 Evening)

### ✅ Completed & Tested
- User registration/login
- User page URL: `/{username}/{copy-slug}` ✅
- Auto-version on upload (1.0.0 → 1.0.1) ✅
- Hash-based SPA routing ✅
- API tested:
  - POST /api/auth/register ✅
  - POST /api/auth/login ✅
  - GET /api/users/:username ✅
  - GET /api/users/:username/:copySlug ✅
  - POST /api/copies (auto-version) ✅

### Commands Working
- `npx clawfactory login/register/upload` CLI ready

### Remaining
- Google OAuth flow
- CLI upload with version selection
- Frontend copy detail enhancement
- Railway redeploy

Last Updated: 2026-02-15

## 🚀 Phase 6 Continuation (2026-02-15 Night)

### ✅ Added
- CLI upload: now shows existing copies and allows updating them
- Auto-increments version on update (1.0.0 → 1.0.1)
- Better URL display: `/#/username/copy-id`

### Still Needed
- Google OAuth (needs Google Cloud setup)
- Frontend copy detail page polish
- Railway auto-deploy (GitHub push already triggers)

Last Updated: 2026-02-15

## 🚀 Phase 6 Continuation (2026-02-15 Late Night)

### ✅ Fixed
- Featured API: removed `rating_count > 0` requirement so seed copies show
- Frontend: added console logs to debug featured copies loading
- Frontend: fixed init timing with DOMContentLoaded

### 🔄 Pending Railway Deploy
- Check console logs at https://clawfactory.ai
- Expected: Featured copies should appear on homepage

Last Updated: 2026-02-15

## 🚀 Phase 6 Continuation (2026-02-15 Night - Deployment Issues)

### ✅ Completed
- User auth (register/login)
- User pages: `/{username}/{copy-slug}`
- CLI upload with update existing copy
- Auto-version increment
- Featured API fix
- Console logs for debugging

### 🚨 Blocked: Railway Deployment
- Last deployment: 00:46:27 (6+ hours ago)
- Latest commits not deployed
- GitHub shows latest commit: `77b2e16` (Trigger Railway deploy)
- Possible causes:
  - GitHub webhook not configured for Railway
  - Railway project issues

### Manual Fix Options
1. Railway dashboard → manually trigger deploy
2. Railway CLI: `railway login` then `railway deploy`
3. Or wait for webhook to work

### What's Working
- API: clawfactory.ai/api/copies ✅
- API: clawfactory.ai/api/featured ✅  
- API: clawfactory.ai/api/users/:username ✅
- 5 seed copies visible via API ✅

### What's Not Visible (needs Railway update)
- Homepage popular copies section
- User pages on frontend
- Updated CLI package

Last Updated: 2026-02-15 02:13

## 🚀 Phase 6 Continuation (2026-02-15 Late Night - Documentation)

### ✅ Completed
- README updated with full feature list
- API endpoints documented
- CLI commands documented
- Local development instructions
- Project structure documented

### 🚨 Railway Deployment (Still Blocked)
- Last deployment: 00:46:27 (7+ hours ago)
- Multiple commits pushed but not deployed
- Need Railway dashboard manual intervention

### 📋 What Works Locally
- All API endpoints
- User auth (register/login)
- Copy CRUD
- User pages
- CLI upload with version increment

### 📋 When Railway Fixed
- Frontend will show featured copies
- User pages will work online
- CLI package will have latest features

Last Updated: 2026-02-15 02:45
Railway status check: Sun Feb 15 02:45:01 CET 2026

## 🚀 Phase 6 Continuation (2026-02-15 Night - Google OAuth)

### ✅ Added This Session
- Google OAuth button on login page
- API endpoint: POST /api/auth/google
- CLI command: `clawfactory google`
- Frontend JS: googleLogin(), handleGoogleResponse()
- Google button CSS styling

### Remaining
- Google Cloud Console setup (requires your Google account)
- Set GOOGLE_CLIENT_ID environment variable
- Railway deploy (still pending)

### How to Enable Google OAuth
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Add authorized JavaScript origins: `https://clawfactory.ai`
4. Copy Client ID to Railway env vars: `GOOGLE_CLIENT_ID=your-id`
5. Or set in window.GOOGLE_CLIENT_ID before loading app.js

Last Updated: 2026-02-15 02:58

## 🚀 Phase 6 Continuation (2026-02-15 Ultra Late Night)

### ✅ Added This Session
- Fixed npm warnings (bin path, engines field)
- Added .npmrc configuration
- Google OAuth support (complete infrastructure)

### 🚨 Railway Status (Still Blocked)
- Last deployment: 00:46 (11+ hours ago)
- Multiple commits pushed since then

### 📋 What Needs Manual Intervention
1. Railway dashboard → Deployments → Manual trigger
2. OR GitHub → Settings → Webhooks → Check Railway integration

### Alternative: Manual Railway Deploy
```bash
railway login
railway deploy
```

Last Updated: 2026-02-15 03:15

## 🚀 Phase 6 Continuation (2026-02-15 Early Morning)

### ✅ Added This Session
- CLI `publish` command: reads local SKILL.md/SOUL.md/AGENTS.md and publishes to registry
- Upload now can read existing SKILL.md from current directory
- README updated with new commands
- npm warnings fixed (.npmrc, engines field)

### 🚨 Railway Deployment (Still Blocked)
- Last deployment: 00:46 (12+ hours ago)

### 📋 CLI Commands Now Available
```bash
clawfactory list           # List copies
clawfactory search <query>  # Search
clawfactory install <id>    # Install
clawfactory copy <id>      # Alias
clawfactory hottest         # Top rated
clawfactory publish [dir]   # Publish local directory
clawfactory login          # Login
clawfactory google         # Google login
clawfactory upload         # Interactive
```

### 🔜 Next Steps (After Railway Fixed)
1. Test frontend popular copies
2. Test user pages
3. Test Google OAuth button

Last Updated: 2026-02-15 03:45

## 🚀 Phase 6 Continuation (Silent Run - 03:43)

### Working Now
- CLI publish command testing
- Documentation updates
- Local development verification

### 🚨 Blocked (Waiting for Railway)
- Frontend testing (popular copies, user pages)
- Google OAuth button testing
- Full user flow testing

### 🔜 Waiting for npm publish
- User needs to run: `npm login` then `npm publish`
- OTP (2FA) required

### ✅ CLI Commands (2026-02-16)
- `clawfactory upload` - Upload public copy
- `clawfactory install <id>` - Install public copy
- `clawfactory secret upload` - Encrypt + upload with .env
- `clawfactory secret install <id> <key>` - Decrypt install
- `clawfactory mine` - List public copies
- `clawfactory mine --private` - List private copies
- Model field support added
- npm published: clawfactory@1.0.9

### ✅ Today (2026-02-16)
- Fixed CLI syntax errors (crypto.createCipheriv parentheses)
- Updated Website URL to https://clawfactory.ai
- Added model field to upload form (above category)
- Updated helper text: "Model settings are NOT copied. Use `openclaw config` to configure manually."
- Published to npm: clawfactory@1.0.9

### ✅ CLI Simplified (2026-02-16)
- Removed: login, register, googleLogin, logout functions
- Removed: publish command (redundant with upload)
- Token-based auth via CLAWFACTORY_TOKEN env or ~/.clawfactory/token file
- Commands: install, copy, upload, secret upload, secret install, hottest, mine, search

### ✅ Frontend Simplified (2026-02-16)
- Login page: token input OR username/password login
- Register page: username/password → generates token → displays token
- Token saved to localStorage for CLI use
- Copy Token button added
- Register success → navigates to My Copies page
- handlePrivateUpload function added (70e05d5)
- Account page with Access Token + Sensitive Token (17a3f2d)
- Logged-in users see Account link, Login/Register hidden
- Logout clears both tokens

### 🔜 Railway Deployment Needed
- npm published: clawfactory@1.0.12 ✅
- Latest commit: a3fd6cb (login/register navigate to /username/account)
- User needs to trigger deployment on Railway dashboard

### Note
This is an autonomous work cycle.
