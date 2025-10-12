import React from 'react';
import { motion } from 'framer-motion';
import { 
  LightBulbIcon, 
  CodeBracketIcon, 
  CubeIcon,
  ArrowRightIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  BookOpenIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

// Componentes
import Header from './components/Header';
import Hero from './components/Hero';
import Objetivo from './components/Objetivo';
import Categorias from './components/Categorias';
import Visao from './components/Visao';
import Principios from './components/Principios';
import Unindo from './components/Unindo';
import ProjetosAtuais from './components/ProjetosAtuais';
import ProjectLogs from './components/ProjectLogs';
import PastProjects from './components/PastProjects';
import IdeasLogs from './components/IdeasLogs';
import OpenStartupLog from './components/OpenStartupLog';
import PlaybooksAbertos from './components/PlaybooksAbertos';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [scrollY, setScrollY] = React.useState(0);

  // Efeito para scroll
  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Error boundary e logging melhorados
  const [hasError, setHasError] = React.useState(false);
  const [errorDetails, setErrorDetails] = React.useState('');

  React.useEffect(() => {
    const handleError = (event) => {
      console.error('App Error:', event.error);
      console.error('Error details:', {
        message: event.error?.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
      setErrorDetails(event.error?.message || 'Erro desconhecido');
      setHasError(true);
    };

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      setErrorDetails(event.reason?.message || 'Erro de Promise');
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Logging para debug
  React.useEffect(() => {
    console.log('App component mounted');
    return () => console.log('App component unmounted');
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-dark text-light-text flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">⚠️ Ops! Algo deu errado</h1>
          <p className="text-gray-400 mb-4 max-w-md">
            {errorDetails}
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary text-dark px-6 py-3 rounded font-semibold hover:bg-opacity-90 transition-colors"
            >
              🔄 Recarregar Página
            </button>
            <br />
            <button 
              onClick={() => {setHasError(false); setErrorDetails('');}} 
              className="bg-gray-600 text-light-text px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-light-text overflow-x-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-dark via-dark-card to-dark opacity-70"></div>
      
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Objetivo Section */}
      <Objetivo />
      
      {/* Categorias Section */}
      <Categorias />
      
      {/* Visão e Princípios */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Visao />
          <Principios />
        </div>
      </div>
      
      {/* Unindo Section */}
      <Unindo />
      
      {/* Projetos Atuais */}
      <ErrorBoundary componentName="ProjetosAtuais">
        <ProjetosAtuais />
      </ErrorBoundary>
      
      {/* Project Logs */}
      <ErrorBoundary componentName="ProjectLogs">
        <ProjectLogs />
      </ErrorBoundary>
      
      {/* Past Projects */}
      <ErrorBoundary componentName="PastProjects">
        <PastProjects />
      </ErrorBoundary>
      
      {/* Ideas Logs */}
      <ErrorBoundary componentName="IdeasLogs">
        <IdeasLogs />
      </ErrorBoundary>
      
      {/* Open Startup Log */}
      <OpenStartupLog />
      
      {/* Playbooks Abertos */}
      <PlaybooksAbertos />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
