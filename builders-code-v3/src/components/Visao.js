import React from 'react';
import { motion } from 'framer-motion';

const Visao = () => {
  return (
    <motion.div 
      className="glassmorphism rounded-2xl p-8"
      initial={{ opacity: 0, x: -50 }}
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
        #VISÃO
      </motion.h2>
      
      <motion.p 
        className="text-lg leading-relaxed"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        viewport={{ once: true }}
      >
        Construir a estrada para o desenvolvimento de soluções de bom e grande
        impacto para evolução humana, quebrando paradigmas enraizados na
        sociedade que travam nosso crescimento e transformando a forma como cada
        um enxerga as limitações da própria realidade.
      </motion.p>
      
      <motion.p 
        className="text-secondary-text mt-6 italic"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        viewport={{ once: true }}
      >
        Muitas estruturas da sociedade ditam como você deve seguir a sua vida, sendo s...
      </motion.p>
    </motion.div>
  );
};

export default Visao;
