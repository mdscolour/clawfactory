// ClawFactory App - Phase 6
// Simplified app with user system and new UI

let currentUser = null;
let pageHistory = [];

async function init() {
  checkAuth();
  loadFeaturedCopies();
  loadCategories();
  handleRoute();
}

// Simple hash-based routing
function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);
  
  if (parts.length === 2 && !parts[0].startsWith('page')) {
    // User copy page: /username/copySlug
    showUserCopyPage(parts[0], parts[1]);
  } else if (parts.length === 1 && !parts[0].startsWith('page')) {
    // User page: /username
    showUserPage(parts[0]);
  } else if (hash === '/') {
    switchPage('home');
  } else if (hash.startsWith('page=')) {
    switchPage(hash.replace('page=', ''));
  }
}

function navigate(hash) {
  window.location.hash = hash;
  handleRoute();
}

function goBack() {
  if (pageHistory.length > 0) {
    const prev = pageHistory.pop();
    window.location.hash = prev;
    handleRoute();
  } else {
    navigate('/');
  }
}

async function showUserPage(username) {
  pageHistory.push(window.location.hash.slice(1));
  const data = await API.getUser(username);
  if (data.error) {
    showNotification('User not found');
    navigate('/');
    return;
  }
  
  document.querySelectorAll('[id$="Page"]').forEach(p => p.style.display = 'none');
  document.getElementById('userPage').style.display = 'block';
  document.getElementById('userPageTitle').textContent = `@${username}'s Copies`;
  
  const list = document.getElementById('userCopiesList');
  if (!data.copies?.length) {
    list.innerHTML = '<p class="empty-message">No public copies yet.</p>';
    return;
  }
  
  list.innerHTML = data.copies.map(c => renderCopyCard(c)).join('');
}

async function showUserCopyPage(username, copySlug) {
  pageHistory.push(window.location.hash.slice(1));
  const copy = await API.getUserCopy(username, copySlug);
  if (copy.error) {
    showNotification('Copy not found');
    navigate('/');
    return;
  }
  
  document.querySelectorAll('[id$="Page"]').forEach(p => p.style.display = 'none');
  document.getElementById('userCopyPage').style.display = 'block';
  document.getElementById('userCopyTitle').textContent = copy.name;
  
  const detail = document.getElementById('userCopyDetail');
  detail.innerHTML = `
    <div class="copy-detail">
      <p class="copy-author">by <a href="#/${username}" onclick="navigate('/${username}')">@${username}</a></p>
      <p>${copy.description}</p>
      <div class="copy-meta">
        <span>⭐ ${copy.rating_average || 0}</span>
        <span>📦 ${copy.install_count || 0}</span>
        <span>${copy.category}</span>
        <span>v${copy.version}</span>
      </div>
      <div class="copy-skills">${copy.skills?.join(', ')}</div>
      <div class="copy-actions">
        <button class="btn btn-primary" onclick="installCopy('${copy.id}')">Install</button>
        <button class="btn btn-secondary" onclick="rateCopy('${copy.id}')">Rate</button>
      </div>
      <h3>Files</h3>
      <pre>${Object.keys(copy.files || {}).join('\n')}</pre>
    </div>
  `;
}

function checkAuth() {
  const token = localStorage.getItem('clawfactory_token');
  if (token) {
    API.setToken(token);
    API.getMe().then(res => {
      if (res.user) {
        currentUser = res.user;
        updateAuthUI();
      } else {
        localStorage.removeItem('clawfactory_token');
      }
    });
  }
}

function updateAuthUI() {
  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');
  const userDisplay = document.getElementById('userDisplay');
  const logoutBtn = document.getElementById('logoutBtn');

  if (currentUser) {
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    userDisplay.style.display = 'inline';
    userDisplay.textContent = `Hi, ${currentUser.username}`;
    logoutBtn.style.display = 'inline-block';
  } else {
    loginLink.style.display = 'inline';
    registerLink.style.display = 'inline';
    userDisplay.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
}

function logout() {
  localStorage.removeItem('clawfactory_token');
  currentUser = null;
  updateAuthUI();
  switchPage('home');
  showNotification('Logged out!');
}

async function loadFeaturedCopies() {
  console.log('[App] Loading featured copies...');
  try {
    const featured = await API.getFeatured();
    console.log('[App] Featured:', featured);
    const container = document.getElementById('popularCopies');
    
    if (!featured?.length) {
      container.innerHTML = '<p class="empty-message">No copies yet. Be the first to upload!</p>';
      return;
    }
    container.innerHTML = featured.map(c => renderCopyCard(c)).join('');
    console.log('[App] Rendered', featured.length, 'featured copies');
  } catch (err) {
    console.error('[App] Error loading featured:', err);
  }
}

async function loadCategories() {
  const categories = await API.getCategories();
  const chips = document.getElementById('categoryChips');
  const grid = document.getElementById('categoryGrid');
  
  chips.innerHTML = '<span class="chip active" data-category="">All</span>' +
    categories.map(c => `<span class="chip" data-category="${c.category}">${c.category} (${c.count})</span>`).join('');
  
  grid.innerHTML = categories.map(c => `
    <div class="category-card" onclick="showCategory('${c.category}')">
      <h3>${c.category}</h3>
      <p>${c.count} copies</p>
    </div>
  `).join('');
}

async function loadAllCopies(category = '') {
  const copies = await API.getCopies();
  const filtered = category ? copies.filter(c => c.category === category) : copies;
  const container = document.getElementById('allCopies');
  container.innerHTML = filtered.length ? filtered.map(c => renderCopyCard(c)).join('') : '<p class="empty-message">No copies found.</p>';
}

function renderCopyCard(copy) {
  const skills = copy.skills?.slice(0, 3).join(', ') || '';
  return `
    <div class="copy-card" onclick="showCopyDetail('${copy.id}')">
      <h3>${copy.name}</h3>
      <p class="copy-author">by ${copy.author}</p>
      <p class="copy-desc">${copy.description?.slice(0, 100)}...</p>
      <div class="copy-meta">
        <span>⭐ ${copy.rating_average || 0}</span>
        <span>📦 ${copy.install_count || 0}</span>
        <span>${copy.category}</span>
      </div>
      ${skills ? `<div class="copy-skills">${skills}</div>` : ''}
    </div>
  `;
}

async function showCopyDetail(id) {
  const copy = await API.getCopy(id);
  if (copy.error) { showNotification(copy.error); return; }

  const modal = document.getElementById('copyModal');
  const body = document.getElementById('modalBody');
  
  body.innerHTML = `
    <h2>${copy.name}</h2>
    <p class="copy-author">by ${copy.author}</p>
    <p>${copy.description}</p>
    <div class="copy-meta">
      <span>⭐ ${copy.rating_average || 0}</span>
      <span>📦 ${copy.install_count || 0}</span>
      <span>${copy.category}</span>
    </div>
    <div class="copy-skills">${copy.skills?.join(', ')}</div>
    <div class="copy-actions">
      <button class="btn btn-primary" onclick="installCopy('${copy.id}')">Install</button>
      <button class="btn btn-secondary" onclick="rateCopy('${copy.id}')">Rate</button>
    </div>
    <h3>Files</h3>
    <pre>${Object.keys(copy.files || {}).join('\n')}</pre>
  `;
  
  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('copyModal').classList.remove('active');
}

function installCopy(id) {
  const cmd = `clawfactory install ${id}`;
  navigator.clipboard.writeText(cmd).then(() => showNotification('Command copied!'));
  showNotification(`Run: ${cmd}`);
}

function rateCopy(id) {
  const rating = prompt('Rate this copy (1-5):');
  if (rating && currentUser) {
    API.rateCopy(id, parseInt(rating)).then(() => showNotification('Rating saved!'));
  } else if (!currentUser) {
    showNotification('Please login first');
  }
}

function showCategory(category) {
  switchPage('copies');
  loadAllCopies(category);
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.dataset.category === category);
  });
}

async function handleSearch(query) {
  if (!query) {
    document.getElementById('searchResults').innerHTML = '';
    return;
  }
  const results = await API.search(query);
  document.getElementById('searchResults').innerHTML = results.length ? results.map(c => renderCopyCard(c)).join('') : '<p class="empty-message">No results.</p>';
}

function handlePrivateUpload() {
  if (!currentUser) {
    showNotification('Please login first');
    switchPage('login');
    return;
  }
  switchPage('upload');
}

// Page switching
const pages = ['home', 'copies', 'categories', 'search', 'upload', 'login', 'register', 'my-copies'];

function switchPage(page) {
  pages.forEach(p => {
    const el = document.getElementById(`${p}Page`);
    if (el) el.style.display = p === page ? 'block' : 'none';
  });
  
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  if (page === 'copies') loadAllCopies();
  if (page === 'my-copies') loadMyCopies();
  if (page === 'home') loadFeaturedCopies();
}

async function loadMyCopies() {
  if (!currentUser) {
    document.getElementById('myCopiesList').innerHTML = '<p>Please login to see your copies.</p>';
    return;
  }
  const copies = await API.getUserCopies(currentUser.id);
  document.getElementById('myCopiesList').innerHTML = copies.length ? copies.map(c => renderCopyCard(c)).join('') : '<p>No copies yet.</p>';
}

function showNotification(msg) {
  const n = document.createElement('div');
  n.className = 'notification';
  n.textContent = msg;
  n.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--primary);color:#fff;padding:12px 24px;border-radius:8px;z-index:1000;animation:fadeIn 0.3s;';
  document.body.appendChild(n);
  setTimeout(() => { n.style.opacity='0'; setTimeout(()=>n.remove(),300); }, 3000);
}

// Form handlers
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await API.login(document.getElementById('loginUsername').value);
  if (res.success) {
    currentUser = res.user;
    updateAuthUI();
    showNotification('Logged in!');
    switchPage('home');
  } else {
    showNotification(res.error || 'Login failed');
  }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await API.register(document.getElementById('regUsername').value, document.getElementById('regEmail').value, document.getElementById('regPassword').value);
  if (res.success) {
    currentUser = res.user;
    updateAuthUI();
    showNotification('Registered!');
    switchPage('home');
  } else {
    showNotification(res.error || 'Registration failed');
  }
});

document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) { showNotification('Please login first'); switchPage('login'); return; }
  
  const copy = await API.createCopy({
    name: document.getElementById('copyName').value,
    description: document.getElementById('copyDescription').value,
    author: document.getElementById('copyAuthor').value,
    category: document.getElementById('copyCategory').value,
    skills: document.getElementById('copySkills').value.split(',').map(s=>s.trim()).filter(Boolean),
    tags: document.getElementById('copyTags').value.split(',').map(t=>t.trim()).filter(Boolean),
    files: { 'SKILL.md': document.getElementById('copyName').value },
    isPrivate: document.getElementById('copyPrivate').checked
  });

  if (copy.success) {
    showNotification(copy.isUpdate ? 'Copy updated!' : 'Copy created!');
    switchPage('home');
  } else {
    showNotification(copy.error || 'Upload failed');
  }
});

// Google Login (requires Google OAuth setup)
async function googleLogin() {
  // Check if Google Identity Services is loaded
  if (typeof google !== 'undefined' && google.accounts) {
    // Use Google Identity Services
    google.accounts.id.initialize({
      client_id: window.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
      callback: handleGoogleResponse
    });
    google.accounts.id.renderButton(
      document.querySelector('.btn-google'),
      { theme: 'outline', size: 'large' }
    );
    google.accounts.id.prompt();
  } else {
    // Fallback: manual token entry for testing
    const token = prompt('Enter Google ID token (for testing):');
    if (token) {
      // In production, verify token with Google
      // For now, use mock login
      await mockGoogleLogin(token);
    }
  }
}

async function handleGoogleResponse(response) {
  await mockGoogleLogin(response.credential);
}

async function mockGoogleLogin(credential) {
  // In production, decode and verify JWT
  // For demo, parse basic claims
  try {
    const parts = credential.split('.');
    if (parts.length !== 3) {
      // Mock data for testing
      await API.googleAuth('mock-google-id', 'user@gmail.com', 'Google User');
      return;
    }
    const payload = JSON.parse(atob(parts[1]));
    await API.googleAuth(payload.sub, payload.email, payload.name);
  } catch (err) {
    console.error('Google login error:', err);
    showNotification('Google login failed');
  }
}

// Modal close on overlay click
document.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
document.querySelector('.modal-close')?.addEventListener('click', closeModal);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for API to initialize
  setTimeout(() => {
    console.log('[App] Starting...');
    init();
  }, 100);
  
  // FIX: Add click handlers to nav links
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page) {
        switchPage(page);
        console.log('[App] Nav click:', page);
      }
    });
  });
  
  console.log('[App] Nav click handlers added');
});
