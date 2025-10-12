import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  FileText, 
  Lightbulb, 
  Eye,
  Plus,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projetos: 24,
    logs: 156,
    ideias: 89,
    midias: 342
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMockData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRecentActivity([
        { 
          id: 1, 
          nome: 'Sistema de Autenticação JWT', 
          descricao: 'Implementação completa com refresh tokens',
          tipo: 'projeto',
          timestamp: '2h atrás'
        },
        { 
          id: 2, 
          nome: 'Deploy em Produção v2.1', 
          descricao: 'Deploy com otimizações de performance',
          tipo: 'log',
          timestamp: '4h atrás'
        },
        { 
          id: 3, 
          nome: 'Dashboard Analytics', 
          descricao: 'Sistema de métricas em tempo real',
          tipo: 'ideia',
          timestamp: '1d atrás'
        }
      ]);
      
      setLoading(false);
    };

    loadMockData();
  }, []);

  const statsCards = [
    {
      title: 'Projetos',
      value: stats.projetos,
      icon: FolderOpen,
      color: 'blue',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Logs',
      value: stats.logs,
      icon: FileText,
      color: 'purple',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Ideias',
      value: stats.ideias,
      icon: Lightbulb,
      color: 'orange',
      change: '+25%',
      trend: 'up'
    },
    {
      title: 'Mídia',
      value: stats.midias,
      icon: Eye,
      color: 'pink',
      change: '-3%',
      trend: 'down'
    }
  ];

  const getTypeIcon = (tipo) => {
    const icons = {
      projeto: FolderOpen,
      log: FileText,
      ideia: Lightbulb
    };
    return icons[tipo] || Activity;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-text-primary mb-1">Dashboard</h1>
        <p className="text-text-tertiary">Visão geral do sistema CMS</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            className="card-stat"
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-400 shadow-md`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-xs font-medium ${
                stat.trend === 'up' ? 'text-success' : 'text-error'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-1">{stat.value}</h3>
              <p className="text-text-tertiary text-sm">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          className="lg:col-span-2 card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Atividade Recente</h2>
            <Link 
              to="/admin/logs" 
              className="text-primary hover:text-primary-light text-sm font-medium transition-colors"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => {
              const IconComponent = getTypeIcon(activity.tipo);
              return (
                <motion.div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="p-2 rounded-lg bg-dark-card text-primary flex-shrink-0">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-text-primary font-medium text-sm truncate">{activity.nome}</h3>
                    <p className="text-text-tertiary text-xs mt-1 line-clamp-2">{activity.descricao}</p>
                    <span className="text-text-quaternary text-xs mt-1 block">{activity.timestamp}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions & System Status */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Ações Rápidas</h2>
            <div className="space-y-2">
              {[
                { label: 'Novo Projeto', icon: Plus, href: '/admin/projetos/novo' },
                { label: 'Novo Log', icon: FileText, href: '/admin/logs/novo' },
                { label: 'Nova Ideia', icon: Lightbulb, href: '/admin/ideias/novo' },
                { label: 'Nova Mídia', icon: Eye, href: '/admin/midias/novo' }
              ].map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 group text-text-tertiary hover:text-text-primary text-sm"
                >
                  <action.icon className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="card">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Status do Sistema</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary text-sm">API Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-success text-sm font-medium">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary text-sm">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-success text-sm font-medium">Conectado</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary text-sm">Último Backup</span>
                <span className="text-text-quaternary text-sm">2h atrás</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

