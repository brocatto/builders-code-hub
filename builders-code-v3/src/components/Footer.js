import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-dark">
      <div className="container mx-auto">
        <motion.div 
          className="glassmorphism rounded-xl p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-display font-bold text-gradient mb-2">Builder's Code</h3>
              <p className="text-secondary-text">For Breaking Paradigms</p>
            </div>
            
            <div className="flex space-x-6">
              <a 
                href="http://x.com/joaobrocatto" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-light-text hover:text-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
                </svg>
              </a>
              <a 
                href="https://medium.com/@joaobrocatto" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-light-text hover:text-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M9.025 8c0 2.485-2.02 4.5-4.513 4.5A4.506 4.506 0 0 1 0 8c0-2.486 2.02-4.5 4.512-4.5A4.506 4.506 0 0 1 9.025 8zm4.95 0c0 2.34-1.01 4.236-2.256 4.236-1.246 0-2.256-1.897-2.256-4.236 0-2.34 1.01-4.236 2.256-4.236 1.246 0 2.256 1.897 2.256 4.236zM16 8c0 2.096-.355 3.795-.794 3.795-.438 0-.793-1.7-.793-3.795 0-2.096.355-3.795.794-3.795.438 0 .793 1.699.793 3.795z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-text text-sm mb-4 md:mb-0">© {new Date().getFullYear()} João Brocatto. Todos os direitos reservados.</p>
            
            <div className="flex space-x-6">
              <a href="#objetivo" className="text-secondary-text hover:text-primary transition-colors text-sm">Objetivo</a>
              <a href="#building" className="text-secondary-text hover:text-primary transition-colors text-sm">Projetos</a>
              <a href="#logs" className="text-secondary-text hover:text-primary transition-colors text-sm">Logs</a>
              <a href="#ideas" className="text-secondary-text hover:text-primary transition-colors text-sm">Ideias</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
