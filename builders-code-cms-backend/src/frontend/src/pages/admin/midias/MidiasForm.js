import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const MidiasForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: 'imagem',
    url: '',
    arquivo: null,
    alt: '',
    tags: [],
    ativa: true
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [newTag, setNewTag] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Buscar dados da mídia se estiver em modo de edição
  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await api.get(`/api/midias/${id}`);
          setFormData(response.data.data.midia);
          if (response.data.data.midia.url) {
            setPreviewUrl(response.data.data.midia.url);
          }
        } catch (error) {
          console.error('Erro ao buscar mídia:', error);
          toast.error('Erro ao carregar dados da mídia');
          navigate('/admin/midias');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id, isEditMode, navigate]);

  // Manipular mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && files.length > 0) {
      const file = files[0];
      setFormData({
        ...formData,
        arquivo: file
      });
      
      // Criar URL de preview para o arquivo
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
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
      
      // Se tiver arquivo, fazer upload primeiro
      if (formData.arquivo) {
        const formDataUpload = new FormData();
        formDataUpload.append('arquivo', formData.arquivo);
        
        const uploadResponse = await api.post('/api/midias/upload', formDataUpload, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
        
        // Atualizar URL com o caminho do arquivo enviado
        formData.url = uploadResponse.data.url;
      }
      
      // Remover o arquivo do objeto antes de enviar para a API
      const dataToSend = { ...formData };
      delete dataToSend.arquivo;
      
      if (isEditMode) {
        await api.patch(`/api/midias/${id}`, dataToSend);
        toast.success('Mídia atualizada com sucesso!');
      } else {
        await api.post('/api/midias', dataToSend);
        toast.success('Mídia criada com sucesso!');
      }
      
      navigate('/admin/midias');
    } catch (error) {
      console.error('Erro ao salvar mídia:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar mídia');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
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
          {isEditMode ? 'Editar Mídia' : 'Nova Mídia'}
        </h1>
        <Link
          to="/admin/midias"
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
              <option value="imagem">Imagem</option>
              <option value="video">Vídeo</option>
              <option value="documento">Documento</option>
              <option value="audio">Áudio</option>
            </select>
          </div>

          {/* URL (se já existir ou for externa) */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
              URL (opcional para upload)
            </label>
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          {/* Texto alternativo */}
          <div>
            <label htmlFor="alt" className="block text-sm font-medium text-gray-300 mb-1">
              Texto Alternativo
            </label>
            <input
              type="text"
              id="alt"
              name="alt"
              value={formData.alt}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Descrição da imagem para acessibilidade"
            />
          </div>

          {/* Upload de arquivo */}
          <div className="md:col-span-2">
            <label htmlFor="arquivo" className="block text-sm font-medium text-gray-300 mb-1">
              Upload de Arquivo
            </label>
            <input
              type="file"
              id="arquivo"
              name="arquivo"
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              accept={formData.tipo === 'imagem' ? 'image/*' : 
                     formData.tipo === 'video' ? 'video/*' : 
                     formData.tipo === 'audio' ? 'audio/*' : 
                     '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'}
            />
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Preview
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                {formData.tipo === 'imagem' ? (
                  <img src={previewUrl} alt={formData.alt || 'Preview'} className="max-h-64 max-w-full" />
                ) : formData.tipo === 'video' ? (
                  <video src={previewUrl} controls className="max-h-64 max-w-full">
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                ) : formData.tipo === 'audio' ? (
                  <audio src={previewUrl} controls className="w-full">
                    Seu navegador não suporta o elemento de áudio.
                  </audio>
                ) : (
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-400">
                      {formData.titulo || 'Documento'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

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

        {/* Barra de progresso de upload */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <p className="text-sm text-gray-400 mt-1">Enviando: {uploadProgress}%</p>
          </div>
        )}

        {/* Botões */}
        <div className="mt-6 flex justify-end space-x-3">
          <Link
            to="/admin/midias"
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

export default MidiasForm;
