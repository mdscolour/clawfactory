/**
 * ClawFactory Backend API Client
 * Handles communication with the backend server
 * Falls back to localStorage when backend is unavailable
 */

const API = {
  baseUrl: '',
  useBackend: false,
  token: null,

  init() {
    if (typeof window !== 'undefined' && window.CLAWFACTORY_CONFIG) {
      this.baseUrl = window.CLAWFACTORY_CONFIG.API_URL || '';
      this.useBackend = window.CLAWFACTORY_CONFIG.FEATURES?.useBackend && this.baseUrl;
      
      // Load saved token
      if (typeof localStorage !== 'undefined') {
        this.token = localStorage.getItem('clawfactory_token');
      }
    }
    console.log('[API] Initialized - Backend mode:', this.useBackend ? 'ON' : 'OFF');
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
    if (!this.useBackend || !this.baseUrl) {
      return { error: 'Backend not configured', offline: true };
    }

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
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error('[API] Error:', err.message);
      return { error: err.message, offline: true };
    }
  },

  // ========== AUTH ==========
  async register(username, email = null) {
    const result = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email })
    });
    
    if (result.success && result.token) {
      this.setToken(result.token);
    }
    return result;
  },

  async login(username) {
    const result = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username })
    });
    
    if (result.success && result.token) {
      this.setToken(result.token);
    }
    return result;
  },

  async getMe() {
    return await this.request('/api/auth/me');
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
