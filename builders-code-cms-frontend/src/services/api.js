import axios from 'axios';

// Get API URL from environment or use development default
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (import.meta.env.PROD) {
    console.error('VITE_API_URL not configured! Please set it in Vercel environment variables.');
    // Return a placeholder that will trigger clear error messages
    return 'MISSING_API_URL_ENV_VAR';
  }

  return 'http://localhost:5000';
};

// Criar instância do axios com URL base
const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autorização (se necessário)
api.interceptors.request.use(
  (config) => {
    // O backend usa cookies httpOnly, mas mantemos isso para compatibilidade
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratar erros de autenticação (401)
    if (error.response && error.response.status === 401) {
      // Se não estiver na página de login, redirecionar
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/forgot-password') &&
          !window.location.pathname.includes('/reset-password')) {
        localStorage.removeItem('token');
        // Usar window.location.replace para evitar loop de redirecionamento
        window.location.replace('/login');
      }
    }
    
    // Log de erros para debug
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response || error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
