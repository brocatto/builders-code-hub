import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { currentUser, updatePassword } = useAuth();
  const [formData, setFormData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.novaSenha !== formData.confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(formData.senhaAtual, formData.novaSenha, formData.confirmarSenha);
      setFormData({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-white">
            Informações do Perfil
          </h3>
          <div className="mt-5">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-400">Nome</dt>
                <dd className="mt-1 text-sm text-white">{currentUser?.nome}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Email</dt>
                <dd className="mt-1 text-sm text-white">{currentUser?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Função</dt>
                <dd className="mt-1 text-sm text-white">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {currentUser?.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-white">
            Alterar Senha
          </h3>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-400">
                Senha Atual
              </label>
              <input
                type="password"
                name="senhaAtual"
                id="senhaAtual"
                required
                value={formData.senhaAtual}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-400">
                Nova Senha
              </label>
              <input
                type="password"
                name="novaSenha"
                id="novaSenha"
                required
                value={formData.novaSenha}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-400">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                name="confirmarSenha"
                id="confirmarSenha"
                required
                value={formData.confirmarSenha}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="pt-5">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Atualizando...' : 'Alterar Senha'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;