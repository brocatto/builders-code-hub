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
  LogOut,
  X,
  Code2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      exact: true,
      color: 'blue'
    },
    {
      label: 'Projetos',
      icon: FolderOpen,
      path: '/admin/projetos',
      color: 'green'
    },
    {
      label: 'Logs',
      icon: FileText,
      path: '/admin/logs',
      color: 'purple'
    },
    {
      label: 'Ideias',
      icon: Lightbulb,
      path: '/admin/ideias',
      color: 'orange'
    },
    {
      label: 'Seções',
      icon: Layout,
      path: '/admin/secoes',
      color: 'cyan'
    },
    {
      label: 'Categorias',
      icon: Tag,
      path: '/admin/categorias',
      color: 'red'
    },
    {
      label: 'Mídias',
      icon: Image,
      path: '/admin/midias',
      color: 'pink'
    },
    {
      label: 'Configurações',
      icon: Settings,
      path: '/admin/configuracoes',
      color: 'gray'
    }
  ];

  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        initial={false}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text-primary">Builder's Code</h2>
                  <p className="text-xs text-text-tertiary">CMS Panel</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-white/10">
            <div className="glassmorphism rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-text-primary truncate">
                    {currentUser?.nome || 'Admin Demo'}
                  </h3>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                    <span className="text-xs text-success">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigationItems.map((item, index) => {
              const isActive = isActiveRoute(item.path, item.exact);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                      isActive
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'hover:bg-white/5 text-text-tertiary hover:text-text-primary'
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-text-tertiary hover:text-error hover:bg-error/10 transition-all duration-200 w-full text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;

