import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const PreviewComponent = ({ content, tipo = 'html', className = '' }) => {
  const [previewContent, setPreviewContent] = useState('');
  
  useEffect(() => {
    if (!content) {
      setPreviewContent('<div class="text-gray-400 text-center p-4">Sem conteúdo para visualizar</div>');
      return;
    }
    
    try {
      switch (tipo) {
        case 'html':
          setPreviewContent(content);
          break;
        case 'markdown':
          // Simulação simples de renderização markdown
          // Em produção, usar uma biblioteca como marked.js
          let htmlContent = content
            .replace(/# (.*?)$/gm, '<h1 class="text-2xl font-bold mb-2">$1</h1>')
            .replace(/## (.*?)$/gm, '<h2 class="text-xl font-bold mb-2">$1</h2>')
            .replace(/### (.*?)$/gm, '<h3 class="text-lg font-bold mb-2">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-indigo-400 hover:underline">$1</a>')
            .replace(/^- (.*?)$/gm, '<li class="ml-4">$1</li>')
            .replace(/\n\n/g, '<br><br>');
          setPreviewContent(htmlContent);
          break;
        case 'json':
          try {
            const jsonObj = JSON.parse(content);
            setPreviewContent(`<pre class="bg-gray-700 p-4 rounded overflow-auto">${JSON.stringify(jsonObj, null, 2)}</pre>`);
          } catch (e) {
            setPreviewContent(`<div class="text-red-400 p-4">JSON inválido: ${e.message}</div>`);
          }
          break;
        default:
          setPreviewContent(`<div class="p-4">${content}</div>`);
      }
    } catch (error) {
      console.error('Erro ao renderizar preview:', error);
      setPreviewContent('<div class="text-red-400 text-center p-4">Erro ao renderizar conteúdo</div>');
    }
  }, [content, tipo]);

  return (
    <div className={`preview-container bg-gray-800 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      <div className="bg-gray-700 px-4 py-2 border-b border-gray-600">
        <div className="flex items-center">
          <span className="text-sm font-medium text-white">Visualização</span>
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
            {tipo.toUpperCase()}
          </span>
        </div>
      </div>
      <div 
        className="p-4 prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: previewContent }}
      />
    </div>
  );
};

export default PreviewComponent;
