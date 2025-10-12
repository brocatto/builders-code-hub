import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Edit, 
  Trash2, 
  TreePine, 
  Users, 
  GripVertical 
} from 'lucide-react';

const DragDropCategoryCard = ({ 
  categoria, 
  onDelete, 
  onDragStart, 
  onDragEnd, 
  onDragOver, 
  onDrop,
  isDragging,
  dragOverStyle = null 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const gradientStyle = categoria.visualConfig?.gradientEnabled ? {
    background: `linear-gradient(135deg, ${categoria.cor}20, ${categoria.cor}10)`
  } : {
    background: `${categoria.cor}10`
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', categoria._id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart && onDragStart(categoria);
  };

  const handleDragEnd = (e) => {
    onDragEnd && onDragEnd();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver && onDragOver(categoria);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    onDrop && onDrop(draggedId, categoria._id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0,
        scale: isDragging ? 0.95 : 1
      }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div 
        className={`relative p-6 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-move ${
          dragOverStyle ? 'border-indigo-400 border-2' : ''
        }`}
        style={gradientStyle}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
        
        {/* Drag handle */}
        <motion.div 
          className="absolute top-2 right-2 p-1 rounded-lg bg-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity"
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </motion.div>

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
          <div className="text-xs text-gray-500">
            Ordem: {categoria.ordem}
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
            onClick={(e) => e.stopPropagation()}
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(categoria._id);
            }}
            className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Drop zone indicator */}
        {dragOverStyle && (
          <div className="absolute inset-0 bg-indigo-500/10 border-2 border-dashed border-indigo-400 rounded-2xl flex items-center justify-center">
            <div className="text-indigo-300 text-sm font-medium">
              Soltar para reordenar
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DragDropCategoryCard;