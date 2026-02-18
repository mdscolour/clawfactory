// ClawFactory App - Phase 6
// Simplified app with token-based auth

let currentUser = null;
let pageHistory = [];

async function init() {
  API.init();
  await checkAuth();
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

  // /username/account - User account page (requires login)
  if (parts.length === 2 && parts[1] === 'account') {
    showUserAccountPage(parts[0]);
    return;
  }
  
  // /username/private/ID - Private copy (requires login)
  if (parts.length === 3 && parts[1] === 'private') {
    handlePrivateCopyPage(parts[0], parts[2]);
    return;
  }
  
  // /username/ID - Public copy (no login required)
  if (parts.length === 2 && !parts[0].startsWith('page') && parts[1] !== 'account') {
    showUserCopyPage(parts[0], parts[1]);
    return;
  }
  
  // /username - User profile page
  if (parts.length === 1 && !parts[0].startsWith('page') && route !== '/') {
    showUserPage(parts[0]);
    return;
  }
  
  // Homepage
  if (route === '/') {
    switchPage('home');
    return;
  }
  
  // Hash-based pages
  if (route.startsWith('page=')) {
    switchPage(route.replace('page=', ''));
  }
}

async function handlePrivateCopyPage(username, copyId) {
  // Check if logged in
  if (!currentUser) {
    showNotification('Please login to view private copies');
    switchPage('login');
    return;
  }
  
  // Load private copy
  pageHistory.push(window.location.hash.slice(1));
  const data = await API.getPrivateCopy(copyId, currentUser.id);
  
  if (data.error) {
    showNotification('Private copy not found or access denied');
    navigate(`/${username}/account`);
    return;
  }
  
  // Hide all pages
  pages.forEach(p => {
    const el = document.getElementById(`${p}Page`);
    if (el) el.style.display = 'none';
  });
  
  // Show copy detail page
  const userCopyPage = document.getElementById('userCopyPage');
  if (userCopyPage) {
    userCopyPage.style.display = 'block';
    document.getElementById('userCopyTitle').textContent = data.name || copyId;
    document.getElementById('userCopyDetail').innerHTML = renderPrivateCopyDetail(data);
  }
}

function renderPrivateCopyDetail(copy) {
  return `
    <div class="copy-detail" style="padding: 20px;">
      <div style="background: var(--bg-secondary); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <p><strong>🔒 Private Copy</strong></p>
        <p>${copy.description || 'No description'}</p>
        <p><strong>Author:</strong> @${copy.author || 'unknown'}</p>
        ${copy.features ? `<p><strong>Features:</strong> ${copy.features.join(', ')}</p>` : ''}
      </div>
      <div style="background: var(--bg-secondary); border-radius: 12px; padding: 20px;">
        <h3>Installation</h3>
        <pre style="background: var(--bg-primary); padding: 12px; border-radius: 8px; overflow-x: auto;">clawfactory install ${copy.id}</pre>
      </div>
    </div>
  `;
}

function showUserAccountPage(username) {
  // Check if logged in
  if (!currentUser) {
    showNotification('Please login first');
    switchPage('login');
    return;
  }
  
  // Navigate to logged-in user's account page
  if (currentUser.username !== username) {
    navigate(`/${currentUser.username}/account`);
    return;
  }
  
  // Show account page
  pages.forEach(p => {
    const el = document.getElementById(`${p}Page`);
    if (el) el.style.display = 'none';
  });
  const userCopyPage = document.getElementById('userCopyPage');
  if (userCopyPage) userCopyPage.style.display = 'none';
  
  const accountPage = document.getElementById('accountPage');
  if (accountPage) {
    accountPage.style.display = 'block';
    loadAccountByUsername(username);
  }
}

function loadAccountByUsername(username) {
  document.getElementById('accountUsername').textContent = username;
  
  // Get tokens from localStorage
  const accessToken = localStorage.getItem('clawfactory_token') || '';
  
  if (accessToken) {
    document.getElementById('accessToken').textContent = accessToken;
  } else {
    document.getElementById('accessToken').textContent = 'Login to get token';
  }
}

function navigateAccount() {
  if (currentUser) {
    navigate(`/${currentUser.username}/account`);
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
  const registerLink = document.getElementById('registerLink');
  const accountLink = document.getElementById('accountLink');
  const logoutBtn = document.getElementById('logoutBtn');
  const userDisplay = document.getElementById('userDisplay');

  if (currentUser) {
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    accountLink.style.display = 'inline';
    logoutBtn.style.display = 'inline-block';
    userDisplay.style.display = 'none';
  } else {
    loginLink.style.display = 'inline';
    registerLink.style.display = 'inline';
    accountLink.style.display = 'none';
    logoutBtn.style.display = 'none';
    userDisplay.style.display = 'none';
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('clawfactory_token');
  localStorage.removeItem('clawfactory_sensitive_token');
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

const pages = ['home', 'copies', 'categories', 'search', 'upload', 'login', 'register', 'account', 'my-copies'];

function switchPage(page) {
  pages.forEach(p => {
    const el = document.getElementById(`${p}Page`);
    if (el) el.style.display = p === page ? 'block' : 'none';
  });
  // Always hide userCopyPage when switching pages
  const userCopyPage = document.getElementById('userCopyPage');
  if (userCopyPage) userCopyPage.style.display = 'none';
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });
  if (page === 'copies') loadAllCopies();
  if (page === 'my-copies') loadMyCopies();
  if (page === 'home') loadFeaturedCopies();
  if (page === 'account') loadAccount();
}

async function loadMyCopies() {
  if (!currentUser) {
    document.getElementById('myCopiesList').innerHTML = '<p>Please login to see your copies.</p>';
    return;
  }
  const copies = await API.getUserCopies(currentUser.id);
  document.getElementById('myCopiesList').innerHTML = copies.length ? copies.map(c => renderCopyCard(c)).join('') : '<p>No copies yet.</p>';
}

async function loadAccount() {
  if (!currentUser) {
    switchPage('login');
    return;
  }
  
  document.getElementById('accountUsername').textContent = currentUser.username;
  
  // Get Access Token (from localStorage or current user id)
  const accessToken = localStorage.getItem('clawfactory_token') || currentUser.id;
  document.getElementById('accessToken').textContent = accessToken;
}

function copyAccessToken() {
  const token = document.getElementById('accessToken').textContent;
  navigator.clipboard?.writeText(token);
  showNotification('Access Token copied!');
}

async function revokeToken() {
  if (!currentUser) {
    showNotification('Please login first');
    switchPage('login');
    return;
  }
  
  if (!confirm('Are you sure you want to revoke and regenerate your token? This will invalidate your current token.')) {
    return;
  }
  
  try {
    const res = await API.revokeToken(currentUser.username);
    if (res.success && res.token) {
      localStorage.setItem('clawfactory_token', res.token);
      API.setToken(res.token);
      document.getElementById('accessToken').textContent = res.token;
      showNotification('Token regenerated successfully!');
    } else {
      showNotification(res.error || 'Failed to revoke token');
    }
  } catch (err) {
    console.error('[Revoke] Error:', err);
    showNotification('Error revoking token');
  }
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
      updateAuthUI();
      showNotification('Token saved!');
      navigate(`/${currentUser.username}/account`);
    } else {
      showNotification('Invalid token: ' + (currentUser?.error || 'User not found'));
    }
  }
});

document.getElementById('loginPasswordForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!username || !password) {
    showNotification('Please enter username and password');
    return;
  }
  
  console.log('[Login] Attempting with username:', username);
  
  try {
    const res = await API.login(username, password);
    console.log('[Login] Full response:', JSON.stringify(res));
    
    if (res.success && res.token) {
      console.log('[Login] Success! Saving token...');
      localStorage.setItem('clawfactory_token', res.token);
      API.setToken(res.token);
      // Use user info from response directly
      currentUser = res.user;
      updateAuthUI();
      showNotification('Logged in!');
      console.log('[Login] currentUser:', currentUser);
      console.log('[Login] Navigating to /' + username + '/account');
      navigate(`/${username}/account`);
    } else {
      const msg = res.remainingMin 
        ? `Too many attempts. Try again in ${res.remainingMin} minutes.`
        : res.error || 'Login failed';
      showNotification(msg);
    }
  } catch (err) {
    console.error('[Login] Error:', err);
    showNotification('Login error: ' + err.message);
  }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('regUsername').value;
  const password = document.getElementById('regPassword').value;
  
  if (!username || !password) {
    showNotification('Please enter username and password');
    return;
  }
  
  const res = await API.register(username, password);
  console.log('[Register] Response:', res);
  if (res.success && res.token) {
    // Same as login: save token and navigate to account
    localStorage.setItem('clawfactory_token', res.token);
    API.setToken(res.token);
    currentUser = res.user;
    updateAuthUI();
    showNotification('Registered!');
    navigate(`/${username}/account`);
  } else {
    showNotification('Registration failed: ' + (res.error || res.message || 'Unknown error'));
  }
});

function saveTokenAndContinue() {
  if (window.pendingToken) {
    localStorage.setItem('clawfactory_token', window.pendingToken);
    API.setToken(window.pendingToken);
    // Set user directly from pendingToken info
    if (window.pendingUser) {
      currentUser = window.pendingUser;
      updateAuthUI();
      showNotification('Registered! Token saved!');
      navigate(`/${currentUser.username}/account`);
    } else {
      checkAuth().then(() => {
        updateAuthUI();
        showNotification('Registered! Token saved!');
        const username = currentUser?.username || 'user';
        navigate(`/${username}/account`);
      });
    }
  }
}

function handlePrivateUpload() {
  if (!currentUser) {
    showNotification('Please login first');
    switchPage('login');
    return;
  }
  switchPage('upload');
}

function copyToken() {
  const token = document.getElementById('userToken').textContent;
  navigator.clipboard?.writeText(token);
  showNotification('✅ Token copied!');
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
    isPrivate: document.getElementById('copyPrivate').checked,
    hasMemory: document.getElementById('copyHasMemory').checked
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

async function openCopyModal(copyId) {
  const modal = document.getElementById('copyModal');
  const modalBody = document.getElementById('modalBody');
  
  modalBody.innerHTML = '<p>Loading copy details...</p>';
  modal.style.display = 'block';
  document.querySelector('.modal-overlay').style.display = 'block';
  
  const copy = await API.getCopy(copyId);
  if (copy.error) {
    modalBody.innerHTML = '<p>Copy not found</p>';
    return;
  }
  
  const installCmd = `clawfactory install ${copy.id}`;
  const skills = (copy.skills || []).join(', ');
  const tags = (copy.tags || []).join(', ');
  const features = Array.isArray(copy.features) ? copy.features.join(', ') : (copy.features || '');
  
  modalBody.innerHTML = `
    <article class="copy-detail copy-detail-modal">
      <div class="copy-hero">
        <p class="copy-author">by @${copy.username || 'unknown'}</p>
        <h2>${copy.name}</h2>
        <p class="copy-description">${copy.description || ''}</p>
        <div class="copy-meta">
          <span>⭐ ${copy.rating_average || 0}</span>
          <span>📦 ${copy.install_count || 0}</span>
          <span>📁 ${copy.category}</span>
          <span>v${copy.version || '1.0.0'}</span>
        </div>
      </div>
      
      ${copy.skills?.length ? `
      <div class="copy-section">
        <h3>Skills</h3>
        <div class="tags">${copy.skills.map(s => `<span class="tag">${s}</span>`).join('')}</div>
      </div>
      ` : ''}
      
      ${copy.tags?.length ? `
      <div class="copy-section">
        <h3>Tags</h3>
        <div class="tags">${copy.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
      ` : ''}
      
      ${features ? `
      <div class="copy-section">
        <h3>Features</h3>
        <p>${features}</p>
      </div>
      ` : ''}
      
      <div class="copy-section">
        <h3>Install</h3>
        <pre onclick="navigator.clipboard.writeText('${installCmd}').then(() => showNotification('Command copied!'))">${installCmd}</pre>
        <p class="copy-hint">Click to copy</p>
      </div>
      
      <div class="copy-actions">
        <a href="#/${copy.username}/${copy.id}" class="btn btn-primary" onclick="closeModal()">View Full Page</a>
        <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('${installCmd}'); showNotification('Command copied!')">Copy Install Command</button>
      </div>
    </article>
  `;
}

function renderCopyCard(copy, directNavigate = false) {
  const clickHandler = directNavigate 
    ? `navigate('/${copy.username}/${copy.id}')` 
    : `openCopyModal('${copy.id}')`;
  return `<article class="copy-card" onclick="${clickHandler}" style="cursor: pointer;">
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
    // Show only top 5 most popular
    const top5 = copies.slice(0, 5);
    container.innerHTML = `<div class="copy-grid">${top5.map(c => renderCopyCard(c)).join('')}</div>`;
  } catch (err) {
    console.error('[App] Failed to load featured:', err);
    container.innerHTML = '<p>Failed to load copies.</p>';
  }
}

// Copies pagination & filter state
let allCopiesData = [];
let filteredCopiesData = [];
let copiesPage = 1;
const copiesPerPage = 10;

async function loadAllCopies() {
  const container = document.getElementById('allCopies');
  if (!container) return;
  container.innerHTML = '<p>Loading...</p>';
  try {
    allCopiesData = await API.getCopies();
    if (!allCopiesData?.length) { container.innerHTML = '<p>No copies available.</p>'; return; }
    applyCopyFilterAndSort();
  } catch (err) {
    container.innerHTML = '<p>Failed to load copies.</p>';
  }
}

function applyCopyFilterAndSort() {
  const filter = document.getElementById('copyFilter')?.value || 'all';
  const sort = document.getElementById('copySort')?.value || 'newest';
  
  // Filter
  let filtered = allCopiesData;
  if (filter === 'hasMemory') {
    filtered = allCopiesData.filter(c => c.has_memory === 1);
  } else if (filter === 'noMemory') {
    filtered = allCopiesData.filter(c => c.has_memory !== 1);
  }
  
  // Sort
  filtered.sort((a, b) => {
    switch (sort) {
      case 'popular':
        return (b.install_count || 0) - (a.install_count || 0);
      case 'rating':
        return (b.rating_average || 0) - (a.rating_average || 0);
      case 'newest':
      default:
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    }
  });
  
  // Store filtered data and render
  filteredCopiesData = filtered;
  renderCopiesPage(1);
}

function applyCopyFilter() {
  applyCopyFilterAndSort();
}

function applyCopySort() {
  applyCopyFilterAndSort();
}

function renderCopiesPage(page) {
  const container = document.getElementById('allCopies');
  if (!container) return;
  
  copiesPage = page;
  const data = filteredCopiesData.length > 0 ? filteredCopiesData : allCopiesData;
  const start = (page - 1) * copiesPerPage;
  const end = start + copiesPerPage;
  const pageData = data.slice(start, end);
  const totalPages = Math.ceil(data.length / copiesPerPage);
  
  // Render vertical list
  container.innerHTML = `<div class="copy-list">${pageData.map(c => renderCopyCard(c, true)).join('')}</div>`;
  
  // Add pagination if needed
  if (totalPages > 1) {
    container.innerHTML += `
      <div class="copies-pagination">
        <button class="btn btn-secondary" onclick="renderCopiesPage(${page - 1})" ${page === 1 ? 'disabled' : ''}>← Prev</button>
        <span class="page-info">Page ${page} of ${totalPages}</span>
        <button class="btn btn-secondary" onclick="renderCopiesPage(${page + 1})" ${page === totalPages ? 'disabled' : ''}>Next →</button>
      </div>
    `;
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
