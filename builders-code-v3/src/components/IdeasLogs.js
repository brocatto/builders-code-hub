import React from 'react';
import { motion } from 'framer-motion';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { useIdeas } from '../hooks/useAPI';

const IdeasLogs = () => {
  const { ideas, loading, error } = useIdeas();

  if (loading) {
    return (
      <section id="ideas" className="py-20 px-4 bg-dark-card/30">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-12 section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            #IDEAS-LOGS
          </motion.h2>
          
          <div className="flex justify-center">
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-16 h-16 border-4 border-gray-600 border-t-transparent rounded-full"></div>
              <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-primary rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="ideas" className="py-20 px-4 bg-dark-card/30">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-12 section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            #IDEAS-LOGS
          </motion.h2>
          
          <div className="glassmorphism rounded-xl p-8 text-center">
            <p className="text-red-400 mb-4">Erro ao carregar ideias: {error}</p>
            <p className="text-secondary-text">Por favor, recarregue a página para tentar novamente.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="ideas" className="py-20 px-4 bg-dark-card/30">
      <div className="container mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-display font-bold mb-12 section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          #IDEAS-LOGS
        </motion.h2>
        
        <motion.p 
          className="text-xl mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
        >
          Lista de ideias em andamento.
        </motion.p>
        
        <div className="grid-masonry">
          {ideas.map((idea, index) => (
            <motion.div 
              key={idea._id || index}
              className="grid-masonry-item glassmorphism rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <LightBulbIcon className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-xl font-display font-bold">{idea.titulo || idea.title}</h3>
              </div>
              
              {idea.descricao && (
                <p className="text-secondary-text mb-4">{idea.descricao}</p>
              )}
              
              {idea.detalhes && idea.detalhes.length > 0 && (
                <div className="space-y-2 mb-4">
                  {idea.detalhes.map((detalhe, i) => (
                    <div key={i} className="text-sm text-secondary-text">
                      {detalhe.tipo === 'bullet' ? (
                        <div style={{ marginLeft: `${detalhe.nivel * 16}px` }}>
                          <span className="text-primary mr-2">•</span>
                          {detalhe.texto}
                        </div>
                      ) : (
                        <p style={{ marginLeft: `${detalhe.nivel * 16}px` }}>{detalhe.texto}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {idea.status && (
                <div className="mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    idea.status === 'validada' ? 'bg-green-500/20 text-green-400' :
                    idea.status === 'em_analise' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {idea.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              )}
              
              {idea.tags && idea.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {idea.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {ideas.length === 0 && (
          <motion.div 
            className="glassmorphism rounded-xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <LightBulbIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Nenhuma ideia encontrada</h3>
            <p className="text-secondary-text">
              As ideias em desenvolvimento aparecerão aqui em breve.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default IdeasLogs;