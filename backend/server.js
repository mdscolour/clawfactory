#!/usr/bin/env node
/**
 * ClawFactory Backend Server
 * Simple self-hosted backend for copy storage and sync
 * 
 * Usage:
 *   npm install better-sqlite3 ws
 *   node server.js
 * 
 * Or run with Docker:
 *   docker build -t clawfactory-backend .
 *   docker run -p 3000:3000 -v ./data:/app/data clawfactory-backend
 */

import sqlite3 from 'better-sqlite3';
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

// Initialize database
const db = new sqlite3(path.join(DATA_DIR, 'clawfactory.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS copies (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    author TEXT NOT NULL,
    version TEXT DEFAULT '1.0.0',
    category TEXT,
    skills TEXT, -- JSON array
    tags TEXT, -- JSON array
    features TEXT, -- JSON array
    files TEXT, -- JSON object: { "SKILL.md": "...", "SOUL.md": "...", "config.js": "...", ... }
    memory TEXT, -- Memory file content (if hasMemory)
    rating_average REAL DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    install_count INTEGER DEFAULT 0,
    is_public INTEGER DEFAULT 1,
    is_private INTEGER DEFAULT 0, -- Private copy (owner only)
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id TEXT PRIMARY KEY,
    copy_id TEXT NOT NULL,
    user_id TEXT,
    rating INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (copy_id) REFERENCES copies(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    copy_id TEXT NOT NULL,
    user_id TEXT,
    author TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (copy_id) REFERENCES copies(id)
  );

  CREATE TABLE IF NOT EXISTS backups (
    id TEXT PRIMARY KEY,
    copy_id TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (copy_id) REFERENCES copies(id)
  );

  CREATE TABLE IF NOT EXISTS stars (
    id TEXT PRIMARY KEY,
    copy_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(copy_id, user_id),
    FOREIGN KEY (copy_id) REFERENCES copies(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

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
  );

  CREATE TABLE IF NOT EXISTS versions (
    id TEXT PRIMARY KEY,
    copy_id TEXT NOT NULL,
    version TEXT NOT NULL,
    data TEXT NOT NULL,
    changelog TEXT,
    created_by TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (copy_id) REFERENCES copies(id)
  );

  CREATE INDEX IF NOT EXISTS idx_copies_category ON copies(category);
  CREATE INDEX IF NOT EXISTS idx_copies_user ON copies(user_id);
  CREATE INDEX IF NOT EXISTS idx_ratings_copy ON ratings(copy_id);
  CREATE INDEX IF NOT EXISTS idx_comments_copy ON comments(copy_id);
`);

console.log('✅ Database initialized at:', path.join(DATA_DIR, 'clawfactory.db'));

// Simple in-memory user session (in production, use proper session/JWT)
const sessions = new Map();

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Parse JSON fields safely
function parseJson(str, defaultVal = null) {
  if (!str) return defaultVal;
  try {
    return JSON.parse(str);
  } catch {
    return defaultVal;
  }
}

// API Routes
const routes = {
  // Health check
  'GET /health': () => ({ status: 'ok', timestamp: new Date().toISOString() }),

  // AI Discovery Manifest
  'GET /.well-known/ai-manifest.json': () => ({
    name: 'ClawFactory',
    description: 'OpenClaw Copy Registry - Share and discover AI agent configurations',
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
    ],
    features: [
      'complete_snapshot', 'version_history', 'forking',
      'private_copies', 'star_system'
    ]
  }),

  // List all public copies
  'GET /api/copies': (req) => {
    const stmt = db.prepare('SELECT * FROM copies WHERE is_public = 1 ORDER BY rating_average DESC, install_count DESC');
    const copies = stmt.all();
    return copies.map(c => ({
      ...c,
      skills: parseJson(c.skills),
      tags: parseJson(c.tags),
      features: parseJson(c.features),
      preview: parseJson(c.preview)
    }));
  },

  // Get single copy
  'GET /api/copies/:id': (req) => {
    const stmt = db.prepare('SELECT * FROM copies WHERE id = ?');
    const copy = stmt.get(req.params.id);
    if (!copy) return { error: 'Copy not found', status: 404 };

    // Check if private copy
    if (copy.is_private === 1) {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${copy.user_id}`) {
        return { error: 'This is a private copy', status: 403 };
      }
    }

    // Get comments
    const commentsStmt = db.prepare('SELECT * FROM comments WHERE copy_id = ? ORDER BY created_at DESC');
    const comments = commentsStmt.all(req.params.id);

    // Get ratings
    const ratingsStmt = db.prepare('SELECT * FROM ratings WHERE copy_id = ?');
    const ratings = ratingsStmt.all(req.params.id);

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

  // Create copy
  'POST /api/copies': (req) => {
    const { name, description, author, version, category, skills, tags, features, preview, github, user_id, is_private } = req.body;
    const id = name.toLowerCase().replace(/\s+/g, '-');

    try {
      // Check if copy already exists (update case)
      const existing = db.prepare('SELECT * FROM copies WHERE id = ?').get(id);

      if (existing) {
        // Update existing copy: create new version first
        db.prepare(`
          INSERT INTO versions (id, copy_id, version, data)
          VALUES (?, ?, ?, ?)
        `).run(generateId(), id, existing.version, JSON.stringify(existing));

        // Update the copy (complete snapshot)
        db.prepare(`
          UPDATE copies SET name = ?, description = ?, author = ?, version = ?, category = ?,
            skills = ?, tags = ?, features = ?, files = ?, memory = ?, is_private = ?, updated_at = datetime('now')
          WHERE id = ?
        `).run(
          name, description, author, version || existing.version, category,
          JSON.stringify(skills || []), JSON.stringify(tags || []), JSON.stringify(features || []),
          JSON.stringify(files || {}), memory || null, is_private ? 1 : 0, id
        );

        return { success: true, id, isUpdate: true, previousVersion: existing.version };
      } else {
        // Insert new copy (complete snapshot)
        const stmt = db.prepare(`
          INSERT INTO copies (id, user_id, name, description, author, version, category, skills, tags, features, files, memory, is_private)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
          id, user_id || 'anonymous', name, description, author, version || '1.0.0', category,
          JSON.stringify(skills || []), JSON.stringify(tags || []), JSON.stringify(features || []),
          JSON.stringify(files || {}), memory || null, is_private ? 1 : 0
        );

        return { success: true, id, isUpdate: false };
      }
    } catch (err) {
      return { error: err.message, status: 400 };
    }
  },

  // Publish copy to marketplace
  'POST /api/marketplace/publish': (req) => {
    const { copy_id, user_id } = req.body;
    
    // Verify copy exists and user owns it
    const copy = db.prepare('SELECT * FROM copies WHERE id = ?').get(copy_id);
    if (!copy) {
      return { error: 'Copy not found', status: 404 };
    }
    
    if (copy.user_id !== user_id) {
      return { error: 'You can only publish your own copies', status: 403 };
    }
    
    // Mark as public
    db.prepare('UPDATE copies SET is_public = 1, published_at = datetime("now"), updated_at = datetime("now") WHERE id = ?')
      .run(copy_id);
    
    return { success: true, message: 'Published to marketplace' };
  },

  // Unpublish from marketplace
  'POST /api/marketplace/unpublish': (req) => {
    const { copy_id, user_id } = req.body;
    
    const copy = db.prepare('SELECT * FROM copies WHERE id = ?').get(copy_id);
    if (!copy) {
      return { error: 'Copy not found', status: 404 };
    }
    
    if (copy.user_id !== user_id) {
      return { error: 'You can only unpublish your own copies', status: 403 };
    }
    
    db.prepare('UPDATE copies SET is_public = 0, updated_at = datetime("now") WHERE id = ?')
      .run(copy_id);
    
    return { success: true, message: 'Removed from marketplace' };
  },

  // Get marketplace copies (featured/popular)
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
      case 'popular':
        query += 'install_count DESC';
        break;
      case 'rating':
        query += 'rating_average DESC';
        break;
      case 'recent':
        query += 'published_at DESC';
        break;
      default:
        query += 'rating_average DESC, install_count DESC';
    }
    
    query += ' LIMIT ?';
    params.push(limit || 50);
    
    const copies = db.prepare(query).all(...params);
    return copies.map(c => ({
      ...c,
      skills: parseJson(c.skills),
      tags: parseJson(c.tags),
      features: parseJson(c.features)
    }));
  },

  // Get user's marketplace copies
  'GET /api/marketplace/user/:id': (req) => {
    const copies = db.prepare('SELECT * FROM copies WHERE user_id = ? AND is_public = 1 ORDER BY published_at DESC').all(req.params.id);
    return copies.map(c => ({
      ...c,
      skills: parseJson(c.skills),
      tags: parseJson(c.tags)
    }));
  },

  // Rate copy
  'POST /api/copies/:id/rate': (req) => {
    const { rating, user_id } = req.body;
    const copyId = req.params.id;
    
    db.prepare(`
      INSERT OR REPLACE INTO ratings (id, copy_id, user_id, rating)
      VALUES (?, ?, ?, ?)
    `).run(generateId(), copyId, user_id, rating);

    // Recalculate average
    const ratings = db.prepare('SELECT rating FROM ratings WHERE copy_id = ?').all(copyId);
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    const count = ratings.length;

    db.prepare('UPDATE copies SET rating_average = ?, rating_count = ?, updated_at = datetime("now") WHERE id = ?')
      .run(avg.toFixed(1), count, copyId);

    // Broadcast rating update
    if (typeof broadcastRatingUpdate === 'function') {
      broadcastRatingUpdate(copyId, { average: avg.toFixed(1), count });
    }

    return { success: true, average: avg.toFixed(1), count };
  },

  // Add comment
  'POST /api/copies/:id/comments': (req) => {
    const { author, text } = req.body;
    const id = generateId();
    const copyId = req.params.id;
    
    db.prepare(`
      INSERT INTO comments (id, copy_id, author, text)
      VALUES (?, ?, ?, ?)
    `).run(id, copyId, author, text);

    // Broadcast new comment
    if (typeof broadcastNewComment === 'function') {
      broadcastNewComment(copyId, { id, author, text, created_at: new Date().toISOString() });
    }

    return { success: true, id };
  },

  // Increment install count
  'POST /api/copies/:id/install': (req) => {
    const copyId = req.params.id;
    db.prepare('UPDATE copies SET install_count = install_count + 1 WHERE id = ?')
      .run(copyId);

    // Broadcast install update
    if (typeof broadcastCopyUpdate === 'function') {
      broadcastCopyUpdate(copyId, 'install');
    }

    return { success: true };
  },

  // ========== STAR FUNCTIONALITY ==========

  // Star a copy
  'POST /api/copies/:id/star': (req) => {
    const { user_id, action } = req.body; // action: 'star' or 'unstar'
    const copyId = req.params.id;

    if (action === 'unstar') {
      db.prepare('DELETE FROM stars WHERE copy_id = ? AND user_id = ?').run(copyId, user_id);
    } else {
      db.prepare('INSERT OR IGNORE INTO stars (id, copy_id, user_id) VALUES (?, ?, ?)')
        .run(generateId(), copyId, user_id);
    }

    const starCount = db.prepare('SELECT COUNT(*) as count FROM stars WHERE copy_id = ?').get(copyId).count;
    return { success: true, stars: starCount };
  },

  // Get star count and status
  'GET /api/copies/:id/stars': (req) => {
    const copyId = req.params.id;
    const userId = req.query.user_id;

    const starCount = db.prepare('SELECT COUNT(*) as count FROM stars WHERE copy_id = ?').get(copyId).count;
    let isStarred = false;
    if (userId) {
      const star = db.prepare('SELECT id FROM stars WHERE copy_id = ? AND user_id = ?').get(copyId, userId);
      isStarred = !!star;
    }

    return { stars: starCount, isStarred };
  },

  // Get user's starred copies
  'GET /api/users/:id/stars': (req) => {
    const stars = db.prepare(`
      SELECT c.* FROM copies c
      JOIN stars s ON c.id = s.copy_id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
    `).all(req.params.id);

    return stars.map(c => ({
      ...c,
      skills: parseJson(c.skills),
      tags: parseJson(c.tags)
    }));
  },

  // ========== FORK FUNCTIONALITY ==========

  // Fork a copy
  'POST /api/copies/:id/fork': (req) => {
    const { user_id } = req.body;
    const originalId = req.params.id;

    const original = db.prepare('SELECT * FROM copies WHERE id = ?').get(originalId);
    if (!original) return { error: 'Original copy not found', status: 404 };

    // Generate new ID for forked copy
    const forkedId = `${originalId}-fork-${Date.now().toString(36)}`;

    try {
      db.prepare(`
        INSERT INTO copies (id, user_id, name, description, author, version, category, skills, tags, features, preview, github, is_public, is_private, forked_from)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        forkedId,
        user_id,
        `${original.name} (Fork)`,
        original.description,
        original.author,
        original.version,
        original.category,
        original.skills,
        original.tags,
        original.features,
        original.preview,
        original.github,
        0,  // Forked copies are private by default
        original.is_private,
        originalId
      );

      // Record fork relationship
      db.prepare('INSERT INTO forks (id, original_copy_id, forked_copy_id, user_id) VALUES (?, ?, ?, ?)')
        .run(generateId(), originalId, forkedId, user_id);

      return { success: true, id: forkedId, originalId };
    } catch (err) {
      return { error: err.message, status: 400 };
    }
  },

  // Get forks of a copy
  'GET /api/copies/:id/forks': (req) => {
    const forks = db.prepare(`
      SELECT c.*, f.created_at as forked_at, u.username as forked_by
      FROM copies c
      JOIN forks f ON c.id = f.forked_copy_id
      LEFT JOIN users u ON f.user_id = u.id
      WHERE f.original_copy_id = ?
      ORDER BY f.created_at DESC
    `).all(req.params.id);

    return forks.map(f => ({
      ...f,
      skills: parseJson(f.skills),
      tags: parseJson(f.tags)
    }));
  },

  // Get user's forks
  'GET /api/users/:id/forks': (req) => {
    const forks = db.prepare(`
      SELECT c.*, f.original_copy_id, f.created_at as forked_at
      FROM copies c
      JOIN forks f ON c.id = f.forked_copy_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `).all(req.params.id);

    return forks.map(f => ({
      ...f,
      skills: parseJson(f.skills),
      tags: parseJson(f.tags)
    }));
  },

  // ========== VERSION CONTROL (Simple) ==========

  // Create new version (auto-called on upload)
  'POST /api/copies/:id/versions': (req) => {
    const { version, changelog, data } = req.body;
    const copyId = req.params.id;

    const copy = db.prepare('SELECT * FROM copies WHERE id = ?').get(copyId);
    if (!copy) return { error: 'Copy not found', status: 404 };

    try {
      db.prepare(`
        INSERT INTO versions (id, copy_id, version, data, changelog)
        VALUES (?, ?, ?, ?, ?)
      `).run(generateId(), copyId, version, JSON.stringify(data), changelog);

      // Update copy version
      db.prepare('UPDATE copies SET version = ?, updated_at = datetime("now") WHERE id = ?')
        .run(version, copyId);

      return { success: true, version };
    } catch (err) {
      return { error: err.message, status: 400 };
    }
  },

  // Get version history
  'GET /api/copies/:id/versions': (req) => {
    const copyId = req.params.id;
    const versions = db.prepare(`
      SELECT id, version, changelog, created_at
      FROM versions
      WHERE copy_id = ?
      ORDER BY created_at DESC
    `).all(copyId);

    return versions;
  },

  // Search copies
  'GET /api/search': (req) => {
    const { q, category, has_memory, sort } = req.query;
    
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
      case 'popular':
        query += 'install_count DESC';
        break;
      case 'rating':
        query += 'rating_average DESC';
        break;
      case 'recent':
        query += 'created_at DESC';
        break;
      default:
        query += 'rating_average DESC';
    }

    const stmt = db.prepare(query);
    const copies = stmt.all(...params);
    return copies.map(c => ({
      ...c,
      skills: parseJson(c.skills),
      tags: parseJson(c.tags)
    }));
  },

  // Get categories with counts
  'GET /api/categories': () => {
    const stmt = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM copies 
      WHERE is_public = 1 
      GROUP BY category
    `);
    return stmt.all();
  },

  // Get featured copies (top rated)
  'GET /api/featured': () => {
    const stmt = db.prepare('SELECT * FROM copies WHERE is_public = 1 AND rating_count > 0 ORDER BY rating_average DESC LIMIT 4');
    const copies = stmt.all();
    return copies.map(c => ({
      ...c,
      skills: parseJson(c.skills),
      tags: parseJson(c.tags)
    }));
  },

  // Export all data (backup)
  'GET /api/export': () => {
    const copies = db.prepare('SELECT * FROM copies').all();
    const comments = db.prepare('SELECT * FROM comments').all();
    const ratings = db.prepare('SELECT * FROM ratings').all();
    
    return {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      copies: copies.map(c => ({
        ...c,
        skills: parseJson(c.skills),
        tags: parseJson(c.tags),
        features: parseJson(c.features),
        preview: parseJson(c.preview)
      })),
      comments,
      ratings
    };
  },

  // Import data
  'POST /api/import': (req) => {
    const { copies, overwrite } = req.body;
    let imported = 0;
    
    for (const copy of copies || []) {
      const id = copy.id || copy.name?.toLowerCase().replace(/\s+/g, '-');
      if (!id) continue;

      const existing = db.prepare('SELECT id FROM copies WHERE id = ?').get(id);
      if (existing && !overwrite) continue;

      try {
        db.prepare(`
          INSERT OR REPLACE INTO copies (id, user_id, name, description, author, version, category, skills, tags, features, preview, github, rating_average, rating_count, install_count, is_public, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          id, 
          copy.user_id || 'imported',
          copy.name,
          copy.description,
          copy.author,
          copy.version || '1.0.0',
          copy.category,
          JSON.stringify(copy.skills || []),
          JSON.stringify(copy.tags || []),
          JSON.stringify(copy.features || []),
          JSON.stringify(copy.preview || {}),
          copy.github,
          copy.rating_average || 0,
          copy.rating_count || 0,
          copy.install_count || 0,
          copy.is_public ?? 1,
          copy.created_at || new Date().toISOString(),
          new Date().toISOString()
        );
        imported++;
      } catch (err) {
        console.error('Error importing copy:', id, err.message);
      }
    }
    
    return { success: true, imported };
  },

  // ========== AUTH ROUTES ==========

  // Register new user
  'POST /api/auth/register': (req) => {
    const { username, email } = req.body;
    const id = generateId();
    
    try {
      db.prepare(`
        INSERT INTO users (id, username, email)
        VALUES (?, ?, ?)
      `).run(id, username, email || null);
      
      return { 
        success: true, 
        user: { id, username, email },
        token: id // Simple token (just user ID for this demo)
      };
    } catch (err) {
      return { error: err.message, status: 400 };
    }
  },

  // Login (simplified - just checks if user exists)
  'POST /api/auth/login': (req) => {
    const { username } = req.body;
    
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    
    if (!user) {
      return { error: 'User not found. Please register first.', status: 404 };
    }
    
    return { 
      success: true, 
      user: { id: user.id, username: user.username, email: user.email },
      token: user.id
    };
  },

  // Get current user info
  'GET /api/auth/me': (req) => {
    const authHeader = req.headers.get?.('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return { error: 'No token provided', status: 401 };
    }
    
    const user = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(token);
    
    if (!user) {
      return { error: 'Invalid token', status: 401 };
    }
    
    return { user };
  },

  // Get user's copies (only owner can see private copies)
  'GET /api/users/:id/copies': (req) => {
    // Verify ownership for private copies
    const authHeader = req.headers.authorization;
    const isOwner = authHeader === `Bearer ${req.params.id}`;

    if (isOwner) {
      // Owner can see all copies including private
      const copies = db.prepare('SELECT * FROM copies WHERE user_id = ? ORDER BY created_at DESC').all(req.params.id);
      return copies.map(c => ({
        ...c,
        skills: parseJson(c.skills),
        tags: parseJson(c.tags)
      }));
    } else {
      // Others only see public copies
      const copies = db.prepare('SELECT * FROM copies WHERE user_id = ? AND is_public = 1 ORDER BY created_at DESC').all(req.params.id);
      return copies.map(c => ({
        ...c,
        skills: parseJson(c.skills),
        tags: parseJson(c.tags)
      }));
    }
  },

  // ========== END AUTH ROUTES ==========
};

// Simple HTTP server
import http from 'http';

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse URL
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  // Find matching route
  let matchedRoute = null;
  let params = {};

  for (const route of Object.keys(routes)) {
    const [routeMethod, routePath] = route.split(' ');
    if (method !== routeMethod) continue;

    // Convert route path to regex
    const regexPath = routePath
      .replace(/:id/g, '([^/]+)')
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${regexPath}$`);
    
    const match = path.match(regex);
    if (match) {
      matchedRoute = route;
      // Extract params
      const paramNames = (routePath.match(/:(\w+)/g) || []).map(p => p.slice(1));
      params = {};
      paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      break;
    }
  }

  if (!matchedRoute) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // Handle request
  const handler = routes[matchedRoute];
  
  if (method === 'GET') {
    const result = handler({ params, query: Object.fromEntries(url.searchParams) });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } else {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = body ? JSON.parse(body) : {};
        const result = handler({ params, body: data, query: Object.fromEntries(url.searchParams) });
        
        if (result.status === 404 || result.error) {
          res.writeHead(result.status || 400, { 'Content-Type': 'application/json' });
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
        }
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`
🦞 ClawFactory Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 HTTP: http://localhost:${PORT}
📡 WebSocket: ws://localhost:${WS_PORT}
📁 Data directory: ${DATA_DIR}
💡 Endpoints:
   GET  /health              - Health check
   GET  /api/copies          - List all copies
   GET  /api/copies/:id      - Get single copy
   POST /api/copies          - Create copy
   POST /api/copies/:id/rate - Rate copy
   POST /api/copies/:id/comments - Add comment
   POST /api/copies/:id/install - Track install
   GET  /api/search?q=       - Search copies
   GET  /api/categories      - List categories
   GET  /api/featured        - Featured copies
   GET  /api/export          - Export all data
   POST /api/import          - Import data
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

// ========== WEBSOCKET SERVER (Real-time Sync) ==========

const wss = new WebSocketServer({ port: WS_PORT });

// Connected clients
const clients = new Set();

// Broadcast to all connected clients
function broadcast(event, data) {
  const message = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`[WS] Client connected. Total: ${clients.size}`);

  // Send welcome message
  ws.send(JSON.stringify({
    event: 'connected',
    data: { message: 'Connected to ClawFactory sync server' },
    timestamp: new Date().toISOString()
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Handle different event types
      switch (data.event) {
        case 'subscribe':
          // Client subscribes to updates
          ws.subscribedCopies = data.copies || [];
          console.log(`[WS] Client subscribed to: ${ws.subscribedCopies.join(', ')}`);
          break;
          
        case 'ping':
          ws.send(JSON.stringify({ event: 'pong', timestamp: new Date().toISOString() }));
          break;
      }
    } catch (err) {
      console.error('[WS] Error parsing message:', err.message);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WS] Client disconnected. Total: ${clients.size}`);
  });

  ws.on('error', (err) => {
    console.error('[WS] Error:', err.message);
    clients.delete(ws);
  });
});

// Broadcast copy update
function broadcastCopyUpdate(copyId, action) {
  broadcast('copy_update', { copyId, action });
  console.log(`[WS] Broadcast: ${action} ${copyId}`);
}

// Broadcast rating update
function broadcastRatingUpdate(copyId, rating) {
  broadcast('rating_update', { copyId, rating });
}

// Broadcast new comment
function broadcastNewComment(copyId, comment) {
  broadcast('new_comment', { copyId, comment });
}

// ========== END WEBSOCKET SERVER ==========

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  db.close();
  server.close();
  process.exit(0);
});
