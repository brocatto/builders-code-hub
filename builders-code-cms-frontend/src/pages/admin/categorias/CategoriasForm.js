import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  ArrowLeft, 
  Palette, 
  TreePine, 
  Eye, 
  Sparkles,
  Hash,
  Move,
  Users,
  Activity,
  Zap
} from 'lucide-react';
import api from '../../../services/api';

const CategoriasForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cor: '#6366F1',
    icone: '',
    ordem: 0,
    ativo: true,
    parent: null,
    visualConfig: {
      gradientEnabled: false,
      gradientColors: ['#6366F1', '#8B5CF6'],
      opacity: 1,
      borderStyle: 'solid'
    }
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Paleta de cores sugeridas
  const suggestedColors = [
    '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F97316',
    '#F59E0B', '#84CC16', '#22C55E', '#06B6D4', '#3B82F6',
    '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899'
  ];

  // Ícones sugeridos
  const suggestedIcons = [
    'fa-rocket', 'fa-code', 'fa-palette', 'fa-lightbulb', 'fa-star',
    'fa-heart', 'fa-fire', 'fa-bolt', 'fa-magic', 'fa-gem',
    'fa-crown', 'fa-shield', 'fa-trophy', 'fa-diamond', 'fa-leaf'
  ];

  // Buscar dados da categoria se estiver em modo de edição
  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await api.get(`/api/categorias/${id}`);
          const categoria = response.data.data.categoria;
          setFormData({
            ...categoria,
            visualConfig: categoria.visualConfig || {
              gradientEnabled: false,
              gradientColors: [categoria.cor || '#6366F1', '#8B5CF6'],
              opacity: 1,
              borderStyle: 'solid'
            }
          });
        } catch (error) {
          console.error('Erro ao buscar categoria:', error);
          toast.error('Erro ao carregar dados da categoria');
          navigate('/admin/categorias');
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchAvailableCategories = async () => {
      try {
        const response = await api.get('/api/categorias');
        // Filtrar a categoria atual para não permitir auto-referência
        const categories = response.data.data.categorias.filter(cat => cat._id !== id);
        setAvailableCategories(categories);
      } catch (error) {
        console.error('Erro ao buscar categorias disponíveis:', error);
      }
    };

    fetchData();
    fetchAvailableCategories();
  }, [id, isEditMode, navigate]);

  // Manipular mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (isEditMode) {
        await api.patch(`/api/categorias/${id}`, formData);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await api.post('/api/categorias', formData);
        toast.success('Categoria criada com sucesso!');
      }
      
      navigate('/admin/categorias');
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar categoria');
    } finally {
      setSubmitting(false);
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
        <h1 className="text-2xl font-bold text-white">
          {isEditMode ? 'Editar Categoria' : 'Nova Categoria'}
        </h1>
        <Link
          to="/admin/categorias"
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
        >
          Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-1">
              Nome *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Cor */}
          <div>
            <label htmlFor="cor" className="block text-sm font-medium text-gray-300 mb-1">
              Cor
            </label>
            <div className="flex">
              <input
                type="color"
                id="cor"
                name="cor"
                value={formData.cor}
                onChange={handleChange}
                className="h-10 w-10 rounded-md border border-gray-600 bg-gray-700 cursor-pointer"
              />
              <input
                type="text"
                value={formData.cor}
                onChange={handleChange}
                name="cor"
                className="flex-1 ml-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Ícone */}
          <div>
            <label htmlFor="icone" className="block text-sm font-medium text-gray-300 mb-1">
              Ícone (nome ou classe)
            </label>
            <input
              type="text"
              id="icone"
              name="icone"
              value={formData.icone}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: fa-rocket, icon-code, etc."
            />
          </div>

          {/* Ordem */}
          <div>
            <label htmlFor="ordem" className="block text-sm font-medium text-gray-300 mb-1">
              Ordem
            </label>
            <input
              type="number"
              id="ordem"
              name="ordem"
              value={formData.ordem}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Descrição */}
          <div className="md:col-span-2">
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-300 mb-1">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Ativa */}
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="ativa"
              name="ativa"
              checked={formData.ativa}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor="ativa" className="ml-2 block text-sm text-gray-300">
              Ativa
            </label>
          </div>
        </div>

        {/* Botões */}
        <div className="px-8 py-6 bg-gray-900/50 border-t border-white/10">
          <div className="flex justify-end space-x-4">
            <Link
              to="/admin/categorias"
              className="flex items-center gap-2 px-6 py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {submitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditMode ? 'Atualizar Categoria' : 'Criar Categoria'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoriasForm;
