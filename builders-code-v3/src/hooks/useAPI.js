// Custom hooks for API data fetching
import { useState, useEffect } from 'react';
import { projectsAPI, logsAPI, ideasAPI, categoriesAPI } from '../services/api';

// Hook for fetching projects
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        console.log('Fetching projects from API...');
        const data = await projectsAPI.getAll();
        console.log('Projects data received:', data);
        
        // Verificar se data existe e extrair projetos corretamente
        if (data && data.data && Array.isArray(data.data.projetos)) {
          setProjects(data.data.projetos);
        } else if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.warn('Projects data structure unexpected:', data);
          setProjects([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Erro ao carregar projetos');
        // Fallback to empty array if API fails
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    // Timeout de segurança
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Projects fetch timeout');
        setError('Timeout ao carregar projetos');
        setLoading(false);
        setProjects([]);
      }
    }, 10000);

    fetchProjects().finally(() => clearTimeout(timeoutId));

    return () => clearTimeout(timeoutId);
  }, []);

  return { projects, loading, error };
};

// Hook for fetching project logs
export const useLogs = (limit = 10) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        console.log('Fetching logs from API...');
        const data = await logsAPI.getRecent(limit);
        console.log('Logs data received:', data);
        
        // Verificar se data existe e extrair logs corretamente
        if (data && data.data && Array.isArray(data.data.logs)) {
          setLogs(data.data.logs);
        } else if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.warn('Logs data structure unexpected:', data);
          setLogs([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching logs:', err);
        setError(err.message || 'Erro ao carregar logs');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Logs fetch timeout');
        setError('Timeout ao carregar logs');
        setLoading(false);
        setLogs([]);
      }
    }, 10000);

    fetchLogs().finally(() => clearTimeout(timeoutId));
    return () => clearTimeout(timeoutId);
  }, [limit]);

  return { logs, loading, error };
};

// Hook for fetching ideas
export const useIdeas = (limit = 5) => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        console.log('Fetching ideas from API...');
        const data = await ideasAPI.getRecent(limit);
        console.log('Ideas data received:', data);
        
        // Verificar se data existe e extrair ideias corretamente
        if (data && data.data && Array.isArray(data.data.ideias)) {
          setIdeas(data.data.ideias);
        } else if (Array.isArray(data)) {
          setIdeas(data);
        } else {
          console.warn('Ideas data structure unexpected:', data);
          setIdeas([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching ideas:', err);
        setError(err.message || 'Erro ao carregar ideias');
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Ideas fetch timeout');
        setError('Timeout ao carregar ideias');
        setLoading(false);
        setIdeas([]);
      }
    }, 10000);

    fetchIdeas().finally(() => clearTimeout(timeoutId));
    return () => clearTimeout(timeoutId);
  }, [limit]);

  return { ideas, loading, error };
};

// Hook for fetching logs by project (lazy — only fetches when projetoId is truthy)
// Tries projetoId first; if no results, falls back to projeto name (for older logs)
export const useProjectLogs = (projetoId, projetoNome) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projetoId) {
      setLogs([]);
      setLoading(false);
      return;
    }

    const extractLogs = (data) => {
      if (data && data.data && Array.isArray(data.data.logs)) return data.data.logs;
      if (Array.isArray(data)) return data;
      return [];
    };

    const fetchLogs = async () => {
      try {
        setLoading(true);

        // Try by ObjectId first
        let result = extractLogs(await logsAPI.getByProjectId(projetoId));

        // Fallback: older logs may only have the projeto name string
        if (result.length === 0 && projetoNome) {
          result = extractLogs(await logsAPI.getByProject(projetoNome));
        }

        setLogs(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching project logs:', err);
        setError(err.message || 'Erro ao carregar logs do projeto');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      setError('Timeout ao carregar logs do projeto');
      setLoading(false);
      setLogs([]);
    }, 10000);

    fetchLogs().finally(() => clearTimeout(timeoutId));
    return () => clearTimeout(timeoutId);
  }, [projetoId, projetoNome]);

  return { logs, loading, error };
};

// Hook for fetching categories
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoriesAPI.getAll();
        setCategories(data.data || data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
        // Fallback to empty array if API fails
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};