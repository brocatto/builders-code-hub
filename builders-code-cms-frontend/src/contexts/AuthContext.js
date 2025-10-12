import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

// Criar contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provedor de autenticação real com JWT
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se o usuário está autenticado ao carregar a aplicação
  useEffect(() => {
    checkAuth();
  }, []);

  // Função para verificar autenticação (usando cookie JWT)
  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/auth/me');
      
      if (response.data.status === 'success') {
        setCurrentUser(response.data.data.user);
      }
    } catch (error) {
      // Se não estiver autenticado, limpar estado
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Função de login real
  const login = async (email, senha) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/login', {
        email,
        senha
      });
      
      if (response.data.status === 'success') {
        setCurrentUser(response.data.data.user);
        toast.success('Login realizado com sucesso!');
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout real
  const logout = async () => {
    try {
      setLoading(true);
      await api.post('/api/auth/logout');
      setCurrentUser(null);
      toast.info('Você saiu do sistema.');
    } catch (error) {
      // Mesmo se der erro no logout do servidor, limpar estado local
      setCurrentUser(null);
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para solicitar redefinição de senha real
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/forgot-password', {
        email
      });
      
      if (response.data.status === 'success') {
        toast.success('Instruções de recuperação enviadas para seu email.');
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao solicitar recuperação de senha.';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função para redefinir senha real
  const resetPassword = async (token, senha, confirmarSenha) => {
    try {
      setLoading(true);
      const response = await api.patch(`/api/auth/reset-password/${token}`, {
        senha,
        confirmarSenha
      });
      
      if (response.data.status === 'success') {
        setCurrentUser(response.data.data.user);
        toast.success('Senha redefinida com sucesso!');
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao redefinir senha.';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar senha real
  const updatePassword = async (senhaAtual, novaSenha, confirmarSenha) => {
    try {
      setLoading(true);
      const response = await api.patch('/api/auth/update-password', {
        senhaAtual,
        novaSenha,
        confirmarSenha
      });
      
      if (response.data.status === 'success') {
        setCurrentUser(response.data.data.user);
        toast.success('Senha atualizada com sucesso!');
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao atualizar senha.';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
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
    checkAuth,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};