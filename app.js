// ClawFactory App - Phase 6
// Simplified app with token-based auth

let currentUser = null;
let pageHistory = [];

async function init() {
  checkAuth();
  loadFeaturedCopies();
  loadCategories();
  handleRoute();
}

// Path-first routing (supports /username/slug), with hash fallback
function getCurrentRoute() {
  const pathname = window.location.pathname || '/';
  if (pathname !== '/' && !pathname.includes('.')) return pathname;
  const hash = window.location.hash.slice(1) || '/';
  return hash;
}

function handleRoute() {
  const route = getCurrentRoute();
  const normalized = route.replace(/^\/+/, '');
  const parts = normalized.split('/').filter(Boolean);

  if (parts.length === 2 && !parts[0].startsWith('page')) {
    showUserCopyPage(parts[0], parts[1]);
  } else if (parts.length === 1 && !parts[0].startsWith('page') && route !== '/') {
    showUserPage(parts[0]);
  } else if (route === '/') {
    switchPage('home');
  } else if (route.startsWith('page=')) {
    switchPage(route.replace('page=', ''));
  }
}

function navigate(route) {
  if (route.startsWith('/')) {
    history.pushState({}, '', route);
  } else {
    window.location.hash = route;
  }
  handleRoute();
}

function goBack() {
  if (pageHistory.length > 0) {
    const prev = pageHistory.pop();
    window.location.hash = prev;
    handleRoute();
    return;
  }
  if (document.referrer && document.referrer.includes(window.location.host)) {
    window.history.back();
    return;
  }
  const currentHash = window.location.hash.slice(1) || '/';
  const parts = currentHash.split('/').filter(Boolean);
  if (currentHash.startsWith('page=')) {
    navigate('/');
  } else if (parts.length >= 2) {
    navigate(`/${parts[0]}`);
  } else if (parts.length === 1 && parts[0]) {
    navigate('/');
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
    list.innerHTML = '<p>No public copies yet.</p>';
    return;
  }
  
  list.innerHTML = `<div class="copy-grid">${data.copies.map(c => renderCopyCard(c)).join('')}</div>`;
}

async function showUserCopyPage(username, copySlug) {
  pageHistory.push(window.location.pathname || window.location.hash.slice(1));
  const copy = await API.getUserCopy(username, copySlug);
  if (copy.error) {
    showNotification('Copy not found');
    navigate('/');
    return;
  }
  
  document.querySelectorAll('[id$="Page"]').forEach(p => p.style.display = 'none');
  document.getElementById('userCopyPage').style.display = 'block';
  document.getElementById('userCopyTitle').textContent = copy.name;

  const installCmd = `clawfactory install ${copy.id}`;
  const skills = (copy.skills || []).join(', ');
  const files = Object.keys(copy.files || {});
  
  document.getElementById('userCopyDetail').innerHTML = `
    <article class="copy-detail copy-detail-page">
      <div class="copy-hero">
        <p class="copy-author">by <a href="/${username}" onclick="navigate('/${username}'); return false;">@${username}</a></p>
        <h2>${copy.name}</h2>
        <p class="copy-description">${copy.description || ''}</p>
        <div class="copy-meta">
          <span>⭐ ${copy.rating_average || 0}</span>
          <span>📦 ${copy.install_count || 0}</span>
          <span>${copy.category || 'others'}</span>
          ${copy.model ? `<span>🤖 ${copy.model}</span>` : ''}
          <span>v${copy.version || '1.0.0'}</span>
        </div>
        ${skills ? `<div class="copy-skills">${skills}</div>` : ''}
      </div>
      <div class="install-panel">
        <h3>Install</h3>
        <div class="install-command-box">
          <code id="installCommand">${installCmd}</code>
          <button class="btn btn-primary" onclick="copyInstallCommand('${copy.id}')">Copy command</button>
        </div>
      </div>
      <div class="copy-actions">
        <button class="btn btn-secondary" onclick="rateCopy('${copy.id}')">Rate</button>
      </div>
      <h3>Files</h3>
      <pre>${files.length ? files.join('\n') : 'No files listed'}</pre>
    </article>
  `;
}

async function checkAuth() {
  const token = localStorage.getItem('clawfactory_token');
  if (token) {
    API.setToken(token);
    const res = await API.getMe();
    if (res.user) currentUser = res.user;
  }
  updateAuthUI();
}

function updateAuthUI() {
  const loginLink = document.getElementById('loginLink');
  const logoutBtn = document.getElementById('logoutBtn');
  const userDisplay = document.getElementById('userDisplay');

  if (currentUser) {
    loginLink.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    userDisplay.style.display = 'inline';
    userDisplay.textContent = `Hi, ${currentUser.username}`;
  } else {
    loginLink.style.display = 'inline';
    logoutBtn.style.display = 'none';
    userDisplay.style.display = 'none';
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('clawfactory_token');
  API.setToken(null);
  updateAuthUI();
  showNotification('Logged out');
  switchPage('home');
}

async function rateCopy(copyId) {
  if (!currentUser) {
    showNotification('Please login first');
    switchPage('login');
    return;
  }
  const rating = prompt('Rate (1-5 stars):', '5');
  if (!rating) return;
  const res = await API.rateCopy(copyId, parseInt(rating));
  if (res.success) showNotification('Rating saved!');
  else showNotification(res.error || 'Failed to save rating');
}

function copyInstallCommand(copyId) {
  const cmd = `clawfactory install ${copyId}`;
  navigator.clipboard?.writeText(cmd);
  showNotification('Command copied!');
}

const pages = ['home', 'copies', 'categories', 'search', 'upload', 'login', 'my-copies'];

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

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = document.getElementById('loginToken').value.trim();
  if (token) {
    // Token login
    localStorage.setItem('clawfactory_token', token);
    API.setToken(token);
    await checkAuth();
    if (currentUser) {
      showNotification('Token saved!');
      switchPage('home');
    } else {
      showNotification('Invalid token');
    }
  }
});

document.getElementById('loginPasswordForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  const res = await API.login(username, password);
  if (res.success && res.token) {
    showNotification('Logged in!');
    switchPage('home');
  } else {
    showNotification(res.error || 'Login failed');
  }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('regUsername').value;
  const password = document.getElementById('regPassword').value;
  
  const res = await API.register(username, password);
  if (res.success && res.token) {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('tokenResult').style.display = 'block';
    document.getElementById('userToken').textContent = res.token;
    window.pendingToken = res.token;
  } else {
    showNotification(res.error || 'Registration failed');
  }
});

function saveTokenAndContinue() {
  if (window.pendingToken) {
    localStorage.setItem('clawfactory_token', window.pendingToken);
    API.setToken(window.pendingToken);
    checkAuth().then(() => {
      showNotification('Token saved!');
      switchPage('home');
    });
  }
}

document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) { showNotification('Please login first'); switchPage('login'); return; }
  const copy = await API.createCopy({
    name: document.getElementById('copyName').value,
    description: document.getElementById('copyDescription').value,
    author: document.getElementById('copyAuthor').value,
    category: document.getElementById('copyCategory').value,
    model: document.getElementById('copyModel').value,
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

document.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
document.querySelector('.modal-close')?.addEventListener('click', closeModal);

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { console.log('[App] Starting...'); init(); }, 100);
  window.addEventListener('popstate', handleRoute);
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page) { switchPage(page); console.log('[App] Nav click:', page); }
    });
  });
});

function closeModal() {
  document.getElementById('copyModal').style.display = 'none';
  document.querySelector('.modal-overlay').style.display = 'none';
}

function renderCopyCard(copy) {
  return `<article class="copy-card" onclick="navigate('/${copy.username}/${copy.id}')">
    <h3>${copy.name}</h3>
    <p>${copy.description?.slice(0, 80) || ''}...</p>
    <div class="copy-meta">
      <span>⭐ ${copy.rating_average || 0}</span>
      <span>📦 ${copy.install_count || 0}</span>
      <span>${copy.category}</span>
    </div>
  </article>`;
}

async function loadFeaturedCopies() {
  const container = document.getElementById('featuredCopies');
  if (!container) return;
  container.innerHTML = '<p>Loading...</p>';
  console.log('[App] Loading featured copies...');
  try {
    const copies = await API.getFeatured();
    console.log('[App] Featured copies:', copies);
    if (!copies?.length) { container.innerHTML = '<p>No featured copies yet.</p>'; return; }
    container.innerHTML = `<div class="copy-grid">${copies.map(c => renderCopyCard(c)).join('')}</div>`;
  } catch (err) {
    console.error('[App] Failed to load featured:', err);
    container.innerHTML = '<p>Failed to load copies.</p>';
  }
}

async function loadAllCopies() {
  const container = document.getElementById('allCopies');
  if (!container) return;
  container.innerHTML = '<p>Loading...</p>';
  try {
    const copies = await API.getAll();
    if (!copies?.length) { container.innerHTML = '<p>No copies available.</p>'; return; }
    container.innerHTML = `<div class="copy-grid">${copies.map(c => renderCopyCard(c)).join('')}</div>`;
  } catch (err) {
    container.innerHTML = '<p>Failed to load copies.</p>';
  }
}

async function loadCategories() {
  const container = document.getElementById('categoryList');
  if (!container) return;
  try {
    const cats = await API.getCategories();
    container.innerHTML = cats.map(c => `<a href="#" onclick="navigate('/?category=${c.category}'); return false;">${c.icon || ''} ${c.category} (${c.count})</a>`).join('');
  } catch (err) {
    container.innerHTML = '<p>Failed to load categories.</p>';
  }
}

async function searchCopies(query) {
  if (!query) return;
  const container = document.getElementById('searchResults');
  if (!container) return;
  container.innerHTML = '<p>Searching...</p>';
  try {
    const results = await API.search(query);
    if (!results?.length) { container.innerHTML = '<p>No results found.</p>'; return; }
    container.innerHTML = `<h2>Search Results for "${query}"</h2><div class="copy-grid">${results.map(c => renderCopyCard(c)).join('')}</div>`;
  } catch (err) {
    container.innerHTML = '<p>Search failed.</p>';
  }
}
