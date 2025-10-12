import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const ConfiguracoesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    chave: '',
    valor: '',
    descricao: '',
    tipo: 'texto',
    grupo: 'geral',
    publico: false
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Buscar dados da configuração se estiver em modo de edição
  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await api.get(`/api/configuracoes/${id}`);
          setFormData(response.data.data.configuracao);
        } catch (error) {
          console.error('Erro ao buscar configuração:', error);
          toast.error('Erro ao carregar dados da configuração');
          navigate('/admin/configuracoes');
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
        await api.patch(`/api/configuracoes/${id}`, formData);
        toast.success('Configuração atualizada com sucesso!');
      } else {
        await api.post('/api/configuracoes', formData);
        toast.success('Configuração criada com sucesso!');
      }
      
      navigate('/admin/configuracoes');
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar configuração');
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
          {isEditMode ? 'Editar Configuração' : 'Nova Configuração'}
        </h1>
        <Link
          to="/admin/configuracoes"
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
        >
          Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chave */}
          <div>
            <label htmlFor="chave" className="block text-sm font-medium text-gray-300 mb-1">
              Chave *
            </label>
            <input
              type="text"
              id="chave"
              name="chave"
              value={formData.chave}
              onChange={handleChange}
              required
              disabled={isEditMode}
              className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isEditMode ? 'opacity-70 cursor-not-allowed' : ''}`}
              placeholder="Ex: site_titulo, contato_email"
            />
            {isEditMode && (
              <p className="text-xs text-gray-400 mt-1">A chave não pode ser alterada após a criação.</p>
            )}
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
              <option value="numero">Número</option>
              <option value="booleano">Booleano</option>
              <option value="json">JSON</option>
              <option value="html">HTML</option>
              <option value="cor">Cor</option>
              <option value="data">Data</option>
            </select>
          </div>

          {/* Grupo */}
          <div>
            <label htmlFor="grupo" className="block text-sm font-medium text-gray-300 mb-1">
              Grupo
            </label>
            <select
              id="grupo"
              name="grupo"
              value={formData.grupo}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="geral">Geral</option>
              <option value="contato">Contato</option>
              <option value="aparencia">Aparência</option>
              <option value="social">Redes Sociais</option>
              <option value="seo">SEO</option>
              <option value="sistema">Sistema</option>
            </select>
          </div>

          {/* Valor */}
          <div className="md:col-span-2">
            <label htmlFor="valor" className="block text-sm font-medium text-gray-300 mb-1">
              Valor *
            </label>
            {formData.tipo === 'booleano' ? (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="valor"
                  name="valor"
                  checked={formData.valor === 'true' || formData.valor === true}
                  onChange={(e) => setFormData({
                    ...formData,
                    valor: e.target.checked
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="valor" className="ml-2 block text-sm text-gray-300">
                  {formData.valor === 'true' || formData.valor === true ? 'Ativado' : 'Desativado'}
                </label>
              </div>
            ) : formData.tipo === 'cor' ? (
              <div className="flex">
                <input
                  type="color"
                  id="valor-color"
                  value={formData.valor || '#000000'}
                  onChange={(e) => setFormData({
                    ...formData,
                    valor: e.target.value
                  })}
                  className="h-10 w-10 rounded-md border border-gray-600 bg-gray-700 cursor-pointer"
                />
                <input
                  type="text"
                  id="valor"
                  name="valor"
                  value={formData.valor}
                  onChange={handleChange}
                  required
                  className="flex-1 ml-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ) : formData.tipo === 'data' ? (
              <input
                type="date"
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : formData.tipo === 'json' || formData.tipo === 'html' ? (
              <textarea
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={formData.tipo === 'json' ? '{"chave": "valor"}' : '<div>Conteúdo HTML</div>'}
              ></textarea>
            ) : (
              <input
                type={formData.tipo === 'numero' ? 'number' : 'text'}
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
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
              placeholder="Descreva o propósito desta configuração"
            ></textarea>
          </div>

          {/* Público */}
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="publico"
              name="publico"
              checked={formData.publico}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor="publico" className="ml-2 block text-sm text-gray-300">
              Público (disponível para visualização no frontend)
            </label>
          </div>
        </div>

        {/* Botões */}
        <div className="mt-6 flex justify-end space-x-3">
          <Link
            to="/admin/configuracoes"
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

export default ConfiguracoesForm;
