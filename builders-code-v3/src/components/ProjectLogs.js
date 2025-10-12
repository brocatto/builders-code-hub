import React from 'react';
import { motion } from 'framer-motion';
import { useLogs } from '../hooks/useAPI';

const ProjectLogs = () => {
  const { logs, loading, error } = useLogs(10);

  if (loading) {
    return (
      <section id="logs" className="py-20 px-4 bg-dark-card/30">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-12 section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            #PROJECT-LOGS
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
      <section id="logs" className="py-20 px-4 bg-dark-card/30">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-12 section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            #PROJECT-LOGS
          </motion.h2>
          
          <div className="glassmorphism rounded-xl p-8 text-center">
            <p className="text-red-400 mb-4">Erro ao carregar logs: {error}</p>
            <p className="text-secondary-text">Por favor, recarregue a página para tentar novamente.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="logs" className="py-20 px-4 bg-dark-card/30">
      <div className="container mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-display font-bold mb-12 section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          #PROJECT-LOGS
        </motion.h2>
        
        <motion.p 
          className="text-xl mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
        >
          Logs de projetos em desenvolvimento.
        </motion.p>
        
        <motion.h3 
          className="text-2xl font-display font-bold mb-8 text-primary"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
        >
          LAST UPDATES:
        </motion.h3>
        
        <div className="space-y-10">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <motion.div 
                key={log._id || index}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col md:flex-row md:items-center mb-3">
                  <h4 className="text-lg font-semibold text-primary mr-3">
                    {log.data || new Date(log.dataReal || log.dataCriacao).toLocaleDateString('pt-BR')}
                  </h4>
                  <h4 className="text-lg font-semibold">
                    | Project @ {log.projeto || 'Projeto não especificado'}
                  </h4>
                </div>
                
                <div className="pl-4">
                  {log.atualizacoes && log.atualizacoes.length > 0 ? (
                    <ul className="space-y-2">
                      {log.atualizacoes.map((atualizacao, i) => (
                        <li key={i} className="text-secondary-text">
                          {atualizacao.tipo === 'link' ? (
                            <a 
                              href={atualizacao.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 transition-colors"
                            >
                              {atualizacao.texto}
                            </a>
                          ) : (
                            <p>{atualizacao.texto}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-secondary-text">
                      {log.conteudo && (
                        log.conteudo.includes("http") ? (
                          <p>
                            {log.conteudo.split(">>")[0]}
                            {log.conteudo.includes(">>") && ">> "}
                            {log.conteudo.includes(">>") && (
                              <a 
                                href={log.conteudo.split(">>")[1].trim()} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors"
                              >
                                {log.conteudo.split(">>")[1].trim()}
                              </a>
                            )}
                          </p>
                        ) : (
                          <p>{log.conteudo}</p>
                        )
                      )}
                      
                      {log.detalhes && (
                        <p className="mt-2 text-sm opacity-80">{log.detalhes}</p>
                      )}
                    </div>
                  )}
                  
                  {log.tags && log.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {log.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="glassmorphism rounded-xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-2">Nenhum log encontrado</h3>
              <p className="text-secondary-text">
                Os logs de desenvolvimento aparecerão aqui em breve.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectLogs;