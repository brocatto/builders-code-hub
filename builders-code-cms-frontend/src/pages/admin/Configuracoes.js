import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

const Configuracoes = () => {
  const [activeSection, setActiveSection] = useState('geral');
  const [configuracoes, setConfiguracoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);

  // Fetch configurations
  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  const fetchConfiguracoes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/configuracoes');
      const configs = response.data.data.configuracoes;
      setConfiguracoes(configs);
      
      // Transform to form data
      const formObj = {};
      configs.forEach(config => {
        formObj[config.chave] = config.valor;
      });
      setFormData(formObj);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  // Handle form change with auto-save
  const handleChange = (chave, valor) => {
    setFormData(prev => ({
      ...prev,
      [chave]: valor
    }));
    setHasChanges(true);

    // Clear existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // Set new auto-save timeout
    const timeout = setTimeout(() => {
      saveConfiguration(chave, valor);
    }, 2000);
    setAutoSaveTimeout(timeout);
  };

  // Save individual configuration
  const saveConfiguration = async (chave, valor) => {
    try {
      const config = configuracoes.find(c => c.chave === chave);
      if (config) {
        await api.patch(`/api/configuracoes/${config._id}`, { valor });
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  };

  // Save all changes
  const saveAllChanges = async () => {
    setSaving(true);
    try {
      const promises = configuracoes.map(config => {
        if (formData[config.chave] !== config.valor) {
          return api.patch(`/api/configuracoes/${config._id}`, { 
            valor: formData[config.chave] 
          });
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      toast.success('Configurações salvas com sucesso!');
      setHasChanges(false);
      fetchConfiguracoes();
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  // Reset changes
  const resetChanges = () => {
    const formObj = {};
    configuracoes.forEach(config => {
      formObj[config.chave] = config.valor;
    });
    setFormData(formObj);
    setHasChanges(false);
  };

  // Group configurations by section
  const groupedConfigs = configuracoes.reduce((acc, config) => {
    const group = config.grupo || 'geral';
    if (!acc[group]) acc[group] = [];
    acc[group].push(config);
    return acc;
  }, {});

  // Navigation sections
  const sections = [
    { id: 'geral', label: 'Geral', icon: '⚙️' },
    { id: 'seguranca', label: 'Segurança', icon: '🔒' },
    { id: 'aparencia', label: 'Aparência', icon: '🎨' },
    { id: 'contato', label: 'Contato', icon: '📧' },
    { id: 'social', label: 'Redes Sociais', icon: '📱' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'sistema', label: 'Sistema', icon: '⚡' }
  ];

  // Render input based on type
  const renderInput = (config) => {
    const value = formData[config.chave] || '';

    const inputClasses = `
      w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white 
      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
      focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm
    `;

    switch (config.tipo) {
      case 'booleano':
        return (
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => handleChange(config.chave, !value)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${value ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-600'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${value ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
            <span className="text-gray-300">
              {value ? 'Ativado' : 'Desativado'}
            </span>
          </div>
        );

      case 'cor':
        return (
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-xl border-2 border-white/20 cursor-pointer"
              style={{ backgroundColor: value || '#000000' }}
              onClick={() => document.getElementById(`color-${config.chave}`).click()}
            />
            <input
              type="color"
              id={`color-${config.chave}`}
              value={value || '#000000'}
              onChange={(e) => handleChange(config.chave, e.target.value)}
              className="sr-only"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(config.chave, e.target.value)}
              className={inputClasses}
              placeholder="#000000"
            />
          </div>
        );

      case 'textarea':
      case 'html':
      case 'json':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(config.chave, e.target.value)}
            rows={4}
            className={`${inputClasses} resize-none`}
            placeholder={config.descricao}
          />
        );

      case 'numero':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(config.chave, e.target.value)}
            className={inputClasses}
            placeholder={config.descricao}
          />
        );

      case 'data':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleChange(config.chave, e.target.value)}
            className={inputClasses}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(config.chave, e.target.value)}
            className={inputClasses}
            placeholder={config.descricao}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
              <p className="text-gray-400">Gerencie as configurações do sistema</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <div className="flex items-center space-x-2 text-sm text-orange-400">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span>Alterações não salvas</span>
                </div>
              )}
              
              <Link
                to="/admin/configuracoes/gerenciar"
                className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all duration-300 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Gerenciar</span>
              </Link>
              
              <button
                onClick={resetChanges}
                disabled={!hasChanges}
                className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all duration-300 disabled:opacity-50"
              >
                Resetar
              </button>
              
              <button
                onClick={saveAllChanges}
                disabled={saving || !hasChanges}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar Tudo'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <span className="text-xl">{section.icon}</span>
                  <span className="font-medium">{section.label}</span>
                  {groupedConfigs[section.id] && (
                    <span className="ml-auto bg-gray-600 text-xs px-2 py-1 rounded-full">
                      {groupedConfigs[section.id].length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {groupedConfigs[activeSection] ? (
            <div className="max-w-4xl">
              <div className="grid gap-6">
                {groupedConfigs[activeSection].map((config) => (
                  <div
                    key={config._id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {config.chave.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </h3>
                        {config.descricao && (
                          <p className="text-gray-400 text-sm">{config.descricao}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {config.publico && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            Público
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          config.tipo === 'texto' ? 'bg-blue-500/20 text-blue-400' :
                          config.tipo === 'numero' ? 'bg-purple-500/20 text-purple-400' :
                          config.tipo === 'booleano' ? 'bg-green-500/20 text-green-400' :
                          config.tipo === 'cor' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {config.tipo}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {renderInput(config)}
                    </div>

                    {/* Live Preview for colors and certain types */}
                    {config.tipo === 'cor' && formData[config.chave] && (
                      <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: formData[config.chave] }}>
                        <p className="text-white text-sm font-medium">Preview da Cor</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 text-6xl opacity-50">
                {sections.find(s => s.id === activeSection)?.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhuma configuração encontrada
              </h3>
              <p className="text-gray-400">
                Não há configurações para a seção "{sections.find(s => s.id === activeSection)?.label}".
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Export/Import Section */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm p-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Zona de Perigo</h3>
          <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div>
              <h4 className="text-red-400 font-medium">Exportar/Importar Configurações</h4>
              <p className="text-red-300/70 text-sm">Faça backup ou restaure todas as configurações</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(configuracoes, null, 2);
                  const dataBlob = new Blob([dataStr], {type: 'application/json'});
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'configuracoes-backup.json';
                  link.click();
                }}
                className="px-4 py-2 bg-blue-600/80 text-white rounded-lg hover:bg-blue-700/80 transition-colors"
              >
                Exportar
              </button>
              <button
                onClick={() => document.getElementById('import-input').click()}
                className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 transition-colors"
              >
                Importar
              </button>
              <input
                id="import-input"
                type="file"
                accept=".json"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const importedConfigs = JSON.parse(event.target.result);
                        console.log('Importing configurations:', importedConfigs);
                        toast.success('Configurações importadas! (Funcionalidade em desenvolvimento)');
                      } catch (error) {
                        toast.error('Erro ao importar configurações: arquivo inválido');
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;