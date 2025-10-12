import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  RotateCcw, 
  Move,
  ArrowUpDown
} from 'lucide-react';
import api from '../services/api';
import DragDropCategoryCard from './DragDropCategoryCard';

const DragDropCategoriasList = ({ categorias: initialCategorias, onUpdate }) => {
  const [categorias, setCategorias] = useState(initialCategorias);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCategorias(initialCategorias);
  }, [initialCategorias]);

  const handleDragStart = (categoria) => {
    setDraggedItem(categoria);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (categoria) => {
    if (draggedItem && draggedItem._id !== categoria._id) {
      setDragOverItem(categoria);
    }
  };

  const handleDrop = (draggedId, targetId) => {
    if (draggedId === targetId) return;

    const draggedIndex = categorias.findIndex(cat => cat._id === draggedId);
    const targetIndex = categorias.findIndex(cat => cat._id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newCategorias = [...categorias];
    const [draggedCategory] = newCategorias.splice(draggedIndex, 1);
    newCategorias.splice(targetIndex, 0, draggedCategory);

    // Atualizar ordens
    const updatedCategorias = newCategorias.map((cat, index) => ({
      ...cat,
      ordem: index
    }));

    setCategorias(updatedCategorias);
    setHasChanges(true);
    setDragOverItem(null);
  };

  const saveReorder = async () => {
    try {
      setSaving(true);
      
      const reorderData = categorias.map((cat, index) => ({
        id: cat._id,
        ordem: index,
        parent: cat.parent?._id || null
      }));

      await api.patch('/api/categorias/reorder', { categorias: reorderData });
      
      toast.success('Categorias reordenadas com sucesso!');
      setHasChanges(false);
      onUpdate && onUpdate();
    } catch (error) {
      console.error('Erro ao reordenar categorias:', error);
      toast.error('Erro ao salvar nova ordenação');
    } finally {
      setSaving(false);
    }
  };

  const resetOrder = () => {
    setCategorias(initialCategorias);
    setHasChanges(false);
  };

  const handleDelete = (id) => {
    // Esta função seria implementada no componente pai
    console.log('Delete categoria:', id);
  };

  return (
    <div className="space-y-6">
      {/* Controles de Drag & Drop */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30 backdrop-blur-md rounded-xl border border-amber-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <ArrowUpDown className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Ordenação Alterada</h4>
                <p className="text-sm text-gray-400">Você tem alterações não salvas na ordem das categorias</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetOrder}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                Desfazer
              </button>
              <button
                onClick={saveReorder}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Salvar Ordem
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instrução de Uso */}
      <div className="p-4 bg-indigo-900/20 backdrop-blur-md rounded-xl border border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <Move className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h4 className="font-medium text-white">Arrastar e Soltar</h4>
            <p className="text-sm text-gray-400">Clique e arraste os cards para reordenar as categorias</p>
          </div>
        </div>
      </div>

      {/* Grid de Categorias Drag & Drop */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {categorias.map((categoria) => (
            <DragDropCategoryCard
              key={categoria._id}
              categoria={categoria}
              onDelete={handleDelete}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDragging={draggedItem?._id === categoria._id}
              dragOverStyle={dragOverItem?._id === categoria._id ? 'active' : null}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Informações Adicionais */}
      <div className="text-center text-sm text-gray-500">
        {categorias.length} categorias • Arraste para reordenar
      </div>
    </div>
  );
};

export default DragDropCategoriasList;