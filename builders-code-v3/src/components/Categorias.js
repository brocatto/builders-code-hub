import React from 'react';
import { motion } from 'framer-motion';
import { 
  LightBulbIcon, 
  CodeBracketIcon, 
  CubeIcon,
  WrenchScrewdriverIcon,
  ArrowPathIcon,
  BookOpenIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Categorias = () => {
  const categorias = [
    { nome: 'ideias', icone: <LightBulbIcon className="h-8 w-8" /> },
    { nome: 'wireframes', icone: <CodeBracketIcon className="h-8 w-8" /> },
    { nome: 'mvps', icone: <CubeIcon className="h-8 w-8" /> },
    { nome: 'operações', icone: <WrenchScrewdriverIcon className="h-8 w-8" /> },
    { nome: 'decisões', icone: <ArrowPathIcon className="h-8 w-8" /> },
    { nome: 'aprendizados', icone: <BookOpenIcon className="h-8 w-8" /> },
    { nome: 'escala', icone: <ChartBarIcon className="h-8 w-8" /> },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categorias.map((categoria, index) => (
            <motion.div
              key={categoria.nome}
              className="glassmorphism rounded-xl p-4 flex flex-col items-center justify-center text-center card-hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-primary mb-3">
                {categoria.icone}
              </div>
              <h3 className="text-lg font-medium">{categoria.nome}</h3>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-xl text-secondary-text">#everthying about building and scaling cool solutions and brands</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Categorias;
