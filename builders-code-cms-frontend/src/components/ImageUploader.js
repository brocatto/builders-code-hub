import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const ImageUploader = ({ onImageUpload, maxSize = 5, acceptedTypes = 'image/*', className = '' }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    if (files.length === 0) return;

    const file = files[0];
    
    // Verificar tamanho do arquivo (em MB)
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      toast.error(`Arquivo muito grande. O tamanho máximo é ${maxSize}MB.`);
      return;
    }

    // Verificar tipo do arquivo
    if (!file.type.match(acceptedTypes.replace('*', '.*'))) {
      toast.error('Tipo de arquivo não suportado.');
      return;
    }

    uploadImage(file);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('arquivo', file);
    
    try {
      setUploading(true);
      setProgress(0);
      
      const response = await api.post('/api/midias/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      
      if (onImageUpload) {
        onImageUpload(response.data.url, file.name);
      }
      
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      toast.error('Erro ao enviar imagem. Tente novamente.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className={`${className}`}>
      <div 
        className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          dragActive ? 'border-indigo-500 bg-indigo-50 bg-opacity-10' : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept={acceptedTypes}
          disabled={uploading}
        />
        
        <svg 
          className="w-12 h-12 text-gray-400 mb-3" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        
        <p className="text-sm text-gray-400 text-center">
          {uploading 
            ? `Enviando... ${progress}%` 
            : `Arraste e solte uma imagem aqui, ou clique para selecionar`}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Tamanho máximo: {maxSize}MB
        </p>
        
        {uploading && (
          <div className="w-full mt-3">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
