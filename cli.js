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

const API_BASE = process.env.CLAWFACTORY_API || 'https://clawfactory.ai';
const INSTALL_DIR = path.join(process.env.HOME, '.clawfactory', 'copies');

const COLORS = {
  reset: '\033[0m',
  green: '\033[0;32m',
  yellow: '\033[1;33m',
  red: '\033[0;31m',
  blue: '\033[0;34m',
  cyan: '\033[0;36m'
};

function log(msg, color = 'reset') {
  console.log(`${COLORS[color]}${msg}${COLORS.reset}`);
}

function error(msg) {
  log(msg, 'red');
  process.exit(1);
}

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = url.startsWith('https') ? https : http;
    req.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function list() {
  log('📦 Fetching copies...', 'cyan');
  const copies = await fetchJson(`${API_BASE}/api/copies`);
  if (!copies || copies.length === 0) {
    log('No copies found.', 'yellow');
    return;
  }
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
  if (!results || results.length === 0) {
    log('No results found.', 'yellow');
    return;
  }
  log(`\n📦 Found ${results.length} copies:\n`, 'green');
  results.forEach(c => {
    console.log(`  ${COLORS.cyan}${c.id}${COLORS.reset}`);
    console.log(`    ${c.name}`);
    console.log('');
  });
}

async function install(copyId) {
  if (!copyId) error('Usage: clawfactory install <copy-id>');
  log(`⬇️  Installing "${copyId}"...`, 'cyan');
  
  const copy = await fetchJson(`${API_BASE}/api/copies/${copyId}`);
  if (copy.error) {
    error(`Copy not found: ${copyId}`);
  }
  
  const installPath = path.join(INSTALL_DIR, copyId);
  fs.mkdirSync(installPath, { recursive: true });
  
  // Save files
  const filesData = copy.files;
  const files = typeof filesData === 'string' ? JSON.parse(filesData) : filesData;
  for (const [filename, content] of Object.entries(files || {})) {
    const filePath = path.join(installPath, filename);
    fs.writeFileSync(filePath, content);
    log(`  📄 ${filename}`, 'yellow');
  }
  
  // Save memory if exists
  if (copy.memory) {
    const memPath = path.join(installPath, 'memory', `${copyId}.md`);
    fs.mkdirSync(path.dirname(memPath), { recursive: true });
    fs.writeFileSync(memPath, copy.memory);
    log(`  🧠 memory/${copyId}.md`, 'yellow');
  }
  
  log(`\n✅ Installed to ${installPath}`, 'green');
  log(`\nUsage: OpenClaw will automatically discover this copy.`, 'cyan');
}

function showHelp() {
  console.log(`
🦞 ClawFactory CLI - OpenClaw Copy Registry

${COLORS.green}Usage:${COLORS.reset}
  clawfactory <command> [options]

${COLORS.green}Commands:${COLORS.reset}
  list                    List all available copies
  search <query>          Search for copies
  install <copy-id>       Install a copy to your system
  info <copy-id>          Show copy details
  categories              List all categories

${COLORS.green}Examples:${COLORS.reset}
  clawfactory list
  clawfactory search trading
  clawfactory install polymarket-trader

${COLORS.green}Environment:${COLORS.reset}
  CLAWFACTORY_API         API server URL (default: https://clawfactory.ai)

${COLORS.green}Website:${COLORS.reset}
  https://clawhub.com
`);
}

async function info(copyId) {
  if (!copyId) error('Usage: clawfactory info <copy-id>');
  const copy = await fetchJson(`${API_BASE}/api/copies/${copyId}`);
  if (copy.error) {
    error(`Copy not found: ${copyId}`);
  }
  
  log(`\n🦞 ${copy.name}\n`, 'green');
  console.log(`  ID: ${copy.id}`);
  console.log(`  Author: ${copy.author}`);
  console.log(`  Version: ${copy.version}`);
  console.log(`  Category: ${copy.category}`);
  console.log(`  ⭐ ${copy.rating_average || 0} (${copy.rating_count || 0} ratings)`);
  console.log(`  📦 ${copy.install_count || 0} installs`);
  console.log(`  ${copy.description}`);
  console.log(`\n  Skills: ${copy.skills}`);
  console.log(`  Tags: ${copy.tags}`);
  console.log(`\n  Files: ${Object.keys(JSON.parse(copy.files || '{}')).join(', ')}`);
}

async function categories() {
  const cats = await fetchJson(`${API_BASE}/api/categories`);
  log('\n📁 Categories:\n', 'green');
  cats.forEach(c => {
    console.log(`  ${c.category}: ${c.count}`);
  });
}

// Main
const args = process.argv.slice(2);
const cmd = args[0] || 'help';

switch (cmd) {
  case 'list':
  case 'ls':
    list();
    break;
  case 'search':
  case 's':
    search(args[1]);
    break;
  case 'install':
  case 'i':
  case 'add':
    install(args[1]);
    break;
  case 'info':
  case 'show':
    info(args[1]);
    break;
  case 'categories':
  case 'cats':
    categories();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    log(`Unknown command: ${cmd}`, 'red');
    showHelp();
}
