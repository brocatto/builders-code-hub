import axios from 'axios';

// Criar instância do axios com URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 
           (import.meta.env.PROD ? 'https://builders-code-cms-backend-9g0zqfie6-brocattos-projects.vercel.app' : 'http://localhost:5000'),
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
