import axios from 'axios';

// Criar instância do axios com URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

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
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
