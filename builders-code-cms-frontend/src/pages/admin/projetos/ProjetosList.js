import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import api from '../../../services/api';
import FaseConclusaoModal from '../../../components/FaseConclusaoModal';

const ProjetosList = () => {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [faseModal, setFaseModal] = useState({ open: false, projetoId: null, faseIndex: null, faseName: '' });

  useEffect(() => {
    fetchProjetos();
  }, []);

  const fetchProjetos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/projetos');
      setProjetos(response.data.data.projetos);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      toast.error('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/projetos/${id}`);
      toast.success('Projeto excluído com sucesso!');
      fetchProjetos();
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast.error('Erro ao excluir projeto');
    } finally {
      setConfirmDelete(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleFaseCheckbox = (projetoId, faseIndex, fase) => {
    if (!fase.concluida) {
      // Marking as done -> open modal
      setFaseModal({ open: true, projetoId, faseIndex, faseName: fase.nome });
    } else {
      // Unmarking -> call API directly
      toggleFase(projetoId, faseIndex, false, '');
    }
  };

  const toggleFase = async (projetoId, faseIndex, concluida, observacoes) => {
    try {
      await api.patch(`/api/projetos/${projetoId}/fase-toggle`, {
        faseIndex,
        concluida,
        observacoes,
      });
      toast.success(concluida ? 'Fase concluída! Log criado.' : 'Fase desmarcada.');
      fetchProjetos();
    } catch (error) {
      console.error('Erro ao atualizar fase:', error);
      toast.error('Erro ao atualizar fase');
    }
  };

  const handleFaseModalConfirm = (observacoes) => {
    toggleFase(faseModal.projetoId, faseModal.faseIndex, true, observacoes);
    setFaseModal({ open: false, projetoId: null, faseIndex: null, faseName: '' });
  };

  const handleFaseModalCancel = () => {
    setFaseModal({ open: false, projetoId: null, faseIndex: null, faseName: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-gray-600 border-t-transparent rounded-full"></div>
          <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-primary rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <section id="projetos" className="py-20 px-4">
      <div className="container mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-display font-bold mb-12 section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          #PROJETOS-CMS <span className="text-secondary-text font-normal">(GERENCIAR)</span>
        </motion.h2>
        
        {/* Ação rápida - Novo Projeto */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Link
            to="/admin/projetos/novo"
            className="glassmorphism px-6 py-3 rounded-full flex items-center hover:bg-primary/10 transition-all inline-flex"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Projeto
          </Link>
        </motion.div>

        {/* Grid de Projetos - IGUAL AO WEBSITE */}
        {projetos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projetos.map((projeto, index) => (
              <motion.div 
                key={projeto._id}
                className="glassmorphism rounded-xl p-6 card-hover"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl md:text-2xl font-display font-bold mb-3 text-gradient">{projeto.nome}</h3>
                <p className="text-secondary-text mb-4">{projeto.descricao}</p>
                
                {projeto.detalhes && (
                  <p className="mb-4">{projeto.detalhes}</p>
                )}
                
                {projeto.link && (
                  <a 
                    href={projeto.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors inline-block mb-4"
                  >
                    {projeto.link}
                  </a>
                )}
                
                {projeto.fase && projeto.fase.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">FASE ATUAL:</h4>
                    <ul className="space-y-1">
                      {projeto.fase.map((item, i) => {
                        const nome = typeof item === 'object' ? item.nome : item;
                        const concluida = typeof item === 'object' ? item.concluida : false;
                        return (
                          <li key={i} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={concluida}
                              onChange={() => handleFaseCheckbox(projeto._id, i, typeof item === 'object' ? item : { nome: item, concluida: false })}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700 mr-2 cursor-pointer flex-shrink-0"
                            />
                            <span className={concluida ? 'line-through text-gray-500' : ''}>{nome}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Links de Ação - estilo website */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <h4 className="font-semibold mb-2">@ações</h4>
                  <ul className="space-y-1">
                    <li>
                      <Link 
                        to={`/admin/projetos/editar/${projeto._id}`}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        Editar Projeto
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => setConfirmDelete(projeto._id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Excluir Projeto
                      </button>
                    </li>
                    <li>
                      <span className="text-secondary-text text-sm">
                        Criado em {formatDate(projeto.dataCriacao)}
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="glassmorphism rounded-xl p-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-display font-bold mb-4 text-gradient">Nenhum projeto encontrado</h3>
            <p className="text-secondary-text mb-8">
              Comece criando seu primeiro projeto incrível!
            </p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">PRÓXIMOS PASSOS:</h4>
              <ul className="space-y-1">
                <li className="flex items-start justify-center">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span>Criar primeiro projeto</span>
                </li>
                <li className="flex items-start justify-center">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span>Definir fases de desenvolvimento</span>
                </li>
              </ul>
            </div>

            <Link
              to="/admin/projetos/novo"
              className="text-primary hover:text-primary/80 transition-colors inline-block"
            >
              Criar Primeiro Projeto
            </Link>
          </motion.div>
        )}

        {/* Modal de conclusão de fase */}
        <FaseConclusaoModal
          isOpen={faseModal.open}
          faseName={faseModal.faseName}
          onConfirm={handleFaseModalConfirm}
          onCancel={handleFaseModalCancel}
        />

        {/* Modal de confirmação - estilo website */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              className="glassmorphism rounded-xl p-8 max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-display font-bold mb-4 text-gradient">Confirmar Exclusão</h3>
              <p className="text-secondary-text mb-6">
                Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
              </p>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">CONSEQUÊNCIAS:</h4>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">•</span>
                    <span>Projeto será removido permanentemente</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">•</span>
                    <span>Dados não poderão ser recuperados</span>
                  </li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 glassmorphism px-4 py-2 rounded-lg hover:bg-primary/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjetosList;