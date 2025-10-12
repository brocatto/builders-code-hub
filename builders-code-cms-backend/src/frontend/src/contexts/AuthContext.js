import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

// Criar contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configurar token no cabeçalho das requisições
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkUser = async () => {
      if (token) {
        try {
          const response = await api.get('/api/auth/me');
          setCurrentUser(response.data.data.user);
        } catch (error) {
          console.error('Erro ao verificar usuário:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkUser();
  }, [token]);

  // Função de login
  const login = async (email, senha) => {
    try {
      const response = await api.post('/api/auth/login', { email, senha });
      const { token, data } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setCurrentUser(data.user);
      
      toast.success('Login realizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      const message = error.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
      toast.error(message);
      return false;
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      if (token) {
        await api.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setCurrentUser(null);
      toast.info('Você saiu do sistema.');
    }
  };

  // Função para solicitar redefinição de senha
  const forgotPassword = async (email) => {
    try {
      await api.post('/api/auth/forgot-password', { email });
      toast.success('Instruções de recuperação enviadas para seu email.');
      return true;
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      const message = error.response?.data?.message || 'Erro ao solicitar recuperação de senha.';
      toast.error(message);
      return false;
    }
  };

  // Função para redefinir senha
  const resetPassword = async (token, senha, confirmarSenha) => {
    try {
      await api.patch(`/api/auth/reset-password/${token}`, { senha, confirmarSenha });
      toast.success('Senha redefinida com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      const message = error.response?.data?.message || 'Erro ao redefinir senha.';
      toast.error(message);
      return false;
    }
  };

  // Função para atualizar senha
  const updatePassword = async (senhaAtual, novaSenha, confirmarSenha) => {
    try {
      const response = await api.patch('/api/auth/update-password', {
        senhaAtual,
        novaSenha,
        confirmarSenha
      });
      
      const { token, data } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setCurrentUser(data.user);
      
      toast.success('Senha atualizada com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      const message = error.response?.data?.message || 'Erro ao atualizar senha.';
      toast.error(message);
      return false;
    }
  };

  // Valores e funções disponíveis no contexto
  const value = {
    currentUser,
    loading,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
