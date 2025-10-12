import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const MidiasList = () => {
  const [midias, setMidias] = useState([]);
  const [filteredMidias, setFilteredMidias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedMidias, setSelectedMidias] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [previewModal, setPreviewModal] = useState({ open: false, midia: null, index: 0 });
  const [uploadMode, setUploadMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [filters, setFilters] = useState({ search: '', tipo: '', tags: '', ativa: '' });
  const [viewMode, setViewMode] = useState('grid'); // grid ou list
  const fileInputRef = useRef(null);
  const observerRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(20);

  useEffect(() => {
    fetchMidias();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [midias, filters]);

  const applyFilters = useCallback(() => {
    let filtered = [...midias];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(midia => 
        midia.titulo.toLowerCase().includes(searchLower) ||
        midia.descricao?.toLowerCase().includes(searchLower) ||
        midia.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.tipo) {
      filtered = filtered.filter(midia => midia.tipo === filters.tipo);
    }

    if (filters.tags) {
      const tagLower = filters.tags.toLowerCase();
      filtered = filtered.filter(midia => 
        midia.tags.some(tag => tag.toLowerCase().includes(tagLower))
      );
    }

    if (filters.ativa !== '') {
      filtered = filtered.filter(midia => midia.ativa === (filters.ativa === 'true'));
    }

    setFilteredMidias(filtered);
  }, [midias, filters]);

  const fetchMidias = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/midias');
      setMidias(response.data.data.midias);
    } catch (error) {
      console.error('Erro ao buscar mídias:', error);
      toast.error('Erro ao carregar mídias');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/midias/${id}`);
      toast.success('Mídia excluída com sucesso!');
      fetchMidias();
      setSelectedMidias(prev => prev.filter(selectedId => selectedId !== id));
    } catch (error) {
      console.error('Erro ao excluir mídia:', error);
      toast.error('Erro ao excluir mídia');
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMidias.length === 0) return;
    
    try {
      await Promise.all(selectedMidias.map(id => api.delete(`/api/midias/${id}`)));
      toast.success(`${selectedMidias.length} mídias excluídas com sucesso!`);
      fetchMidias();
      setSelectedMidias([]);
      setBulkMode(false);
    } catch (error) {
      console.error('Erro ao excluir mídias:', error);
      toast.error('Erro ao excluir mídias selecionadas');
    }
  };

  const handleSelectMidia = (id) => {
    setSelectedMidias(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMidias.length === filteredMidias.length) {
      setSelectedMidias([]);
    } else {
      setSelectedMidias(filteredMidias.map(midia => midia._id));
    }
  };

  const openPreview = (midia, index) => {
    setPreviewModal({ open: true, midia, index });
  };

  const closePreview = () => {
    setPreviewModal({ open: false, midia: null, index: 0 });
  };

  const navigatePreview = (direction) => {
    const currentIndex = previewModal.index;
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % filteredMidias.length
      : currentIndex === 0 ? filteredMidias.length - 1 : currentIndex - 1;
    
    setPreviewModal({
      open: true,
      midia: filteredMidias[newIndex],
      index: newIndex
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    await handleMultipleUploads(files);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    await handleMultipleUploads(files);
  };

  const handleMultipleUploads = async (files) => {
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || 
                         file.type.startsWith('video/') || 
                         file.type.startsWith('audio/') ||
                         file.type.includes('pdf') ||
                         file.type.includes('document');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidType) {
        toast.error(`Tipo de arquivo não suportado: ${file.name}`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`Arquivo muito grande: ${file.name}`);
        return false;
      }
      return true;
    });

    for (const file of validFiles) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    const fileId = Date.now() + Math.random();
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

    const formData = new FormData();
    formData.append('arquivo', file);

    try {
      const response = await api.post('/api/midias/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({ ...prev, [fileId]: percentCompleted }));
        }
      });

      // Auto-create media entry
      const tipo = file.type.startsWith('image/') ? 'imagem' :
                  file.type.startsWith('video/') ? 'video' :
                  file.type.startsWith('audio/') ? 'audio' : 'documento';

      await api.post('/api/midias', {
        titulo: file.name.split('.')[0],
        tipo,
        url: response.data.url,
        ativa: true,
        tags: []
      });

      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });

      fetchMidias();
      toast.success(`${file.name} enviado com sucesso!`);
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      toast.error(`Erro ao enviar ${file.name}`);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    }
  };

  const downloadMidia = (midia) => {
    const link = document.createElement('a');
    link.href = midia.url;
    link.download = midia.titulo;
    link.click();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copiada para a área de transferência!');
  };

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatar tamanho do arquivo
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Obter classe de tipo
  const getTipoClass = (tipo) => {
    switch (tipo) {
      case 'imagem':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'video':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'documento':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'audio':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Obter ícone do tipo
  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'imagem':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'audio':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          <div className="text-white text-lg font-medium">Carregando mídias...</div>
          <div className="text-gray-400 text-sm">Aguarde enquanto preparamos sua galeria</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" 
         onDragEnter={handleDrag}
         onDragLeave={handleDrag}
         onDragOver={handleDrag}
         onDrop={handleDrop}>
      
      {/* Drag overlay */}
      {dragActive && (
        <div className="fixed inset-0 bg-indigo-600/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-gray-800/90 border-2 border-dashed border-indigo-400 rounded-2xl p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-white text-xl font-semibold mb-2">Solte os arquivos aqui</p>
            <p className="text-gray-400">Múltiplos arquivos suportados</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Galeria de Mídias</h1>
          <p className="text-gray-400">Gerencie suas imagens, vídeos e documentos</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {bulkMode && selectedMidias.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Excluir ({selectedMidias.length})</span>
            </button>
          )}
          
          <button
            onClick={() => setBulkMode(!bulkMode)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              bulkMode ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span>{bulkMode ? 'Sair da Seleção' : 'Seleção Múltipla'}</span>
          </button>
          
          <button
            onClick={() => setUploadMode(!uploadMode)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Upload Rápido</span>
          </button>
          
          <Link
            to="/admin/midias/novo"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nova Mídia</span>
          </Link>
        </div>
      </div>

      {/* Upload Zone */}
      {uploadMode && (
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 mb-8">
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            />
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 hover:border-indigo-500 transition-colors cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}>
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-white text-xl font-semibold mb-2">Upload Múltiplo</h3>
              <p className="text-gray-400 mb-4">Arraste arquivos aqui ou clique para selecionar</p>
              <div className="text-sm text-gray-500">
                <p>Suporte: Imagens, Vídeos, Áudios, PDFs, Documentos</p>
                <p>Tamanho máximo: 10MB por arquivo</p>
              </div>
            </div>
            
            {/* Progress bars */}
            {Object.entries(uploadProgress).map(([id, progress]) => (
              <div key={id} className="mt-4 bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Enviando...</span>
                  <span className="text-sm text-indigo-400">{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                       style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por título, descrição ou tags..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          {/* Type filter */}
          <div>
            <select
              value={filters.tipo}
              onChange={(e) => setFilters(prev => ({ ...prev, tipo: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todos os tipos</option>
              <option value="imagem">Imagens</option>
              <option value="video">Vídeos</option>
              <option value="audio">Áudios</option>
              <option value="documento">Documentos</option>
            </select>
          </div>
          
          {/* Tags filter */}
          <div>
            <input
              type="text"
              placeholder="Filtrar por tag"
              value={filters.tags}
              onChange={(e) => setFilters(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Status filter */}
          <div>
            <select
              value={filters.ativa}
              onChange={(e) => setFilters(prev => ({ ...prev, ativa: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todos os status</option>
              <option value="true">Ativas</option>
              <option value="false">Inativas</option>
            </select>
          </div>
        </div>
        
        {/* View mode and stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm">
              {filteredMidias.length} de {midias.length} mídias
            </span>
            {bulkMode && (
              <button
                onClick={handleSelectAll}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
              >
                {selectedMidias.length === filteredMidias.length ? 'Desmarcar todas' : 'Selecionar todas'}
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-gray-300'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-gray-300'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      {filteredMidias.length > 0 ? (
        <div className={viewMode === 'grid' ? 
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6" :
          "space-y-4"
        }>
          {filteredMidias.slice(0, visibleItems).map((midia, index) => (
            viewMode === 'grid' ? (
              /* Grid Card */
              <div key={midia._id} className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105">
                {/* Checkbox for bulk selection */}
                {bulkMode && (
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedMidias.includes(midia._id)}
                      onChange={() => handleSelectMidia(midia._id)}
                      className="w-5 h-5 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                  </div>
                )}
                
                {/* Image/Preview Area */}
                <div className="relative h-48 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden cursor-pointer"
                     onClick={() => openPreview(midia, index)}>
                  
                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {midia.tipo === 'imagem' ? (
                    <img 
                      src={midia.url} 
                      alt={midia.alt || midia.titulo} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-center">
                      <div className={`p-4 rounded-full mb-3 ${getTipoClass(midia.tipo)}`}>
                        {getTipoIcon(midia.tipo)}
                      </div>
                      <p className="text-gray-300 font-medium">{midia.tipo.charAt(0).toUpperCase() + midia.tipo.slice(1)}</p>
                    </div>
                  )}
                  
                  {/* Hover actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); openPreview(midia, index); }}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadMidia(midia); }}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-sm truncate flex-1 mr-2">{midia.titulo}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTipoClass(midia.tipo)}`}>
                      {midia.tipo}
                    </span>
                  </div>
                  
                  {midia.descricao && (
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">{midia.descricao}</p>
                  )}
                  
                  {/* Tags */}
                  {midia.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {midia.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600">
                          #{tag}
                        </span>
                      ))}
                      {midia.tags.length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600">
                          +{midia.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      midia.ativa ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {midia.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                    
                    <div className="flex space-x-1">
                      <Link
                        to={`/admin/midias/editar/${midia._id}`}
                        className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 rounded transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(midia._id)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* List Item */
              <div key={midia._id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-indigo-500/50 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  {bulkMode && (
                    <input
                      type="checkbox"
                      checked={selectedMidias.includes(midia._id)}
                      onChange={() => handleSelectMidia(midia._id)}
                      className="w-5 h-5 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                  )}
                  
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer"
                       onClick={() => openPreview(midia, index)}>
                    {midia.tipo === 'imagem' ? (
                      <img src={midia.url} alt={midia.alt || midia.titulo} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`p-2 rounded ${getTipoClass(midia.tipo)}`}>
                        {getTipoIcon(midia.tipo)}
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-white font-semibold truncate">{midia.titulo}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTipoClass(midia.tipo)}`}>
                        {midia.tipo}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        midia.ativa ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {midia.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    
                    {midia.descricao && (
                      <p className="text-gray-400 text-sm mb-2 line-clamp-1">{midia.descricao}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Criado: {formatDate(midia.createdAt)}</span>
                      {midia.tags.length > 0 && (
                        <span>Tags: {midia.tags.slice(0, 3).join(', ')}{midia.tags.length > 3 ? '...' : ''}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => openPreview(midia, index)}
                      className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/20 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => downloadMidia(midia)}
                      className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/20 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => copyToClipboard(midia.url)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <Link
                      to={`/admin/midias/editar/${midia._id}`}
                      className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/20 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(midia._id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 max-w-md mx-auto">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-white text-xl font-semibold mb-2">Nenhuma mídia encontrada</h3>
            <p className="text-gray-400 mb-6">
              {midias.length === 0 
                ? 'Comece adicionando sua primeira mídia à galeria' 
                : 'Tente ajustar os filtros ou limpar a busca'}
            </p>
            {midias.length === 0 ? (
              <Link
                to="/admin/midias/novo"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Adicionar Primeira Mídia</span>
              </Link>
            ) : (
              <button
                onClick={() => setFilters({ search: '', tipo: '', tags: '', ativa: '' })}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Limpar Filtros</span>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Load more button */}
      {filteredMidias.length > visibleItems && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisibleItems(prev => prev + 20)}
            className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Carregar mais ({filteredMidias.length - visibleItems} restantes)
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {previewModal.open && previewModal.midia && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50"
             onClick={closePreview}>
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center p-4"
               onClick={(e) => e.stopPropagation()}>
            
            {/* Navigation buttons */}
            <button
              onClick={() => navigatePreview('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => navigatePreview('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Close button */}
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Media content */}
            <div className="flex-1 flex items-center justify-center">
              {previewModal.midia.tipo === 'imagem' ? (
                <img 
                  src={previewModal.midia.url} 
                  alt={previewModal.midia.alt || previewModal.midia.titulo} 
                  className="max-w-full max-h-full object-contain"
                />
              ) : previewModal.midia.tipo === 'video' ? (
                <video 
                  src={previewModal.midia.url} 
                  controls 
                  className="max-w-full max-h-full"
                  autoPlay
                >
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              ) : previewModal.midia.tipo === 'audio' ? (
                <div className="bg-gray-800 rounded-2xl p-8 text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-4">{previewModal.midia.titulo}</h3>
                  <audio 
                    src={previewModal.midia.url} 
                    controls 
                    className="w-full"
                    autoPlay
                  >
                    Seu navegador não suporta o elemento de áudio.
                  </audio>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-2xl p-8 text-center max-w-md">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">{previewModal.midia.titulo}</h3>
                  <p className="text-gray-400 mb-6">Documento</p>
                  <a 
                    href={previewModal.midia.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>Abrir Documento</span>
                  </a>
                </div>
              )}
            </div>
            
            {/* Metadata panel */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{previewModal.midia.titulo}</h3>
                  {previewModal.midia.descricao && (
                    <p className="text-gray-300 text-sm mb-2">{previewModal.midia.descricao}</p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>Tipo: {previewModal.midia.tipo}</span>
                    <span>Criado: {formatDate(previewModal.midia.createdAt)}</span>
                    <span>{previewModal.index + 1} de {filteredMidias.length}</span>
                  </div>
                  {previewModal.midia.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {previewModal.midia.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => downloadMidia(previewModal.midia)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => copyToClipboard(previewModal.midia.url)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <Link
                    to={`/admin/midias/editar/${previewModal.midia._id}`}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    onClick={closePreview}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
             onClick={() => setConfirmDelete(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
               onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Confirmar Exclusão</h3>
              <p className="text-gray-300 mb-6">
                Tem certeza que deseja excluir esta mídia? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

export default MidiasList;
