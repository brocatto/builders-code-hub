// API Service for Builder's Code Hub v3
import axios from 'axios';

// Get API URL from environment or use development default
const getApiUrl = () => {
  // Check if environment variable is set
  if (process.env.REACT_APP_API_URL) {
    console.log('✅ Using REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }

  // Production fallback - uses stable production alias
  if (process.env.NODE_ENV === 'production') {
    return 'https://builders-code-cms-backend.vercel.app/api';
  }

  // Development default
  return 'http://localhost:5000/api';
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// API endpoints
export const projectsAPI = {
  // Get all projects (public)
  getAll: () => api.get('/projetos/public'),
  
  // Get project by ID (public)
  getById: (id) => api.get(`/projetos/public/${id}`),
  
  // Get featured projects (public)
  getFeatured: () => api.get('/projetos/public?destaque=true'),
};

export const logsAPI = {
  // Get all logs (public)
  getAll: () => api.get('/logs/public'),
  
  // Get logs by project ID (public)
  getByProject: (projectName) => api.get(`/logs/public?projeto=${projectName}&sort=-dataReal`),
  
  // Get recent logs (public)
  getRecent: (limit = 10) => api.get(`/logs/public?limit=${limit}&sort=-dataCriacao`),

  // Get logs by project ObjectId (public)
  getByProjectId: (projetoId) => api.get(`/logs/public?projetoId=${projetoId}&sort=-dataReal`),
};

export const ideasAPI = {
  // Get all ideas (public)
  getAll: () => api.get('/ideias/public'),
  
  // Get featured ideas (public)
  getFeatured: () => api.get('/ideias/public?destaque=true'),
  
  // Get recent ideas (public)
  getRecent: (limit = 5) => api.get(`/ideias/public?limit=${limit}&sort=-dataCriacao`),
};

export const categoriesAPI = {
  // Get all categories
  getAll: () => api.get('/categorias'),
  
  // Get category by ID
  getById: (id) => api.get(`/categorias/${id}`),
};

export const sectionsAPI = {
  // Get all sections
  getAll: () => api.get('/secoes'),
  
  // Get section by ID
  getById: (id) => api.get(`/secoes/${id}`),
};

export const mediaAPI = {
  // Get all media
  getAll: () => api.get('/midias'),
  
  // Get media by type
  getByType: (type) => api.get(`/midias?tipo=${type}`),
};

export const configAPI = {
  // Get all configurations
  getAll: () => api.get('/configuracoes'),
  
  // Get configuration by key
  getByKey: (key) => api.get(`/configuracoes?chave=${key}`),
};

// Error handler
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      throw new Error(data.message || `Server error: ${status}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error: Unable to connect to server');
    } else {
      // Something else happened
      throw new Error(error.message || 'Unknown error occurred');
    }
  }
);

export default api;