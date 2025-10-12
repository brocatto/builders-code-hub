import React from 'react';
import { motion } from 'framer-motion';

const Principios = () => {
  return (
    <motion.div 
      className="glassmorphism rounded-2xl p-8"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.h2 
        className="text-3xl font-display font-bold mb-6 section-title"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
      >
        #PRINCÍPIOS
      </motion.h2>
      
      <motion.p 
        className="text-lg leading-relaxed mb-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        viewport={{ once: true }}
      >
        Construir impacto, quebrando paradigmas, transformando realidades e ajudando
      </motion.p>
      
      <motion.ul 
        className="space-y-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <li className="flex items-center">
          <span className="text-primary mr-2">•</span>
          <span>Impacte o mundo com ideias;</span>
        </li>
        <li className="flex items-center">
          <span className="text-primary mr-2">•</span>
          <span>Quebre paradigmas injustos;</span>
        </li>
        <li className="flex items-center">
          <span className="text-primary mr-2">•</span>
          <span>Transforme realidades estagnadas;</span>
        </li>
        <li className="flex items-center">
          <span className="text-primary mr-2">•</span>
          <span>Ajude pessoas;</span>
        </li>
        <li className="flex items-center">
          <span className="text-primary mr-2">•</span>
          <span>Evolua.</span>
        </li>
      </motion.ul>
    </motion.div>
  );
};

export default Principios;
