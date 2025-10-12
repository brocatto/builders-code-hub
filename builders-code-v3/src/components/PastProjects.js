import React from 'react';
import { motion } from 'framer-motion';

const PastProjects = () => {
  const projects = [
    {
      url: "http://dragonpharma.com.br/",
      result: "Escalamos do 0 para +R$2M de faturamento em 10 meses"
    },
    {
      url: "http://mercosulvendas.com.br/",
      result: "Escalamos do 0 para +R$ 140k/mês"
    },
    {
      url: "http://woom.com.br/",
      result: "Escalamos dos R$ 50k → +R$ 300k/mês"
    },
    {
      url: "https://biobio.com.br/",
      result: "Escalamos dos R$ 12k → R$ 40k/mês"
    }
  ];

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
          #PAST-PROJECTS
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              className="glassmorphism rounded-xl p-6 card-hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors text-lg font-medium mb-4 block"
              >
                {project.url}
              </a>
              
              <p className="text-secondary-text">{project.result}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PastProjects;
