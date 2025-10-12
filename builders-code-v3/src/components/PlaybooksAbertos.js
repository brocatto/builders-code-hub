import React from 'react';
import { motion } from 'framer-motion';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const PlaybooksAbertos = () => {
  return (
    <section className="py-20 px-4 bg-dark-card/30">
      <div className="container mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-display font-bold mb-12 section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          "Playbooks Abertos"
        </motion.h2>
        
        <motion.div 
          className="glassmorphism rounded-xl p-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center mb-6">
            <BookOpenIcon className="h-8 w-8 text-primary mr-3" />
            <h3 className="text-xl font-display font-bold">Mostre como pensa, com frameworks, Notion templates, Miro, etc.</h3>
          </div>
          
          <p className="text-secondary-text mb-6">
            Esta seção compartilhará frameworks, templates e metodologias utilizadas nos projetos, servindo como lead magnet natural e recurso para a comunidade.
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

export default PlaybooksAbertos;
