import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white">Builder's Code CMS</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-gray-300 text-sm">
            Olá, {currentUser?.nome || 'Usuário'}
          </div>
          
          <div className="relative group">
            <button className="flex items-center text-gray-300 hover:text-white focus:outline-none">
              <span className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                {currentUser?.nome?.charAt(0) || 'U'}
              </span>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                Meu Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
