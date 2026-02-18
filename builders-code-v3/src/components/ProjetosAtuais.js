import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { useProjects } from '../hooks/useAPI';
import ProjectPeekModal from './ProjectPeekModal';

const ProjetosAtuais = () => {
  const { projects, loading, error } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter only active projects
  const projetosAtivos = projects.filter(projeto => projeto.ativo);

  if (loading) {
    return (
      <section id="building" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-display font-bold mb-12 section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            #BUILDING RN <span className="text-secondary-text font-normal">(RIGHT NOW)</span>
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
      <section id="building" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-display font-bold mb-12 section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            #BUILDING RN <span className="text-secondary-text font-normal">(RIGHT NOW)</span>
          </motion.h2>

          <div className="glassmorphism rounded-xl p-8 text-center">
            <p className="text-red-400 mb-4">Erro ao carregar projetos: {error}</p>
            <p className="text-secondary-text">Por favor, recarregue a página para tentar novamente.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="building" className="py-20 px-4">
      <div className="container mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-display font-bold mb-12 section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          #BUILDING RN <span className="text-secondary-text font-normal">(RIGHT NOW)</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projetosAtivos.map((projeto, index) => (
            <motion.div
              key={projeto._id}
              className="glassmorphism rounded-xl p-6 card-hover cursor-pointer group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              onClick={() => setSelectedProject(projeto)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelectedProject(projeto); }}
            >
              {/* Expand icon hint */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowsPointingOutIcon className="w-5 h-5 text-gray-500" />
              </div>

              {projeto.categoria && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 inline-block mb-2">
                  {projeto.categoria}
                </span>
              )}
              <h3 className="text-xl md:text-2xl font-display font-bold mb-2 text-gradient">{projeto.nome}</h3>
              <p className="text-secondary-text">{projeto.descricao}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectPeekModal
        projeto={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default ProjetosAtuais;
