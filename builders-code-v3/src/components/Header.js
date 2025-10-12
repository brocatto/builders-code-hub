import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glassmorphism py-3' : 'bg-transparent py-5'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.div 
          className="text-xl md:text-2xl font-display font-bold"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-gradient">Builder's Code</span>
        </motion.div>
        
        <nav className="hidden md:flex space-x-8">
          <a href="#objetivo" className="text-light-text hover:text-primary transition-colors">Objetivo</a>
          <a href="#building" className="text-light-text hover:text-primary transition-colors">Projetos</a>
          <a href="#logs" className="text-light-text hover:text-primary transition-colors">Logs</a>
          <a href="#ideas" className="text-light-text hover:text-primary transition-colors">Ideias</a>
        </nav>
        
        <div className="flex space-x-4">
          <a href="http://x.com/joaobrocatto" target="_blank" rel="noopener noreferrer" className="text-light-text hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
            </svg>
          </a>
          <a href="https://medium.com/@joaobrocatto" target="_blank" rel="noopener noreferrer" className="text-light-text hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M9.025 8c0 2.485-2.02 4.5-4.513 4.5A4.506 4.506 0 0 1 0 8c0-2.486 2.02-4.5 4.512-4.5A4.506 4.506 0 0 1 9.025 8zm4.95 0c0 2.34-1.01 4.236-2.256 4.236-1.246 0-2.256-1.897-2.256-4.236 0-2.34 1.01-4.236 2.256-4.236 1.246 0 2.256 1.897 2.256 4.236zM16 8c0 2.096-.355 3.795-.794 3.795-.438 0-.793-1.7-.793-3.795 0-2.096.355-3.795.794-3.795.438 0 .793 1.699.793 3.795z"/>
            </svg>
          </a>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
