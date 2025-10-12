import React from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const OpenStartupLog = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-display font-bold mb-12 section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          ?OPEN STARTUP LOG
        </motion.h2>
        
        <motion.div 
          className="glassmorphism rounded-xl p-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center mb-6">
            <ChartBarIcon className="h-8 w-8 text-primary mr-3" />
            <h3 className="text-xl font-display font-bold">Números reais dos negócios (ou de MVPs que esteja testando).</h3>
          </div>
          
          <p className="text-secondary-text mb-6">
            Esta seção será atualizada com métricas e dados reais dos projetos em andamento, mantendo a transparência e compartilhando aprendizados.
          </p>
          
          <div className="flex justify-center">
            <motion.div 
              className="text-primary text-opacity-50"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Em breve...
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OpenStartupLog;
