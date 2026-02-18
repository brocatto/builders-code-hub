import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useProjectLogs } from '../hooks/useAPI';

const notionEasing = [0.16, 1, 0.3, 1];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: notionEasing },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 10,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const ProjectPeekModal = ({ projeto, isOpen, onClose }) => {
  const { logs, loading: logsLoading } = useProjectLogs(
    isOpen ? projeto?._id : null,
    isOpen ? projeto?.nome : null
  );

  // ESC to close + scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!projeto) return null;

  // Compute fase progress
  const fases = projeto.fase || [];
  const totalFases = fases.length;
  const completedFases = fases.filter(
    (f) => (typeof f === 'object' ? f.concluida : false)
  ).length;
  const progressPct = totalFases > 0 ? (completedFases / totalFases) * 100 : 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Centering wrapper — flexbox avoids Framer Motion overriding CSS translate */}
          <div
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 md:p-8 pointer-events-none"
            onClick={onClose}
          >
          <motion.div
            className="w-full max-w-2xl max-h-full flex flex-col rounded-2xl border border-white/10 shadow-2xl overflow-hidden pointer-events-auto"
            style={{
              background: 'rgba(24, 24, 27, 0.92)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-0">
              <div className="pr-4">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-gradient">
                  {projeto.nome}
                </h2>
                {projeto.categoria && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 inline-block mt-2">
                    {projeto.categoria}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
                aria-label="Fechar"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 pt-4 modal-scrollbar">
              {/* Description */}
              {projeto.detalhes ? (
                <>
                  <p className="text-secondary-text text-sm mb-3">{projeto.descricao}</p>
                  <p className="text-gray-300 mb-4">{projeto.detalhes}</p>
                </>
              ) : (
                <p className="text-gray-300 mb-4">{projeto.descricao}</p>
              )}

              {/* Fases */}
              {totalFases > 0 && (
                <>
                  <Divider />
                  <SectionLabel>FASES DO PROJETO</SectionLabel>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                      <span>Progresso</span>
                      <span>
                        {completedFases}/{totalFases} concluídas
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #0066FF, #6E44FF)',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.8, ease: notionEasing }}
                      />
                    </div>
                  </div>

                  {/* Checklist */}
                  <ul className="space-y-2 mb-2">
                    {fases.map((item, i) => {
                      const nome = typeof item === 'object' ? item.nome : item;
                      const concluida = typeof item === 'object' ? item.concluida : false;
                      const dataConclusao =
                        typeof item === 'object' ? item.dataConclusao : null;
                      return (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <span
                            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs border ${
                              concluida
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            {concluida ? '\u2713' : ''}
                          </span>
                          <span className="flex-1">
                            <span className={concluida ? 'line-through text-gray-500' : ''}>
                              {nome}
                            </span>
                            {concluida && dataConclusao && (
                              <span className="ml-2 text-xs text-gray-600">
                                {formatDate(dataConclusao)}
                              </span>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              {/* Links */}
              {(projeto.link || (projeto.links && projeto.links.length > 0)) && (
                <>
                  <Divider />
                  <SectionLabel>LINKS</SectionLabel>
                  <div className="space-y-2 mb-2">
                    {projeto.link && (
                      <a
                        href={projeto.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 flex-shrink-0" />
                        {projeto.link}
                      </a>
                    )}
                    {projeto.links &&
                      projeto.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
                        >
                          <ArrowTopRightOnSquareIcon className="w-4 h-4 flex-shrink-0" />
                          {link.texto}
                        </a>
                      ))}
                  </div>
                </>
              )}

              {/* Updates / Logs */}
              <Divider />
              <SectionLabel>UPDATES</SectionLabel>

              {logsLoading ? (
                <div className="flex items-center gap-3 py-6 justify-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-gray-600 border-t-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <span className="text-sm text-gray-500">Carregando logs...</span>
                </div>
              ) : logs.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  Nenhum log registrado para este projeto.
                </p>
              ) : (
                <div className="space-y-0">
                  {logs.map((log, i) => (
                    <div key={log._id || i} className="timeline-item">
                      {/* Date + tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-primary">
                          {log.data || formatDate(log.dataReal || log.dataCriacao)}
                        </span>
                        {log.tags &&
                          log.tags.map((tag, ti) => (
                            <span
                              key={ti}
                              className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary/80"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>

                      {/* Atualizacoes (main content) */}
                      {log.atualizacoes && log.atualizacoes.length > 0 ? (
                        <ul className="space-y-1">
                          {log.atualizacoes.map((att, ai) => (
                            <li key={ai} className="text-sm text-gray-300">
                              {att.tipo === 'link' ? (
                                <a
                                  href={att.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80 transition-colors"
                                >
                                  {att.texto}
                                </a>
                              ) : (
                                <p>{att.texto}</p>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : log.conteudo ? (
                        <p className="text-sm text-gray-300">{log.conteudo}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modal, document.body);
};

// Small helper components
const Divider = () => (
  <div className="border-t border-white/5 my-5" />
);

const SectionLabel = ({ children }) => (
  <h3 className="text-xs font-semibold tracking-widest text-gray-500 mb-3">
    {children}
  </h3>
);

export default ProjectPeekModal;
