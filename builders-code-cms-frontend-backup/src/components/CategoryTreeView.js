import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronDown, 
  Edit, 
  Trash2, 
  Users,
  Plus
} from 'lucide-react';

const CategoryTreeView = ({ categorias, onDelete }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  // Organizar categorias em hierarquia
  const organizeHierarchy = (cats) => {
    const rootCategories = cats.filter(cat => !cat.parent);
    const childCategories = cats.filter(cat => cat.parent);
    
    const addChildren = (parent) => {
      const children = childCategories.filter(child => child.parent._id === parent._id);
      return {
        ...parent,
        children: children.map(child => addChildren(child))
      };
    };

    return rootCategories.map(root => addChildren(root));
  };

  const toggleExpand = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const TreeNode = ({ categoria, level = 0 }) => {
    const hasChildren = categoria.children && categoria.children.length > 0;
    const isExpanded = expandedNodes.has(categoria._id);
    const indentWidth = level * 24;

    return (
      <div className="relative">
        {/* Connecting Lines */}
        {level > 0 && (
          <>
            {/* Horizontal line */}
            <div 
              className="absolute top-6 bg-gray-600/50 h-px"
              style={{ 
                left: `${indentWidth - 12}px`, 
                width: '12px' 
              }}
            />
            {/* Vertical line */}
            <div 
              className="absolute top-0 bottom-0 w-px bg-gray-600/50"
              style={{ left: `${indentWidth - 12}px` }}
            />
          </>
        )}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group"
          style={{ marginLeft: `${indentWidth}px` }}
        >
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
            {/* Expand/Collapse Button */}
            <button
              onClick={() => toggleExpand(categoria._id)}
              className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                hasChildren 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                  : 'invisible'
              }`}
            >
              {hasChildren && (
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </button>

            {/* Icon */}
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ 
                backgroundColor: `${categoria.cor}20`, 
                color: categoria.cor,
                border: `1px solid ${categoria.cor}40`
              }}
            >
              {categoria.icone ? (
                <i className={categoria.icone}></i>
              ) : (
                categoria.nome.charAt(0).toUpperCase()
              )}
            </div>

            {/* Category Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-white truncate">{categoria.nome}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Users className="w-3 h-3" />
                  {categoria.usageStats?.totalUso || 0}
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  categoria.ativo ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
              {categoria.descricao && (
                <p className="text-sm text-gray-400 truncate mt-1">{categoria.descricao}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                to={`/admin/categorias/editar/${categoria._id}`}
                className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
              >
                <Edit className="w-3 h-3" />
              </Link>
              <button
                onClick={() => onDelete(categoria._id)}
                className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Children */}
          <AnimatePresence>
            {hasChildren && isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {categoria.children.map(child => (
                  <TreeNode 
                    key={child._id} 
                    categoria={child} 
                    level={level + 1} 
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  };

  const hierarchicalCategorias = organizeHierarchy(categorias);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 backdrop-blur-md rounded-xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Visualização em Árvore</h3>
            <p className="text-sm text-gray-400">Explore a hierarquia de categorias</p>
          </div>
        </div>
        <button
          onClick={() => {
            const allIds = new Set(categorias.map(cat => cat._id));
            setExpandedNodes(
              expandedNodes.size === allIds.size ? new Set() : allIds
            );
          }}
          className="px-3 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/30 transition-colors text-sm"
        >
          {expandedNodes.size === categorias.length ? 'Recolher Tudo' : 'Expandir Tudo'}
        </button>
      </div>

      {/* Tree */}
      <div className="bg-gray-800/30 backdrop-blur-md rounded-xl border border-white/5 p-4">
        {hierarchicalCategorias.length > 0 ? (
          <div className="space-y-1">
            {hierarchicalCategorias.map(categoria => (
              <TreeNode key={categoria._id} categoria={categoria} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-3">
              <Plus className="w-8 h-8" />
            </div>
            <p>Nenhuma categoria criada ainda</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Ativa</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span>Inativa</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3" />
          <span>Número de usos</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryTreeView;