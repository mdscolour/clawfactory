/**
 * ClawFactory Backend API Client
 * Handles communication with the backend server
 * Updated: 2026-02-16 19:50 UTC - FORCE CACHE REFRESH
 */

const API = {
  baseUrl: '',
  useBackend: true,  // Always enable backend
  token: null,

  init() {
    this.useBackend = true;  // Ensure enabled
    this.baseUrl = '';
    this.token = localStorage.getItem('clawfactory_token') || null;
    console.log('[API] Initialized with useBackend=true');
  },

  setToken(token) {
    this.token = token;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('clawfactory_token', token);
    }
  },

  clearToken() {
    this.token = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('clawfactory_token');
    }
  },

  async request(endpoint, options = {}) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      });

      if (response.status === 401) {
        this.clearToken();
        return { error: 'Unauthorized', unauthorized: true };
      }

      if (!response.ok) {
        // Try to parse error response from backend
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          return { error: errorJson.error || errorJson.message || `HTTP ${response.status}`, status: response.status };
        } catch {
          return { error: `HTTP ${response.status}`, status: response.status };
        }
      }

      return await response.json();
    } catch (err) {
      console.error('[API] Error fetching', endpoint, ':', err.message);
      return { error: err.message, offline: true };
    }
  },

  // ========== AUTH ==========
  async register(username, password) {
    const result = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    
    if (result.success && result.token) {
      this.setToken(result.token);
    }
    return result;
  },

  async login(username, password = null) {
    const result = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    
    if (result.success && result.token) {
      this.setToken(result.token);
    }
    return result;
  },

  async googleAuth(googleId, email, name) {
    const result = await this.request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ googleId, email, name })
    });
    
    if (result.success && result.token) {
      this.setToken(result.token);
      currentUser = result.user;
      updateAuthUI();
      showNotification('Logged in with Google!');
      switchPage('home');
    }
    return result;
  },

  async getMe() {
    return await this.request('/api/auth/me');
  },

  async revokeToken(username) {
    return await this.request('/api/auth/revoke', {
      method: 'POST',
      body: JSON.stringify({ username })
    });
  },

  // ========== USER API ==========
  async getUser(username) {
    return await this.request(`/api/users/${encodeURIComponent(username)}`);
  },

  async getUserCopy(username, copySlug) {
    return await this.request(`/api/users/${encodeURIComponent(username)}/${encodeURIComponent(copySlug)}`);
  },

  async getUserCopies(userId) {
    return await this.request(`/api/users/${userId}/copies`);
  },

  logout() {
    this.clearToken();
  },

  // ========== COPIES ==========
  async getCopies() {
    return await this.request('/api/copies');
  },

  async getCopy(id) {
    return await this.request(`/api/copies/${id}`);
  },

  async getPrivateCopy(id, userId) {
    return await this.request(`/api/copies/${id}/private?user_id=${userId}`);
  },

  async createCopy(data) {
    return await this.request('/api/copies', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        is_private: data.isPrivate ? 1 : 0
      })
    });
  },

  async rateCopy(id, rating) {
    return await this.request(`/api/copies/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating })
    });
  },

  async addComment(id, author, text) {
    return await this.request(`/api/copies/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ author, text })
    });
  },

  async trackInstall(id) {
    return await this.request(`/api/copies/${id}/install`, {
      method: 'POST'
    });
  },

  // ========== STAR & FORK ==========
  async starCopy(id, userId, action = 'star') {
    return await this.request(`/api/copies/${id}/star`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, action })
    });
  },

  async getStars(id, userId = null) {
    const endpoint = userId
      ? `/api/copies/${id}/stars?user_id=${userId}`
      : `/api/copies/${id}/stars`;
    return await this.request(endpoint);
  },

  async getUserStars(userId) {
    return await this.request(`/api/users/${userId}/stars`);
  },

  async forkCopy(id, userId) {
    return await this.request(`/api/copies/${id}/fork`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId })
    });
  },

  async getForks(id) {
    return await this.request(`/api/copies/${id}/forks`);
  },

  async getUserForks(userId) {
    return await this.request(`/api/users/${userId}/forks`);
  },

  // ========== VERSION CONTROL (Simple) ==========
  async createVersion(id, version, data, changelog = '') {
    return await this.request(`/api/copies/${id}/versions`, {
      method: 'POST',
      body: JSON.stringify({ version, data, changelog })
    });
  },

  async getVersions(id) {
    return await this.request(`/api/copies/${id}/versions`);
  },

  // ========== SEARCH ==========
  async search(query, options = {}) {
    const params = new URLSearchParams({ q: query, ...options });
    return await this.request(`/api/search?${params}`);
  },

  async getCategories() {
    return await this.request('/api/categories');
  },

  async getFeatured() {
    return await this.request('/api/featured');
  },

  // ========== BACKUP ==========
  async exportData() {
    return await this.request('/api/export');
  },

  async importData(data, overwrite = false) {
    return await this.request('/api/import', {
      method: 'POST',
      body: JSON.stringify({ copies: data, overwrite })
    });
  },

  // ========== SYNC ==========
  async syncFromBackend() {
    // Load all data from backend
    const [copies, featured, categories] = await Promise.all([
      this.getCopies(),
      this.getFeatured(),
      this.getCategories()
    ]);
    
    return { copies, featured, categories };
  },

  async syncToBackend(localCopies) {
    // Upload local copies to backend
    return await this.importData(localCopies, true);
  },

  // ========== HEALTH ==========
  async health() {
    return await this.request('/health');
  }
};

// Auto-init
if (typeof window !== 'undefined') {
  API.init();
}

// Export for use
window.CLAWFACTORY_API = API;
