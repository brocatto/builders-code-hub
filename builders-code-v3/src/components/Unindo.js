import React from 'react';
import { motion } from 'framer-motion';

const Unindo = () => {
  return (
    <section className="py-16 px-4 bg-dark-card/30">
      <div className="container mx-auto">
        <motion.h2 
          className="text-3xl font-display font-bold mb-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="text-gradient">+UNINDO…</span>
        </motion.h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-12 space-y-8 md:space-y-0">
          <motion.div 
            className="glassmorphism rounded-xl p-6 text-center w-full md:w-1/3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h3 className="text-xl font-medium mb-3">construir rápido</h3>
            <div className="text-4xl">👷🏽‍♂️</div>
          </motion.div>
          
          <motion.div 
            className="glassmorphism rounded-xl p-6 text-center w-full md:w-1/3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h3 className="text-xl font-medium mb-3">pensar em sistemas</h3>
            <div className="text-4xl">🧠</div>
          </motion.div>
          
          <motion.div 
            className="glassmorphism rounded-xl p-6 text-center w-full md:w-1/3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h3 className="text-xl font-medium mb-3">conectar ideias e execução</h3>
            <div className="text-4xl">🔨</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Unindo;
