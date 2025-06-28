// API Configuration with fallback
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://jwt-login-cjop.onrender.com';

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
    return `${API_BASE_URL}${endpoint}`;
}; 