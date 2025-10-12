import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Palette,
  Activity,
  Eye,
  X
} from 'lucide-react';
import api from '../services/api';

const CategoryAnalytics = ({ isOpen, onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
    }
  }, [isOpen]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/categorias/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'indigo' }) => {
    const colorClasses = {
      indigo: 'from-indigo-600 to-purple-600',
      green: 'from-green-600 to-emerald-600',
      blue: 'from-blue-600 to-cyan-600',
      purple: 'from-purple-600 to-pink-600',
      orange: 'from-orange-600 to-red-600'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 rounded-2xl backdrop-blur-md border border-white/10 bg-gradient-to-br from-white/5 to-transparent overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-10`}></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white">{value}</h3>
            <p className="text-gray-300 font-medium">{title}</p>
            {subtitle && (
              <p className="text-gray-400 text-sm">{subtitle}</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const TopCategoryCard = ({ categoria, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 backdrop-blur-md border border-white/5 hover:border-white/10 transition-colors"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg text-lg font-bold text-gray-400">
        #{index + 1}
      </div>
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${categoria.cor}20`, color: categoria.cor }}
      >
        {categoria.icone ? (
          <i className={categoria.icone}></i>
        ) : (
          <Target className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-white">{categoria.nome}</h4>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="w-3 h-3" />
          {categoria.usageStats.totalUso} usos
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-white">{categoria.usageStats.totalUso}</div>
        <div className="text-xs text-gray-400">Total</div>
      </div>
    </motion.div>
  );

  const ColorDistributionCard = ({ cor, count, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 border border-white/5"
    >
      <div 
        className="w-6 h-6 rounded-full border-2 border-white/20"
        style={{ backgroundColor: cor }}
      ></div>
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{cor}</div>
        <div className="text-xs text-gray-400">{count} categorias</div>
      </div>
    </motion.div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/10 max-w-6xl w-full max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Analytics de Categorias</h2>
                <p className="text-gray-400">Insights e estatísticas detalhadas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"
                />
              </div>
            ) : analytics ? (
              <div className="space-y-8">
                {/* Estatísticas Gerais */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Estatísticas Gerais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      icon={Target}
                      title="Total de Categorias"
                      value={analytics.analytics.totalCategorias || 0}
                      color="indigo"
                    />
                    <StatCard
                      icon={Eye}
                      title="Categorias Ativas"
                      value={analytics.analytics.categoriasAtivas || 0}
                      subtitle={`${Math.round((analytics.analytics.categoriasAtivas / analytics.analytics.totalCategorias) * 100)}% do total`}
                      color="green"
                    />
                    <StatCard
                      icon={Users}
                      title="Total de Usos"
                      value={analytics.analytics.totalUso || 0}
                      color="blue"
                    />
                    <StatCard
                      icon={TrendingUp}
                      title="Média por Categoria"
                      value={analytics.analytics.avgUsoPorCategoria || 0}
                      color="purple"
                    />
                  </div>
                </div>

                {/* Categorias Mais Usadas */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Top 10 Categorias Mais Usadas
                  </h3>
                  <div className="space-y-3">
                    {analytics.categoriasMaisUsadas?.slice(0, 10).map((categoria, index) => (
                      <TopCategoryCard key={categoria._id} categoria={categoria} index={index} />
                    ))}
                  </div>
                </div>

                {/* Distribuição de Cores */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Distribuição de Cores
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {analytics.categoriasPorCor?.map((item, index) => (
                      <ColorDistributionCard 
                        key={item._id} 
                        cor={item._id} 
                        count={item.count} 
                        index={index} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                Erro ao carregar analytics
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CategoryAnalytics;