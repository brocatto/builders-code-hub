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
      path: '/admin/projetos'
    },
    {
      label: 'Logs',
      icon: FileText,
      path: '/admin/logs'
    },
    {
      label: 'Ideias',
      icon: Lightbulb,
      path: '/admin/ideias'
    },
    {
      label: 'Seções',
      icon: Layout,
      path: '/admin/secoes'
    },
    {
      label: 'Categorias',
      icon: Tag,
      path: '/admin/categorias'
    },
    {
      label: 'Mídias',
      icon: Image,
      path: '/admin/midias'
    },
    {
      label: 'Configurações',
      icon: Settings,
      path: '/admin/configuracoes'
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
        initial={false}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div className="hidden lg:block">
              <h2 className="text-lg font-bold text-white">Builder's CMS</h2>
              <p className="text-sm text-gray-400">Admin Panel</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentUser?.nome || 'Admin User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {currentUser?.email || 'admin@builders.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActiveRoute(item.path, item.exact)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;