import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard,
  FolderOpen, 
  FileText, 
  Lightbulb, 
  Layout,
  Tag,
  Image,
  Settings,
  User,
  ChevronLeft,
  ChevronDown,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleLogout = async () => {
    await logout();
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      exact: true
    },
    {
      label: 'Projetos',
      icon: FolderOpen,
      path: '/admin/projetos',
      submenu: [
        { label: 'Listar Projetos', path: '/admin/projetos' },
        { label: 'Novo Projeto', path: '/admin/projetos/novo' }
      ]
    },
    {
      label: 'Logs',
      icon: FileText,
      path: '/admin/logs',
      submenu: [
        { label: 'Listar Logs', path: '/admin/logs' },
        { label: 'Novo Log', path: '/admin/logs/novo' }
      ]
    },
    {
      label: 'Ideias',
      icon: Lightbulb,
      path: '/admin/ideias',
      submenu: [
        { label: 'Listar Ideias', path: '/admin/ideias' },
        { label: 'Nova Ideia', path: '/admin/ideias/novo' }
      ]
    },
    {
      label: 'Seções',
      icon: Layout,
      path: '/admin/secoes',
      submenu: [
        { label: 'Listar Seções', path: '/admin/secoes' },
        { label: 'Nova Seção', path: '/admin/secoes/novo' }
      ]
    },
    {
      label: 'Categorias',
      icon: Tag,
      path: '/admin/categorias',
      submenu: [
        { label: 'Listar Categorias', path: '/admin/categorias' },
        { label: 'Nova Categoria', path: '/admin/categorias/novo' }
      ]
    },
    {
      label: 'Mídias',
      icon: Image,
      path: '/admin/midias',
      submenu: [
        { label: 'Listar Mídias', path: '/admin/midias' },
        { label: 'Nova Mídia', path: '/admin/midias/novo' }
      ]
    },
    {
      label: 'Configurações',
      icon: Settings,
      path: '/admin/configuracoes',
      submenu: [
        { label: 'Gerenciar', path: '/admin/configuracoes/gerenciar' },
        { label: 'Nova Configuração', path: '/admin/configuracoes/novo' }
      ]
    }
  ];

  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: { 
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-700 z-50 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
            </div>
            <div className="hidden lg:block">
              <h2 className="text-lg font-bold text-white tracking-tight">Builder's CMS</h2>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">ADMIN PANEL</p>
            </div>
          </div>
          
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center ring-2 ring-dark-border shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-dark-elevated"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                {currentUser?.nome || 'Admin User'}
              </p>
              <p className="text-xs text-text-tertiary truncate font-mono">
                {currentUser?.email || 'admin@builders.com'}
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                <span className="text-xs text-success font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item, index) => (
            <div key={index} className="mb-2">
              {/* Main Navigation Item */}
              <div
                className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                  isActiveRoute(item.path, item.exact)
                    ? 'bg-primary bg-opacity-15 border border-primary border-opacity-30 text-primary shadow-lg shadow-primary/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-dark-hover'
                }`}
                onClick={() => {
                  if (item.submenu) {
                    toggleSubmenu(item.label);
                  }
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl transition-all duration-200 ${
                    isActiveRoute(item.path, item.exact)
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-dark-card group-hover:bg-dark-border text-text-tertiary group-hover:text-text-secondary'
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                </div>
                
                {item.submenu && (
                  <div className={`p-1 rounded-lg transition-all duration-200 ${
                    expandedMenus[item.label] ? 'bg-dark-card rotate-180' : 'group-hover:bg-dark-card'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Submenu */}
              <AnimatePresence>
                {item.submenu && expandedMenus[item.label] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="ml-6 mt-3 space-y-2 overflow-hidden border-l-2 border-dark-border pl-4"
                  >
                    {item.submenu.map((subitem, subindex) => (
                      <Link
                        key={subindex}
                        to={subitem.path}
                        onClick={() => setIsOpen(false)}
                        className={`block p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          location.pathname === subitem.path
                            ? 'text-primary bg-primary bg-opacity-10 border border-primary border-opacity-20 shadow-lg shadow-primary/10'
                            : 'text-text-tertiary hover:text-text-primary hover:bg-dark-hover'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            location.pathname === subitem.path ? 'bg-primary' : 'bg-text-quaternary'
                          }`}></div>
                          <span>{subitem.label}</span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Quick Actions & Logout */}
        <div className="p-4 border-t border-dark-border space-y-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-text-quaternary font-semibold uppercase tracking-wider">Actions</span>
            <div className="w-8 h-px bg-dark-border"></div>
          </div>
          
          <Link
            to="/admin/profile"
            onClick={() => setIsOpen(false)}
            className="group flex items-center space-x-4 p-4 rounded-2xl text-text-secondary hover:text-text-primary hover:bg-dark-hover transition-all duration-200"
          >
            <div className="p-2 bg-dark-card group-hover:bg-dark-border rounded-xl transition-all duration-200">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-sm">Meu Perfil</span>
              <p className="text-xs text-text-quaternary">Configurações da conta</p>
            </div>
          </Link>
          
          <button
            onClick={handleLogout}
            className="group flex items-center space-x-4 p-4 rounded-2xl text-text-secondary hover:text-error hover:bg-error hover:bg-opacity-10 transition-all duration-200 w-full border border-transparent hover:border-error hover:border-opacity-20"
          >
            <div className="p-2 bg-dark-card group-hover:bg-error group-hover:bg-opacity-20 rounded-xl transition-all duration-200">
              <LogOut className="w-4 h-4" />
            </div>
            <div className="flex-1 text-left">
              <span className="font-semibold text-sm">Sair do Sistema</span>
              <p className="text-xs text-text-quaternary group-hover:text-error">Encerrar sessão</p>
            </div>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;