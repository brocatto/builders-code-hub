import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import FaseConclusaoModal from '../../../components/FaseConclusaoModal';

const ProjetosForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    link: '',
    fase: [],
    detalhes: '',
    links: [],
    categoria: '',
    ordem: 0,
    ativo: true,
    destaque: false
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [newFaseItem, setNewFaseItem] = useState('');
  const [newLink, setNewLink] = useState({ url: '', texto: '' });
  const [faseModal, setFaseModal] = useState({ open: false, faseIndex: null, faseName: '' });

  // Buscar dados do projeto se estiver em modo de edição
  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await api.get(`/api/projetos/${id}`);
          setFormData(response.data.data.projeto);
        } catch (error) {
          console.error('Erro ao buscar projeto:', error);
          toast.error('Erro ao carregar dados do projeto');
          navigate('/admin/projetos');
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

  // Adicionar item à fase
  const handleAddFaseItem = () => {
    if (newFaseItem.trim()) {
      setFormData({
        ...formData,
        fase: [...formData.fase, { nome: newFaseItem.trim(), concluida: false, dataConclusao: null }]
      });
      setNewFaseItem('');
    }
  };

  // Remover item da fase
  const handleRemoveFaseItem = (index) => {
    const updatedFase = [...formData.fase];
    updatedFase.splice(index, 1);
    setFormData({
      ...formData,
      fase: updatedFase
    });
  };

  // Manipular mudanças nos campos do novo link
  const handleNewLinkChange = (e) => {
    const { name, value } = e.target;
    setNewLink({
      ...newLink,
      [name]: value
    });
  };

  // Adicionar novo link
  const handleAddLink = () => {
    if (newLink.url.trim() && newLink.texto.trim()) {
      setFormData({
        ...formData,
        links: [...formData.links, { ...newLink }]
      });
      setNewLink({ url: '', texto: '' });
    }
  };

  // Remover link
  const handleRemoveLink = (index) => {
    const updatedLinks = [...formData.links];
    updatedLinks.splice(index, 1);
    setFormData({
      ...formData,
      links: updatedLinks
    });
  };

  // Toggle fase no form
  const handleFaseCheckbox = (index) => {
    const fase = formData.fase[index];
    const nome = typeof fase === 'object' ? fase.nome : fase;
    const concluida = typeof fase === 'object' ? fase.concluida : false;

    if (!concluida && isEditMode) {
      // Marking as done in edit mode -> open modal for API call
      setFaseModal({ open: true, faseIndex: index, faseName: nome });
    } else if (concluida && isEditMode) {
      // Unmarking in edit mode -> call API directly
      toggleFaseApi(index, false, '');
    } else {
      // New project (no ID yet) -> toggle locally
      const updatedFase = [...formData.fase];
      updatedFase[index] = { ...updatedFase[index], concluida: !concluida, dataConclusao: !concluida ? new Date().toISOString() : null };
      setFormData({ ...formData, fase: updatedFase });
    }
  };

  const toggleFaseApi = async (faseIndex, concluida, observacoes) => {
    try {
      const response = await api.patch(`/api/projetos/${id}/fase-toggle`, {
        faseIndex,
        concluida,
        observacoes,
      });
      setFormData(response.data.data.projeto);
      toast.success(concluida ? 'Fase concluída! Log criado.' : 'Fase desmarcada.');
    } catch (error) {
      console.error('Erro ao atualizar fase:', error);
      toast.error('Erro ao atualizar fase');
    }
  };

  const handleFaseModalConfirm = (observacoes) => {
    toggleFaseApi(faseModal.faseIndex, true, observacoes);
    setFaseModal({ open: false, faseIndex: null, faseName: '' });
  };

  const handleFaseModalCancel = () => {
    setFaseModal({ open: false, faseIndex: null, faseName: '' });
  };

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (isEditMode) {
        await api.patch(`/api/projetos/${id}`, formData);
        toast.success('Projeto atualizado com sucesso!');
      } else {
        await api.post('/api/projetos', formData);
        toast.success('Projeto criado com sucesso!');
      }
      
      navigate('/admin/projetos');
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar projeto');
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
          {isEditMode ? 'Editar Projeto' : 'Novo Projeto'}
        </h1>
        <Link
          to="/admin/projetos"
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

          {/* Link */}
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-1">
              Link Principal
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://exemplo.com"
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

          {/* Detalhes */}
          <div className="md:col-span-2">
            <label htmlFor="detalhes" className="block text-sm font-medium text-gray-300 mb-1">
              Detalhes
            </label>
            <textarea
              id="detalhes"
              name="detalhes"
              value={formData.detalhes}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Fase */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Fase
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newFaseItem}
                onChange={(e) => setNewFaseItem(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Adicionar item à fase"
              />
              <button
                type="button"
                onClick={handleAddFaseItem}
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Adicionar
              </button>
            </div>
            {formData.fase.length > 0 ? (
              <ul className="space-y-2 mt-2">
                {formData.fase.map((item, index) => {
                  const nome = typeof item === 'object' ? item.nome : item;
                  const concluida = typeof item === 'object' ? item.concluida : false;
                  return (
                    <li key={index} className="flex items-center bg-gray-700 p-2 rounded-md">
                      <input
                        type="checkbox"
                        checked={concluida}
                        onChange={() => handleFaseCheckbox(index)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700 mr-2 cursor-pointer flex-shrink-0"
                      />
                      <span className={`flex-1 text-white ${concluida ? 'line-through text-gray-500' : ''}`}>{nome}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaseItem(index)}
                        className="ml-2 text-red-400 hover:text-red-300 focus:outline-none"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm mt-2">Nenhum item adicionado à fase.</p>
            )}
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Links Adicionais
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <input
                type="url"
                name="url"
                value={newLink.url}
                onChange={handleNewLinkChange}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="URL"
              />
              <div className="flex">
                <input
                  type="text"
                  name="texto"
                  value={newLink.texto}
                  onChange={handleNewLinkChange}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Texto do link"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Adicionar
                </button>
              </div>
            </div>
            {formData.links.length > 0 ? (
              <ul className="space-y-2 mt-2">
                {formData.links.map((link, index) => (
                  <li key={index} className="flex items-center bg-gray-700 p-2 rounded-md">
                    <span className="flex-1 text-white">
                      <strong>{link.texto}:</strong> {link.url}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(index)}
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
              <p className="text-gray-400 text-sm mt-2">Nenhum link adicional.</p>
            )}
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-2 flex space-x-6">
            <div className="flex items-center">
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
            <div className="flex items-center">
              <input
                type="checkbox"
                id="destaque"
                name="destaque"
                checked={formData.destaque}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="destaque" className="ml-2 block text-sm text-gray-300">
                Destaque
              </label>
            </div>
          </div>
        </div>

        {/* Modal de conclusão de fase */}
        <FaseConclusaoModal
          isOpen={faseModal.open}
          faseName={faseModal.faseName}
          onConfirm={handleFaseModalConfirm}
          onCancel={handleFaseModalCancel}
        />

        {/* Botões */}
        <div className="mt-6 flex justify-end space-x-3">
          <Link
            to="/admin/projetos"
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

export default ProjetosForm;
