import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const IdeiasList = () => {
  const [ideias, setIdeias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewMode, setViewMode] = useState('masonry'); // masonry, kanban, list
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedIdeia, setSelectedIdeia] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const masonryRef = useRef(null);

  useEffect(() => {
    fetchIdeias();
  }, []);

  const fetchIdeias = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/ideias');
      setIdeias(response.data.data.ideias);
    } catch (error) {
      console.error('Erro ao buscar ideias:', error);
      toast.error('Erro ao carregar ideias');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/ideias/${id}`);
      toast.success('Ideia excluída com sucesso!');
      fetchIdeias();
    } catch (error) {
      console.error('Erro ao excluir ideia:', error);
      toast.error('Erro ao excluir ideia');
    } finally {
      setConfirmDelete(null);
    }
  };

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Sistema de cores vibrantes para status
  const getStatusConfig = (status) => {
    switch (status) {
      case 'rascunho':
        return {
          bg: 'from-purple-500/20 to-pink-500/20',
          border: 'border-purple-400/30',
          glow: 'shadow-purple-500/20',
          text: 'text-purple-300',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-400/30'
        };
      case 'em_analise':
        return {
          bg: 'from-amber-500/20 to-orange-500/20',
          border: 'border-amber-400/30',
          glow: 'shadow-amber-500/20',
          text: 'text-amber-300',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30'
        };
      case 'validada':
        return {
          bg: 'from-emerald-500/20 to-green-500/20',
          border: 'border-emerald-400/30',
          glow: 'shadow-emerald-500/20',
          text: 'text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
        };
      default:
        return {
          bg: 'from-gray-500/20 to-slate-500/20',
          border: 'border-gray-400/30',
          glow: 'shadow-gray-500/20',
          text: 'text-gray-300',
          badge: 'bg-gray-500/20 text-gray-300 border-gray-400/30'
        };
    }
  };

  // Obter texto de status
  const getStatusText = (status) => {
    switch (status) {
      case 'rascunho':
        return 'Ideia';
      case 'em_analise':
        return 'Desenvolvimento';
      case 'validada':
        return 'Concluída';
      default:
        return 'Desconhecido';
    }
  };

  // Filtrar ideias
  const filteredIdeias = ideias.filter(ideia => {
    const statusMatch = filterStatus === 'all' || ideia.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || ideia.categoria === filterCategory;
    return statusMatch && categoryMatch;
  });

  // Obter categorias únicas
  const uniqueCategories = [...new Set(ideias.map(ideia => ideia.categoria).filter(Boolean))];

  // Gerar altura aleatória para cards masonry
  const getRandomCardHeight = () => {
    const heights = ['h-64', 'h-72', 'h-80', 'h-96'];
    return heights[Math.floor(Math.random() * heights.length)];
  };

  // Abrir modal de detalhes
  const openModal = (ideia) => {
    setSelectedIdeia(ideia);
    setShowModal(true);
  };

  // Fechar modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedIdeia(null);
  };

  // Atualizar status via drag and drop
  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/api/ideias/${id}`, { status: newStatus });
      fetchIdeias();
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  // Handlers para drag and drop
  const handleDragStart = (e, ideia) => {
    setDraggedItem(ideia);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== targetStatus) {
      updateStatus(draggedItem._id, targetStatus);
    }
    setDraggedItem(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400/30 border-t-purple-400"></div>
          <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      {/* Header Premium */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ideias Criativas
            </h1>
            <div className="h-8 w-px bg-gradient-to-b from-purple-400 to-transparent"></div>
            <span className="text-gray-400 font-medium">{filteredIdeias.length} ideias</span>
          </div>
          <Link
            to="/admin/ideias/novo"
            className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Nova Ideia</span>
            </span>
          </Link>
        </div>

        {/* Controles de Visualização e Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10">
          {/* Modos de Visualização */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm font-medium">Visualização:</span>
            <div className="flex rounded-lg bg-gray-800/50 p-1">
              {[
                { mode: 'masonry', icon: 'grid', label: 'Masonry' },
                { mode: 'kanban', icon: 'columns', label: 'Kanban' },
                { mode: 'list', icon: 'list', label: 'Lista' }
              ].map(({ mode, icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === mode
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtros */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-gray-400 text-sm font-medium">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="rascunho">Ideias</option>
                <option value="em_analise">Desenvolvimento</option>
                <option value="validada">Concluídas</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-gray-400 text-sm font-medium">Categoria:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
              >
                <option value="all">Todas</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      {filteredIdeias.length > 0 ? (
        <div>
          {/* Vista Masonry */}
          {viewMode === 'masonry' && (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredIdeias.map((ideia) => {
                const statusConfig = getStatusConfig(ideia.status);
                const cardHeight = getRandomCardHeight();
                return (
                  <div
                    key={ideia._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, ideia)}
                    className={`group relative break-inside-avoid ${cardHeight} rounded-2xl bg-gradient-to-br ${statusConfig.bg} backdrop-blur-xl border ${statusConfig.border} overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${statusConfig.glow} mb-6`}
                    onClick={() => openModal(ideia)}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    
                    {/* Card Content */}
                    <div className="relative p-6 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.badge}`}>
                          {getStatusText(ideia.status)}
                        </span>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Link
                            to={`/admin/ideias/editar/${ideia._id}`}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete(ideia._id);
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 transition-colors"
                          >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                        {ideia.titulo}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
                        {ideia.descricao}
                      </p>

                      {/* Tags */}
                      {ideia.tags && ideia.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {ideia.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white">
                              {tag}
                            </span>
                          ))}
                          {ideia.tags.length > 3 && (
                            <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white">
                              +{ideia.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center space-x-2">
                          {ideia.categoria && (
                            <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                              {ideia.categoria}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDate(ideia.dataCriacao)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Vista Kanban */}
          {viewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['rascunho', 'em_analise', 'validada'].map((status) => {
                const statusConfig = getStatusConfig(status);
                const statusIdeias = filteredIdeias.filter(ideia => ideia.status === status);
                return (
                  <div
                    key={status}
                    className={`rounded-2xl bg-gradient-to-br ${statusConfig.bg} backdrop-blur-xl border ${statusConfig.border} p-6`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                  >
                    <h3 className={`text-lg font-bold ${statusConfig.text} mb-4 text-center`}>
                      {getStatusText(status)} ({statusIdeias.length})
                    </h3>
                    <div className="space-y-4">
                      {statusIdeias.map((ideia) => (
                        <div
                          key={ideia._id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, ideia)}
                          className="group p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-all duration-200 cursor-move border border-white/10"
                          onClick={() => openModal(ideia)}
                        >
                          <h4 className="font-semibold text-white mb-2 line-clamp-1">{ideia.titulo}</h4>
                          <p className="text-gray-300 text-sm line-clamp-2 mb-2">{ideia.descricao}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">{formatDate(ideia.dataCriacao)}</span>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link
                                to={`/admin/ideias/editar/${ideia._id}`}
                                className="p-1 rounded text-blue-400 hover:text-blue-300"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDelete(ideia._id);
                                }}
                                className="p-1 rounded text-red-400 hover:text-red-300"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Vista Lista */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredIdeias.map((ideia) => {
                const statusConfig = getStatusConfig(ideia.status);
                return (
                  <div
                    key={ideia._id}
                    className={`group rounded-2xl bg-gradient-to-r ${statusConfig.bg} backdrop-blur-xl border ${statusConfig.border} p-6 hover:shadow-2xl ${statusConfig.glow} transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
                    onClick={() => openModal(ideia)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-xl font-bold text-white">{ideia.titulo}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.badge}`}>
                            {getStatusText(ideia.status)}
                          </span>
                          {ideia.categoria && (
                            <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                              {ideia.categoria}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 mb-2 line-clamp-2">{ideia.descricao}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{formatDate(ideia.dataCriacao)}</span>
                            {ideia.tags && ideia.tags.length > 0 && (
                              <span>{ideia.tags.length} tags</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Link
                          to={`/admin/ideias/editar/${ideia._id}`}
                          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(ideia._id);
                          }}
                          className="p-3 rounded-xl bg-white/10 hover:bg-red-500/20 transition-colors"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Nenhuma ideia encontrada</h3>
            <p className="text-gray-400 mb-8">Comece criando sua primeira ideia criativa!</p>
            <Link
              to="/admin/ideias/novo"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:scale-105 transition-transform duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Criar Primeira Ideia</span>
            </Link>
          </div>
        </div>
      )}

      {/* Modal de Detalhes Premium */}
      {showModal && selectedIdeia && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20 shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusConfig(selectedIdeia.status).badge}`}>
                    {getStatusText(selectedIdeia.status)}
                  </span>
                  {selectedIdeia.categoria && (
                    <span className="px-3 py-1 bg-white/10 rounded-lg text-sm text-gray-300">
                      {selectedIdeia.categoria}
                    </span>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-3xl font-bold text-white mb-4">{selectedIdeia.titulo}</h2>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">{selectedIdeia.descricao}</p>

                {selectedIdeia.conteudoRich && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-3">Detalhes</h3>
                    <div className="p-4 bg-black/20 rounded-xl text-gray-300">
                      {selectedIdeia.conteudoRich}
                    </div>
                  </div>
                )}

                {selectedIdeia.detalhes && selectedIdeia.detalhes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-3">Estrutura</h3>
                    <div className="space-y-2">
                      {selectedIdeia.detalhes.map((detalhe, index) => (
                        <div key={index} className={`pl-${detalhe.nivel * 4} text-gray-300`}>
                          {detalhe.tipo === 'bullet' && '• '}
                          {detalhe.tipo === 'numbered' && `${index + 1}. `}
                          {detalhe.texto}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedIdeia.tags && selectedIdeia.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedIdeia.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-sm text-purple-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-400">
                  Criado em {formatDate(selectedIdeia.dataCriacao)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between p-6 border-t border-white/10">
                <div className="flex space-x-3">
                  {['rascunho', 'em_analise', 'validada'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        if (status !== selectedIdeia.status) {
                          updateStatus(selectedIdeia._id, status);
                          setSelectedIdeia({ ...selectedIdeia, status });
                        }
                      }}
                      className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                        selectedIdeia.status === status
                          ? `bg-gradient-to-r ${getStatusConfig(status).bg} border ${getStatusConfig(status).border} ${getStatusConfig(status).text}`
                          : 'bg-white/10 hover:bg-white/20 text-gray-300'
                      }`}
                    >
                      {getStatusText(status)}
                    </button>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <Link
                    to={`/admin/ideias/editar/${selectedIdeia._id}`}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => {
                      closeModal();
                      setConfirmDelete(selectedIdeia._id);
                    }}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900/90 to-red-900/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-red-500/30 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Confirmar Exclusão</h3>
              <p className="text-gray-300 mb-8">
                Esta ação não pode ser desfeita. Tem certeza que deseja excluir esta ideia?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeiasList;
