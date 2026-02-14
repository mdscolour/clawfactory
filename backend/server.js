#!/usr/bin/env node
/**
 * ClawFactory Backend Server
 * Uses sql.js (WebAssembly SQLite) for cross-platform compatibility
 * 
 * Usage:
 *   npm install sql.js ws
 *   node server.js
 */

import initSqlJs from 'sql.js';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 3001;

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'clawfactory.db');

let db;

// Initialize database
async function initDb() {
  const SQL = await initSqlJs();

  // Load existing database or create new one
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS copies (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      author TEXT NOT NULL,
      version TEXT DEFAULT '1.0.0',
      category TEXT,
      skills TEXT,
      tags TEXT,
      features TEXT,
      files TEXT,
      memory TEXT,
      rating_average REAL DEFAULT 0,
      rating_count INTEGER DEFAULT 0,
      install_count INTEGER DEFAULT 0,
      is_public INTEGER DEFAULT 1,
      is_private INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ratings (
      id TEXT PRIMARY KEY,
      copy_id TEXT NOT NULL,
      user_id TEXT,
      rating INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (copy_id) REFERENCES copies(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      copy_id TEXT NOT NULL,
      user_id TEXT,
      author TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (copy_id) REFERENCES copies(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stars (
      id TEXT PRIMARY KEY,
      copy_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(copy_id, user_id),
      FOREIGN KEY (copy_id) REFERENCES copies(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS forks (
      id TEXT PRIMARY KEY,
      original_copy_id TEXT NOT NULL,
      forked_copy_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(forked_copy_id),
      FOREIGN KEY (original_copy_id) REFERENCES copies(id),
      FOREIGN KEY (forked_copy_id) REFERENCES copies(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS versions (
      id TEXT PRIMARY KEY,
      copy_id TEXT NOT NULL,
      version TEXT NOT NULL,
      data TEXT NOT NULL,
      changelog TEXT,
      created_by TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (copy_id) REFERENCES copies(id)
    )
  `);

  // Create indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_copies_category ON copies(category)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_copies_user ON copies(user_id)`);

  // Save database
  saveDb();

  console.log('✅ Database initialized at:', DB_PATH);

  // Seed example data if database is empty
  seedExampleData();
}

// Seed example copies
function seedExampleData() {
  const existing = getOne('SELECT COUNT(*) as count FROM copies');
  if (existing?.count > 0) {
    console.log('📦 Database has data, skipping seed');
    return;
  }

  console.log('🌱 Seeding example data...');

  const examples = [
    {
      id: 'polymarket-trader',
      name: 'Polymarket Trader',
      description: 'Automated trading bot for Polymarket prediction markets. Monitors odds changes and executes trades.',
      author: 'CryptoTrader',
      version: '1.0.0',
      category: 'financial',
      skills: JSON.stringify(['trading', 'monitoring', 'automation']),
      tags: JSON.stringify(['crypto', 'prediction-market', 'trading']),
      features: JSON.stringify(['Auto-odds monitoring', 'Trade execution', 'Profit tracking']),
      files: JSON.stringify({
        'SKILL.md': '# Polymarket Trading Skill\n\nMonitors prediction markets for arbitrage opportunities.',
        'SOUL.md': '# Trader Personality\n\nFocus on data-driven decisions and risk management.'
      })
    },
    {
      id: 'frontend-developer',
      name: 'Frontend Developer',
      description: 'Complete frontend development environment with React, Vue, and modern tools.',
      author: 'DevMaster',
      version: '1.2.0',
      category: 'frontend-dev',
      skills: JSON.stringify(['react', 'vue', 'css', 'typescript']),
      tags: JSON.stringify(['frontend', 'web-dev', 'react']),
      features: JSON.stringify(['VS Code setup', 'ESLint config', 'Git workflow']),
      files: JSON.stringify({
        'SKILL.md': '# Frontend Skills\n\nReact, Vue, CSS architecture.'
      })
    },
    {
      id: 'productivity-assistant',
      name: 'Productivity Assistant',
      description: 'AI-powered personal assistant for daily task management and scheduling.',
      author: 'ProductivityGuru',
      version: '2.0.0',
      category: 'productivity',
      skills: JSON.stringify(['task-management', 'calendar', 'automation']),
      tags: JSON.stringify(['productivity', 'tasks', 'schedule']),
      features: JSON.stringify(['Auto-scheduling', 'Task prioritization', 'Meeting prep']),
      files: JSON.stringify({
        'SKILL.md': '# Productivity Skills\n\nTask management and scheduling.'
      })
    },
    {
      id: 'content-creator',
      name: 'Content Creator',
      description: 'Professional content creation workflow for blogs, videos, and social media.',
      author: 'CreativePro',
      version: '1.5.0',
      category: 'content',
      skills: JSON.stringify(['writing', 'video-editing', 'seo']),
      tags: JSON.stringify(['content', 'marketing', 'social']),
      features: JSON.stringify(['Blog templates', 'Video workflow', 'SEO optimization']),
      files: JSON.stringify({
        'SKILL.md': '# Content Creation Skills\n\nWriting, editing, and SEO.'
      })
    },
    {
      id: 'research-assistant',
      name: 'Research Assistant',
      description: 'AI agent for academic research, paper analysis, and literature review.',
      author: 'ResearchLab',
      version: '1.0.0',
      category: 'research',
      skills: JSON.stringify(['research', 'analysis', 'writing']),
      tags: JSON.stringify(['academic', 'research', 'analysis']),
      features: JSON.stringify(['Paper summarization', 'Citation management', 'Literature mapping']),
      files: JSON.stringify({
        'SKILL.md': '# Research Skills\n\nAcademic research and analysis.'
      })
    }
  ];

  for (const ex of examples) {
    try {
      db.run(`
        INSERT INTO copies (id, user_id, name, description, author, version, category, skills, tags, features, files)
        VALUES (?, 'seed', ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        ex.id, ex.name, ex.description, ex.author, ex.version, ex.category,
        ex.skills, ex.tags, ex.features, ex.files
      ]);
    } catch (e) {
      // Ignore duplicate errors
    }
  }

  saveDb();
  console.log('🌱 Example data seeded!');
}

// Save database to file
function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

// Helper functions
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function parseJson(str, defaultVal = null) {
  if (!str) return defaultVal;
  try {
    return JSON.parse(str);
  } catch {
    return defaultVal;
  }
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
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDb();
}

// API Routes
const routes = {
  'GET /health': () => ({ status: 'ok', timestamp: new Date().toISOString() }),

  'GET /.well-known/ai-manifest.json': () => ({
    name: 'ClawFactory',
    description: 'OpenClaw Copy Registry',
    version: '1.0.0',
    api_base: `/api`,
    endpoints: {
      copies: '/api/copies',
      search: '/api/search?q=...',
      categories: '/api/categories',
      copy_detail: '/api/copies/:id'
    },
    cli: {
      name: 'clawfactory',
      install: 'clawfactory install <copy-id>',
      list: 'clawfactory list',
      search: 'clawfactory search <query>'
    },
    categories: [
      'financial', 'frontend-dev', 'backend-dev', 'fullstack-dev',
      'pm', 'designer', 'marketing', 'secretary',
      'video-maker', 'productivity', 'content', 'research', 'others'
    ]
  }),

  'GET /api/copies': () => {
    const copies = getAll('SELECT * FROM copies WHERE is_public = 1 ORDER BY rating_average DESC, install_count DESC');
    return copies.map(c => ({
      ...c,
      skills: parseJson(c.skills),
      tags: parseJson(c.tags),
      features: parseJson(c.features)
    }));
  },

  'GET /api/copies/:id': (req) => {
    const copy = getOne('SELECT * FROM copies WHERE id = ?', [req.params.id]);
    if (!copy) return { error: 'Copy not found', status: 404 };

    if (copy.is_private === 1) {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${copy.user_id}`) {
        return { error: 'This is a private copy', status: 403 };
      }
    }

    const comments = getAll('SELECT * FROM comments WHERE copy_id = ? ORDER BY created_at DESC', [req.params.id]);
    const ratings = getAll('SELECT * FROM ratings WHERE copy_id = ?', [req.params.id]);

    return {
      ...copy,
      skills: parseJson(copy.skills),
      tags: parseJson(copy.tags),
      features: parseJson(copy.features),
      files: parseJson(copy.files),
      memory: copy.memory || null,
      comments,
      ratings
    };
  },

  'POST /api/copies': (req) => {
    const { name, description, author, version, category, skills, tags, features, files, memory, user_id, is_private } = req.body;
    const id = name.toLowerCase().replace(/\s+/g, '-');

    const existing = getOne('SELECT * FROM copies WHERE id = ?', [id]);

    if (existing) {
      // Update existing
      run(`
        UPDATE copies SET name = ?, description = ?, author = ?, version = ?, category = ?,
        skills = ?, tags = ?, features = ?, files = ?, memory = ?, is_private = ?, updated_at = datetime('now')
        WHERE id = ?
      `, [
        name, description, author, version || existing.version, category,
        JSON.stringify(skills || []), JSON.stringify(tags || []), JSON.stringify(features || []),
        JSON.stringify(files || {}), memory || null, is_private ? 1 : 0, id
      ]);
      return { success: true, id, isUpdate: true };
    } else {
      // Insert new
      run(`
        INSERT INTO copies (id, user_id, name, description, author, version, category, skills, tags, features, files, memory, is_private)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id, user_id || 'anonymous', name, description, author, version || '1.0.0', category,
        JSON.stringify(skills || []), JSON.stringify(tags || []), JSON.stringify(features || []),
        JSON.stringify(files || {}), memory || null, is_private ? 1 : 0
      ]);
      return { success: true, id, isUpdate: false };
    }
  },

  'POST /api/marketplace/publish': (req) => {
    const { copy_id, user_id } = req.body;
    const copy = getOne('SELECT * FROM copies WHERE id = ?', [copy_id]);
    if (!copy) return { error: 'Copy not found', status: 404 };
    if (copy.user_id !== user_id) return { error: 'Not your copy', status: 403 };

    run('UPDATE copies SET is_public = 1, published_at = datetime("now"), updated_at = datetime("now") WHERE id = ?', [copy_id]);
    return { success: true };
  },

  'POST /api/marketplace/unpublish': (req) => {
    const { copy_id, user_id } = req.body;
    const copy = getOne('SELECT * FROM copies WHERE id = ?', [copy_id]);
    if (!copy) return { error: 'Copy not found', status: 404 };
    if (copy.user_id !== user_id) return { error: 'Not your copy', status: 403 };

    run('UPDATE copies SET is_public = 0, updated_at = datetime("now") WHERE id = ?', [copy_id]);
    return { success: true };
  },

  'GET /api/marketplace': (req) => {
    const { sort, category, limit } = req.query;
    
    let query = 'SELECT * FROM copies WHERE is_public = 1 AND published_at IS NOT NULL';
    const params = [];
    
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY ';
    switch (sort) {
      case 'popular': query += 'install_count DESC'; break;
      case 'rating': query += 'rating_average DESC'; break;
      case 'recent': query += 'published_at DESC'; break;
      default: query += 'rating_average DESC, install_count DESC';
    }
    
    query += ' LIMIT ?';
    params.push(limit || 50);
    
    const copies = getAll(query, params);
    return copies.map(c => ({
      ...c,
      skills: parseJson(c.skills),
      tags: parseJson(c.tags)
    }));
  },

  'GET /api/marketplace/user/:id': (req) => {
    const copies = getAll('SELECT * FROM copies WHERE user_id = ? AND is_public = 1 ORDER BY published_at DESC', [req.params.id]);
    return copies.map(c => ({
      ...c,
      skills: parseJson(c.skills),
      tags: parseJson(c.tags)
    }));
  },

  'POST /api/copies/:id/rate': (req) => {
    const { rating, user_id } = req.body;
    const copyId = req.params.id;
    
    run('INSERT OR REPLACE INTO ratings (id, copy_id, user_id, rating) VALUES (?, ?, ?, ?)',
      [generateId(), copyId, user_id, rating]);

    const ratings = getAll('SELECT rating FROM ratings WHERE copy_id = ?', [copyId]);
    const avg = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;

    run('UPDATE copies SET rating_average = ?, rating_count = ?, updated_at = datetime("now") WHERE id = ?',
      [avg.toFixed(1), ratings.length, copyId]);

    return { success: true, average: avg.toFixed(1), count: ratings.length };
  },

  'POST /api/copies/:id/comments': (req) => {
    const { author, text } = req.body;
    const copyId = req.params.id;
    
    run('INSERT INTO comments (id, copy_id, author, text) VALUES (?, ?, ?, ?)',
      [generateId(), copyId, author, text]);

    return { success: true, id: generateId() };
  },

  'POST /api/copies/:id/install': (req) => {
    const copyId = req.params.id;
    run('UPDATE copies SET install_count = install_count + 1 WHERE id = ?', [copyId]);
    return { success: true };
  },

  'POST /api/copies/:id/star': (req) => {
    const { user_id, action } = req.body;
    const copyId = req.params.id;

    if (action === 'unstar') {
      run('DELETE FROM stars WHERE copy_id = ? AND user_id = ?', [copyId, user_id]);
    } else {
      run('INSERT OR IGNORE INTO stars (id, copy_id, user_id) VALUES (?, ?, ?)',
        [generateId(), copyId, user_id]);
    }

    const starCount = getOne('SELECT COUNT(*) as count FROM stars WHERE copy_id = ?', [copyId]);
    return { success: true, stars: starCount?.count || 0 };
  },

  'GET /api/copies/:id/stars': (req) => {
    const copyId = req.params.id;
    const userId = req.query.user_id;

    const starCount = getOne('SELECT COUNT(*) as count FROM stars WHERE copy_id = ?', [copyId]);
    let isStarred = false;
    if (userId) {
      const star = getOne('SELECT id FROM stars WHERE copy_id = ? AND user_id = ?', [copyId, userId]);
      isStarred = !!star;
    }

    return { stars: starCount?.count || 0, isStarred };
  },

  'GET /api/users/:id/stars': (req) => {
    const stars = getAll(`
      SELECT c.* FROM copies c
      JOIN stars s ON c.id = s.copy_id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
    `, [req.params.id]);
    return stars.map(c => ({ ...c, skills: parseJson(c.skills) }));
  },

  'POST /api/copies/:id/fork': (req) => {
    const { user_id } = req.body;
    const originalId = req.params.id;

    const original = getOne('SELECT * FROM copies WHERE id = ?', [originalId]);
    if (!original) return { error: 'Original copy not found', status: 404 };

    const forkedId = `${originalId}-fork-${Date.now().toString(36)}`;

    try {
      run(`
        INSERT INTO copies (id, user_id, name, description, author, version, category, skills, tags, features, is_public, is_private, forked_from)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        forkedId, user_id, `${original.name} (Fork)`, original.description, original.author,
        original.version, original.category, original.skills, original.tags, original.features,
        0, original.is_private, originalId
      ]);

      run('INSERT INTO forks (id, original_copy_id, forked_copy_id, user_id) VALUES (?, ?, ?, ?)',
        [generateId(), originalId, forkedId, user_id]);

      return { success: true, id: forkedId, originalId };
    } catch (err) {
      return { error: err.message, status: 400 };
    }
  },

  'GET /api/copies/:id/forks': (req) => {
    const forks = getAll(`
      SELECT c.*, f.created_at as forked_at FROM copies c
      JOIN forks f ON c.id = f.forked_copy_id
      WHERE f.original_copy_id = ?
      ORDER BY f.created_at DESC
    `, [req.params.id]);
    return forks.map(f => ({ ...f, skills: parseJson(f.skills) }));
  },

  'GET /api/users/:id/forks': (req) => {
    const forks = getAll(`
      SELECT c.*, f.original_copy_id, f.created_at as forked_at
      FROM copies c
      JOIN forks f ON c.id = f.forked_copy_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `, [req.params.id]);
    return forks.map(f => ({ ...f, skills: parseJson(f.skills) }));
  },

  'POST /api/copies/:id/versions': (req) => {
    const { version, changelog, data } = req.body;
    const copyId = req.params.id;

    const copy = getOne('SELECT * FROM copies WHERE id = ?', [copyId]);
    if (!copy) return { error: 'Copy not found', status: 404 };

    run('INSERT INTO versions (id, copy_id, version, data, changelog) VALUES (?, ?, ?, ?, ?)',
      [generateId(), copyId, version, JSON.stringify(data), changelog]);

    run('UPDATE copies SET version = ?, updated_at = datetime("now") WHERE id = ?', [version, copyId]);

    return { success: true, version };
  },

  'GET /api/copies/:id/versions': (req) => {
    const versions = getAll(`
      SELECT id, version, changelog, created_at
      FROM versions
      WHERE copy_id = ?
      ORDER BY created_at DESC
    `, [req.params.id]);
    return versions;
  },

  'GET /api/search': (req) => {
    const { q, category, sort } = req.query;
    
    let query = 'SELECT * FROM copies WHERE is_public = 1';
    const params = [];
    
    if (q) {
      query += ' AND (name LIKE ? OR description LIKE ? OR skills LIKE ?)';
      const term = `%${q}%`;
      params.push(term, term, term);
    }
    
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY ';
    switch (sort) {
      case 'popular': query += 'install_count DESC'; break;
      case 'rating': query += 'rating_average DESC'; break;
      case 'recent': query += 'created_at DESC'; break;
      default: query += 'rating_average DESC';
    }

    const copies = getAll(query, params);
    return copies.map(c => ({ ...c, skills: parseJson(c.skills), tags: parseJson(c.tags) }));
  },

  'GET /api/categories': () => {
    return getAll('SELECT category, COUNT(*) as count FROM copies WHERE is_public = 1 GROUP BY category');
  },

  'GET /api/featured': () => {
    const copies = getAll('SELECT * FROM copies WHERE is_public = 1 AND rating_count > 0 ORDER BY rating_average DESC LIMIT 4');
    return copies.map(c => ({ ...c, skills: parseJson(c.skills), tags: parseJson(c.tags) }));
  },

  'GET /api/export': () => {
    const copies = getAll('SELECT * FROM copies');
    const comments = getAll('SELECT * FROM comments');
    const ratings = getAll('SELECT * FROM ratings');
    return {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      copies: copies.map(c => ({ ...c, skills: parseJson(c.skills) })),
      comments,
      ratings
    };
  },

  'POST /api/import': (req) => {
    const { copies, overwrite } = req.body;
    let imported = 0;
    
    for (const copy of copies || []) {
      const id = copy.id;
      if (!id) continue;

      const existing = getOne('SELECT id FROM copies WHERE id = ?', [id]);
      if (existing && !overwrite) continue;

      try {
        run(`
          INSERT OR REPLACE INTO copies 
          (id, user_id, name, description, author, version, category, skills, tags, features, 
           rating_average, rating_count, install_count, is_public, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id, copy.user_id || 'imported', copy.name, copy.description, copy.author,
          copy.version || '1.0.0', copy.category, JSON.stringify(copy.skills || []),
          JSON.stringify(copy.tags || []), JSON.stringify(copy.features || []),
          copy.rating_average || 0, copy.rating_count || 0, copy.install_count || 0,
          copy.is_public ?? 1, copy.created_at || new Date().toISOString(), new Date().toISOString()
        ]);
        imported++;
      } catch (err) {
        console.error('Import error:', id, err.message);
      }
    }
    return { success: true, imported };
  },

  'POST /api/auth/register': (req) => {
    const { username, email } = req.body;
    const id = generateId();
    
    try {
      run('INSERT INTO users (id, username, email) VALUES (?, ?, ?)', [id, username, email || null]);
      return { success: true, user: { id, username, email }, token: id };
    } catch (err) {
      return { error: err.message, status: 400 };
    }
  },

  'POST /api/auth/login': (req) => {
    const { username } = req.body;
    const user = getOne('SELECT * FROM users WHERE username = ?', [username]);
    
    if (!user) return { error: 'User not found', status: 404 };
    return { success: true, user: { id: user.id, username: user.username, email: user.email }, token: user.id };
  },

  'GET /api/auth/me': (req) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return { error: 'No token', status: 401 };
    
    const user = getOne('SELECT id, username, email, created_at FROM users WHERE id = ?', [token]);
    if (!user) return { error: 'Invalid token', status: 401 };
    return { user };
  },

  'GET /api/users/:id/copies': (req) => {
    const authHeader = req.headers.authorization || '';
    const isOwner = authHeader === `Bearer ${req.params.id}`;

    let copies;
    if (isOwner) {
      copies = getAll('SELECT * FROM copies WHERE user_id = ? ORDER BY created_at DESC', [req.params.id]);
    } else {
      copies = getAll('SELECT * FROM copies WHERE user_id = ? AND is_public = 1 ORDER BY created_at DESC', [req.params.id]);
    }
    return copies.map(c => ({ ...c, skills: parseJson(c.skills), tags: parseJson(c.tags) }));
  },

  // ========== ADMIN ROUTES ==========
  'GET /api/admin/copies': () => {
    const copies = getAll('SELECT id, name, author, version, category, rating_average, install_count, is_public, created_at FROM copies ORDER BY created_at DESC');
    return { copies, count: copies.length };
  },

  'DELETE /api/admin/copies/:id': (req) => {
    const copyId = req.params.id;
    run('DELETE FROM copies WHERE id = ?', [copyId]);
    run('DELETE FROM ratings WHERE copy_id = ?', [copyId]);
    run('DELETE FROM comments WHERE copy_id = ?', [copyId]);
    run('DELETE FROM stars WHERE copy_id = ?', [copyId]);
    run('DELETE FROM forks WHERE original_copy_id = ? OR forked_copy_id = ?', [copyId, copyId]);
    return { success: true, deleted: copyId };
  },

  'GET /api/admin/stats': () => {
    const totalCopies = getOne('SELECT COUNT(*) as count FROM copies')?.count || 0;
    const totalUsers = getOne('SELECT COUNT(*) as count FROM users')?.count || 0;
    const totalInstalls = getOne('SELECT SUM(install_count) as count FROM copies')?.count || 0;
    const publicCopies = getOne('SELECT COUNT(*) as count FROM copies WHERE is_public = 1')?.count || 0;
    return {
      totalCopies,
      totalUsers,
      totalInstalls,
      publicCopies,
      privateCopies: totalCopies - publicCopies
    };
  }
};

// HTTP Server
import http from 'http';

const FRONTEND_DIR = path.join(__dirname, '..');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const httpServer = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathName = url.pathname;
  const method = req.method;

  // Serve static files (root index.html for SPA)
  if (method === 'GET' && !pathName.startsWith('/api') && !pathName.startsWith('/.')) {
    let filePath = pathName === '/' ? '/index.html' : pathName;
    const fullPath = path.join(FRONTEND_DIR, filePath);
    const ext = path.extname(fullPath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        const content = fs.readFileSync(fullPath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
        return;
      }
    } catch (e) {
      // File not found, continue to API
    }
  }

  // API Routes
  let matchedRoute = null;
  let params = {};

  for (const route of Object.keys(routes)) {
    const [routeMethod, routePath] = route.split(' ');
    if (method !== routeMethod) continue;

    const regexPath = routePath.replace(/:id/g, '([^/]+)').replace(/\//g, '\\/');
    const regex = new RegExp(`^${regexPath}$`);
    const match = pathName.match(regex);
    
    if (match) {
      matchedRoute = route;
      const paramNames = (routePath.match(/:(\w+)/g) || []).map(p => p.slice(1));
      params = {};
      paramNames.forEach((name, i) => params[name] = match[i + 1]);
      break;
    }
  }

  if (!matchedRoute) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

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
        res.writeHead(result.error ? (result.status || 400) : 200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  }
});

// Start server
async function start() {
  await initDb();

  httpServer.listen(PORT, () => {
    console.log(`
🦞 ClawFactory Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 HTTP: http://localhost:${PORT}
📡 WebSocket: ws://localhost:${WS_PORT}
📁 Data: ${DB_PATH}
    `);
  });

  // WebSocket Server
  const wss = new WebSocketServer({ port: WS_PORT });
  const clients = new Set();

  function broadcast(event, data) {
    const msg = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
    clients.forEach(c => { if (c.readyState === 1) c.send(msg); });
  }

  wss.on('connection', (ws) => {
    clients.add(ws);
    ws.send(JSON.stringify({ event: 'connected', data: { message: 'Connected' } }));
    
    ws.on('message', (msg) => {
      try {
        const data = JSON.parse(msg);
        if (data.event === 'ping') ws.send(JSON.stringify({ event: 'pong' }));
      } catch (e) {}
    });
    
    ws.on('close', () => clients.delete(ws));
  });

  console.log(`📡 WebSocket running on ws://localhost:${WS_PORT}`);
}

start().catch(console.error);
