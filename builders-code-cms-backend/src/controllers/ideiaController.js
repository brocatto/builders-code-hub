const Ideia = require('../models/ideiaModel');
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

// Obter todas as ideias
exports.getAllIdeias = async (req, res) => {
  try {
    // Filtros básicos
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Filtros avançados
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    // Construir query
    let query = Ideia.find(JSON.parse(queryStr));

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
    const ideias = await query;

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'ideia', null, { filtros: req.query }, req);

    // Enviar resposta
    res.status(200).json({
      status: 'success',
      results: ideias.length,
      data: {
        ideias,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar ideias.',
    });
  }
};

// Obter uma ideia específica
exports.getIdeia = async (req, res) => {
  try {
    const ideia = await Ideia.findById(req.params.id);

    if (!ideia) {
      return res.status(404).json({
        status: 'error',
        message: 'Ideia não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'ideia', ideia._id, {}, req);

    res.status(200).json({
      status: 'success',
      data: {
        ideia,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar ideia.',
    });
  }
};

// Criar nova ideia
exports.createIdeia = async (req, res) => {
  try {
    const novaIdeia = await Ideia.create(req.body);

    // Registrar atividade
    await registrarAtividade(req.user._id, 'create', 'ideia', novaIdeia._id, { dados: req.body }, req);

    res.status(201).json({
      status: 'success',
      data: {
        ideia: novaIdeia,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao criar ideia.',
      errors: error.errors,
    });
  }
};

// Atualizar ideia
exports.updateIdeia = async (req, res) => {
  try {
    const ideia = await Ideia.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!ideia) {
      return res.status(404).json({
        status: 'error',
        message: 'Ideia não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'update', 'ideia', ideia._id, { dados: req.body }, req);

    res.status(200).json({
      status: 'success',
      data: {
        ideia,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao atualizar ideia.',
      errors: error.errors,
    });
  }
};

// Excluir ideia
exports.deleteIdeia = async (req, res) => {
  try {
    const ideia = await Ideia.findByIdAndDelete(req.params.id);

    if (!ideia) {
      return res.status(404).json({
        status: 'error',
        message: 'Ideia não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'delete', 'ideia', req.params.id, {}, req);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao excluir ideia.',
    });
  }
};

// Versões públicas para o website (sem autenticação)

// Obter todas as ideias públicas (apenas ativas e visíveis)
exports.getAllIdeiasPublic = async (req, res) => {
  try {
    // Filtrar apenas ideias ativas e visíveis para o público
    const queryObj = { ativo: true, ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Construir query
    let query = Ideia.find(queryObj);

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
    const ideias = await query;

    // Enviar resposta
    res.status(200).json({
      status: 'success',
      results: ideias.length,
      data: {
        ideias,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar ideias.',
    });
  }
};

// Obter uma ideia pública específica
exports.getIdeiaPublic = async (req, res) => {
  try {
    const ideia = await Ideia.findOne({ 
      _id: req.params.id, 
      ativo: true 
    });

    if (!ideia) {
      return res.status(404).json({
        status: 'error',
        message: 'Ideia não encontrada.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        ideia,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar ideia.',
    });
  }
};
