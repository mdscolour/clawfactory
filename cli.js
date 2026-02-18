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
const crypto = require('crypto');

const API_BASE = process.env.CLAWFACTORY_API || 'https://clawfactory.ai';
const DATA_DIR = path.join(process.env.HOME, '.clawfactory');
const TOKEN_FILE = path.join(DATA_DIR, 'token');

// Get CLI arguments first - must be before functions that use it
const args = process.argv.slice(2);

const COLORS = {
  reset: '\033[0m', green: '\033[0;32m', yellow: '\033[1;33m', red: '\033[0;31m', blue: '\033[0;34m', cyan: '\033[0;36m'
};

function log(msg, color = 'reset') { console.log(`${COLORS[color]}${msg}${COLORS.reset}`); }
function error(msg) { log(msg, 'red'); process.exit(1); }

// Support TOKEN=<your-token> format from command line
function getTokenFromArgs() {
  const tokenArg = args.find(a => a.startsWith('TOKEN='));
  return tokenArg ? tokenArg.split('=')[1] : null;
}

function getToken() {
  // First check CLI argument: TOKEN=<your-token>
  const argToken = getTokenFromArgs();
  if (argToken) return argToken;
  // Then check file
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

async function postJson(url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = (urlObj.protocol === 'https:' ? https : http).request({
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch { resolve(d); }
      });
    }).on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
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

async function mine() {
  const token = getToken();
  if (!token) error('Please provide token: clawfactory mine TOKEN=<your-token> or set CLAWFACTORY_TOKEN');

  const isPrivate = args.includes('--private') || args.includes('-p');
  log(`\n📦 Your ${isPrivate ? 'private' : 'public'} copies:\n`, 'cyan');

  const userRes = await fetchJson(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (userRes.error) error('Session expired or invalid token.');
  const user = userRes.user;

  const userPage = await fetchJson(`${API_BASE}/api/users/${user.username}`);
  if (userPage.error) error('Could not fetch your copies');

  const copies = (userPage.copies || []).filter(c => isPrivate ? c.is_private : !c.is_private);
  
  if (!copies.length) {
    log(`You haven't uploaded any ${isPrivate ? 'private' : 'public'} copies yet.`, 'yellow');
    return;
  }

  log(`Found ${copies.length} ${isPrivate ? 'private' : 'public'} copies:\n`, 'green');
  copies.forEach(c => {
    console.log(`  ${COLORS.cyan}${c.id}${COLORS.reset}`);
    console.log(`    ${c.name} (v${c.version})`);
    console.log(`    ⭐ ${c.rating_average || 0} | 📦 ${c.install_count || 0}`);
    console.log('');
  });
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

  if (copy.memory && copy.has_memory === 1) {
    const memPath = path.join(installPath, 'memory', `${copyId}.md`);
    fs.mkdirSync(path.dirname(memPath), { recursive: true });
    fs.writeFileSync(memPath, copy.memory);
    log(`  🧠 memory/${copyId}.md`, 'yellow');
  }

  // Track install
  await postJson(`${API_BASE}/api/copies/${copyId}/install`, {});

  log(`\n✅ Installed to ${installPath}`, 'green');
  log(`\nTo use this copy, copy these files to your OpenClaw workspace.`, 'cyan');
}

async function upload() {
  const token = getToken();
  if (!token) error('Please provide token: clawfactory upload TOKEN=<your-token> or set CLAWFACTORY_TOKEN');

  log('\n📤 Upload a copy\n', 'cyan');

  // Get user info first
  const userRes = await fetchJson(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (userRes.error) error('Session expired or invalid token.');
  const user = userRes.user;

  // Check for existing copies
  const myCopiesRes = await fetchJson(`${API_BASE}/api/users/${user.username}`);
  const myCopies = myCopiesRes.copies || [];

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  let copyId = null;

  // If user has existing copies, offer to update one
  if (myCopies.length > 0) {
    log('Your existing copies:', 'yellow');
    myCopies.forEach((c, i) => {
      log(`  ${i + 1}. ${c.id} (v${c.version}) - ${c.name}`, 'cyan');
    });
    log(`  ${myCopies.length + 1}. Create new copy`, 'cyan');

    const choice = await new Promise(r => rl.question('\nChoose (number) or press Enter for new: ', r));

    const num = parseInt(choice);
    if (num >= 1 && num <= myCopies.length) {
      copyId = myCopies[num - 1].id;
      log(`\n📝 Updating: ${copyId}`, 'cyan');
    }
  }

  if (!copyId) {
    const name = await new Promise(r => rl.question('Copy ID name: ', r));
    copyId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    log(`\n📦 Creating new copy: ${copyId}`, 'cyan');
  }

  // Ask for copy details (reuse existing values if updating)
  const existingCopy = myCopies.find(c => c.id === copyId);

  // Version selection for updates
  let version = null;
  if (existingCopy) {
    log(`\n📌 Current version: ${existingCopy.version}`, 'yellow');
    log('Choose version bump:', 'cyan');
    log('  1. Patch (1.0.0 → 1.0.1) - Bug fixes');
    log('  2. Minor (1.0.0 → 1.1.0) - New features');
    log('  3. Major (1.0.0 → 2.0.0) - Breaking changes');
    log('  4. Custom version');
    log('  5. Keep current (auto-detect)');
    
    const rlVersion = readline.createInterface({ input: process.stdin, output: process.stdout });
    const vChoice = await new Promise(r => rlVersion.question('\nVersion choice (1-5): ', r));
    rlVersion.close();
    
    const parts = existingCopy.version.split('.').map(Number);
    switch (vChoice) {
      case '1': // patch
        version = `${parts[0]}.${parts[1]}.${(parts[2] || 0) + 1}`;
        break;
      case '2': // minor
        version = `${parts[0]}.${(parts[1] || 0) + 1}.${parts[2] || 0}`;
        break;
      case '3': // major
        version = `${(parts[0] || 1) + 1}.${parts[1] || 0}.${parts[2] || 0}`;
        break;
      case '4': // custom
        const rlCustom = readline.createInterface({ input: process.stdin, output: process.stdout });
        version = await new Promise(r => rlCustom.question('Custom version (e.g., 1.5.0): ', r));
        rlCustom.close();
        break;
      default:
        version = null; // auto-detect by backend
    }
    log(`\n📦 Version: ${version || 'auto'}, copy: ${copyId}`, 'cyan');
  }

  const name = existingCopy?.name || await new Promise(r => rl.question('Display name: ', r));
  const description = existingCopy?.description || await new Promise(r => rl.question('Description: ', r));
  // Author is automatically set to the logged-in user's username
  const author = user.username;
  const category = existingCopy?.category || (await new Promise(r => rl.question('Category (financial/frontend-dev/backend-dev/pm/designer/marketing/secretary/video-maker/productivity/content/research/others/undefined): ', r))) || 'undefined';
  
  // Memory option - use existing value for updates, prompt for new
  let hasMemory = existingCopy?.has_memory === 1;
  if (!existingCopy) {
    hasMemory = (await new Promise(r => rl.question('Include memory files? (y/n): ', r))) === 'y';
  }

  const isPrivate = existingCopy?.is_private === 1 || (await new Promise(r => rl.question('Private? (y/n): ', r))) === 'y';

  // Read SKILL.md if it exists in current directory
  let skillContent = '';
  if (fs.existsSync('SKILL.md')) {
    const readSkill = await new Promise(r => rl.question('Found SKILL.md in current directory. Use it? (y/n): ', r));
    if (readSkill.toLowerCase() === 'y') {
      try {
        skillContent = fs.readFileSync('SKILL.md', 'utf8');
        log('📄 Using existing SKILL.md content', 'cyan');
      } catch (e) {
        log(`Could not read SKILL.md: ${e.message}`, 'yellow');
      }
    }
  }

  log('\n⬆️  Uploading...', 'cyan');
  rl.close();

  // Read memory files if requested
  let memoryContent = '';
  if (hasMemory) {
    const memoryPath = path.join(process.cwd(), 'memory');
    if (fs.existsSync(memoryPath)) {
      const files = fs.readdirSync(memoryPath).filter(f => f.endsWith('.md'));
      if (files.length > 0) {
        memoryContent = files.map(f => {
          const content = fs.readFileSync(path.join(memoryPath, f), 'utf8');
          return `## ${f}\n\n${content}`;
        }).join('\n\n---\n\n');
        log(`📦 Found ${files.length} memory file(s)`, 'cyan');
      } else {
        log('⚠️  memory/ directory exists but no .md files found', 'yellow');
      }
    } else {
      log('⚠️  memory/ directory not found (will skip memory upload)', 'yellow');
      hasMemory = false;
    }
  }

  const res = await postJson(`${API_BASE}/api/copies`, {
    copyId,
    name,
    description,
    author,
    category,
    skills: [],
    tags: [],
    files: { 
      'SKILL.md': skillContent || `# ${name}\n\n${description}`
    },
    memory: memoryContent || undefined,
    has_memory: hasMemory,
    version,
    is_private: isPrivate,
    is_public: !isPrivate,
    user_id: user.id,
    username: user.username
  }, { Authorization: `Bearer ${token}` });

  if (res.error) error(res.error);
  log(`\n✅ ${res.isUpdate ? `Updated to v${res.version}` : 'Created'} copy: ${res.id}`, 'green');
  log(`\n🔗 URL: ${API_BASE}/#/${user.username}/${res.id}`, 'cyan');
}

async function secretUpload(copyId) {
  const token = getToken();
  if (!token) error('Please provide token: clawfactory secret upload TOKEN=<your-token> or set CLAWFACTORY_TOKEN');

  log('\n🔐 Upload with secrets\n', 'cyan');

  // Check for .env file
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    error('.env file not found in current directory');
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  log('Found .env file', 'cyan');

  // Encrypt secrets
  const secretKey = crypto.randomBytes(32).toString('hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey.padEnd(32).slice(0, 32)), iv);
  let encrypted = cipher.update(envContent, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const encryptedData = iv.toString('hex') + ':' + encrypted;

  log('🔒 Secrets encrypted', 'green');

  // Read SKILL.md if exists
  let skillContent = '';
  if (fs.existsSync('SKILL.md')) {
    skillContent = fs.readFileSync('SKILL.md', 'utf8');
  }

  // Get user info
  const userRes = await fetchJson(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (userRes.error) error('Session expired or invalid token.');
  const user = userRes.user;

  log('\n⬆️  Uploading with secrets...', 'cyan');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const name = await new Promise(r => rl.question('Copy ID name: ', r));
  const description = await new Promise(r => rl.question('Description: ', r));
  const category = await new Promise(r => rl.question('Category: ', r)) || 'others';
  const skills = await new Promise(r => rl.question('Skills (comma-separated): ', r));
  rl.close();

  const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const res = await postJson(`${API_BASE}/api/copies`, {
    copyId: id,
    name,
    description,
    author: user.username,
    category,
    skills: skills.split(',').map(s => s.trim()).filter(Boolean),
    files: { 'SKILL.md': skillContent || `# ${name}\n\n${description}` },
    has_secrets: true,
    encrypted_secrets: encryptedData,
    is_private: false,
    user_id: user.id,
    username: user.username
  }, { Authorization: `Bearer ${token}` });

  if (res.error) error(res.error);

  log(`\n✅ Uploaded with secrets!`, 'green');
  log(`\n🔑 SAVE THIS KEY - You'll need it to install:\n${COLORS.yellow}${secretKey}${COLORS.reset}`, 'green');
  log(`\n🔗 URL: ${API_BASE}/#/${user.username}/${res.id}`, 'cyan');
  log('\n⚠️  The secret key is shown ONLY once. Save it somewhere safe!', 'yellow');
}

async function secretInstall(copyId, secretKey) {
  if (!copyId) error('Usage: clawfactory secret-install <copy-id> <secret-key>');
  if (!secretKey) error('Usage: clawfactory secret-install <copy-id> <secret-key>');

  log(`🔓 Installing encrypted copy "${copyId}"...`, 'cyan');

  const copy = await fetchJson(`${API_BASE}/api/copies/${copyId}`);
  if (copy.error) error(`Copy not found: ${copyId}`);

  if (!copy.has_secrets) {
    error('This copy does not have secrets. Use "clawfactory install" instead.');
  }

  if (!copy.encrypted_secrets) {
    error('Encrypted secrets not found for this copy.');
  }

  try {
    // Decrypt
    const [ivHex, encrypted] = copy.encrypted_secrets.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey.padEnd(32).slice(0, 32)), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // Save .env
    const envPath = path.join(DATA_DIR, 'copies', copyId, '.env');
    fs.mkdirSync(path.dirname(envPath), { recursive: true });
    fs.writeFileSync(envPath, decrypted);
    log(`  📄 .env`, 'yellow');

    // Save regular files
    const files = copy.files ? (typeof copy.files === 'string' ? JSON.parse(copy.files) : copy.files) : {};
    for (const [filename, content] of Object.entries(files || {})) {
      fs.writeFileSync(path.join(DATA_DIR, 'copies', copyId, filename), content);
      log(`  📄 ${filename}`, 'yellow');
    }

    // Track install
    await postJson(`${API_BASE}/api/copies/${copyId}/install`, {});

    log(`\n✅ Installed to ${path.join(DATA_DIR, 'copies', copyId)}`, 'green');
    log('\n🔐 Secrets decrypted and saved to .env', 'green');
  } catch (e) {
    error(`Decryption failed. Check your secret key: ${e.message}`);
  }
}

function showHelp() {
  console.log(`
🦞 ClawFactory CLI - OpenClaw Copy Registry

${COLORS.green}Usage:${COLORS.reset}
  clawfactory <command> [options]

${COLORS.green}Commands:${COLORS.reset}
  install <copy-id>        Install a copy
  copy <copy-id>           Alias for install
  upload                   Upload a copy (requires token)
  secret upload            Upload with .env secrets
  secret install <id> <key> Install encrypted copy
  hottest                 Install the top-rated copy
  mine                    List your copies
  mine --private          List your private copies
  search <query>          Search for copies

${COLORS.green}Setup:${COLORS.reset}
  Get your token from https://clawfactory.ai/username/account
  
  Use token directly:
    clawfactory upload TOKEN=<your-token>
    clawfactory mine TOKEN=<your-token>
  
  Or save to file:
    echo <your-token> > ~/.clawfactory/token
    export CLAWFACTORY_TOKEN=<your-token>

${COLORS.green}Examples:${COLORS.reset}
  clawfactory install polymarket-trader
  clawfactory copy polymarket-trader
  clawfactory upload TOKEN=clawfactory_xxx
  clawfactory secret upload TOKEN=clawfactory_xxx
  clawfactory mine TOKEN=clawfactory_xxx
  clawfactory mine --private TOKEN=clawfactory_xxx
  clawfactory hottest
  clawfactory search trading

${COLORS.green}Website:${COLORS.reset}
  https://clawfactory.ai
`);
}

const cmd = args[0] || 'help';

switch (cmd) {
  case 'install': case 'add': case 'i': install(args[1]); break;
  case 'copy': copy(args[1]); break;
  case 'hottest': hottest(); break;
  case 'search': case 's': search(args[1]); break;
  case 'mine': mine(); break;
  case 'upload': upload(); break;
  case 'secret': 
    if (args[1] === 'upload') secretUpload();
    else if (args[1] === 'install') secretInstall(args[2], args[3]);
    else showHelp();
    break;
  case 'secret-upload': secretUpload(); break;
  case 'secret-install': secretInstall(args[1], args[2]); break;
  case 'help': case '--help': case '-h': showHelp(); break;
  default: log(`Unknown command: ${cmd}`, 'red'); showHelp();
}
