import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Mapeamento de rotas para títulos mais amigáveis
  const routeTitles = {
    'admin': 'Dashboard',
    'projetos': 'Projetos',
    'logs': 'Logs',
    'ideias': 'Ideias',
    'secoes': 'Seções',
    'categorias': 'Categorias',
    'midias': 'Mídias',
    'configuracoes': 'Configurações',
    'profile': 'Meu Perfil',
    'gerenciar': 'Gerenciar',
    'novo': 'Novo',
    'editar': 'Editar'
  };

  const getTitle = (path) => {
    return routeTitles[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  // Se estivermos apenas no admin, não mostrar breadcrumbs
  if (pathnames.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      {/* Home/Dashboard */}
      <Link
        to="/admin"
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        // Pular o 'admin' inicial pois já temos o ícone home
        if (name === 'admin') {
          return null;
        }

        return (
          <React.Fragment key={name}>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            
            {isLast ? (
              <span className="text-white font-medium">
                {getTitle(name)}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-primary transition-colors"
              >
                {getTitle(name)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;