import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  FileText, 
  Lightbulb, 
  Eye,
  Plus,
  Activity,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import api from '../../services/api';

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

        setRecentActivity([
          { 
            id: 1, 
            nome: 'Sistema de Autenticação', 
            descricao: 'Projeto criado recentemente com implementação JWT',
            tipo: 'projeto',
            acao: 'create',
            fase: ['Desenvolvimento inicial', 'Testes de integração']
          },
          { 
            id: 2, 
            nome: 'Deploy em Produção', 
            descricao: 'Log de deploy com configurações atualizadas',
            tipo: 'log',
            acao: 'update',
            fase: ['Deploy finalizado', 'Monitoramento ativo']
          },
          { 
            id: 3, 
            nome: 'Dashboard Analytics', 
            descricao: 'Nova ideia para sistema de métricas avançado',
            tipo: 'ideia',
            acao: 'create',
            fase: ['Conceptualização', 'Pesquisa de mercado']
          }
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

  const statsData = [
    { 
      nome: 'Projetos Ativos',
      descricao: `${stats.projetos} projetos em desenvolvimento no sistema CMS`,
      link: '/admin/projetos',
      fase: ['Desenvolvimento', 'Testes', 'Deploy']
    },
    { 
      nome: 'Logs Recentes',
      descricao: `${stats.logs} logs de atividades e atualizações do sistema`,
      link: '/admin/logs',
      fase: ['Monitoramento', 'Análise de dados']
    },
    { 
      nome: 'Ideias em Andamento', 
      descricao: `${stats.ideias} ideias catalogadas para futuras implementações`,
      link: '/admin/ideias',
      fase: ['Brainstorming', 'Validação', 'Planejamento']
    },
    { 
      nome: 'Gestão de Mídia',
      descricao: `${stats.midias} arquivos de mídia organizados no sistema`,
      link: '/admin/midias',
      fase: ['Upload', 'Organização', 'Otimização']
    }
  ];

  const quickActions = [
    { title: 'Novo Projeto', icon: Plus, link: '/admin/projetos/novo' },
    { title: 'Novo Log', icon: FileText, link: '/admin/logs/novo' },
    { title: 'Nova Ideia', icon: Lightbulb, link: '/admin/ideias/novo' },
    { title: 'Nova Mídia', icon: Eye, link: '/admin/midias/novo' }
  ];

  // Dados das métricas principais
  const metricsData = [
    { 
      title: 'Total de Projetos',
      value: stats.projetos,
      change: '+12%',
      changeType: 'positive',
      icon: FolderOpen,
      color: 'blue'
    },
    { 
      title: 'Logs Ativos',
      value: stats.logs,
      change: '+8%',
      changeType: 'positive', 
      icon: FileText,
      color: 'green'
    },
    { 
      title: 'Ideias Catalogadas',
      value: stats.ideias,
      change: '+25%',
      changeType: 'positive',
      icon: Lightbulb,
      color: 'yellow'
    },
    { 
      title: 'Arquivos de Mídia',
      value: stats.midias,
      change: '-3%',
      changeType: 'negative',
      icon: Eye,
      color: 'purple'
    }
  ];

  const getColorClasses = (color, type = 'bg') => {
    const colors = {
      blue: type === 'bg' ? 'bg-blue-500' : type === 'text' ? 'text-blue-400' : 'border-blue-500',
      green: type === 'bg' ? 'bg-green-500' : type === 'text' ? 'text-green-400' : 'border-green-500',
      yellow: type === 'bg' ? 'bg-yellow-500' : type === 'text' ? 'text-yellow-400' : 'border-yellow-500',
      purple: type === 'bg' ? 'bg-purple-500' : type === 'text' ? 'text-purple-400' : 'border-purple-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Visão geral do sistema CMS</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 bg-opacity-10 text-blue-400 rounded-lg hover:bg-opacity-20 transition-colors">
            <Calendar className="w-4 h-4 inline mr-2" />
            Este mês
          </button>
          <Link 
            to="/admin/projetos/novo"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Novo Projeto
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric, index) => (
          <motion.div
            key={index}
            className="glassmorphism rounded-xl p-6 card-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${getColorClasses(metric.color)} bg-opacity-10`}>
                <metric.icon className={`w-6 h-6 ${getColorClasses(metric.color, 'text')}`} />
              </div>
              
              <div className={`flex items-center text-sm ${
                metric.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.changeType === 'positive' ? 
                  <ArrowUpRight className="w-4 h-4 mr-1" /> : 
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                }
                {metric.change}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
              <p className="text-gray-400 text-sm mt-1">{metric.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Atividades Recentes */}
        <div className="lg:col-span-2">
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-text-primary">Atividade Recente</h2>
              <Link to="/admin/logs" className="text-primary hover:text-primary/80 text-sm">
                Ver todas
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-dark-card hover:bg-opacity-50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-2 bg-primary bg-opacity-10 rounded-lg flex-shrink-0">
                    {activity.tipo === 'projeto' && <FolderOpen className="w-4 h-4 text-blue-400" />}
                    {activity.tipo === 'log' && <FileText className="w-4 h-4 text-green-400" />}
                    {activity.tipo === 'ideia' && <Lightbulb className="w-4 h-4 text-yellow-400" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary truncate">{activity.nome}</h3>
                    <p className="text-text-secondary text-sm mt-1 line-clamp-2">{activity.descricao}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activity.acao === 'create' ? 'bg-green-500 bg-opacity-10 text-green-400' :
                        activity.acao === 'update' ? 'bg-yellow-500 bg-opacity-10 text-yellow-400' :
                        'bg-blue-500 bg-opacity-10 text-blue-400'
                      }`}>
                        {activity.acao === 'create' ? 'Criado' : activity.acao === 'update' ? 'Atualizado' : 'Visualizado'}
                      </span>
                      <span className="text-xs text-text-secondary">há 2 horas</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="space-y-6">
          <div className="glassmorphism rounded-xl p-6">
            <h2 className="text-xl font-display font-bold text-text-primary mb-6">Ações Rápidas</h2>
            
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-card hover:bg-opacity-50 transition-colors group"
                >
                  <div className="p-2 bg-primary bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors">
                    <action.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-text-primary group-hover:text-primary transition-colors">
                    {action.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Status do Sistema */}
          <div className="glassmorphism rounded-xl p-6">
            <h2 className="text-xl font-display font-bold text-text-primary mb-6">Status do Sistema</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">API Status</span>
                <span className="flex items-center text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Online
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Database</span>
                <span className="flex items-center text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Conectado
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Último Backup</span>
                <span className="text-text-secondary">2h atrás</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;