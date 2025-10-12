import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const MidiasList = () => {
  const [midias, setMidias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchMidias();
  }, []);

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
    } catch (error) {
      console.error('Erro ao excluir mídia:', error);
      toast.error('Erro ao excluir mídia');
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

  // Obter classe de tipo
  const getTipoClass = (tipo) => {
    switch (tipo) {
      case 'imagem':
        return 'bg-blue-100 text-blue-800';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'documento':
        return 'bg-green-100 text-green-800';
      case 'audio':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Mídias</h1>
        <Link
          to="/admin/midias/novo"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Nova Mídia
        </Link>
      </div>

      {midias.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {midias.map((midia) => (
            <div key={midia._id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-white truncate">{midia.titulo}</h3>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoClass(midia.tipo)}`}>
                    {midia.tipo}
                  </span>
                </div>
                
                <div className="h-40 flex items-center justify-center bg-gray-700 rounded-md mb-3 overflow-hidden">
                  {midia.tipo === 'imagem' ? (
                    <img src={midia.url} alt={midia.alt || midia.titulo} className="max-h-full max-w-full object-contain" />
                  ) : midia.tipo === 'video' ? (
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-400">Vídeo</p>
                    </div>
                  ) : midia.tipo === 'audio' ? (
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-400">Áudio</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-400">Documento</p>
                    </div>
                  )}
                </div>
                
                {midia.descricao && (
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{midia.descricao}</p>
                )}
                
                {midia.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {midia.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
                        {tag}
                      </span>
                    ))}
                    {midia.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
                        +{midia.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    midia.ativa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {midia.ativa ? 'Ativa' : 'Inativa'}
                  </span>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/midias/editar/${midia._id}`}
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(midia._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center border border-gray-700">
          <p className="text-gray-400">Nenhuma mídia encontrada.</p>
          <Link
            to="/admin/midias/novo"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Adicionar Primeira Mídia
          </Link>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja excluir esta mídia? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MidiasList;
