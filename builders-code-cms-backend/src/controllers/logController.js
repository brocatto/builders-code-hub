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

// Obter todos os logs
exports.getAllLogs = async (req, res) => {
  try {
    // Filtros básicos
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Filtros avançados
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    // Construir query
    let query = Log.find(JSON.parse(queryStr));

    // Ordenação
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-dataReal -ordem');
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
    const logs = await query;

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'log', null, { filtros: req.query }, req);

    // Enviar resposta
    res.status(200).json({
      status: 'success',
      results: logs.length,
      data: {
        logs,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar logs.',
    });
  }
};

// Obter um log específico
exports.getLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);

    if (!log) {
      return res.status(404).json({
        status: 'error',
        message: 'Log não encontrado.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'log', log._id, {}, req);

    res.status(200).json({
      status: 'success',
      data: {
        log,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar log.',
    });
  }
};

// Criar novo log
exports.createLog = async (req, res) => {
  try {
    const novoLog = await Log.create(req.body);

    // Registrar atividade
    await registrarAtividade(req.user._id, 'create', 'log', novoLog._id, { dados: req.body }, req);

    res.status(201).json({
      status: 'success',
      data: {
        log: novoLog,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao criar log.',
      errors: error.errors,
    });
  }
};

// Atualizar log
exports.updateLog = async (req, res) => {
  try {
    const log = await Log.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!log) {
      return res.status(404).json({
        status: 'error',
        message: 'Log não encontrado.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'update', 'log', log._id, { dados: req.body }, req);

    res.status(200).json({
      status: 'success',
      data: {
        log,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao atualizar log.',
      errors: error.errors,
    });
  }
};

// Excluir log
exports.deleteLog = async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);

    if (!log) {
      return res.status(404).json({
        status: 'error',
        message: 'Log não encontrado.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'delete', 'log', req.params.id, {}, req);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao excluir log.',
    });
  }
};

// Versões públicas para o website (sem autenticação)

// Obter todos os logs públicos (apenas ativos e visíveis)
exports.getAllLogsPublic = async (req, res) => {
  try {
    // Filtrar apenas logs ativos e visíveis para o público
    const queryObj = { ativo: true, ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Construir query
    let query = Log.find(queryObj);

    // Ordenação
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-dataReal -ordem');
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
    const logs = await query;

    // Enviar resposta
    res.status(200).json({
      status: 'success',
      results: logs.length,
      data: {
        logs,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar logs.',
    });
  }
};

// Obter um log público específico
exports.getLogPublic = async (req, res) => {
  try {
    const log = await Log.findOne({ 
      _id: req.params.id, 
      ativo: true 
    });

    if (!log) {
      return res.status(404).json({
        status: 'error',
        message: 'Log não encontrado.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        log,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar log.',
    });
  }
};
