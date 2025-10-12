import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const ConfiguracoesList = () => {
  const [configuracoes, setConfiguracoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filtroGrupo, setFiltroGrupo] = useState('todos');

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  const fetchConfiguracoes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/configuracoes');
      setConfiguracoes(response.data.data.configuracoes);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/configuracoes/${id}`);
      toast.success('Configuração excluída com sucesso!');
      fetchConfiguracoes();
    } catch (error) {
      console.error('Erro ao excluir configuração:', error);
      toast.error('Erro ao excluir configuração');
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
      case 'texto':
        return 'bg-blue-100 text-blue-800';
      case 'numero':
        return 'bg-purple-100 text-purple-800';
      case 'booleano':
        return 'bg-green-100 text-green-800';
      case 'json':
        return 'bg-yellow-100 text-yellow-800';
      case 'html':
        return 'bg-pink-100 text-pink-800';
      case 'cor':
        return 'bg-red-100 text-red-800';
      case 'data':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obter grupos únicos
  const grupos = ['todos', ...new Set(configuracoes.map(config => config.grupo))];

  // Filtrar configurações por grupo
  const configuracoesFiltered = filtroGrupo === 'todos' 
    ? configuracoes 
    : configuracoes.filter(config => config.grupo === filtroGrupo);

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
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Link
              to="/admin/configuracoes"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              ← Voltar às Configurações
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white">Gerenciar Configurações</h1>
        </div>
        <Link
          to="/admin/configuracoes/novo"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Nova Configuração
        </Link>
      </div>

      {/* Filtro de grupos */}
      {configuracoes.length > 0 && (
        <div className="mb-6">
          <label htmlFor="filtroGrupo" className="block text-sm font-medium text-gray-300 mb-1">
            Filtrar por Grupo
          </label>
          <select
            id="filtroGrupo"
            value={filtroGrupo}
            onChange={(e) => setFiltroGrupo(e.target.value)}
            className="w-full md:w-64 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {grupos.map((grupo) => (
              <option key={grupo} value={grupo}>
                {grupo.charAt(0).toUpperCase() + grupo.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      {configuracoesFiltered.length > 0 ? (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Chave
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Grupo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Público
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {configuracoesFiltered.map((config) => (
                <tr key={config._id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{config.chave}</div>
                    <div className="text-sm text-gray-400">{config.descricao ? config.descricao.substring(0, 50) + '...' : ''}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">
                      {config.tipo === 'booleano' ? (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          config.valor === 'true' || config.valor === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {config.valor === 'true' || config.valor === true ? 'Verdadeiro' : 'Falso'}
                        </span>
                      ) : config.tipo === 'cor' ? (
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: config.valor }}></div>
                          <span>{config.valor}</span>
                        </div>
                      ) : config.tipo === 'json' || config.tipo === 'html' ? (
                        <div className="truncate max-w-xs">{config.valor}</div>
                      ) : (
                        config.valor
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoClass(config.tipo)}`}>
                      {config.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {config.grupo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      config.publico ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {config.publico ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/admin/configuracoes/editar/${config._id}`}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(config._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center border border-gray-700">
          <p className="text-gray-400">
            {filtroGrupo !== 'todos' 
              ? `Nenhuma configuração encontrada no grupo "${filtroGrupo}".` 
              : 'Nenhuma configuração encontrada.'}
          </p>
          <Link
            to="/admin/configuracoes/novo"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Criar Primeira Configuração
          </Link>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja excluir esta configuração? Esta ação não pode ser desfeita.
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

export default ConfiguracoesList;
