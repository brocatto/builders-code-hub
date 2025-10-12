import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projetos: 0,
    logs: 0,
    ideias: 0,
    secoes: 0,
    categorias: 0,
    midias: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Buscar estatísticas
        const [
          projetosRes,
          logsRes,
          ideiasRes,
          secoesRes,
          categoriasRes,
          midiasRes
        ] = await Promise.all([
          api.get('/api/projetos?limit=1'),
          api.get('/api/logs?limit=1'),
          api.get('/api/ideias?limit=1'),
          api.get('/api/secoes?limit=1'),
          api.get('/api/categorias?limit=1'),
          api.get('/api/midias?limit=1')
        ]);

        setStats({
          projetos: projetosRes.data.results,
          logs: logsRes.data.results,
          ideias: ideiasRes.data.results,
          secoes: secoesRes.data.results,
          categorias: categoriasRes.data.results,
          midias: midiasRes.data.results
        });

        // Buscar atividades recentes (simulado por enquanto)
        // Em uma implementação real, teríamos um endpoint específico para isso
        setRecentActivity([
          { id: 1, tipo: 'projeto', acao: 'create', entidade: 'Novo Projeto', data: new Date().toISOString() },
          { id: 2, tipo: 'log', acao: 'update', entidade: 'Atualização de Log', data: new Date().toISOString() },
          { id: 3, tipo: 'ideia', acao: 'create', entidade: 'Nova Ideia', data: new Date().toISOString() }
        ]);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Função para formatar data
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

  // Função para obter ícone baseado no tipo
  const getIcon = (tipo) => {
    switch (tipo) {
      case 'projeto':
        return (
          <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'log':
        return (
          <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'ideia':
        return (
          <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="text-sm text-gray-400">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-500 bg-opacity-10">
              <svg className="h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">{stats.projetos}</h2>
              <p className="text-gray-400">Projetos</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/projetos" className="text-indigo-400 hover:text-indigo-300 text-sm">
              Ver todos →
            </Link>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500 bg-opacity-10">
              <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">{stats.logs}</h2>
              <p className="text-gray-400">Logs</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/logs" className="text-green-400 hover:text-green-300 text-sm">
              Ver todos →
            </Link>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500 bg-opacity-10">
              <svg className="h-8 w-8 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">{stats.ideias}</h2>
              <p className="text-gray-400">Ideias</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/ideias" className="text-yellow-400 hover:text-yellow-300 text-sm">
              Ver todas →
            </Link>
          </div>
        </div>
      </div>

      {/* Atividades recentes */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Atividades Recentes</h2>
        
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start p-3 bg-gray-700 bg-opacity-50 rounded-lg">
                <div className="mr-3">
                  {getIcon(activity.tipo)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-white font-medium">{activity.entidade}</p>
                    <span className="text-gray-400 text-sm">{formatDate(activity.data)}</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {activity.acao === 'create' ? 'Criado' : activity.acao === 'update' ? 'Atualizado' : 'Excluído'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">Nenhuma atividade recente encontrada.</p>
          )}
        </div>
      </div>

      {/* Links rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Ações Rápidas</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin/projetos/novo"
              className="flex items-center p-3 bg-indigo-500 bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all"
            >
              <svg className="h-5 w-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-white">Novo Projeto</span>
            </Link>
            
            <Link
              to="/admin/logs/novo"
              className="flex items-center p-3 bg-green-500 bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all"
            >
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-white">Novo Log</span>
            </Link>
            
            <Link
              to="/admin/ideias/novo"
              className="flex items-center p-3 bg-yellow-500 bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all"
            >
              <svg className="h-5 w-5 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-white">Nova Ideia</span>
            </Link>
            
            <Link
              to="/admin/midias/novo"
              className="flex items-center p-3 bg-purple-500 bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all"
            >
              <svg className="h-5 w-5 text-purple-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-white">Nova Mídia</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Resumo do Sistema</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Seções</span>
              <span className="text-white font-medium">{stats.secoes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Categorias</span>
              <span className="text-white font-medium">{stats.categorias}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Mídias</span>
              <span className="text-white font-medium">{stats.midias}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Última atualização</span>
              <span className="text-white font-medium">{formatDate(new Date().toISOString())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
