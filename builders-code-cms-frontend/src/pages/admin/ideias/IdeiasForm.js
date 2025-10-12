import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const IdeiasForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    detalhes: [],
    conteudoRich: '',
    status: 'rascunho',
    categoria: '',
    tags: [],
    ordem: 0,
    ativo: true
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [newDetalhe, setNewDetalhe] = useState({ texto: '', nivel: 0, tipo: 'texto' });
  const [newTag, setNewTag] = useState('');

  // Buscar dados da ideia se estiver em modo de edição
  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await api.get(`/api/ideias/${id}`);
          setFormData(response.data.data.ideia);
        } catch (error) {
          console.error('Erro ao buscar ideia:', error);
          toast.error('Erro ao carregar dados da ideia');
          navigate('/admin/ideias');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id, isEditMode, navigate]);

  // Buscar categorias disponíveis
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get('/api/categorias');
        setCategorias(response.data.data.categorias);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategorias();
  }, []);

  // Manipular mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Manipular mudanças nos campos do novo detalhe
  const handleNewDetalheChange = (e) => {
    const { name, value } = e.target;
    setNewDetalhe({
      ...newDetalhe,
      [name]: name === 'nivel' ? parseInt(value, 10) : value
    });
  };

  // Adicionar novo detalhe
  const handleAddDetalhe = () => {
    if (newDetalhe.texto.trim()) {
      setFormData({
        ...formData,
        detalhes: [...formData.detalhes, { ...newDetalhe }]
      });
      setNewDetalhe({ texto: '', nivel: 0, tipo: 'texto' });
    }
  };

  // Remover detalhe
  const handleRemoveDetalhe = (index) => {
    const updatedDetalhes = [...formData.detalhes];
    updatedDetalhes.splice(index, 1);
    setFormData({
      ...formData,
      detalhes: updatedDetalhes
    });
  };

  // Adicionar tag
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  // Remover tag
  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (isEditMode) {
        await api.patch(`/api/ideias/${id}`, formData);
        toast.success('Ideia atualizada com sucesso!');
      } else {
        await api.post('/api/ideias', formData);
        toast.success('Ideia criada com sucesso!');
      }
      
      navigate('/admin/ideias');
    } catch (error) {
      console.error('Erro ao salvar ideia:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar ideia');
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
          {isEditMode ? 'Editar Ideia' : 'Nova Ideia'}
        </h1>
        <Link
          to="/admin/ideias"
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

          {/* Categoria */}
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-300 mb-1">
              Categoria
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria._id} value={categoria.nome}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="rascunho">Rascunho</option>
              <option value="em_analise">Em Análise</option>
              <option value="validada">Validada</option>
            </select>
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
              Descrição *
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Conteúdo Rich */}
          <div className="md:col-span-2">
            <label htmlFor="conteudoRich" className="block text-sm font-medium text-gray-300 mb-1">
              Conteúdo Rich
            </label>
            <textarea
              id="conteudoRich"
              name="conteudoRich"
              value={formData.conteudoRich}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Conteúdo em formato rich text (HTML ou Markdown)"
            ></textarea>
          </div>

          {/* Detalhes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Detalhes
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="texto"
                  value={newDetalhe.texto}
                  onChange={handleNewDetalheChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Texto do detalhe"
                />
              </div>
              <div className="flex">
                <select
                  name="nivel"
                  value={newDetalhe.nivel}
                  onChange={handleNewDetalheChange}
                  className="w-1/3 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="0">Nível 0</option>
                  <option value="1">Nível 1</option>
                  <option value="2">Nível 2</option>
                </select>
                <select
                  name="tipo"
                  value={newDetalhe.tipo}
                  onChange={handleNewDetalheChange}
                  className="w-1/3 px-3 py-2 bg-gray-700 border-l-0 border-r-0 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="texto">Texto</option>
                  <option value="bullet">Bullet</option>
                  <option value="numbered">Numerado</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddDetalhe}
                  className="w-1/3 px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Adicionar
                </button>
              </div>
            </div>
            {formData.detalhes.length > 0 ? (
              <ul className="space-y-2 mt-2">
                {formData.detalhes.map((detalhe, index) => (
                  <li key={index} className="flex items-center bg-gray-700 p-2 rounded-md">
                    <div className="flex-1">
                      <div className="text-white" style={{ marginLeft: `${detalhe.nivel * 20}px` }}>
                        {detalhe.tipo === 'bullet' && '• '}
                        {detalhe.tipo === 'numbered' && `${index + 1}. `}
                        {detalhe.texto}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Nível: {detalhe.nivel}, Tipo: {detalhe.tipo}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDetalhe(index)}
                      className="ml-2 text-red-400 hover:text-red-300 focus:outline-none"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm mt-2">Nenhum detalhe adicionado.</p>
            )}
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Adicionar tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Adicionar
              </button>
            </div>
            {formData.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-indigo-600 hover:text-indigo-500 focus:outline-none"
                    >
                      <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm mt-2">Nenhuma tag adicionada.</p>
            )}
          </div>

          {/* Ativo */}
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="ativo"
              name="ativo"
              checked={formData.ativo}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor="ativo" className="ml-2 block text-sm text-gray-300">
              Ativo
            </label>
          </div>
        </div>

        {/* Botões */}
        <div className="mt-6 flex justify-end space-x-3">
          <Link
            to="/admin/ideias"
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

export default IdeiasForm;
