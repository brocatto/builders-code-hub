import React from 'react';
import { Menu, Bell, Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = ({ toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled ? 'glassmorphism-elevated border-b border-dark-border backdrop-blur-xl' : 'bg-dark bg-opacity-80'
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-6 lg:px-8 py-4">
        {/* Left Side - Mobile Menu + Search */}
        <div className="flex items-center space-x-6">
          {/* Mobile Hamburger */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-3 rounded-2xl hover:bg-dark-hover text-text-secondary hover:text-text-primary transition-all duration-200 border border-transparent hover:border-dark-border"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex items-center bg-dark-elevated border border-dark-border rounded-2xl px-5 py-3 min-w-[400px] shadow-lg">
            <Search className="w-5 h-5 text-text-tertiary mr-4" />
            <input
              type="text"
              placeholder="Buscar no CMS..."
              className="bg-transparent border-none outline-none text-text-primary placeholder-text-tertiary flex-1 font-medium text-sm"
            />
            <div className="hidden sm:flex items-center space-x-1 ml-4">
              <kbd className="px-2 py-1 bg-dark-card rounded-lg text-xs text-text-quaternary font-mono border border-dark-border">⌘</kbd>
              <kbd className="px-2 py-1 bg-dark-card rounded-lg text-xs text-text-quaternary font-mono border border-dark-border">K</kbd>
            </div>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search Button */}
          <button className="md:hidden p-3 rounded-2xl hover:bg-dark-hover text-text-secondary hover:text-text-primary transition-all duration-200 border border-transparent hover:border-dark-border">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-3 rounded-2xl hover:bg-dark-hover text-text-secondary hover:text-text-primary transition-all duration-200 border border-transparent hover:border-dark-border group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-3 h-3 bg-accent rounded-full border-2 border-dark-elevated animate-pulse"></span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full opacity-75 animate-ping"></span>
          </button>

          {/* Quick Actions - Desktop only */}
          <div className="hidden lg:flex items-center space-x-3">
            <button className="px-4 py-2.5 text-sm font-semibold bg-primary text-white rounded-2xl hover:bg-primary-hover transition-all duration-200 shadow-lg hover:shadow-primary/25">
              <Plus className="w-4 h-4 inline mr-2" />
              Novo Projeto
            </button>
          </div>

          {/* Profile Avatar */}
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center ring-2 ring-dark-border shadow-lg cursor-pointer hover:ring-primary hover:ring-opacity-50 transition-all duration-200">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-dark-elevated"></div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;