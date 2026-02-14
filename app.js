// Copy Data Structure
const copies = [
  // {
  //   id: 'polymarket-trader',
  //   name: 'Polymarket Trader',
  //   description: 'Automated trading bot for Polymarket prediction markets with real-time monitoring and PnL tracking.',
  //   hasMemory: true,
  //   author: 'Kunhe',
  //   version: '1.0.0',
  //   category: 'trading',
  //   skills: ['polymarket', 'trading', 'monitoring'],
  //   tags: ['trading', 'polymarket', 'automation', 'finance', 'bot'],
  //   installCommand: 'clawfactory install polymarket-trader',
  //   features: [
  //     'Real-time trade monitoring',
  //     'Automated PnL calculation',
  //     'Strategy B execution',
  //     'Memory-enhanced decision making'
  //   ],
  //   preview: {
  //     'SOUL.md': 'Technical operator focused on trading automation and market analysis.',
  //     'HEARTBEAT.md': 'Routine monitor checks Polymarket bot every 1 minute.',
  //     'skills': ['polymarket', 'trading']
  //   }
  // },
  {
    id: 'developer-assistant',
    name: 'Developer Assistant',
    description: 'General-purpose coding assistant with GitHub integration and project management skills.',
    hasMemory: false,
    author: 'OpenClaw',
    version: '1.2.0',
    category: 'development',
    skills: ['github', 'coding', 'filesystem'],
    tags: ['developer', 'github', 'coding', 'programming', 'assistant'],
    installCommand: 'clawfactory install developer-assistant',
    features: [
      'GitHub integration',
      'Code review automation',
      'File management',
      'Shell command execution'
    ],
    preview: {
      'SOUL.md': 'Helpful coding assistant with strong GitHub integration.',
      'skills': ['github', 'coding']
    }
  },
  {
    id: 'research-agent',
    name: 'Research Agent',
    description: 'AI research assistant with web search, summarization, and knowledge management capabilities.',
    hasMemory: true,
    author: 'OpenClaw',
    version: '1.0.0',
    category: 'productivity',
    skills: ['web-search', 'summarize', 'memory'],
    tags: ['research', 'ai', 'search', 'summarization', 'knowledge'],
    installCommand: 'clawfactory install research-agent',
    features: [
      'Web research automation',
      'Content summarization',
      'Knowledge base management',
      'Long-term memory'
    ],
    preview: {
      'SOUL.md': 'Research-focused agent with web search and summarization skills.',
      'skills': ['web-search', 'summarize']
    }
  },
  {
    id: 'productivity-hub',
    name: 'Productivity Hub',
    description: 'Integrated personal productivity system with calendar, tasks, and notes management.',
    hasMemory: true,
    author: 'OpenClaw',
    version: '1.1.0',
    category: 'productivity',
    skills: ['calendar', 'tasks', 'notes', 'gog'],
    installCommand: 'clawfactory install productivity-hub',
    features: [
      'Google Calendar integration',
      'Task management',
      'Notes and documentation',
      'Email automation'
    ],
    preview: {
      'SOUL.md': 'Productivity-focused agent with calendar and task management.',
      'skills': ['calendar', 'tasks', 'gog']
    }
  },
  {
    id: 'home-automation',
    name: 'Home Automation',
    description: 'Smart home control center for managing IoT devices and automation routines.',
    hasMemory: false,
    author: 'OpenClaw',
    version: '1.0.0',
    category: 'automation',
    skills: ['homekit', 'automation', 'sensors'],
    installCommand: 'clawfactory install home-automation',
    features: [
      'Device control',
      'Automation routines',
      'Sensor monitoring',
      'Voice commands'
    ],
    preview: {
      'SOUL.md': 'Home automation specialist for IoT device management.',
      'skills': ['homekit', 'automation']
    }
  },
  {
    id: 'crypto-trader',
    name: 'Crypto Trader',
    description: 'Automated cryptocurrency trading with market analysis and portfolio management.',
    hasMemory: true,
    author: 'OpenClaw',
    version: '1.0.0',
    category: 'trading',
    skills: ['crypto', 'trading', 'market-analysis'],
    installCommand: 'clawfactory install crypto-trader',
    features: [
      'Price monitoring',
      'Automated trading strategies',
      'Portfolio tracking',
      'Market sentiment analysis'
    ],
    preview: {
      'SOUL.md': 'Crypto trading specialist with market analysis capabilities.',
      'skills': ['crypto', 'trading']
    }
  },
  {
    id: 'writing-assistant',
    name: 'Writing Assistant',
    description: '中文写作助手，支持文章创作、润色、翻译和内容优化。',
    hasMemory: true,
    author: 'Kunhe',
    version: '1.0.0',
    category: 'productivity',
    skills: ['writing', 'chinese', 'editing', 'translation'],
    installCommand: 'clawfactory install writing-assistant',
    features: [
      '文章创作',
      '文本润色',
      '中英翻译',
      '写作风格优化'
    ],
    preview: {
      'SOUL.md': '中文写作专家，专注于文章创作和语言优化。',
      'skills': ['writing', 'chinese']
    }
  },
  {
    id: 'social-media-manager',
    name: 'Social Media Manager',
    description: 'Manage social media posts, scheduling, and analytics across platforms.',
    hasMemory: true,
    author: 'OpenClaw',
    version: '1.0.0',
    category: 'productivity',
    skills: ['social', 'scheduling', 'analytics'],
    installCommand: 'clawfactory install social-media-manager',
    features: [
      'Multi-platform posting',
      'Content scheduling',
      'Analytics dashboard',
      'Engagement tracking'
    ],
    preview: {
      'SOUL.md': 'Social media management expert with scheduling capabilities.',
      'skills': ['social', 'scheduling']
    }
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Data analysis and visualization assistant with SQL, Python, and reporting skills.',
    hasMemory: false,
    author: 'OpenClaw',
    version: '1.0.0',
    category: 'development',
    skills: ['sql', 'python', 'visualization', 'analytics'],
    installCommand: 'clawfactory install data-analyst',
    features: [
      'SQL queries',
      'Data visualization',
      'Report generation',
      'Statistical analysis'
    ],
    preview: {
      'SOUL.md': 'Data analysis expert with SQL and visualization skills.',
      'skills': ['sql', 'python']
    }
  },
  {
    id: 'video-editor',
    name: 'Video Editor',
    description: 'AI-powered video editing assistant with timeline management and effects.',
    hasMemory: false,
    author: 'OpenClaw',
    version: '1.0.0',
    category: 'productivity',
    skills: ['video', 'editing', 'effects', 'audio'],
    installCommand: 'clawfactory install video-editor',
    features: [
      'Timeline management',
      'Video effects',
      'Audio editing',
      'Export optimization'
    ],
    preview: {
      'SOUL.md': 'Video editing specialist with effects and timeline management.',
      'skills': ['video', 'editing']
    }
  },
  {
    id: 'music-producer',
    name: 'Music Producer',
    description: 'Music composition and production assistant with MIDI and audio processing.',
    hasMemory: true,
    author: 'OpenClaw',
    version: '1.0.0',
    category: 'productivity',
    skills: ['music', 'midi', 'audio', 'composition'],
    installCommand: 'clawfactory install music-producer',
    features: [
      'MIDI composition',
      'Audio mixing',
      'Sound design',
      'Beat making'
    ],
    preview: {
      'SOUL.md': 'Music production expert with composition and audio skills.',
      'skills': ['music', 'midi']
    }
  }
];

// Categories
const categories = [
  { id: 'all', name: 'All', icon: '📦' },
  { id: 'trading', name: 'Trading', icon: '📈' },
  { id: 'development', name: 'Development', icon: '💻' },
  { id: 'productivity', name: 'Productivity', icon: '⚡' },
  { id: 'automation', name: 'Automation', icon: '🤖' }
];

// State
let searchQuery = '';
let showMemoryOnly = false;
let selectedCategory = 'all';
let currentPage = 'browse';

// LocalStorage keys
const STORAGE_KEYS = {
  INSTALLED_COPIES: 'clawfactory_installed_copies',
  UPLOADED_COPIES: 'clawfactory_uploaded_coipes',
  COPY_RATINGS: 'clawfactory_ratings',
  COPY_COMMENTS: 'clawfactory_comments',
  INSTALL_COUNTS: 'clawfactory_install_counts'
};

// Install count functions
function loadInstallCounts() {
  const stored = localStorage.getItem(STORAGE_KEYS.INSTALL_COUNTS);
  return stored ? JSON.parse(stored) : {};
}

function saveInstallCounts(counts) {
  localStorage.setItem(STORAGE_KEYS.INSTALL_COUNTS, JSON.stringify(counts));
}

function incrementInstallCount(copyId) {
  const counts = loadInstallCounts();
  counts[copyId] = (counts[copyId] || 0) + 1;
  saveInstallCounts(counts);
  renderCopies();
}

function getInstallCount(copyId) {
  const counts = loadInstallCounts();
  return counts[copyId] || 0;
}

// Comment functions
function loadComments() {
  const stored = localStorage.getItem(STORAGE_KEYS.COPY_COMMENTS);
  return stored ? JSON.parse(stored) : {};
}

function saveComments(comments) {
  localStorage.setItem(STORAGE_KEYS.COPY_COMMENTS, JSON.stringify(comments));
}

function getCopyComments(copyId) {
  const comments = loadComments();
  return comments[copyId] || [];
}

function addComment(copyId, author, text) {
  const comments = loadComments();
  if (!comments[copyId]) {
    comments[copyId] = [];
  }

  const newComment = {
    id: Date.now(),
    author,
    text,
    createdAt: new Date().toISOString()
  };

  comments[copyId].unshift(newComment); // Add to beginning
  saveComments(comments);
  return newComment;
}

function deleteComment(copyId, commentId) {
  const comments = loadComments();
  if (comments[copyId]) {
    comments[copyId] = comments[copyId].filter(c => c.id !== commentId);
    saveComments(comments);
  }
}

// Rating functions
function loadRatings() {
  const stored = localStorage.getItem(STORAGE_KEYS.COPY_RATINGS);
  return stored ? JSON.parse(stored) : {};
}

function saveRatings(ratings) {
  localStorage.setItem(STORAGE_KEYS.COPY_RATINGS, JSON.stringify(ratings));
}

function getCopyRating(copyId) {
  const ratings = loadRatings();
  if (!ratings[copyId]) {
    return { average: 0, count: 0, userRating: 0 };
  }
  return ratings[copyId];
}

function rateCopy(copyId, rating) {
  const ratings = loadRatings();
  if (!ratings[copyId]) {
    ratings[copyId] = { average: rating, count: 1, userRating: rating, total: rating };
  } else {
    ratings[copyId].userRating = rating;
    ratings[copyId].total += rating;
    ratings[copyId].count = Math.max(1, ratings[copyId].count);
    ratings[copyId].average = (ratings[copyId].total / ratings[copyId].count).toFixed(1);
  }
  saveRatings(ratings);
  
  // Sync with backend if available
  if (typeof window.CLAWFACTORY_API !== 'undefined') {
    window.CLAWFACTORY_API.rateCopy(copyId, rating).catch(() => {});
  }
  
  renderCopies();
  return ratings[copyId];
}

// Render comments for a copy
function renderComments(copyId) {
  const commentsList = document.getElementById('commentsList');
  if (!commentsList) return;

  const comments = getCopyComments(copyId);

  if (comments.length === 0) {
    commentsList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No comments yet. Be the first to share!</p>';
    return;
  }

  commentsList.innerHTML = comments.map(comment => `
    <div class="comment" style="background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <strong>${comment.author}</strong>
        <span style="color: var(--text-secondary); font-size: 0.8rem;">${new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
      <p style="margin: 0; line-height: 1.6;">${comment.text}</p>
    </div>
  `).join('');
}

// ========== STAR FUNCTIONS ==========

async function loadStarInfo(copyId) {
  if (window.CLAWFACTORY_API?.useBackend) {
    try {
      const result = await window.CLAWFACTORY_API.getStars(copyId);
      const starCount = document.getElementById('starCount');
      const starBtn = document.getElementById('starBtn');
      if (starCount) starCount.textContent = `${result.stars || 0} ⭐`;
      if (starBtn) {
        starBtn.textContent = result.isStarred ? '★ Unstar' : '☆ Star this copy';
        starBtn.onclick = () => toggleStar(copyId, !result.isStarred);
      }
    } catch (e) {
      console.error('Failed to load stars:', e);
    }
  }
}

async function toggleStar(copyId, currentlyStarred) {
  if (!window.CLAWFACTORY_API?.token) {
    alert('Please login to star copies');
    switchPage('sync');
    return;
  }

  const me = await window.CLAWFACTORY_API.getMe();
  if (!me.user) {
    alert('Please login first');
    return;
  }

  const result = await window.CLAWFACTORY_API.starCopy(copyId, me.user.id, currentlyStarred ? 'unstar' : 'star');
  if (result.success) {
    const starCount = document.getElementById('starCount');
    const starBtn = document.getElementById('starBtn');
    if (starCount) starCount.textContent = `${result.stars} ⭐`;
    if (starBtn) {
      starBtn.textContent = currentlyStarred ? '☆ Star this copy' : '★ Unstar';
      starBtn.onclick = () => toggleStar(copyId, !currentlyStarred);
    }
  }
}

// ========== FORK FUNCTIONS ==========

async function loadForks(copyId) {
  const forksList = document.getElementById('forksList');
  if (!forksList) return;

  if (window.CLAWFACTORY_API?.useBackend) {
    try {
      const forks = await window.CLAWFACTORY_API.getForks(copyId);
      if (forks.length === 0) {
        forksList.innerHTML = '<p style="color: var(--text-secondary);">No forks yet. Be the first to fork!</p>';
        return;
      }
      forksList.innerHTML = `
        <div style="display: grid; gap: 8px;">
          ${forks.map(fork => `
            <div style="padding: 10px 14px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; cursor: pointer;" onclick="openCopyDetail('${fork.id}')">
              <strong>${fork.name}</strong>
              <span style="color: var(--text-secondary); font-size: 0.85rem;"> by ${fork.forked_by || 'Unknown'}</span>
            </div>
          `).join('')}
        </div>
      `;
    } catch (e) {
      forksList.innerHTML = '<p style="color: var(--text-secondary);">Unable to load forks</p>';
    }
  } else {
    forksList.innerHTML = '<p style="color: var(--text-secondary);">Connect to backend to see forks</p>';
  }
}

// ========== VERSION FUNCTIONS ==========

async function loadVersionHistory(copyId) {
  const versionHistory = document.getElementById('versionHistory');
  if (!versionHistory) return;

  if (window.CLAWFACTORY_API?.useBackend) {
    try {
      const versions = await window.CLAWFACTORY_API.getVersions(copyId);
      if (versions.length === 0) {
        versionHistory.innerHTML = '<p style="color: var(--text-secondary);">No version history</p>';
        return;
      }
      versionHistory.innerHTML = `
        <div class="version-list" style="border: 1px solid var(--border); border-radius: 8px; overflow: hidden;">
          ${versions.map((v, i) => `
            <div style="padding: 10px 14px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; ${i === 0 ? 'background: var(--bg-tertiary);' : ''}">
              <span>📦 v${v.version}${i === 0 ? ' (current)' : ''}</span>
              <span style="color: var(--text-secondary); font-size: 0.85rem;">${new Date(v.created_at).toLocaleDateString()}</span>
            </div>
          `).join('')}
        </div>
      `;
    } catch (e) {
      versionHistory.innerHTML = '<p style="color: var(--text-secondary);">Unable to load versions</p>';
    }
  }
}

// Share copy via various platforms
function shareCopy(copyId, platform) {
  const copy = copies.find(c => c.id === copyId);
  if (!copy) return;

  const url = `https://clawhub.com/copy/${copyId}`;
  const text = `Check out "${copy.name}" - ${copy.description}`;

  switch (platform) {
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'email':
      window.location.href = `mailto:?subject=${encodeURIComponent(`Check out: ${copy.name}`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
      break;
    case 'copy':
    default:
      navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
        alert('Link copied to clipboard!');
      }).catch(() => {
        prompt('Copy this link:', `${text}\n${url}`);
      });
  }
}

// Render AI API Page
function renderAIPage() {
  const categoryChips = document.getElementById('aiCategoryChips');
  if (!categoryChips) return;

  // Render category chips
  categoryChips.innerHTML = `
    <span class="chip active" data-category="">All</span>
    ${categories.map(cat => `
      <span class="chip" data-category="${cat.id}">${cat.icon} ${cat.name}</span>
    `).join('')}
  `;

  // Add click handlers
  categoryChips.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderAICopyList(chip.dataset.category);
    });
  });

  // Render initial list
  renderAICopyList('');
}

// Render AI copy list
function renderAICopyList(category) {
  // This would typically fetch from backend API
  // For now, show filtered local copies
  const filtered = category
    ? copies.filter(c => c.category === category || c.category?.startsWith(category))
    : copies.filter(c => !c.isPrivate && !c.is_private);

  // The AI page is primarily for API documentation, not copy browsing
  // The actual copy data is accessed via API endpoints
}

// Submit a new comment
function submitComment(copyId) {
  const commentInput = document.getElementById('commentInput');
  const commentAuthor = document.getElementById('commentAuthor');
  
  if (!commentInput || !commentAuthor) return;

  const text = commentInput.value.trim();
  const author = commentAuthor.value.trim() || 'Anonymous';

  if (!text) {
    alert('Please enter a comment');
    return;
  }

  addComment(copyId, author, text);
  
  // Sync with backend if available
  if (typeof window.CLAWFACTORY_API !== 'undefined') {
    window.CLAWFACTORY_API.addComment(copyId, author, text).catch(() => {});
  }
  
  // Clear form
  commentInput.value = '';
  
  // Re-render comments
  renderComments(copyId);
}

// DOM Elements
const copyList = document.getElementById('copyList');
const searchInput = document.getElementById('searchInput');
const memoryToggle = document.getElementById('memoryToggle');
const emptyState = document.getElementById('emptyState');
const modal = document.getElementById('copyModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const uploadForm = document.getElementById('uploadForm');
const installedList = document.getElementById('installedList');
const uploadedList = document.getElementById('uploadedList');

// Theme toggle functionality
function toggleTheme() {
  const body = document.body;
  const themeIcon = document.getElementById('themeIcon');
  const currentTheme = body.getAttribute('data-theme');
  
  if (currentTheme === 'light') {
    body.removeAttribute('data-theme');
    localStorage.removeItem('clawfactory_theme');
    themeIcon.textContent = '🌙';
  } else {
    body.setAttribute('data-theme', 'light');
    localStorage.setItem('clawfactory_theme', 'light');
    themeIcon.textContent = '☀️';
  }
}

// Toggle custom category input
function toggleCustomCategory() {
  const categorySelect = document.getElementById('copyCategory');
  const customInput = document.getElementById('customCategory');
  if (categorySelect && customInput) {
    if (categorySelect.value === 'custom') {
      customInput.style.display = 'block';
      customInput.required = true;
    } else {
      customInput.style.display = 'none';
      customInput.required = false;
    }
  }
}

// Handle files JSON upload
function handleFilesUpload() {
  const fileInput = document.getElementById('copyFilesJson');
  const textArea = document.getElementById('copyFilesContent');

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        textArea.value = JSON.stringify(json, null, 2);
      } catch (err) {
        alert('Invalid JSON file!');
        fileInput.value = '';
      }
    };
    reader.readAsText(file);
  }
}

// Load saved theme
function loadTheme() {
  const savedTheme = localStorage.getItem('clawfactory_theme');
  const themeIcon = document.getElementById('themeIcon');
  
  if (savedTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
    if (themeIcon) themeIcon.textContent = '☀️';
  } else if (themeIcon) {
    themeIcon.textContent = '🌙';
  }
}

// Initialize
function init() {
  loadTheme();
  renderCategories();
  renderFeaturedCopies();
  renderCopies();
  renderMyCopies();
  setupEventListeners();
  loadInstalledCopies();
}

// Setup Event Listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      switchPage(page);
    });
  });

  // Search
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderCopies();
  });

  // Memory toggle
  memoryToggle.addEventListener('change', (e) => {
    showMemoryOnly = e.target.checked;
    renderCopies();
  });

  // Modal
  modalClose.addEventListener('click', closeModal);
  modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Upload form
  if (uploadForm) {
    uploadForm.addEventListener('submit', handleUpload);
  }
}

// Switch page
function switchPage(page) {
  currentPage = page;

  // Update nav
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  // Show/hide pages
  document.getElementById('browsePage').style.display = page === 'browse' ? 'block' : 'none';
  document.getElementById('comparePage').style.display = page === 'compare' ? 'block' : 'none';
  document.getElementById('syncPage').style.display = page === 'sync' ? 'block' : 'none';
  document.getElementById('authorsPage').style.display = page === 'authors' ? 'block' : 'none';
  document.getElementById('authorProfilePage').style.display = page === 'author-profile' ? 'block' : 'none';
  document.getElementById('myCopiesPage').style.display = page === 'my-copies' ? 'block' : 'none';
  document.getElementById('marketplacePage').style.display = page === 'marketplace' ? 'block' : 'none';
  document.getElementById('uploadPage').style.display = page === 'upload' ? 'block' : 'none';
  document.getElementById('cliPage').style.display = page === 'cli' ? 'block' : 'none';
  document.getElementById('aiPage').style.display = page === 'ai' ? 'block' : 'none';

  // Refresh pages when switching to them
  if (page === 'my-copies') {
    renderMyCopies();
  }

  if (page === 'cli') {
    renderCLICopyList();
  }

  if (page === 'authors') {
    renderAuthorsPage();
  }

  if (page === 'compare') {
    renderComparePage();
  }

  if (page === 'marketplace') {
    renderMarketplace();
  }

  if (page === 'ai') {
    renderAIPage();
  }

  if (page === 'sync') {
    renderSyncPage();
  }
}

// Render CLI page copy list
function renderCLICopyList() {
  const cliCopyList = document.getElementById('cliCopyList');
  if (!cliCopyList) return;

  cliCopyList.innerHTML = copies.map(copy => `
    <div class="cli-copy-item">
      <div class="cli-copy-info">
        <strong>${copy.name}</strong>
        <span class="copy-badge ${copy.hasMemory ? 'memory' : 'no-memory'}" style="font-size: 0.7rem;">
          ${copy.hasMemory ? '🧠 Memory' : '⚡ No Memory'}
        </span>
      </div>
      <div class="install-command" style="cursor: pointer; margin-top: 8px;" onclick="copyInstallCommand('bash <(curl -sL https://clawhub.com/install/${copy.id}.sh)')">
        <code>bash <(curl -sL https://clawhub.com/install/${copy.id}.sh)</code>
        <span style="float: right; font-size: 0.7rem; opacity: 0.7;">📋 Copy</span>
      </div>
    </div>
  `).join('');
}

// Get all unique authors with their copy counts
function getAuthors() {
  const authorStats = {};
  
  copies.forEach(copy => {
    if (!authorStats[copy.author]) {
      authorStats[copy.author] = {
        name: copy.author,
        copyCount: 0,
        copies: []
      };
    }
    authorStats[copy.author].copyCount++;
    authorStats[copy.author].copies.push(copy);
  });

  return Object.values(authorStats).sort((a, b) => b.copyCount - a.copyCount);
}

// Render authors page
function renderAuthorsPage() {
  const authorsList = document.getElementById('authorsList');
  if (!authorsList) return;

  const authors = getAuthors();

  authorsList.innerHTML = `
    <div class="authors-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
      ${authors.map(author => `
        <div class="author-card" onclick="showAuthorProfile('${author.name}')" style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="width: 48px; height: 48px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              ${author.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style="font-size: 1.1rem; margin-bottom: 4px;">${author.name}</h3>
              <span style="color: var(--text-secondary); font-size: 0.9rem;">${author.copyCount} copies</span>
            </div>
          </div>
          <div style="color: var(--text-secondary); font-size: 0.9rem;">
            ${author.copies.slice(0, 3).map(c => `• ${c.name}`).join(' ')}
            ${author.copyCount > 3 ? ` +${author.copyCount - 3} more` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Show author profile
function showAuthorProfile(authorName) {
  const author = getAuthors().find(a => a.name === authorName);
  if (!author) return;

  document.getElementById('authorName').textContent = author.name;
  document.getElementById('authorBio').textContent = `Created ${author.copyCount} copies`;

  const authorCopiesList = document.getElementById('authorCopiesList');
  authorCopiesList.innerHTML = `
    <div class="author-copies-grid" style="display: grid; gap: 16px;">
      ${author.copies.map(copy => {
        const rating = getCopyRating(copy.id);
        const stars = '★'.repeat(Math.round(rating.average)) + '☆'.repeat(5 - Math.round(rating.average));
        return `
        <div class="copy-card" onclick="openCopyDetail('${copy.id}')" style="cursor: pointer;">
          <div class="copy-header">
            <span class="copy-name">${copy.name}</span>
            <span class="copy-badge ${copy.hasMemory ? 'memory' : 'no-memory'}">
              ${copy.hasMemory ? '带 Memory' : '不带 Memory'}
            </span>
          </div>
          <p class="copy-description">${copy.description}</p>
          <div class="copy-meta">
            <span>📦 v${copy.version}</span>
            <span class="copy-rating">${stars} ${rating.average}</span>
          </div>
        </div>
      `}).join('')}
    </div>
  `;

  switchPage('author-profile');
}

// Load installed copies from localStorage
function loadInstalledCopies() {
  const stored = localStorage.getItem(STORAGE_KEYS.INSTALLED_COPIES);
  return stored ? JSON.parse(stored) : [];
}

// Save installed copies to localStorage
function saveInstalledCopies(installed) {
  localStorage.setItem(STORAGE_KEYS.INSTALLED_COPIES, JSON.stringify(installed));
}

// Load uploaded copies from localStorage
function loadUploadedCopies() {
  const stored = localStorage.getItem(STORAGE_KEYS.UPLOADED_COPIES);
  return stored ? JSON.parse(stored) : [];
}

// Save uploaded copies to localStorage
function saveUploadedCopies(uploaded) {
  localStorage.setItem(STORAGE_KEYS.UPLOADED_COPIES, JSON.stringify(uploaded));
}

// Install a copy
function installCopy(copyId) {
  const copy = copies.find(c => c.id === copyId);
  if (!copy) return;

  const installed = loadInstalledCopies();
  if (installed.find(c => c.id === copyId)) {
    alert('This copy is already installed!');
    return;
  }

  const installedCopy = {
    ...copy,
    installedAt: new Date().toISOString()
  };

  installed.push(installedCopy);
  saveInstalledCopies(installed);
  
  // Increment install count (local)
  incrementInstallCount(copyId);
  
  // Also track on backend if available
  if (typeof window.CLAWFACTORY_API !== 'undefined') {
    window.CLAWFACTORY_API.trackInstall(copyId).catch(() => {});
  }
  
  renderMyCopies();
  alert(`${copy.name} installed successfully!`);
}

// Uninstall a copy
function uninstallCopy(copyId) {
  if (!confirm('Are you sure you want to uninstall this copy?')) return;

  const installed = loadInstalledCopies().filter(c => c.id !== copyId);
  saveInstalledCopies(installed);
  renderMyCopies();
  alert('Copy uninstalled successfully!');
}

// Delete an uploaded copy
function deleteUploadedCopy(copyId) {
  if (!confirm('Are you sure you want to delete this copy?')) return;

  const uploaded = loadUploadedCopies().filter(c => c.id !== copyId);
  saveUploadedCopies(uploaded);
  
  // Also remove from main copies array if it's a user-uploaded copy
  const copyIndex = copies.findIndex(c => c.id === copyId && c.isUploaded);
  if (copyIndex > -1) {
    copies.splice(copyIndex, 1);
    renderCopies();
  }
  
  renderMyCopies();
  alert('Copy deleted successfully!');
}

// Fork an existing copy
function forkCopy(copyId) {
  const copy = copies.find(c => c.id === copyId);
  if (!copy) return;

  // Switch to upload page
  switchPage('upload');

  // Pre-fill the form with copy data
  document.getElementById('copyName').value = copy.name + ' (Fork)';
  document.getElementById('copyDescription').value = copy.description;
  document.getElementById('copyAuthor').value = '';
  document.getElementById('copyVersion').value = '1.0.0';
  document.querySelector(`input[name="hasMemory"][value="${copy.hasMemory}"]`).checked = true;
  document.getElementById('copySkills').value = copy.skills.join(', ');
  document.getElementById('copyFeatures').value = copy.features.join('\n');
  document.getElementById('copyTags').value = copy.tags ? copy.tags.join(', ') : '';

  // Store original copy info for reference
  localStorage.setItem('clawfactory_fork_source', JSON.stringify({
    originalId: copy.id,
    originalName: copy.name,
    forkedAt: new Date().toISOString()
  }));

  // Scroll to top of form
  window.scrollTo({ top: 0, behavior: 'smooth' });

  alert(`Forking "${copy.name}". Please enter your details and submit to create your version!`);
}

// Render My Copies page
function renderMyCopies() {
  const installed = loadInstalledCopies();
  const uploaded = loadUploadedCopies();

  // Render installed copies
  if (installed.length === 0) {
    installedList.innerHTML = '<p class="empty-message">No copies installed yet.</p>';
  } else {
    installedList.innerHTML = installed.map(copy => {
      const backups = getBackupsForCopy(copy.id);
      return `
      <div class="my-copy-card">
        <div class="my-copy-info">
          <h4>${copy.name}</h4>
          <p>${copy.description}</p>
          <small>Installed: ${new Date(copy.installedAt).toLocaleDateString()}${copy.restoredFromBackup ? ' 🔄 Restored' : ''}</small>
        </div>
        <div class="my-copy-actions">
          ${backups.length > 0 ? `<button class="btn btn-secondary" onclick="restoreFromBackup('${copy.id}', ${backups.length - 1})">🔄 Restore</button>` : `<button class="btn btn-secondary" onclick="backupCopy('${copy.id}')">💾 Backup</button>`}
          <button class="btn btn-danger" onclick="uninstallCopy('${copy.id}')">Uninstall</button>
        </div>
      </div>
    `}).join('');
  }

  // Render uploaded copies
  if (uploaded.length === 0) {
    uploadedList.innerHTML = '<p class="empty-message">No copies uploaded yet.</p>';
  } else {
    uploadedList.innerHTML = uploaded.map(copy => `
      <div class="my-copy-card">
        <div class="my-copy-info">
          <h4>${copy.name}</h4>
          <p>${copy.description}</p>
          <small>Uploaded: ${new Date(copy.uploadedAt || Date.now()).toLocaleDateString()}</small>
        </div>
        <div class="my-copy-actions">
          <button class="btn btn-secondary" onclick="openCopyDetail('${copy.id}')">View</button>
          <button class="btn btn-danger" onclick="deleteUploadedCopy('${copy.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  }
}

// Export all data
function exportAllCopies() {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    installed: loadInstalledCopies(),
    uploaded: loadUploadedCopies(),
    ratings: loadRatings(),
    comments: loadComments(),
    installCounts: loadInstallCounts()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `clawfactory-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Bulk export with copy data
function bulkExport() {
  // Create a comprehensive export of all copies with their metadata
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    copies: copies,
    metadata: {
      totalCopies: copies.length,
      categories: categories
    }
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `clawfactory-copies-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Bulk import copies
function bulkImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.copies && Array.isArray(data.copies)) {
          let imported = 0;
          data.copies.forEach(newCopy => {
            if (!copies.find(c => c.id === newCopy.id)) {
              copies.push(newCopy);
              imported++;
            }
          });
          renderCopies();
          alert(`Successfully imported ${imported} copies!`);
        } else {
          alert('Invalid import format');
        }
      } catch (err) {
        alert('Error importing file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// Backup a specific copy
function backupCopy(copyId) {
  const copy = copies.find(c => c.id === copyId);
  if (!copy) return;

  const backupData = {
    copy: copy,
    backedUpAt: new Date().toISOString()
  };

  // Save to localStorage
  const backups = loadBackups();
  backups[copyId] = backups[copyId] || [];
  backups[copyId].push(backupData);
  saveBackups(backups);

  alert(`${copy.name} backed up successfully!`);
  renderMyCopies();
}

// Load backups from localStorage
function loadBackups() {
  const stored = localStorage.getItem('clawfactory_backups');
  return stored ? JSON.parse(stored) : {};
}

// Save backups to localStorage
function saveBackups(backups) {
  localStorage.setItem('clawfactory_backups', JSON.stringify(backups));
}

// Get available backups for a copy
function getBackupsForCopy(copyId) {
  const backups = loadBackups();
  return backups[copyId] || [];
}

// Restore from backup
function restoreFromBackup(copyId, backupIndex) {
  const backups = loadBackups();
  const copyBackups = backups[copyId];
  if (!copyBackups || !copyBackups[backupIndex]) {
    alert('Backup not found!');
    return;
  }

  if (!confirm(`Restore ${copyBackups[backupIndex].copy.name} from backup? Current version will be replaced.`)) {
    return;
  }

  const backup = copyBackups[backupIndex];
  const installed = loadInstalledCopies();
  
  // Update or add the copy
  const existingIndex = installed.findIndex(c => c.id === copyId);
  if (existingIndex > -1) {
    installed[existingIndex] = {
      ...backup.copy,
      installedAt: new Date().toISOString(),
      restoredFromBackup: true
    };
  } else {
    installed.push({
      ...backup.copy,
      installedAt: new Date().toISOString(),
      restoredFromBackup: true
    });
  }

  saveInstalledCopies(installed);
  renderMyCopies();
  alert(`${backup.copy.name} restored successfully!`);
}

// Delete a backup
function deleteBackup(copyId, backupIndex) {
  if (!confirm('Delete this backup?')) return;

  const backups = loadBackups();
  if (backups[copyId]) {
    backups[copyId].splice(backupIndex, 1);
    if (backups[copyId].length === 0) {
      delete backups[copyId];
    }
    saveBackups(backups);
    renderMyCopies();
    alert('Backup deleted!');
  }
}

// Show all backups modal
function showAllBackups() {
  const backups = loadBackups();
  const backupIds = Object.keys(backups);

  if (backupIds.length === 0) {
    alert('No backups found. Backup your installed copies to keep them safe!');
    return;
  }

  let modalHTML = `
    <h2>💾 All Backups</h2>
    <p style="color: var(--text-secondary); margin-bottom: 24px;">
      Manage your copy backups below.
    </p>
  `;

  backupIds.forEach(copyId => {
    const copyBackups = backups[copyId];
    copyBackups.forEach((backup, index) => {
      modalHTML += `
        <div class="backup-item" style="background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>${backup.copy.name}</strong>
              <br><small style="color: var(--text-secondary);">Backup: ${new Date(backup.backedUpAt).toLocaleString()}</small>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary" onclick="restoreFromBackup('${copyId}', ${index})">🔄 Restore</button>
              <button class="btn btn-danger" onclick="deleteBackup('${copyId}', ${index})">🗑️</button>
            </div>
          </div>
        </div>
      `;
    });
  });

  modalBody.innerHTML = modalHTML;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Import copies
function importCopies() {
  document.getElementById('importFileInput').click();
}

// Handle import file
function handleImportFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      
      if (data.installed && Array.isArray(data.installed)) {
        const currentInstalled = loadInstalledCopies();
        const mergedInstalled = [...currentInstalled];
        data.installed.forEach(newCopy => {
          if (!mergedInstalled.find(c => c.id === newCopy.id)) {
            mergedInstalled.push(newCopy);
          }
        });
        saveInstalledCopies(mergedInstalled);
      }

      if (data.uploaded && Array.isArray(data.uploaded)) {
        const currentUploaded = loadUploadedCopies();
        const mergedUploaded = [...currentUploaded];
        data.uploaded.forEach(newCopy => {
          if (!mergedUploaded.find(c => c.id === newCopy.id)) {
            newCopy.isUploaded = true;
            mergedUploaded.push(newCopy);
            copies.push(newCopy);
          }
        });
        saveUploadedCopies(mergedUploaded);
      }

      renderMyCopies();
      renderCopies();
      alert('Copies imported successfully!');
    } catch (err) {
      alert('Error importing file: Invalid JSON format');
    }
  };
  reader.readAsText(file);
  event.target.value = ''; // Reset input
}

// Clear all data
function clearAllData() {
  if (!confirm('Are you sure you want to clear all data? This cannot be undone!')) return;

  localStorage.removeItem(STORAGE_KEYS.INSTALLED_COPIES);
  localStorage.removeItem(STORAGE_KEYS.UPLOADED_COPIES);
  renderMyCopies();
  alert('All data cleared!');
}

// Handle upload form submission
function handleUpload(e) {
  e.preventDefault();

  const name = document.getElementById('copyName').value.trim();
  const description = document.getElementById('copyDescription').value.trim();
  const author = document.getElementById('copyAuthor').value.trim();
  const version = document.getElementId('copyVersion').value.trim() || '1.0.0';
  const hasMemory = document.querySelector('input[name="hasMemory"]:checked').value === 'true';
  const isPrivate = document.querySelector('input[name="isPrivate"]:checked').value === 'true';
  const skillsInput = document.getElementById('copySkills').value.trim();
  const featuresInput = document.getElementById('copyFeatures').value.trim();
  const tagsInput = document.getElementById('copyTags')?.value.trim() || '';

  // Get category (use custom input if selected)
  let categoryInput = document.getElementById('copyCategory')?.value || '';
  if (categoryInput === 'custom') {
    categoryInput = document.getElementById('customCategory')?.value.trim() || 'others';
  }
  const category = categoryInput || 'others';

  // Get files (complete snapshot)
  let files = {};
  try {
    const filesContent = document.getElementById('copyFilesContent')?.value.trim();
    if (filesContent) {
      files = JSON.parse(filesContent);
    }
  } catch (e) {
    console.error('Error parsing files JSON:', e);
  }

  // Get memory content
  const memory = document.getElementById('copyMemory')?.value.trim() || null;

  const skills = skillsInput.split(',').map(s => s.trim()).filter(s => s);
  const features = featuresInput.split('\n').map(f => f.trim()).filter(f => f);
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

  const newCopy = {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    description,
    hasMemory,
    isPrivate,  // 🔒 Private copy flag
    author,
    version,
    category,
    skills,
    tags,
    files,  // Complete snapshot files
    memory,  // Memory content (if hasMemory)
    installCommand: `clawfactory install ${name.toLowerCase().replace(/\s+/g, '-')}`,
    features,
    isUploaded: true,
    uploadedAt: new Date().toISOString()
  };

  // Check if this is a fork (only for logged in users)
  if (window.CLAWFACTORY_API?.token) {
    const forkSource = localStorage.getItem('clawfactory_fork_source');
    if (forkSource) {
      try {
        const source = JSON.parse(forkSource);
        newCopy.forkedFrom = source.originalId;
        newCopy.originalName = source.originalName;
        localStorage.removeItem('clawfactory_fork_source');
      } catch (e) {
        console.error('Error parsing fork source:', e);
      }
    }
  }

  // Track version history for logged in users (auto-version on upload)
  if (window.CLAWFACTORY_API?.token) {
    const uploaded = loadUploadedCopies();
    const existingCopy = uploaded.find(c => c.id === newCopy.id);
  
  if (existingCopy) {
    // Update existing copy - save old version to history
    const versionHistory = existingCopy.versionHistory || [];
    versionHistory.push({
      version: existingCopy.version,
      changedAt: new Date().toISOString(),
      author: existingCopy.author
    });
    newCopy.versionHistory = versionHistory.slice(-10); // Keep last 10 versions
    newCopy.updatedAt = new Date().toISOString();
    
    // Remove old version from uploads
    const filtered = uploaded.filter(c => c.id !== newCopy.id);
    saveUploadedCopies([...filtered, newCopy]);
  } else {
    // New copy - initialize version history
    newCopy.versionHistory = [{
      version: version,
      changedAt: new Date().toISOString(),
      author: author
    }];
    newCopy.createdAt = new Date().toISOString();
    newCopy.updatedAt = new Date().toISOString();
    uploaded.push(newCopy);
    saveUploadedCopies(uploaded);
  }

  // Add to main copies array
  copies.push(newCopy);

  renderCopies();
  renderMyCopies();

  // Reset form
  uploadForm.reset();

  // Switch to My Copies page
  switchPage('my-copies');

  // Show success feedback
  alert('Copy uploaded successfully!');
}

// Filter copies
function getFilteredCopies() {
  return copies.filter(copy => {
    const matchesSearch = !searchQuery ||
      copy.name.toLowerCase().includes(searchQuery) ||
      copy.description.toLowerCase().includes(searchQuery) ||
      copy.skills.some(skill => skill.includes(searchQuery)) ||
      (copy.tags && copy.tags.some(tag => tag.includes(searchQuery)));

    const matchesMemory = !showMemoryOnly || copy.hasMemory;
    const matchesCategory = selectedCategory === 'all' || copy.category === selectedCategory;

    return matchesSearch && matchesMemory && matchesCategory;
  });
}

// ========== SYNC PAGE FUNCTIONS ==========

// Render sync page
function renderSyncPage() {
  const authForm = document.getElementById('authForm');
  const authStatus = document.getElementById('authStatus');
  const currentUsername = document.getElementById('currentUsername');

  if (typeof window.CLAWFACTORY_API === 'undefined') {
    document.getElementById('backendStatus').innerHTML = '<p style="color: var(--text-secondary);">Backend not configured</p>';
    authForm.style.display = 'block';
    authStatus.style.display = 'none';
    return;
  }

  const api = window.CLAWFACTORY_API;

  // Check backend health
  api.health().then(result => {
    const statusEl = document.getElementById('backendStatus');
    if (result.status === 'ok') {
      statusEl.innerHTML = '<p style="color: var(--success);">✅ Connected to backend</p>';
    } else {
      statusEl.innerHTML = '<p style="color: #dc2626;">❌ Backend unavailable (using local mode)</p>';
    }
  }).catch(() => {
    document.getElementById('backendStatus').innerHTML = '<p style="color: #dc2626;">❌ Cannot connect to backend</p>';
  });

  // Update auth UI
  if (api.token) {
    authForm.style.display = 'none';
    authStatus.style.display = 'block';
    currentUsername.textContent = 'Loading...';
    
    api.getMe().then(result => {
      if (result.user) {
        currentUsername.textContent = result.user.username;
      } else {
        currentUsername.textContent = 'Unknown';
      }
    });
  } else {
    authForm.style.display = 'block';
    authStatus.style.display = 'none';
  }
}

// Register user
async function syncRegister() {
  const username = document.getElementById('syncUsername').value.trim();
  if (!username) {
    alert('Please enter a username');
    return;
  }

  if (typeof window.CLAWFACTORY_API === 'undefined') {
    alert('Backend not configured');
    return;
  }

  const result = await window.CLAWFACTORY_API.register(username);
  
  if (result.success) {
    alert(`Registered! You are now logged in as ${username}`);
    renderSyncPage();
  } else {
    alert('Registration failed: ' + result.error);
  }
}

// Login user
async function syncLogin() {
  const username = document.getElementById('syncUsername').value.trim();
  if (!username) {
    alert('Please enter a username');
    return;
  }

  if (typeof window.CLAWFACTORY_API === 'undefined') {
    alert('Backend not configured');
    return;
  }

  const result = await window.CLAWFACTORY_API.login(username);
  
  if (result.success) {
    alert(`Logged in as ${username}`);
    renderSyncPage();
  } else {
    alert('Login failed: ' + result.error);
  }
}

// Logout user
function syncLogout() {
  if (typeof window.CLAWFACTORY_API !== 'undefined') {
    window.CLAWFACTORY_API.logout();
  }
  renderSyncPage();
}

// Sync from cloud (download)
async function syncFromCloud() {
  if (typeof window.CLAWFACTORY_API === 'undefined') {
    alert('Backend not configured');
    return;
  }

  const statusEl = document.getElementById('syncStatus');
  statusEl.textContent = 'Downloading from cloud...';

  const result = await window.CLAWFACTORY_API.syncFromCloud();
  
  if (result.copies && Array.isArray(result.copies)) {
    // Merge with local copies
    let imported = 0;
    result.copies.forEach(cloudCopy => {
      if (!copies.find(c => c.id === cloudCopy.id)) {
        copies.push(cloudCopy);
        imported++;
      }
    });
    
    renderCopies();
    statusEl.textContent = `✅ Downloaded ${imported} new copies from cloud`;
    alert(`Downloaded ${imported} copies from cloud!`);
  } else {
    statusEl.textContent = '❌ Failed to download: ' + (result.error || 'Unknown error');
  }
}

// Sync to cloud (upload)
async function syncToCloud() {
  if (typeof window.CLAWFACTORY_API === 'undefined') {
    alert('Backend not configured');
    return;
  }

  if (!window.CLAWFACTORY_API.token) {
    alert('Please login first');
    switchPage('sync');
    return;
  }

  const statusEl = document.getElementById('syncStatus');
  statusEl.textContent = 'Uploading to cloud...';

  // Get uploaded copies
  const uploaded = loadUploadedCopies();
  const localCopies = [...copies.filter(c => c.isUploaded), ...uploaded];

  const result = await window.CLAWFACTORY_API.syncToBackend(localCopies);
  
  if (result.success) {
    statusEl.textContent = `✅ Uploaded ${result.imported} copies to cloud`;
    alert(`Uploaded ${result.imported} copies to cloud!`);
  } else {
    statusEl.textContent = '❌ Failed to upload: ' + (result.error || 'Unknown error');
  }
}

// ========== MARKETPLACE FUNCTIONS ==========

// Render marketplace page
async function renderMarketplace() {
  const marketplaceList = document.getElementById('marketplaceList');
  const marketplaceEmpty = document.getElementById('marketplaceEmpty');
  
  if (!marketplaceList) return;

  // Check if backend is configured
  if (typeof window.CLAWFACTORY_API !== 'undefined' && window.CLAWFACTORY_API.useBackend) {
    // Load from backend marketplace
    const sort = document.getElementById('marketplaceSort')?.value || 'rating';
    const result = await window.CLAWFACTORY_API.request(`/api/marketplace?sort=${sort}`);
    
    if (result.error || !result.length) {
      marketplaceList.innerHTML = '';
      marketplaceEmpty.style.display = 'block';
      return;
    }
    
    marketplaceEmpty.style.display = 'none';
    marketplaceList.innerHTML = result.map(copy => renderMarketplaceCard(copy)).join('');
    return;
  }
  
  // Fallback to local marketplace copies (copies with is_public)
  const marketplaceCopies = copies.filter(c => c.is_public);
  
  if (marketplaceCopies.length === 0) {
    marketplaceList.innerHTML = '';
    marketplaceEmpty.style.display = 'block';
    return;
  }
  
  marketplaceEmpty.style.display = 'none';
  marketplaceList.innerHTML = marketplaceCopies.map(copy => renderMarketplaceCard(copy)).join('');
}

// Render marketplace card
function renderMarketplaceCard(copy) {
  const rating = getCopyRating(copy.id);
  const stars = '★'.repeat(Math.round(rating.average)) + '☆'.repeat(5 - Math.round(rating.average));
  
  return `
    <div class="copy-card" data-id="${copy.id}" onclick="openCopyDetail('${copy.id}')" style="cursor: pointer;">
      <div class="copy-header">
        <span class="copy-name">${copy.name}</span>
        <span class="copy-badge ${copy.hasMemory ? 'memory' : 'no-memory'}">
          ${copy.hasMemory ? '🧠 Memory' : '⚡ No Memory'}
        </span>
      </div>
      <p class="copy-description">${copy.description}</p>
      <div class="copy-meta">
        <span>👤 ${copy.author}</span>
        <span>📦 v${copy.version}</span>
        <span>⬇️ ${getInstallCount(copy.id)}</span>
        <span class="copy-rating">${stars} ${rating.average}</span>
      </div>
      <div class="copy-tags">
        ${copy.skills?.slice(0, 3).map(skill => `<span class="tag">${skill}</span>`).join('') || ''}
      </div>
    </div>
  `;
}

// Publish copy to marketplace
async function publishToMarketplace(copyId) {
  if (!window.CLAWFACTORY_API?.token) {
    alert('Please login first');
    switchPage('sync');
    return;
  }
  
  const me = await window.CLAWFACTORY_API.getMe();
  if (!me.user) {
    alert('Please login first');
    return;
  }
  
  const result = await window.CLAWFACTORY_API.request('/api/marketplace/publish', {
    method: 'POST',
    body: JSON.stringify({ copy_id: copyId, user_id: me.user.id })
  });
  
  if (result.success) {
    alert('Published to marketplace!');
  } else {
    alert('Failed: ' + result.error);
  }
}

// ========== COMPARE PAGE FUNCTIONS ==========

// Compare page functionality
let selectedForCompare = [];

// Render compare page
function renderComparePage() {
  const compareList = document.getElementById('compareCopyList');
  if (!compareList) return;

  compareList.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
      ${copies.map(copy => {
        const isSelected = selectedForCompare.includes(copy.id);
        return `
        <div class="compare-card ${isSelected ? 'selected' : ''}" onclick="toggleCompareSelect('${copy.id}')" style="background: var(--bg-secondary); border: 2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}; border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.2s;">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <h4>${copy.name}</h4>
              <span style="color: var(--text-secondary); font-size: 0.85rem;">👤 ${copy.author}</span>
            </div>
            <input type="checkbox" ${isSelected ? 'checked' : ''} onclick="event.stopPropagation(); toggleCompareSelect('${copy.id}')">
          </div>
          <p style="margin: 8px 0; color: var(--text-secondary); font-size: 0.9rem;">${copy.description.substring(0, 80)}...</p>
          <div style="display: flex; gap: 12px; font-size: 0.8rem; color: var(--text-secondary);">
            <span>🔧 ${copy.skills.length} skills</span>
            <span>⬇️ ${getInstallCount(copy.id)} installs</span>
          </div>
        </div>
      `}).join('')}
    </div>
    <div style="margin-top: 24px; text-align: center;">
      <button class="btn btn-primary" onclick="runComparison()" ${selectedForCompare.length < 2 ? 'disabled style="opacity: 0.5;"' : ''}>
        Compare Selected (${selectedForCompare.length}/3)
      </button>
      <button class="btn btn-secondary" onclick="clearComparison()" style="margin-left: 12px;" ${selectedForCompare.length === 0 ? 'disabled style="opacity: 0.5;"' : ''}>
        Clear Selection
      </button>
    </div>
  `;
}

// Toggle copy selection for comparison
function toggleCompareSelect(copyId) {
  const index = selectedForCompare.indexOf(copyId);
  if (index > -1) {
    selectedForCompare.splice(index, 1);
  } else if (selectedForCompare.length < 3) {
    selectedForCompare.push(copyId);
  } else {
    alert('You can compare up to 3 copies at a time');
    return;
  }
  renderComparePage();
}

// Clear selection
function clearComparison() {
  selectedForCompare = [];
  document.getElementById('compareResults').style.display = 'none';
  renderComparePage();
}

// Run comparison
function runComparison() {
  if (selectedForCompare.length < 2) return;

  const selectedCopies = selectedForCompare.map(id => copies.find(c => c.id === id));
  const table = document.getElementById('comparisonTable');
  const results = document.getElementById('compareResults');

  results.style.display = 'block';

  table.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(${selectedCopies.length + 1}, 1fr); gap: 1px; background: var(--border); border-radius: 8px; overflow: hidden;">
      <!-- Header -->
      <div style="background: var(--bg-tertiary); padding: 16px;"></div>
      ${selectedCopies.map(copy => `
        <div style="background: var(--bg-secondary); padding: 16px; text-align: center;">
          <h4>${copy.name}</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">${copy.author}</p>
        </div>
      `).join('')}

      <!-- Description -->
      <div style="background: var(--bg-tertiary); padding: 12px 16px; font-weight: 600;">Description</div>
      ${selectedCopies.map(copy => `
        <div style="background: var(--bg-secondary); padding: 12px;">${copy.description}</div>
      `).join('')}

      <!-- Version -->
      <div style="background: var(--bg-tertiary); padding: 12px 16px; font-weight: 600;">Version</div>
      ${selectedCopies.map(copy => `
        <div style="background: var(--bg-secondary); padding: 12px;">📦 v${copy.version}</div>
      `).join('')}

      <!-- Skills -->
      <div style="background: var(--bg-tertiary); padding: 12px 16px; font-weight: 600;">Skills</div>
      ${selectedCopies.map(copy => `
        <div style="background: var(--bg-secondary); padding: 12px;">
          <div class="copy-tags">
            ${copy.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
          </div>
        </div>
      `).join('')}

      <!-- Memory -->
      <div style="background: var(--bg-tertiary); padding: 12px 16px; font-weight: 600;">Memory</div>
      ${selectedCopies.map(copy => `
        <div style="background: var(--bg-secondary); padding: 12px;">
          ${copy.hasMemory ? '✅ Yes' : '❌ No'}
        </div>
      `).join('')}

      <!-- Rating -->
      <div style="background: var(--bg-tertiary); padding: 12px 16px; font-weight: 600;">Rating</div>
      ${selectedCopies.map(copy => {
        const rating = getCopyRating(copy.id);
        const stars = '★'.repeat(Math.round(rating.average)) + '☆'.repeat(5 - Math.round(rating.average));
        return `
        <div style="background: var(--bg-secondary); padding: 12px;">
          ${stars} ${rating.average} (${rating.count})
        </div>
      `}).join('')}

      <!-- Installs -->
      <div style="background: var(--bg-tertiary); padding: 12px 16px; font-weight: 600;">Installs</div>
      ${selectedCopies.map(copy => `
        <div style="background: var(--bg-secondary); padding: 12px;">⬇️ ${getInstallCount(copy.id)}</div>
      `).join('')}

      <!-- Features -->
      <div style="background: var(--bg-tertiary); padding: 12px 16px; font-weight: 600;">Features</div>
      ${selectedCopies.map(copy => `
        <div style="background: var(--bg-secondary); padding: 12px;">
          <ul style="padding-left: 16px; margin: 0;">
            ${copy.features.slice(0, 3).map(f => `<li style="margin-bottom: 4px;">${f}</li>`).join('')}
            ${copy.features.length > 3 ? `<li>+${copy.features.length - 3} more</li>` : ''}
          </ul>
        </div>
      `).join('')}

      <!-- Actions -->
      <div style="background: var(--bg-tertiary); padding: 12px 16px; font-weight: 600;"></div>
      ${selectedCopies.map(copy => `
        <div style="background: var(--bg-secondary); padding: 12px; text-align: center;">
          <button class="btn btn-primary" onclick="openCopyDetail('${copy.id}'); switchPage('browse');" style="padding: 8px 16px; font-size: 0.85rem;">View</button>
        </div>
      `).join('')}
    </div>
  `;

  // Scroll to results
  results.scrollIntoView({ behavior: 'smooth' });
}

// Get featured copies (top rated + high skill count)
function getFeaturedCopies(limit = 4) {
  const ratedCopies = copies.map(copy => {
    const rating = getCopyRating(copy.id);
    const score = (rating.average * 2) + (copy.skills.length * 0.5) + (copy.features.length * 0.3);
    return { ...copy, score };
  });

  return ratedCopies
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Render featured copies
function renderFeaturedCopies() {
  const featuredSection = document.getElementById('featuredSection');
  const featuredList = document.getElementById('featuredList');
  
  if (!featuredSection || !featuredList) return;

  const featured = getFeaturedCopies(4);

  featuredList.innerHTML = `
    <div class="featured-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
      ${featured.map(copy => {
        const rating = getCopyRating(copy.id);
        const stars = '★'.repeat(Math.round(rating.average)) + '☆'.repeat(5 - Math.round(rating.average));
        return `
        <div class="featured-card" onclick="openCopyDetail('${copy.id}')" style="background: var(--bg-secondary); border: 1px solid var(--primary); border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s; position: relative;">
          <div style="position: absolute; top: -10px; right: 10px; background: var(--primary); padding: 4px 10px; border-radius: 20px; font-size: 0.75rem;">⭐ Featured</div>
          <div class="copy-header">
            <span class="copy-name">${copy.name}</span>
          </div>
          <p class="copy-description" style="margin: 12px 0;">${copy.description}</p>
          <div class="copy-meta">
            <span>👤 ${copy.author}</span>
            <span class="copy-rating" style="color: #fbbf24;">${stars} ${rating.average}</span>
          </div>
          <div class="copy-tags" style="margin-top: 12px;">
            ${copy.skills.slice(0, 3).map(skill => `<span class="tag">${skill}</span>`).join('')}
          </div>
        </div>
      `}).join('')}
    </div>
  `;
}

// Render categories
function renderCategories() {
  const filterSection = document.querySelector('.filters');
  const existingCategories = filterSection.querySelector('.categories');
  if (existingCategories) existingCategories.remove();

  const categoriesHTML = document.createElement('div');
  categoriesHTML.className = 'categories';
  categoriesHTML.innerHTML = `
    <div class="category-list">
      ${categories.map(cat => `
        <button class="category-btn ${selectedCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
          <span>${cat.icon}</span>
          <span>${cat.name}</span>
        </button>
      `).join('')}
    </div>
  `;

  const filterGroup = filterSection.querySelector('.filter-group');
  filterSection.insertBefore(categoriesHTML, filterGroup.nextSibling);

  // Add click handlers
  filterSection.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.dataset.category;
      renderCategories();
      renderCopies();
    });
  });
}

// Render copy list
function renderCopies() {
  const filtered = getFilteredCopies();

  if (filtered.length === 0) {
    copyList.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  copyList.innerHTML = filtered.map(copy => {
    const rating = getCopyRating(copy.id);
    const installCount = getInstallCount(copy.id);
    const stars = '★'.repeat(Math.round(rating.average)) + '☆'.repeat(5 - Math.round(rating.average));
    const isPrivate = copy.isPrivate || copy.is_private;
    return `
    <div class="copy-card" data-id="${copy.id}">
      <div class="copy-header">
        <span class="copy-name">${copy.name}</span>
        <span class="copy-badge ${isPrivate ? 'private' : (copy.hasMemory ? 'memory' : 'no-memory')}">
          ${isPrivate ? '🔒 Private' : (copy.hasMemory ? '带 Memory' : '不带 Memory')}
        </span>
      </div>
      <p class="copy-description">${copy.description}</p>
      <div class="copy-meta">
        <span>👤 ${copy.author}</span>
        <span>📦 v${copy.version}</span>
        <span>⬇️ ${installCount} installs</span>
        <span class="copy-rating" title="${rating.count} ratings">${stars} ${rating.average}</span>
        ${copy.github ? '<span>🔗 GitHub</span>' : ''}
      </div>
      <div class="copy-tags">
        ${copy.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
      </div>
    </div>
  `}).join('');

  // Add click handlers
  document.querySelectorAll('.copy-card').forEach(card => {
    card.addEventListener('click', () => {
      const copyId = card.dataset.id;
      openCopyDetail(copyId);
    });
  });
}

// Open copy detail modal
function openCopyDetail(copyId) {
  const copy = copies.find(c => c.id === copyId);
  if (!copy) return;

  // Get rating info
  const rating = getCopyRating(copyId);
  const installCount = getInstallCount(copyId);
  const stars = '★'.repeat(Math.round(rating.average)) + '☆'.repeat(5 - Math.round(rating.average));
  const isPrivate = copy.isPrivate || copy.is_private;

  // Build preview HTML
  let previewHTML = '';
  if (copy.preview) {
    previewHTML = `
      <h3 style="margin-bottom: 12px;">Configuration Preview</h3>
      <div class="preview-section">
        ${Object.entries(copy.preview).map(([file, content]) => `
          <div class="preview-item">
            <div class="preview-file">📄 ${file}</div>
            <pre class="preview-content">${content}</pre>
          </div>
        `).join('')}
      </div>
    `;
  }

  modalBody.innerHTML = `
    <h2>${copy.name}
      ${isPrivate ? '<span class="copy-badge private" style="margin-left: 8px;">🔒 Private</span>' : ''}
    </h2>
    <p>${copy.description}</p>

    <div class="copy-meta" style="margin-bottom: 20px;">
      <span>👤 ${copy.author}</span>
      <span>📦 v${copy.version}</span>
      <span>⬇️ ${installCount} installs</span>
      <span>🔧 ${copy.skills.length} skills</span>
      <span class="copy-rating" style="color: #fbbf24;">${stars} ${rating.average} (${rating.count})</span>
      <span class="copy-badge ${copy.hasMemory ? 'memory' : 'no-memory'}">
        ${copy.hasMemory ? '带 Memory' : '不带 Memory'}
      </span>
      ${copy.github ? `<span><a href="${copy.github}" target="_blank" style="color: var(--primary);">🔗 GitHub</a></span>` : ''}
    </div>

    <h3 style="margin-bottom: 12px;">Rate this copy</h3>
    <div class="rating-stars" id="ratingStars" style="margin-bottom: 24px;">
      ${[1,2,3,4,5].map(star => `
        <span class="star" data-rating="${star}" style="font-size: 1.5rem; cursor: pointer; color: ${star <= rating.userRating ? '#fbbf24' : '#444'};">★</span>
      `).join('')}
      <span style="margin-left: 12px; color: var(--text-secondary); font-size: 0.9rem;">Click to rate</span>
    </div>

    <h3 style="margin-bottom: 12px;">⭐ Star</h3>
    <div class="star-actions" style="margin-bottom: 24px; display: flex; gap: 12px; align-items: center;">
      <button class="btn btn-secondary" onclick="toggleStar('${copy.id}')" id="starBtn">
        ☆ Star this copy
      </button>
      <span id="starCount" style="color: var(--text-secondary);">0 stars</span>
    </div>

    <h3 style="margin-bottom: 12px;">Features</h3>
    <ul style="margin-bottom: 24px; padding-left: 20px; color: var(--text-secondary);">
      ${copy.features.map(f => `<li style="margin-bottom: 8px;">${f}</li>`).join('')}
    </ul>

    ${previewHTML}

    <h3 style="margin-bottom: 12px;">Installation</h3>
    <div class="install-actions">
      <div class="install-command" style="cursor: pointer;" onclick="copyInstallCommand('bash <(curl -sL https://clawhub.com/install/${copyId}.sh)')">
        <code>bash <(curl -sL https://clawhub.com/install/${copyId}.sh)</code>
        <span style="float: right; font-size: 0.8rem; opacity: 0.7;">📋 Click to copy</span>
      </div>
      <button class="btn btn-secondary" style="margin-top: 12px;" onclick="downloadInstallScript('${copy.id}')">
        📥 Download Install Script
      </button>
      <button class="btn btn-primary" style="margin-top: 12px;" onclick="installCopyWithFork('${copy.id}'); closeModal();">
        🖥️ Quick Install ${window.CLAWFACTORY_API?.token ? '(Auto-Fork)' : ''}
      </button>
      ${!window.CLAWFACTORY_API?.token ? `<p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 8px;">💡 Login to auto-fork this copy!</p>` : ''}
    </div>

    <h3 style="margin-bottom: 12px;">Share</h3>
    <div class="share-buttons" style="display: flex; gap: 8px; margin-bottom: 24px;">
      <button class="btn btn-secondary" onclick="shareCopy('${copy.id}', 'twitter')">🐦 Twitter</button>
      <button class="btn btn-secondary" onclick="shareCopy('${copy.id}', 'copy')">📋 Copy Link</button>
      <button class="btn btn-secondary" onclick="shareCopy('${copy.id}', 'email')">✉️ Email</button>
    </div>

    <h3 style="margin-bottom: 12px;">Actions</h3>
    <div style="display: flex; gap: 8px; margin-bottom: 24px;">
      ${!window.CLAWFACTORY_API?.token ? `
      <button class="btn btn-primary" onclick="forkCopy('${copy.id}'); closeModal();">🍴 Fork This Copy</button>
      ` : `
      <p style="color: var(--text-secondary); font-size: 0.9rem;">🍴 Auto-forked when you install (logged in)</p>
      `}
      ${copy.forkedFrom ? `<span style="align-self: center; color: var(--text-secondary); font-size: 0.9rem;">Forked from: ${copy.originalName}</span>` : ''}
    </div>

    <h3 style="margin-bottom: 12px;">🍴 Forks</h3>
    <div id="forksList" style="margin-bottom: 24px;">
      <p style="color: var(--text-secondary);">Loading forks...</p>
    </div>

    <h3 style="margin-bottom: 12px;">📜 Version History</h3>
    <div id="versionHistory" style="margin-bottom: 24px;">
      ${copy.versionHistory && copy.versionHistory.length > 0 ? `
        <div class="version-list" style="border: 1px solid var(--border); border-radius: 8px; overflow: hidden;">
          ${copy.versionHistory.map((v, i) => `
            <div style="padding: 10px 14px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; ${i === 0 ? 'background: var(--bg-tertiary);' : ''}">
              <span>📦 v${v.version}${i === 0 ? ' (current)' : ''}</span>
              <span style="color: var(--text-secondary); font-size: 0.85rem;">${new Date(v.changedAt).toLocaleDateString()}</span>
            </div>
          `).join('')}
        </div>
      ` : '<p style="color: var(--text-secondary);">No version history available</p>'}
    </div>

    <h3 style="margin-bottom: 12px;">Skills</h3>
    <div class="copy-tags">
      ${copy.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
    </div>

    <h3 style="margin-top: 32px; margin-bottom: 12px;">💬 Comments</h3>
    <div id="commentsSection">
      <div class="comment-form" style="margin-bottom: 20px;">
        <textarea id="commentInput" placeholder="Share your experience with this copy..." style="width: 100%; padding: 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); min-height: 80px; margin-bottom: 8px;"></textarea>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="commentAuthor" placeholder="Your name" style="flex: 1; padding: 10px 14px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text);">
          <button class="btn btn-primary" onclick="submitComment('${copy.id}')">Post Comment</button>
        </div>
      </div>
      <div id="commentsList">
        <!-- Comments will be rendered here -->
      </div>
    </div>
  `;

  // Render comments
  renderComments(copyId);

  // Load star count
  loadStarInfo(copyId);

  // Add rating click handlers
  document.querySelectorAll('#ratingStars .star').forEach(star => {
    star.addEventListener('click', () => {
      const ratingValue = parseInt(star.dataset.rating);
      const newRating = rateCopy(copyId, ratingValue);
      
      // Update UI
      document.querySelectorAll('#ratingStars .star').forEach((s, i) => {
        s.style.color = i < ratingValue ? '#fbbf24' : '#444';
      });
      
      // Update rating display
      const starsDisplay = '★'.repeat(Math.round(newRating.average)) + '☆'.repeat(5 - Math.round(newRating.average));
      document.querySelector('.copy-rating').textContent = `${starsDisplay} ${newRating.average} (${newRating.count})`;
    });
  });

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Generate real installation script for a copy
function generateInstallScript(copyId) {
  const copy = copies.find(c => c.id === copyId);
  if (!copy) return null;

  // Get files from complete snapshot (default to empty object)
  const files = copy.files || {};
  const fileNames = Object.keys(files);

  // Generate bash to restore all files
  const restoreFilesScript = fileNames.length > 0
    ? fileNames.map(filename => {
        const escapedContent = (files[filename] || '').replace(/'/g, "'\\''");
        return `
# Create ${filename}
cat > "$SKILLS_DIR/${filename}" << 'EOF${filename}'
${files[filename]}
EOF${filename}
echo -e "${GREEN}📄 Created ${filename}${NC}"`;
      }).join('\n')
    : '# No files in snapshot - creating default SKILL.md\ncat > "$SKILLS_DIR/SKILL.md" << \'EOF\'\n---\nname: ' + copy.name + '\nversion: ' + copy.version + '\ndescription: ' + copy.description + '\nauthor: ' + copy.author + '\n---\n\n# ' + copy.name + '\n\n' + copy.description + '\nEOF';

  // Generate memory restoration script
  const memoryScript = copy.memory
    ? `
# Restore memory file
mkdir -p "$OPENCLAW_DIR/memory"
cat > "$OPENCLAW_DIR/memory/${copyId}.md" << 'EOFMEMORY'
${copy.memory}
EOFMEMORY
echo -e "${GREEN}🧠 Restored memory file${NC}"`
    : '';

  const script = `#!/bin/bash
# ClawFactory Installation Script (Complete Snapshot)
# Copy: ${copy.name}
# Version: ${copy.version}
# Generated: ${new Date().toISOString()}
# Homepage: https://clawhub.com/copy/${copyId}

set -e

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

COPY_NAME="${copy.name}"
COPY_ID="${copy.id}"
COPY_VERSION="${copy.version}"
OPENCLAW_DIR="${process.env.HOME}/.openclaw/workspace"
SKILLS_DIR="$OPENCLAW_DIR/skills/${copyId}"
BACKUP_DIR="$OPENCLAW_DIR/.backups/${copyId}-$(date +%Y%m%d-%H%M%S)"

echo -e "${GREEN}🚀 Installing $COPY_NAME v$COPY_VERSION (Complete Snapshot)...${NC}"

# Safety check: Verify OpenClaw workspace
if [ ! -d "$OPENCLAW_DIR" ]; then
    echo -e "${RED}❌ Error: OpenClaw workspace not found at $OPENCLAW_DIR${NC}"
    exit 1
fi

# Backup existing copy if it exists
if [ -d "$SKILLS_DIR" ]; then
    echo -e "${YELLOW}📦 Backing up existing installation...${NC}"
    mkdir -p "$BACKUP_DIR"
    cp -r "$SKILLS_DIR" "$BACKUP_DIR/"
    echo -e "${GREEN}✅ Backup created at: $BACKUP_DIR${NC}"
fi

# Create skill directory
mkdir -p "$SKILLS_DIR"

${restoreFilesScript}

${memoryScript}

echo ""
echo -e "${GREEN}✅ $COPY_NAME installed successfully!${NC}"
echo -e "${GREEN}📂 Installed to: $SKILLS_DIR${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Restart OpenClaw: ${GREEN}openclaw restart${NC}"
echo -e "  2. Or run: ${GREEN}openclaw${NC}"
echo ""
echo -e "${YELLOW}To uninstall later:${NC}"
echo -e "  ${GREEN}rm -rf $SKILLS_DIR${NC}"
`;

  return script;
}

// Download installation script as file
function downloadInstallScript(copyId) {
  const script = generateInstallScript(copyId);
  if (!script) {
    alert('Copy not found!');
    return;
  }

  const blob = new Blob([script], { type: 'application/x-sh' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `install-${copyId}.sh`;
  a.click();
  URL.revokeObjectURL(url);

  alert(`Script downloaded!\n\nRun: chmod +x install-${copyId}.sh && ./install-${copyId}.sh`);
}

// Copy install command
function copyInstallCommand(command) {
  navigator.clipboard.writeText(command).then(() => {
    alert('Command copied to clipboard!');
  }).catch(() => {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = command;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Command copied to clipboard!');
  });
}

// Install copy with auto-fork for logged in users
async function installCopyWithFork(copyId) {
  const copy = copies.find(c => c.id === copyId);
  if (!copy) {
    alert('Copy not found!');
    return;
  }

  if (window.CLAWFACTORY_API?.token) {
    // Logged in: auto fork first
    const me = await window.CLAWFACTORY_API.getMe();
    if (me.user) {
      // Create fork on backend
      const forkResult = await window.CLAWFACTORY_API.forkCopy(copyId, me.user.id);
      if (forkResult.success) {
        alert(`🍴 Forked "${copy.name}" to your account!\n\nYou can now modify and upload changes.`);
        return;
      }
    }
  }

  // Not logged in or fork failed: just install
  installCopy(copyId);
}

// Close modal
function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
