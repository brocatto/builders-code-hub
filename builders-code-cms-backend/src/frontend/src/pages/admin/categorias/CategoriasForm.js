import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const CategoriasForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cor: '#6366F1', // Cor padrão (indigo)
    icone: '',
    ordem: 0,
    ativa: true
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Buscar dados da categoria se estiver em modo de edição
  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await api.get(`/api/categorias/${id}`);
          setFormData(response.data.data.categoria);
        } catch (error) {
          console.error('Erro ao buscar categoria:', error);
          toast.error('Erro ao carregar dados da categoria');
          navigate('/admin/categorias');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
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
        <div className="mt-6 flex justify-end space-x-3">
          <Link
            to="/admin/categorias"
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {submitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoriasForm;
