import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit, 
  Trash2, 
  Plus, 
  BarChart3, 
  TreePine, 
  Grid, 
  Eye,
  Move,
  Users,
  Palette,
  Filter,
  Shuffle
} from 'lucide-react';
import api from '../../../services/api';
import DragDropCategoriasList from '../../../components/DragDropCategoriasList';
import CategoryAnalytics from '../../../components/CategoryAnalytics';
import CategoryTreeView from '../../../components/CategoryTreeView';

const CategoriasList = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'hierarchy', 'table'
  const [analytics, setAnalytics] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all'); // 'all', 'active', 'inactive'
  const [showDragDrop, setShowDragDrop] = useState(false);

  useEffect(() => {
    fetchCategorias();
    fetchAnalytics();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const queryParam = viewMode === 'hierarchy' ? '?hierarchy=true' : '';
      const response = await api.get(`/api/categorias${queryParam}`);
      setCategorias(response.data.data.categorias);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      toast.error('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/api/categorias/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar analytics:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/categorias/${id}`);
      toast.success('Categoria excluída com sucesso!');
      fetchCategorias();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast.error('Erro ao excluir categoria');
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

  // Filtrar categorias
  const filteredCategorias = categorias.filter(categoria => {
    const matchesSearch = categoria.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
      (filterActive === 'active' && categoria.ativo) ||
      (filterActive === 'inactive' && !categoria.ativo);
    return matchesSearch && matchesFilter;
  });

  // Recarregar quando viewMode muda
  useEffect(() => {
    fetchCategorias();
  }, [viewMode]);

  // Componente de Card de Categoria
  const CategoryCard = ({ categoria }) => {
    const gradientStyle = categoria.visualConfig?.gradientEnabled ? {
      background: `linear-gradient(135deg, ${categoria.cor}20, ${categoria.cor}10)`
    } : {
      background: `${categoria.cor}10`
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="relative group"
      >
        <div 
          className="relative p-6 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
          style={gradientStyle}
        >
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
          
          {/* Color indicator */}
          <div 
            className="absolute top-4 right-4 w-4 h-4 rounded-full shadow-lg"
            style={{ backgroundColor: categoria.cor }}
          ></div>

          {/* Header */}
          <div className="relative z-10 flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {categoria.icone && (
                <div 
                  className="text-2xl p-2 rounded-lg backdrop-blur-sm"
                  style={{ color: categoria.cor, backgroundColor: `${categoria.cor}20` }}
                >
                  <i className={categoria.icone}></i>
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{categoria.nome}</h3>
                {categoria.parent && (
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <TreePine className="w-3 h-3" />
                    {categoria.parent.nome}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {categoria.descricao && (
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {categoria.descricao}
            </p>
          )}

          {/* Usage Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {categoria.usageStats?.totalUso || 0}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoria.ativo ? '#10B981' : '#EF4444' }}></div>
                {categoria.ativo ? 'Ativa' : 'Inativa'}
              </span>
            </div>
          </div>

          {/* Children indicator */}
          {categoria.children && categoria.children.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-2">Subcategorias:</div>
              <div className="flex flex-wrap gap-1">
                {categoria.children.slice(0, 3).map(child => (
                  <span 
                    key={child._id}
                    className="px-2 py-1 rounded-full text-xs backdrop-blur-sm border border-white/10"
                    style={{ color: child.cor }}
                  >
                    {child.nome}
                  </span>
                ))}
                {categoria.children.length > 3 && (
                  <span className="px-2 py-1 rounded-full text-xs text-gray-400">+{categoria.children.length - 3}</span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="relative z-10 flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              to={`/admin/categorias/editar/${categoria._id}`}
              className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setConfirmDelete(categoria._id)}
              className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Analytics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestão de Categorias</h1>
          {analytics && (
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>{analytics.totalCategorias} total</span>
              <span>{analytics.categoriasAtivas} ativas</span>
              <span>{analytics.totalUso} usos</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDragDrop(!showDragDrop)}
            className={`p-2 rounded-lg transition-colors ${
              showDragDrop 
                ? 'bg-orange-600 text-white' 
                : 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowAnalytics(true)}
            className="p-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          
          <Link
            to="/admin/categorias/novo"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Nova Categoria
          </Link>
        </div>
      </div>

      {/* Analytics Panel */}
      <AnimatePresence>
        {showAnalytics && analytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-md rounded-2xl border border-white/10"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{analytics.totalCategorias}</div>
              <div className="text-gray-400">Categorias Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{analytics.categoriasAtivas}</div>
              <div className="text-gray-400">Categorias Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{analytics.avgUsoPorCategoria}</div>
              <div className="text-gray-400">Média de Uso</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar categorias..."
              className="pl-10 pr-4 py-2 bg-gray-800/50 backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Filter className="w-4 h-4" />
            </div>
          </div>
          
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="px-3 py-2 bg-gray-800/50 backdrop-blur-md border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todas</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </select>
        </div>

        <div className="flex items-center gap-2 p-1 bg-gray-800/50 backdrop-blur-md border border-gray-600 rounded-lg">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'cards' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('hierarchy')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'hierarchy' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <TreePine className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {filteredCategorias.length > 0 ? (
        <div>
          {viewMode === 'cards' && !showDragDrop && (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredCategorias.map((categoria) => (
                  <CategoryCard key={categoria._id} categoria={categoria} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {viewMode === 'cards' && showDragDrop && (
            <DragDropCategoriasList 
              categorias={filteredCategorias}
              onUpdate={fetchCategorias}
            />
          )}

          {viewMode === 'hierarchy' && (
            <CategoryTreeView 
              categorias={filteredCategorias}
              onDelete={setConfirmDelete}
            />
          )}

          {viewMode === 'table' && (
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/10">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-900/50 to-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Hierarquia</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Uso</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {filteredCategorias.map((categoria) => (
                    <motion.tr 
                      key={categoria._id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {categoria.icone && (
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${categoria.cor}20`, color: categoria.cor }}
                            >
                              <i className={categoria.icone}></i>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-white">{categoria.nome}</div>
                            <div className="text-sm text-gray-400">{categoria.descricao?.substring(0, 40)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {categoria.parent ? (
                          <span className="flex items-center gap-1 text-sm text-gray-400">
                            <TreePine className="w-4 h-4" />
                            {categoria.parent.nome}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">Categoria Raiz</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">{categoria.usageStats?.totalUso || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          categoria.ativo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {categoria.ativo ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/admin/categorias/editar/${categoria._id}`}
                            className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setConfirmDelete(categoria._id)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6">
            <Palette className="w-12 h-12 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhuma categoria encontrada</h3>
          <p className="text-gray-400 mb-6">Comece criando sua primeira categoria</p>
          <Link
            to="/admin/categorias/novo"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Criar Primeira Categoria
          </Link>
        </motion.div>
      )}

      {/* Modal de confirmação de exclusão */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Confirmar Exclusão</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita e pode afetar projetos relacionados.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Modal */}
      <CategoryAnalytics 
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />
    </div>
  );
};

export default CategoriasList;
