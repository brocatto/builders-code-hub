import React from 'react';
import { motion } from 'framer-motion';

const Objetivo = () => {
  return (
    <section id="objetivo" className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div 
          className="glassmorphism rounded-2xl p-8 md:p-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-8 text-gradient"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            $OBJETIVO
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
          >
            compartilhar ideias, projetos e execuções desde o estágio pré-alpha, criando um
            ecossistema em torno da habilidade de construir, pensar sistemicamente e
            entregar soluções.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Objetivo;
