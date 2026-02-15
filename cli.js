#!/usr/bin/env node
/**
 * ClawFactory CLI
 * Usage: clawfactory <command> [options]
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const API_BASE = process.env.CLAWFACTORY_API || 'https://clawfactory.ai';
const DATA_DIR = path.join(process.env.HOME, '.clawfactory');
const TOKEN_FILE = path.join(DATA_DIR, 'token');

const COLORS = {
  reset: '\033[0m', green: '\033[0;32m', yellow: '\033[1;33m', red: '\033[0;31m', blue: '\033[0;34m', cyan: '\033[0;36m'
};

function log(msg, color = 'reset') { console.log(`${COLORS[color]}${msg}${COLORS.reset}`); }
function error(msg) { log(msg, 'red'); process.exit(1); }

function getToken() {
  try { return fs.readFileSync(TOKEN_FILE, 'utf8').trim(); } catch { return null; }
}
function saveToken(t) { fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(TOKEN_FILE, t); }
function clearToken() { try { fs.unlinkSync(TOKEN_FILE); } catch {} }

async function fetchJson(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const req = (url.startsWith('https') ? https : http).get(url, opts, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch { resolve(d); }
      });
    }).on('error', reject);
  });
}

async function login() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  
  const username = await new Promise(r => rl.question('Username: ', r));
  const password = await new Promise(r => rl.question('Password: ', r));
  rl.close();

  log('\nLogging in...', 'cyan');
  const res = await fetchJson(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (res.error) error(res.error);
  saveToken(res.token);
  log(`✅ Logged in as ${username}!`, 'green');
}

async function register() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const username = await new Promise(r => rl.question('Username: ', r));
  const email = await new Promise(r => rl.question('Email (optional): ', r));
  const password = await new Promise(r => rl.question('Password: ', r));
  rl.close();

  log('\nRegistering...', 'cyan');
  const res = await fetchJson(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  if (res.error) error(res.error);
  saveToken(res.token);
  log(`✅ Registered as ${username}!`, 'green');
}

async function logout() {
  clearToken();
  log('✅ Logged out!', 'green');
}

async function list() {
  log('📦 Fetching copies...', 'cyan');
  const copies = await fetchJson(`${API_BASE}/api/copies`);
  if (!copies?.length) { log('No copies found.', 'yellow'); return; }
  log(`\n🦞 Found ${copies.length} copies:\n`, 'green');
  copies.forEach(c => {
    console.log(`  ${COLORS.cyan}${c.id}${COLORS.reset}`);
    console.log(`    ${c.name} by ${c.author}`);
    console.log(`    ${c.description?.slice(0, 60)}...`);
    console.log(`    ⭐ ${c.rating_average || 0} | 📦 ${c.install_count || 0} | ${c.category}`);
    console.log('');
  });
}

async function search(query) {
  if (!query) error('Usage: clawfactory search <query>');
  log(`🔍 Searching for "${query}"...`, 'cyan');
  const results = await fetchJson(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
  if (!results?.length) { log('No results found.', 'yellow'); return; }
  log(`\n📦 Found ${results.length} copies:\n`, 'green');
  results.forEach(c => console.log(`  ${COLORS.cyan}${c.id}${COLORS.reset} - ${c.name}`));
}

async function copy(copyId) {
  if (!copyId) error('Usage: clawfactory copy <copy-id>');
  await install(copyId);
}

async function hottest() {
  log('🔥 Finding hottest copy...', 'cyan');
  const copies = await fetchJson(`${API_BASE}/api/copies`);
  if (!copies?.length) error('No copies found');
  const hottest = copies[0];
  log(`🔥 Hottest: ${hottest.id} - ${hottest.name}`, 'green');
  await install(hottest.id);
}

async function install(copyId) {
  if (!copyId) error('Usage: clawfactory install <copy-id>');
  log(`⬇️  Installing "${copyId}"...`, 'cyan');
  
  const copy = await fetchJson(`${API_BASE}/api/copies/${copyId}`);
  if (copy.error) error(`Copy not found: ${copyId}`);

  const installPath = path.join(DATA_DIR, 'copies', copyId);
  fs.mkdirSync(installPath, { recursive: true });

  const files = copy.files ? (typeof copy.files === 'string' ? JSON.parse(copy.files) : copy.files) : {};
  for (const [filename, content] of Object.entries(files || {})) {
    fs.writeFileSync(path.join(installPath, filename), content);
    log(`  📄 ${filename}`, 'yellow');
  }

  if (copy.memory) {
    const memPath = path.join(installPath, 'memory', `${copyId}.md`);
    fs.mkdirSync(path.dirname(memPath), { recursive: true });
    fs.writeFileSync(memPath, copy.memory);
    log(`  🧠 memory/${copyId}.md`, 'yellow');
  }

  // Track install
  await fetchJson(`${API_BASE}/api/copies/${copyId}/install`, { method: 'POST' });

  log(`\n✅ Installed to ${installPath}`, 'green');
  log(`\nTo use this copy, copy these files to your OpenClaw workspace.`, 'cyan');
}

async function upload() {
  const token = getToken();
  if (!token) error('Please login first: clawfactory login');

  log('\n📤 Upload a copy\n', 'cyan');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  
  const name = await new Promise(r => rl.question('Copy name: ', r));
  const description = await new Promise(r => rl.question('Description: ', r));
  const author = await new Promise(r => rl.question('Author: ', r));
  const category = await new Promise(r => rl.question('Category (financial/frontend-dev/backend-dev/pm/designer/marketing/secretary/video-maker/productivity/content/research/others): ', r));
  const skills = await new Promise(r => rl.question('Skills (comma-separated): ', r));
  const tags = await new Promise(r => rl.question('Tags (comma-separated): ', r));
  const version = await new Promise(r => rl.question('Version (default 1.0.0): ', r)) || '1.0.0';
  const isPrivate = await new Promise(r => rl.question('Private? (y/n): ', r)) === 'y';
  rl.close();

  // Get user info
  const userRes = await fetchJson(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (userRes.error) error('Session expired. Please login again.');
  
  const user = userRes.user;
  const username = user.username;

  log('\nCreating copy...', 'cyan');

  const res = await fetchJson(`${API_BASE}/api/copies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name, description, author, version, category,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      files: { 'SKILL.md': `# ${name}\n\n${description}` },
      is_private: isPrivate,
      user_id: user.id,
      username
    })
  });

  if (res.error) error(res.error);
  log(`\n✅ ${res.isUpdate ? 'Updated' : 'Created'} copy: ${res.id}`, 'green');
  log(`\n🔗 Share URL: ${API_BASE}/#/copy/${res.id}`, 'cyan');
}

async function info(copyId) {
  if (!copyId) error('Usage: clawfactory info <copy-id>');
  const copy = await fetchJson(`${API_BASE}/api/copies/${copyId}`);
  if (copy.error) error(`Copy not found: ${copyId}`);

  log(`\n🦞 ${copy.name}\n`, 'green');
  console.log(`  ID: ${copy.id}`);
  console.log(`  Author: ${copy.author} (${copy.username})`);
  console.log(`  Version: ${copy.version}`);
  console.log(`  Category: ${copy.category}`);
  console.log(`  ⭐ ${copy.rating_average || 0} (${copy.rating_count || 0} ratings)`);
  console.log(`  📦 ${copy.install_count || 0} installs`);
  console.log(`  ${copy.description}`);
  console.log(`\n  Skills: ${copy.skills?.join(', ')}`);
  console.log(`\n  Files: ${Object.keys(copy.files || {}).join(', ')}`);
}

async function categories() {
  const cats = await fetchJson(`${API_BASE}/api/categories`);
  log('\n📁 Categories:\n', 'green');
  cats.forEach(c => console.log(`  ${c.category}: ${c.count}`));
}

async function stats() {
  const s = await fetchJson(`${API_BASE}/api/admin/stats`);
  log('\n📊 Statistics:\n', 'green');
  console.log(`  Total Copies: ${s.totalCopies}`);
  console.log(`  Total Users: ${s.totalUsers}`);
  console.log(`  Total Installs: ${s.totalInstalls}`);
}

function showHelp() {
  console.log(`
🦞 ClawFactory CLI - OpenClaw Copy Registry

${COLORS.green}Usage:${COLORS.reset}
  clawfactory <command> [options]

${COLORS.green}Commands:${COLORS.reset}
  login                    Login with username/password
  register                 Create a new account
  logout                   Log out
  list                     List all public copies
  search <query>          Search for copies
  install <copy-id>       Install a copy to your system
  copy <copy-id>          Alias for install
  hottest                  Install the top-rated copy
  upload                   Upload a new copy (login required)
  info <copy-id>          Show copy details
  categories               List all categories
  stats                    Show statistics

${COLORS.green}Examples:${COLORS.reset}
  clawfactory list
  clawfactory search trading
  clawfactory install polymarket-trader
  clawfactory copy polymarket-trader
  clawfactory hottest

${COLORS.green}Environment:${COLORS.reset}
  CLAWFACTORY_API         API server URL (default: https://clawfactory.ai)

${COLORS.green}Website:${COLORS.reset}
  https://clawfactory.ai
`);
}

const args = process.argv.slice(2);
const cmd = args[0] || 'help';

switch (cmd) {
  case 'login': login(); break;
  case 'register': register(); break;
  case 'logout': logout(); break;
  case 'list': case 'ls': list(); break;
  case 'search': case 's': search(args[1]); break;
  case 'install': case 'add': case 'i': install(args[1]); break;
  case 'copy': copy(args[1]); break;
  case 'hottest': hottest(); break;
  case 'upload': upload(); break;
  case 'info': case 'show': info(args[1]); break;
  case 'categories': case 'cats': categories(); break;
  case 'stats': stats(); break;
  case 'help': case '--help': case '-h': showHelp(); break;
  default: log(`Unknown command: ${cmd}`, 'red'); showHelp();
}
