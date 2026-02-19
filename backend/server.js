#!/usr/bin/env node
/**
 * ClawFactory Backend Server - Phase 6
 * Adds user authentication, Google OAuth, user pages
 */

import initSqlJs from 'sql.js';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 3001;

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Rate limiting for login attempts
const loginAttempts = new Map(); // username -> { count, resetTime }

function checkLoginRateLimit(username) {
  const now = Date.now();
  const attempt = loginAttempts.get(username);
  
  if (!attempt) {
    loginAttempts.set(username, { count: 1, resetTime: now + 3600000 }); // 1 hour
    return { allowed: true, remaining: 9 };
  }
  
  if (now > attempt.resetTime) {
    // Reset after 1 hour
    loginAttempts.set(username, { count: 1, resetTime: now + 3600000 });
    return { allowed: true, remaining: 9 };
  }
  
  if (attempt.count >= 10) {
    const remainingMs = attempt.resetTime - now;
    const remainingMin = Math.ceil(remainingMs / 60000);
    return { allowed: false, remainingMin };
  }
  
  attempt.count++;
  return { allowed: true, remaining: 10 - attempt.count };
}

function resetLoginAttempts(username) {
  loginAttempts.delete(username);
}

const DB_PATH = path.join(DATA_DIR, 'clawfactory.db');
let db;

async function initDb() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
  }

  // Users table with password
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT,
    provider TEXT DEFAULT 'local',
    provider_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  // Add username to copies
  try { db.run(`ALTER TABLE copies ADD COLUMN username TEXT`); } catch (e) {}

  db.run(`CREATE TABLE IF NOT EXISTS copies (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    username TEXT,
    name TEXT NOT NULL,
    description TEXT,
    author TEXT NOT NULL,
    version TEXT DEFAULT '1.0.0',
    category TEXT,
    model TEXT,
    skills TEXT,
    tags TEXT,
    features TEXT,
    files TEXT,
    memory TEXT,
    tarball TEXT,
    tarball_size INTEGER DEFAULT 0,
    rating_average REAL DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    install_count INTEGER DEFAULT 0,
    is_public INTEGER DEFAULT 1,
    is_private INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`);

  // Migration: add model column if not exists
  try {
    db.run(`ALTER TABLE copies ADD COLUMN model TEXT`);
  } catch (e) {}

  // Migration: add has_memory column if not exists
  try {
    db.run(`ALTER TABLE copies ADD COLUMN has_memory INTEGER DEFAULT 0`);
  } catch (e) {}

  // Migration: add tarball columns if not exists
  try {
    db.run(`ALTER TABLE copies ADD COLUMN tarball TEXT`);
  } catch (e) {}
  try {
    db.run(`ALTER TABLE copies ADD COLUMN tarball_size INTEGER DEFAULT 0`);
  } catch (e) {}

  // Verify columns exist, add if missing
  const cols = db.exec("SELECT sql FROM sqlite_master WHERE type='table' AND name='copies'");
  const createSql = cols[0]?.values[0]?.[0] || '';
  if (!createSql.includes('tarball')) {
    try { db.run(`ALTER TABLE copies ADD COLUMN tarball TEXT`); } catch (e) {}
  }
  if (!createSql.includes('tarball_size')) {
    try { db.run(`ALTER TABLE copies ADD COLUMN tarball_size INTEGER DEFAULT 0`); } catch (e) {}
  }

  // Create tarball storage directory
  const TARBALL_DIR = path.join(DATA_DIR, 'tarballs');
  if (!fs.existsSync(TARBALL_DIR)) {
    fs.mkdirSync(TARBALL_DIR, { recursive: true });
  }

  // Collaborative editing tables
  db.run(`CREATE TABLE IF NOT EXISTS contributors (
    id TEXT PRIMARY KEY,
    copy_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    role TEXT DEFAULT 'contributor',
    contribution_count INTEGER DEFAULT 0,
    first_contributed TEXT DEFAULT (datetime('now')),
    last_contributed TEXT DEFAULT (datetime('now')),
    UNIQUE(copy_id, user_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS changes (
    id TEXT PRIMARY KEY,
    copy_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    change_type TEXT NOT NULL,
    description TEXT,
    version_before TEXT,
    version_after TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS ratings (
    id TEXT PRIMARY KEY, copy_id TEXT NOT NULL, user_id TEXT, rating INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY, copy_id TEXT NOT NULL, user_id TEXT, author TEXT NOT NULL, text TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS stars (
    id TEXT PRIMARY KEY, copy_id TEXT NOT NULL, user_id TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(copy_id, user_id)
  )`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_copies_category ON copies(category)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_copies_user ON copies(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_copies_username ON copies(username)`);

  saveDb();
  seedExampleData();
  console.log('✅ Database initialized');
}

function saveDb() {
  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function parseJson(str, defaultVal = null) {
  if (!str) return defaultVal;
  try { return JSON.parse(str); } catch { return defaultVal; }
}

function calculateRecommendationReason(copy, prefs) {
  const reasons = [];
  const copyTags = parseJson(copy.tags, []).map(t => t.toLowerCase());
  const copySkills = parseJson(copy.skills, []).map(s => s.toLowerCase());
  
  if (prefs.category && copy.category === prefs.category) {
    reasons.push(`Similar to ${prefs.category} copies you've seen`);
  }
  
  if (prefs.tags) {
    const tagList = prefs.tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
    const matchingTags = copyTags.filter(t => tagList.includes(t));
    if (matchingTags.length > 0) {
      reasons.push(`Matches your interest in "${matchingTags[0]}"`);
    }
  }
  
  if (copy.rating_average >= 4) {
    reasons.push('Highly rated by the community');
  } else if (copy.install_count > 10) {
    reasons.push('Popular among users');
  }
  
  return reasons.length > 0 ? reasons[0] : 'Recommended for you';
}

const salt = 'clawfactory-2024';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

function getOne(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

function getAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const results = [];
  while (stmt.step()) results.push(stmt.getAsObject());
  stmt.free();
  return results;
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDb();
}

function seedExampleData() {
  if (getOne('SELECT COUNT(*) as count FROM copies')?.count > 0) return;

  console.log('🌱 Seeding example data...');

  const seedUsers = [
    { id: 'seed-1', username: 'cryptotrader', email: 'crypto@example.com', password: 'demo123' },
    { id: 'seed-2', username: 'devmaster', email: 'dev@example.com', password: 'demo123' },
    { id: 'seed-3', username: 'productivityguru', email: 'prod@example.com', password: 'demo123' },
    { id: 'seed-4', username: 'creativepro', email: 'creative@example.com', password: 'demo123' },
    { id: 'seed-5', username: 'researchlab', email: 'research@example.com', password: 'demo123' },
  ];

  for (const u of seedUsers) {
    try { run('INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)', [u.id, u.username, u.email, hashPassword(u.password)]); } catch (e) {}
  }

  const examples = [
    { id: 'polymarket-trader', name: 'Polymarket Trader', description: 'Automated trading bot for Polymarket', author: 'CryptoTrader', username: 'cryptotrader', version: '1.0.0', category: 'financial', skills: ['trading', 'monitoring'], tags: ['crypto', 'trading'], features: ['Auto-monitoring', 'Trade execution'] },
    { id: 'frontend-developer', name: 'Frontend Developer', description: 'Complete frontend development environment', author: 'DevMaster', username: 'devmaster', version: '1.2.0', category: 'frontend-dev', skills: ['react', 'vue'], tags: ['frontend', 'web-dev'], features: ['VS Code setup', 'Git workflow'] },
    { id: 'productivity-assistant', name: 'Productivity Assistant', description: 'AI-powered task management', author: 'ProductivityGuru', username: 'productivityguru', version: '2.0.0', category: 'productivity', skills: ['task-management', 'calendar'], tags: ['productivity'], features: ['Auto-scheduling', 'Task prioritization'] },
    { id: 'content-creator', name: 'Content Creator', description: 'Professional content workflow', author: 'CreativePro', username: 'creativepro', version: '1.5.0', category: 'content', skills: ['writing', 'video-editing'], tags: ['content'], features: ['Blog templates', 'SEO optimization'] },
    { id: 'research-assistant', name: 'Research Assistant', description: 'AI research agent', author: 'ResearchLab', username: 'researchlab', version: '1.0.0', category: 'research', skills: ['research', 'analysis'], tags: ['academic'], features: ['Paper summarization', 'Citation management'] },
  ];

  for (const ex of examples) {
    const userId = seedUsers.find(u => u.username === ex.username)?.id || 'seed';
    try {
      run(`INSERT INTO copies (id, user_id, username, name, description, author, version, category, model, skills, tags, features, is_public) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ex.id, userId, ex.username, ex.name, ex.description, ex.author, ex.version, ex.category, model||null, JSON.stringify(ex.skills), JSON.stringify(ex.tags), JSON.stringify(ex.features), 1]);
    } catch (e) {}
  }
  console.log('🌱 Seed complete!');
}

const routes = {
  'GET /health': () => ({ status: 'ok', timestamp: new Date().toISOString() }),

  'GET /api/version': () => ({
    version: '1.0.13',
    name: 'ClawFactory',
    api: '1.0.0',
    frontend: '1.0.13',
    lastUpdated: new Date().toISOString()
  }),

  'GET /.well-known/ai-manifest.json': () => ({
    name: 'ClawFactory', description: 'OpenClaw Copy Registry', version: '1.0.0',
    cli: { name: 'clawfactory', install: 'clawfactory install <copy-id>', list: 'clawfactory list' },
    categories: ['financial', 'frontend-dev', 'backend-dev', 'pm', 'designer', 'marketing', 'secretary', 'video-maker', 'productivity', 'content', 'research', 'others']
  }),

  'GET /api/copies': () => {
    const copies = getAll('SELECT * FROM copies WHERE is_public = 1 ORDER BY rating_average DESC, install_count DESC');
    return copies.map(c => ({ ...c, skills: parseJson(c.skills), tags: parseJson(c.tags), has_memory: c.has_memory }));
  },

  'GET /api/copies/:id': (req) => {
    const copy = getOne('SELECT * FROM copies WHERE id = ?', [req.params.id]);
    if (!copy) return { error: 'Copy not found', status: 404 };
    if (copy.is_private === 1) {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${copy.user_id}`) return { error: 'Private copy', status: 403 };
    }
    return { ...copy, skills: parseJson(copy.skills), tags: parseJson(copy.tags), files: parseJson(copy.files), memory: copy.memory, has_memory: copy.has_memory };
  },

  'GET /api/copies/:id/private': (req) => {
    const { user_id } = req.query;
    const copy = getOne('SELECT * FROM copies WHERE id = ?', [req.params.id]);
    if (!copy) return { error: 'Copy not found', status: 404 };
    // Only the owner can view private copies
    if (copy.is_private === 1 && copy.user_id !== user_id) return { error: 'Access denied', status: 403 };
    return { ...copy, skills: parseJson(copy.skills), tags: parseJson(copy.tags), files: parseJson(copy.files), memory: copy.memory, has_memory: copy.has_memory };
  },

  'GET /api/copies/:id/tarball': (req, res) => {
    const copy = getOne('SELECT * FROM copies WHERE id = ?', [req.params.id]);
    if (!copy) return { error: 'Copy not found', status: 404 };
    
    const tarballPath = copy.tarball;
    if (!tarballPath || !fs.existsSync(tarballPath)) {
      return { error: 'Tarball not found', status: 404 };
    }
    
    console.log(`[Tarball] Serving: ${tarballPath}`);
    
    // Read and return the tarball with checksum
    try {
      const tarball = fs.readFileSync(tarballPath);
      
      // Validate gzip format (magic bytes: 0x1f 0x8b)
      const isGzip = tarball.length > 2 && tarball[0] === 0x1f && tarball[1] === 0x8b;
      if (!isGzip) {
        console.error('[Tarball] Invalid tarball format (not gzip)');
        return { error: 'Invalid tarball format', status: 400 };
      }
      
      // Calculate SHA256 checksum for integrity verification
      const crypto = require('crypto');
      const checksum = crypto.createHash('sha256').update(tarball).digest('hex');
      
      return {
        tarball: tarball.toString('base64'),
        size: tarball.length,
        checksum: checksum,
        format: 'gzip'
      };
    } catch (e) {
      console.error('[Tarball] Error reading tarball:', e.message);
      return { error: 'Failed to read tarball', status: 500 };
    }
  },

  'GET /api/users/:username': (req) => {
    const user = getOne('SELECT id, username, email, created_at FROM users WHERE username = ?', [req.params.username]);
    if (!user) return { error: 'User not found', status: 404 };
    const copies = getAll('SELECT * FROM copies WHERE username = ? AND is_public = 1 ORDER BY created_at DESC', [req.params.username]);
    return { user, copies: copies.map(c => ({ ...c, skills: parseJson(c.skills) })) };
  },

  'GET /api/users/:username/:copySlug': (req) => {
    const { username, copySlug } = req.params;
    const copy = getOne('SELECT c.*, u.username as owner_username FROM copies c LEFT JOIN users u ON c.user_id = u.id WHERE c.id = ? AND c.username = ?', [copySlug, username]);
    if (!copy) return { error: 'Copy not found', status: 404 };
    if (copy.is_private === 1) {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${copy.user_id}`) return { error: 'Private copy', status: 403 };
    }
    return {
      ...copy,
      skills: parseJson(copy.skills),
      tags: parseJson(copy.tags),
      files: parseJson(copy.files),
      memory: copy.memory,
      owner: copy.owner_username
    };
  },

  'POST /api/copies': (req) => {
    const { name, description, author, version, category, model, skills, tags, features, files, memory, user_id, username, is_public, is_private, copyId, has_memory, workspace_tarball, tarball_size } = req.body;
    const id = copyId || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const existing = getOne('SELECT * FROM copies WHERE id = ?', [id]);

    // Handle tarball
    let tarballPath = null;
    if (workspace_tarball) {
      tarballPath = path.join(DATA_DIR, 'tarballs', `${id}.tar.gz`);
      try {
        const tarballBuffer = Buffer.from(workspace_tarball, 'base64');
        fs.writeFileSync(tarballPath, tarballBuffer);
        console.log(`[Copies] Saved tarball to ${tarballPath} (${tarball_size} bytes)`);
      } catch (e) {
        console.error('[Copies] Failed to save tarball:', e.message);
      }
    }

    if (existing) {
      // Use provided version, or auto-increment if not provided
      let newVersion = version;
      if (!version) {
        const parts = existing.version.split('.');
        newVersion = `${parts[0]}.${parts[1]}.${(parseInt(parts[2]) || 0) + 1}`;
      }
      
      run(`UPDATE copies SET name=?, description=?, author=?, version=?, category=?, model=?, skills=?, tags=?, features=?, files=?, memory=?, is_public=?, is_private=?, has_memory=?, tarball=?, tarball_size=?, updated_at=datetime('now') WHERE id=?`,
        [name, description, author, newVersion, category, model||null, JSON.stringify(skills||[]), JSON.stringify(tags||[]), JSON.stringify(features||[]), JSON.stringify(files||{}), memory||null, is_public?1:0, is_private?1:0, has_memory?1:0, tarballPath, tarball_size||0, id]);
      return { success: true, id, isUpdate: true, version: newVersion };
    } else {
      run(`INSERT INTO copies (id, user_id, username, name, description, author, version, category, model, skills, tags, features, files, memory, is_public, is_private, has_memory, tarball, tarball_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, user_id||'anonymous', username, name, description, author, version||'1.0.0', category, model||null, JSON.stringify(skills||[]), JSON.stringify(tags||[]), JSON.stringify(features||[]), JSON.stringify(files||{}), memory||null, is_public?1:0, is_private?1:0, has_memory?1:0, tarballPath, tarball_size||0]);
      return { success: true, id, isUpdate: false, version: version||'1.0.0' };
    }
  },

  'POST /api/auth/register': (req) => {
    const { username, email, password } = req.body;
    console.log('[Register] Attempting:', { username, email });
    const id = generateId();
    const token = 'clawfactory_' + generateId();
    try {
      const hash = hashPassword(password);
      console.log('[Register] Password hash:', hash);
      run('INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)', [id, username, email||null, hash]);
      console.log('[Register] Success:', { id, username });
      return { success: true, user: { id, username, email }, token };
    } catch (err) { 
      console.error('[Register] Error:', err.message);
      // Return more specific error message
      if (err.message.includes('UNIQUE constraint failed')) {
        if (err.message.includes('users.username')) {
          return { error: '用户名已存在', status: 400 };
        }
        if (err.message.includes('users.email')) {
          return { error: '邮箱已被注册', status: 400 };
        }
      }
      return { error: err.message, status: 400 }; 
    }
  },

  'POST /api/auth/login': (req) => {
    const { username, password } = req.body;
    console.log('[Login] Attempting:', { username });
    
    // Check rate limit first
    const rateLimit = checkLoginRateLimit(username);
    if (!rateLimit.allowed) {
      console.log('[Login] Rate limited:', username);
      return { error: `Too many failed attempts. Try again in ${rateLimit.remainingMin} minutes.`, status: 429, remainingMin: rateLimit.remainingMin };
    }
    
    const user = getOne('SELECT * FROM users WHERE username = ?', [username]);
    console.log('[Login] User found:', user ? 'yes' : 'no');
    
    if (!user) {
      console.log('[Login] User not found');
      return { error: 'Invalid username or password', status: 401, remaining: rateLimit.remaining };
    }
    
    const inputHash = hashPassword(password);
    const storedHash = user.password_hash;
    console.log('[Login] Input hash:', inputHash);
    console.log('[Login] Stored hash:', storedHash);
    console.log('[Login] Match:', inputHash === storedHash);
    
    if (user.password_hash && !verifyPassword(password, user.password_hash)) {
      console.log('[Login] Password mismatch');
      return { error: 'Invalid username or password', status: 401, remaining: rateLimit.remaining };
    }
    
    // Success - reset failed attempts
    resetLoginAttempts(username);
    console.log('[Login] Success!');
    
    const token = 'clawfactory_' + user.id;
    return { success: true, user: { id: user.id, username: user.username, email: user.email }, token };
  },

  // Clear rate limit (for testing)
  'POST /api/auth/clear-limit': (req) => {
    const { username } = req.body;
    if (username) {
      resetLoginAttempts(username);
      return { success: true, message: 'Rate limit cleared' };
    }
    return { error: 'Username required', status: 400 };
  },

  'POST /api/auth/revoke': (req) => {
    const { username } = req.body;
    if (!username) {
      return { error: 'Username required', status: 400 };
    }
    
    const user = getOne('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      return { error: 'User not found', status: 404 };
    }
    
    // Generate new token
    const newToken = 'clawfactory_' + generateId();
    console.log('[Revoke] New token generated for:', username);
    return { success: true, token: newToken };
  },

  'POST /api/auth/google': (req) => {
    const { googleId, email, name } = req.body;
    let user = getOne('SELECT * FROM users WHERE provider_id = ? AND provider = ?', [googleId, 'google']);
    if (!user) {
      user = getOne('SELECT * FROM users WHERE email = ?', [email]);
      if (user) run('UPDATE users SET provider=?, provider_id=? WHERE id=?', ['google', googleId, user.id]);
      else {
        const id = generateId();
        const username = email.split('@')[0] + '-' + Date.now().toString(36);
        run('INSERT INTO users (id, username, email, provider, provider_id) VALUES (?, ?, ?, ?, ?)', [id, username, email, 'google', googleId]);
        user = { id, username, email };
      }
    }
    return { success: true, user: { id: user.id, username: user.username, email: user.email }, token: user.id };
  },

  'GET /api/auth/me': (req) => {
    let token = (req.headers.authorization || '').replace('Bearer ', '');
    // Support both "clawfactory_xxx" and "xxx" formats
    if (token.startsWith('clawfactory_')) {
      token = token.replace('clawfactory_', '');
    }
    if (!token) return { error: 'No token', status: 401 };
    const user = getOne('SELECT id, username, email, created_at FROM users WHERE id = ?', [token]);
    if (!user) return { error: 'Invalid token', status: 401 };
    return { user };
  },

  'POST /api/copies/:id/rate': (req) => {
    const { rating, user_id } = req.body;
    const copyId = req.params.id;
    run('INSERT OR REPLACE INTO ratings (id, copy_id, user_id, rating) VALUES (?, ?, ?, ?)', [generateId(), copyId, user_id, rating]);
    const ratings = getAll('SELECT rating FROM ratings WHERE copy_id = ?', [copyId]);
    const avg = ratings.length > 0 ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 0;
    run('UPDATE copies SET rating_average=?, rating_count=?, updated_at=datetime("now") WHERE id=?', [avg.toFixed(1), ratings.length, copyId]);
    return { success: true, average: avg.toFixed(1), count: ratings.length };
  },

  'POST /api/copies/:id/install': (req) => {
    run('UPDATE copies SET install_count = install_count + 1 WHERE id = ?', [req.params.id]);
    return { success: true };
  },

  'GET /api/search': (req) => {
    const { q, category } = req.query;
    let query = 'SELECT * FROM copies WHERE is_public = 1';
    const params = [];
    if (q) { query += ' AND (name LIKE ? OR description LIKE ? OR skills LIKE ?)'; const t = `%${q}%`; params.push(t, t, t); }
    if (category && category !== 'all') { query += ' AND category = ?'; params.push(category); }
    query += ' ORDER BY rating_average DESC, install_count DESC';
    return getAll(query, params).map(c => ({ ...c, skills: parseJson(c.skills), tags: parseJson(c.tags) }));
  },

  'GET /api/categories': () => getAll('SELECT category, COUNT(*) as count FROM copies WHERE is_public = 1 GROUP BY category'),

  'GET /api/featured': () => getAll('SELECT * FROM copies WHERE is_public = 1 ORDER BY install_count DESC, rating_average DESC LIMIT 4').map(c => ({ ...c, skills: parseJson(c.skills) })),

  // AI-powered recommendations based on user's preferences
  'GET /api/recommendations': (req) => {
    const { user_id, category, tags, exclude, limit = 4 } = req.query;
    
    let query = 'SELECT * FROM copies WHERE is_public = 1';
    const params = [];
    
    // Exclude already seen/owned copies
    if (exclude) {
      const excluded = exclude.split(',').map(e => e.trim()).filter(e => e);
      if (excluded.length > 0) {
        query += ' AND id NOT IN (' + excluded.map(() => '?').join(',') + ')';
        params.push(...excluded);
      }
    }
    
    // Filter by category if provided
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    
    // Filter by tags if provided (match any tag)
    if (tags) {
      const tagList = tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
      if (tagList.length > 0) {
        query += ' AND (';
        const tagConditions = tagList.map(() => 'LOWER(tags) LIKE ?').join(' OR ');
        query += tagConditions;
        params.push(...tagList.map(t => `%${t}%`));
        query += ')';
      }
    }
    
    query += ' ORDER BY rating_average DESC, install_count DESC LIMIT ?';
    params.push(parseInt(limit));
    
    const recommendations = getAll(query, params).map(c => ({ 
      ...c, 
      skills: parseJson(c.skills), 
      tags: parseJson(c.tags),
      reason: calculateRecommendationReason(c, { category, tags })
    }));
    
    // If no specific matches, return popular copies as fallback
    if (recommendations.length === 0) {
      const fallback = getAll('SELECT * FROM copies WHERE is_public = 1 ORDER BY install_count DESC, rating_average DESC LIMIT ?', [parseInt(limit)])
        .map(c => ({ 
          ...c, 
          skills: parseJson(c.skills), 
          tags: parseJson(c.tags),
          reason: 'Popular choice'
        }));
      return { recommendations: fallback, fallback: true };
    }
    
    return { recommendations };
  },

  // Collaborative editing: get contributors for a copy
  'GET /api/copies/:id/contributors': (req) => {
    const contributors = getAll('SELECT * FROM contributors WHERE copy_id = ? ORDER BY contribution_count DESC LIMIT 10', [req.params.id]);
    return { contributors };
  },

  // Collaborative editing: get change history for a copy
  'GET /api/copies/:id/changes': (req) => {
    const { limit = 20 } = req.query;
    const changes = getAll('SELECT * FROM changes WHERE copy_id = ? ORDER BY created_at DESC LIMIT ?', [req.params.id, parseInt(limit)]);
    return { changes };
  },

  // Collaborative editing: record a change
  'POST /api/copies/:id/change': (req) => {
    const { user_id, username, change_type, description, version_before, version_after } = req.body;
    const copyId = req.params.id;
    
    // Update or add contributor
    const existing = getOne('SELECT * FROM contributors WHERE copy_id = ? AND user_id = ?', [copyId, user_id]);
    if (existing) {
      run('UPDATE contributors SET contribution_count = contribution_count + 1, last_contributed = datetime("now") WHERE id = ?', [existing.id]);
    } else {
      run('INSERT INTO contributors (id, copy_id, user_id, username, contribution_count) VALUES (?, ?, ?, ?, 1)',
        [generateId(), copyId, user_id, username]);
    }
    
    // Record the change
    run('INSERT INTO changes (id, copy_id, user_id, username, change_type, description, version_before, version_after) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [generateId(), copyId, user_id, username, change_type, description || change_type, version_before, version_after]);
    
    return { success: true };
  },

  // Collaborative editing: add comment on copy
  'POST /api/copies/:id/comment': (req) => {
    const { user_id, author, text } = req.body;
    const commentId = generateId();
    run('INSERT INTO comments (id, copy_id, user_id, author, text) VALUES (?, ?, ?, ?, ?)',
      [commentId, req.params.id, user_id, author, text]);
    
    // Update contributor count
    const existing = getOne('SELECT * FROM contributors WHERE copy_id = ? AND user_id = ?', [req.params.id, user_id]);
    if (existing) {
      run('UPDATE contributors SET contribution_count = contribution_count + 1, last_contributed = datetime("now") WHERE id = ?', [existing.id]);
    }
    
    return { success: true, id: commentId };
  },

  // Collaborative editing: get comments for a copy
  'GET /api/copies/:id/comments': (req) => {
    const comments = getAll('SELECT * FROM comments WHERE copy_id = ? ORDER BY created_at ASC', [req.params.id]);
    return { comments };
  },

  // Get user's contributions across all copies
  'GET /api/users/:userId/contributions': (req) => {
    const contributions = getAll('SELECT c.*, cont.contribution_count, cont.first_contributed, cont.last_contributed FROM contributors cont JOIN copies c ON cont.copy_id = c.id WHERE cont.user_id = ? ORDER BY cont.last_contributed DESC', [req.params.userId]);
    return { contributions };
  },

  'GET /api/admin/stats': () => ({
    totalCopies: getOne('SELECT COUNT(*) as count FROM copies')?.count || 0,
    totalUsers: getOne('SELECT COUNT(*) as count FROM users')?.count || 0,
    totalInstalls: getOne('SELECT SUM(install_count) as count FROM copies')?.count || 0,
    publicCopies: getOne('SELECT COUNT(*) as count FROM copies WHERE is_public = 1')?.count || 0
  }),
};

import http from 'http';

const FRONTEND_DIR = path.join(__dirname, '..');
const mimeTypes = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg' };

const httpServer = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathName = url.pathname;
  const method = req.method;

  // Static files
  // Serve static files, but keep API routes under /api/*
  if (method === 'GET' && !pathName.startsWith('/api/') && !pathName.startsWith('/.') && pathName !== '/health') {
    let filePath = pathName === '/' ? '/index.html' : pathName;
    const fullPath = path.join(FRONTEND_DIR, filePath);
    try {
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(fullPath)] || 'application/octet-stream' });
        res.end(fs.readFileSync(fullPath));
        return;
      }

      // SPA fallback for clean routes like /username/slug
      const indexPath = path.join(FRONTEND_DIR, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(indexPath));
        return;
      }
    } catch (e) {}
  }

  // API routes
  let matchedRoute = null, params = {};
  for (const route of Object.keys(routes)) {
    const [routeMethod, routePath] = route.split(' ');
    if (method !== routeMethod) continue;
    const regexPath = routePath.replace(/:id/g, '([^/]+)').replace(/:username/g, '([^/]+)').replace(/:copySlug/g, '([^/]+)').replace(/\//g, '\\/');
    const match = pathName.match(new RegExp(`^${regexPath}$`));
    if (match) {
      matchedRoute = route;
      const paramNames = (routePath.match(/:(\w+)/g) || []).map(p => p.slice(1));
      params = {}; paramNames.forEach((name, i) => params[name] = match[i + 1]);
      break;
    }
  }

  if (!matchedRoute) { res.writeHead(404); res.end(JSON.stringify({ error: 'Not found' })); return; }

  const handler = routes[matchedRoute];
  if (method === 'GET') {
    const result = handler({ params, query: Object.fromEntries(url.searchParams), headers: req.headers });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } else {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = body ? JSON.parse(body) : {};
        const result = handler({ params, body: data, query: Object.fromEntries(url.searchParams), headers: req.headers });
        res.writeHead(result.error ? 400 : 200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) { res.writeHead(400); res.end(JSON.stringify({ error: err.message })); }
    });
  }
});

function friendlyPortError(err, name, port) {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`❌ ${name} port ${port} is already in use (EADDRINUSE).`);
    console.error(`   Another process is already listening on ${port}.`);
    console.error(`   Fix options:`);
    console.error(`   1) Stop the existing process using port ${port}`);
    console.error(`   2) Start on a different port, e.g. PORT=${port + 1} npm start`);
    process.exitCode = 1;
    return;
  }
  console.error(`❌ ${name} failed:`, err?.message || err);
  process.exitCode = 1;
}

async function start() {
  await initDb();

  httpServer.on('error', (err) => friendlyPortError(err, 'HTTP server', Number(PORT)));
  httpServer.listen(PORT, () => console.log(`🦞 ClawFactory API: http://localhost:${PORT}`));
  
  // WebSocket
  const wss = new WebSocketServer({ port: WS_PORT });
  wss.on('error', (err) => friendlyPortError(err, 'WebSocket server', Number(WS_PORT)));
  wss.on('connection', ws => {
    ws.on('message', msg => {
      try { const d = JSON.parse(msg); if (d.event === 'ping') ws.send(JSON.stringify({ event: 'pong' })); } catch (e) {}
    });
  });
  console.log(`📡 WebSocket: ws://localhost:${WS_PORT}`);
}

start().catch((err) => {
  console.error('❌ Startup failed:', err?.message || err);
  process.exitCode = 1;
});
// Railway deploy trigger Sun Feb 15 01:51:30 CET 2026
