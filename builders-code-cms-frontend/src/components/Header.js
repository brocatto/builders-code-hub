import React from 'react';
import { Menu, Bell, Search, Plus, Command, User } from 'lucide-react';
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
      className={`header transition-all duration-500 ${
        isScrolled 
          ? 'glassmorphism-elevated border-b border-glass-border-elevated backdrop-blur-3xl' 
          : 'glassmorphism backdrop-blur-xl'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left Side - Mobile Menu + Title */}
        <div className="flex items-center space-x-4">
          {/* Mobile Hamburger */}
          <motion.button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-text-tertiary hover:text-text-primary transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          {/* Title */}
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-sm text-text-tertiary">Visão geral do sistema</p>
          </div>
        </div>

        {/* Right Side - Search + Actions */}
        <div className="flex items-center space-x-3">
          {/* Enhanced Search Bar */}
          <motion.div 
            className="hidden md:flex items-center glassmorphism border border-glass-border rounded-lg px-3 py-2 w-64 hover:glassmorphism-elevated transition-all duration-200"
            whileHover={{ scale: 1.02 }}
          >
            <Search className="w-4 h-4 text-text-quaternary mr-3" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="bg-transparent border-none outline-none text-text-primary placeholder-text-quaternary flex-1 text-sm"
            />
          </motion.div>

          {/* Mobile Search Button */}
          <motion.button 
            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-text-tertiary hover:text-text-primary transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-5 h-5" />
          </motion.button>

          {/* Notifications */}
          <motion.button 
            className="relative p-2 rounded-lg hover:bg-white/10 text-text-tertiary hover:text-text-primary transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
          </motion.button>

          {/* Quick Action - Desktop Only */}
          <div className="hidden lg:block">
            <motion.button 
              className="btn btn-primary text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo
            </motion.button>
          </div>

          {/* Profile Avatar */}
          <motion.div 
            className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
          >
            <User className="w-4 h-4 text-white" />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

