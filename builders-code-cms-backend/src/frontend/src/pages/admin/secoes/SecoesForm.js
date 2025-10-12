import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const SecoesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    conteudo: '',
    tipo: 'texto',
    ordem: 0,
    visivel: true,
    componente: '',
    config: {}
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Buscar dados da seção se estiver em modo de edição
  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await api.get(`/api/secoes/${id}`);
          setFormData(response.data.data.secao);
        } catch (error) {
          console.error('Erro ao buscar seção:', error);
          toast.error('Erro ao carregar dados da seção');
          navigate('/admin/secoes');
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

  // Manipular mudanças no objeto de configuração
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      config: {
        ...formData.config,
        [name]: value
      }
    });
  };

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (isEditMode) {
        await api.patch(`/api/secoes/${id}`, formData);
        toast.success('Seção atualizada com sucesso!');
      } else {
        await api.post('/api/secoes', formData);
        toast.success('Seção criada com sucesso!');
      }
      
      navigate('/admin/secoes');
    } catch (error) {
      console.error('Erro ao salvar seção:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar seção');
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
          {isEditMode ? 'Editar Seção' : 'Nova Seção'}
        </h1>
        <Link
          to="/admin/secoes"
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
        >
          Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-300 mb-1">
              Título *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tipo */}
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-300 mb-1">
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="texto">Texto</option>
              <option value="html">HTML</option>
              <option value="markdown">Markdown</option>
              <option value="componente">Componente React</option>
            </select>
          </div>

          {/* Componente (se tipo for componente) */}
          {formData.tipo === 'componente' && (
            <div>
              <label htmlFor="componente" className="block text-sm font-medium text-gray-300 mb-1">
                Nome do Componente *
              </label>
              <input
                type="text"
                id="componente"
                name="componente"
                value={formData.componente}
                onChange={handleChange}
                required={formData.tipo === 'componente'}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Header, Footer, Hero"
              />
            </div>
          )}

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
              rows={2}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Conteúdo */}
          <div className="md:col-span-2">
            <label htmlFor="conteudo" className="block text-sm font-medium text-gray-300 mb-1">
              Conteúdo
            </label>
            <textarea
              id="conteudo"
              name="conteudo"
              value={formData.conteudo}
              onChange={handleChange}
              rows={8}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={formData.tipo === 'html' ? '<div>Seu conteúdo HTML aqui</div>' : 
                formData.tipo === 'markdown' ? '# Título\n\nSeu conteúdo Markdown aqui' : 
                formData.tipo === 'componente' ? 'Configuração em JSON ou deixe em branco' : 
                'Seu conteúdo aqui'}
            ></textarea>
          </div>

          {/* Configurações adicionais para componentes */}
          {formData.tipo === 'componente' && (
            <div className="md:col-span-2">
              <h3 className="text-md font-medium text-white mb-2">Configurações do Componente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-700 rounded-md">
                <div>
                  <label htmlFor="config-titulo" className="block text-sm font-medium text-gray-300 mb-1">
                    Título Personalizado
                  </label>
                  <input
                    type="text"
                    id="config-titulo"
                    name="titulo"
                    value={formData.config.titulo || ''}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="config-classe" className="block text-sm font-medium text-gray-300 mb-1">
                    Classes CSS
                  </label>
                  <input
                    type="text"
                    id="config-classe"
                    name="classe"
                    value={formData.config.classe || ''}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="config-animacao" className="block text-sm font-medium text-gray-300 mb-1">
                    Animação
                  </label>
                  <select
                    id="config-animacao"
                    name="animacao"
                    value={formData.config.animacao || ''}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Nenhuma</option>
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="zoom">Zoom</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="config-variante" className="block text-sm font-medium text-gray-300 mb-1">
                    Variante
                  </label>
                  <select
                    id="config-variante"
                    name="variante"
                    value={formData.config.variante || ''}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Padrão</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="transparent">Transparente</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Visível */}
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="visivel"
              name="visivel"
              checked={formData.visivel}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor="visivel" className="ml-2 block text-sm text-gray-300">
              Visível no site
            </label>
          </div>
        </div>

        {/* Botões */}
        <div className="mt-6 flex justify-end space-x-3">
          <Link
            to="/admin/secoes"
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

export default SecoesForm;
