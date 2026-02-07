const Projeto = require('../models/projetoModel');
const Log = require('../models/logModel');
const LogAtividade = require('../models/logAtividadeModel');

// Registrar atividade do usuário
const registrarAtividade = async (usuarioId, acao, entidade, entidadeId = null, detalhes = {}, req) => {
  try {
    await LogAtividade.create({
      usuarioId,
      acao,
      entidade,
      entidadeId,
      detalhes,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
  }
};

// Obter todos os projetos
exports.getAllProjetos = async (req, res) => {
  try {
    // Filtros básicos
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Filtros avançados
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    // Construir query
    let query = Projeto.find(JSON.parse(queryStr));

    // Ordenação
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-ordem');
    }

    // Seleção de campos
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Paginação
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Executar query
    const projetos = await query;

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'projeto', null, { filtros: req.query }, req);

    // Enviar resposta
    res.status(200).json({
      status: 'success',
      results: projetos.length,
      data: {
        projetos,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar projetos.',
    });
  }
};

// Obter um projeto específico
exports.getProjeto = async (req, res) => {
  try {
    const projeto = await Projeto.findById(req.params.id);

    if (!projeto) {
      return res.status(404).json({
        status: 'error',
        message: 'Projeto não encontrado.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'projeto', projeto._id, {}, req);

    res.status(200).json({
      status: 'success',
      data: {
        projeto,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar projeto.',
    });
  }
};

// Criar novo projeto
exports.createProjeto = async (req, res) => {
  try {
    const novoProjeto = await Projeto.create(req.body);

    // Registrar atividade
    await registrarAtividade(req.user._id, 'create', 'projeto', novoProjeto._id, { dados: req.body }, req);

    res.status(201).json({
      status: 'success',
      data: {
        projeto: novoProjeto,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao criar projeto.',
      errors: error.errors,
    });
  }
};

// Atualizar projeto
exports.updateProjeto = async (req, res) => {
  try {
    const projeto = await Projeto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!projeto) {
      return res.status(404).json({
        status: 'error',
        message: 'Projeto não encontrado.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'update', 'projeto', projeto._id, { dados: req.body }, req);

    res.status(200).json({
      status: 'success',
      data: {
        projeto,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao atualizar projeto.',
      errors: error.errors,
    });
  }
};

// Excluir projeto
exports.deleteProjeto = async (req, res) => {
  try {
    const projeto = await Projeto.findByIdAndDelete(req.params.id);

    if (!projeto) {
      return res.status(404).json({
        status: 'error',
        message: 'Projeto não encontrado.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'delete', 'projeto', req.params.id, {}, req);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao excluir projeto.',
    });
  }
};

// Toggle conclusão de fase + auto-criar log
exports.toggleFaseConclusao = async (req, res) => {
  try {
    const { faseIndex, concluida, observacoes } = req.body;
    const projeto = await Projeto.findById(req.params.id);

    if (!projeto) {
      return res.status(404).json({
        status: 'error',
        message: 'Projeto não encontrado.',
      });
    }

    if (faseIndex < 0 || faseIndex >= projeto.fase.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Índice de fase inválido.',
      });
    }

    projeto.fase[faseIndex].concluida = concluida;
    projeto.fase[faseIndex].dataConclusao = concluida ? new Date() : null;

    await projeto.save();

    // Se marcando como concluída, criar log automaticamente
    if (concluida) {
      const now = new Date();
      const dataFormatada = now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const faseName = projeto.fase[faseIndex].nome;
      const textoLog = observacoes
        ? `Fase "${faseName}" concluída - ${observacoes}`
        : `Fase "${faseName}" concluída`;

      await Log.create({
        data: dataFormatada,
        projeto: projeto.nome,
        projetoId: projeto._id,
        atualizacoes: [{ texto: textoLog, tipo: 'texto' }],
        tags: ['fase-concluida'],
      });
    }

    // Registrar atividade
    await registrarAtividade(
      req.user._id,
      'update',
      'projeto',
      projeto._id,
      { acao: 'toggle-fase', faseIndex, concluida },
      req
    );

    res.status(200).json({
      status: 'success',
      data: { projeto },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao atualizar fase do projeto.',
    });
  }
};

// Versões públicas para o website (sem autenticação)

// Obter todos os projetos públicos (apenas ativos e visíveis)
exports.getAllProjetosPublic = async (req, res) => {
  try {
    // Filtrar apenas projetos ativos e visíveis para o público
    const queryObj = { ativo: true, ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Construir query
    let query = Projeto.find(queryObj);

    // Ordenação
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-ordem');
    }

    // Seleção de campos (excluir campos sensíveis)
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Paginação
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Executar query
    const projetos = await query;

    // Enviar resposta
    res.status(200).json({
      status: 'success',
      results: projetos.length,
      data: {
        projetos,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar projetos.',
    });
  }
};

// Obter um projeto público específico
exports.getProjetoPublic = async (req, res) => {
  try {
    const projeto = await Projeto.findOne({ 
      _id: req.params.id, 
      ativo: true 
    });

    if (!projeto) {
      return res.status(404).json({
        status: 'error',
        message: 'Projeto não encontrado.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        projeto,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar projeto.',
    });
  }
};
