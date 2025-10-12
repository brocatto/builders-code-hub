import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexto de autenticação
import { AuthProvider } from './contexts/AuthContext';

// Componentes de layout
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

// Páginas públicas
import Login from './pages/public/Login';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';

// Páginas administrativas
import Dashboard from './pages/admin/Dashboard';
import ProjetosList from './pages/admin/projetos/ProjetosList';
import ProjetosForm from './pages/admin/projetos/ProjetosForm';
import LogsList from './pages/admin/logs/LogsList';
import LogsForm from './pages/admin/logs/LogsForm';
import IdeiasList from './pages/admin/ideias/IdeiasList';
import IdeiasForm from './pages/admin/ideias/IdeiasForm';
import SecoesList from './pages/admin/secoes/SecoesList';
import SecoesForm from './pages/admin/secoes/SecoesForm';
import CategoriasList from './pages/admin/categorias/CategoriasList';
import CategoriasForm from './pages/admin/categorias/CategoriasForm';
import MidiasList from './pages/admin/midias/MidiasList';
import MidiasForm from './pages/admin/midias/MidiasForm';
import ConfiguracoesList from './pages/admin/configuracoes/ConfiguracoesList';
import ConfiguracoesForm from './pages/admin/configuracoes/ConfiguracoesForm';
import Profile from './pages/admin/Profile';

// Componente de rota protegida
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Rotas públicas */}
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Rotas administrativas protegidas */}
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/profile" element={<Profile />} />
            
            {/* Projetos */}
            <Route path="/admin/projetos" element={<ProjetosList />} />
            <Route path="/admin/projetos/novo" element={<ProjetosForm />} />
            <Route path="/admin/projetos/editar/:id" element={<ProjetosForm />} />
            
            {/* Logs */}
            <Route path="/admin/logs" element={<LogsList />} />
            <Route path="/admin/logs/novo" element={<LogsForm />} />
            <Route path="/admin/logs/editar/:id" element={<LogsForm />} />
            
            {/* Ideias */}
            <Route path="/admin/ideias" element={<IdeiasList />} />
            <Route path="/admin/ideias/novo" element={<IdeiasForm />} />
            <Route path="/admin/ideias/editar/:id" element={<IdeiasForm />} />
            
            {/* Seções */}
            <Route path="/admin/secoes" element={<SecoesList />} />
            <Route path="/admin/secoes/novo" element={<SecoesForm />} />
            <Route path="/admin/secoes/editar/:id" element={<SecoesForm />} />
            
            {/* Categorias */}
            <Route path="/admin/categorias" element={<CategoriasList />} />
            <Route path="/admin/categorias/novo" element={<CategoriasForm />} />
            <Route path="/admin/categorias/editar/:id" element={<CategoriasForm />} />
            
            {/* Mídias */}
            <Route path="/admin/midias" element={<MidiasList />} />
            <Route path="/admin/midias/novo" element={<MidiasForm />} />
            <Route path="/admin/midias/editar/:id" element={<MidiasForm />} />
            
            {/* Configurações */}
            <Route path="/admin/configuracoes" element={<ConfiguracoesList />} />
            <Route path="/admin/configuracoes/novo" element={<ConfiguracoesForm />} />
            <Route path="/admin/configuracoes/editar/:id" element={<ConfiguracoesForm />} />
          </Route>

          {/* Redirecionar para o login se acessar a raiz */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rota 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
