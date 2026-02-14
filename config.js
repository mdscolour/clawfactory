// ClawFactory Configuration
// Backend API URL (set to null or empty to use localStorage only)

const CONFIG = {
  // Backend server URL (leave empty/null for local-only mode)
  API_URL: process.env.CLAWFACTORY_API_URL || '',
  
  // Feature flags
  FEATURES: {
    useBackend: false, // Set to true when backend is available
    enableSync: true,
    enableRatings: true,
    enableComments: true
  },
  
  // Storage keys
  STORAGE_KEYS: {
    INSTALLED_COPIES: 'clawfactory_installed_copies',
    UPLOADED_COPIES: 'clawfactory_uploaded_copies',
    COPY_RATINGS: 'clawfactory_ratings',
    COPY_COMMENTS: 'clawfactory_comments',
    INSTALL_COUNTS: 'clawfactory_install_counts'
  }
};

// Export for use in app.js
window.CLAWFACTORY_CONFIG = CONFIG;
