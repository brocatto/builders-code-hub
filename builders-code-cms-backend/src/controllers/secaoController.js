const Secao = require('../models/secaoModel');
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

// Obter todas as seções
exports.getAllSecoes = async (req, res) => {
  try {
    // Filtros básicos
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Filtros avançados
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    // Construir query
    let query = Secao.find(JSON.parse(queryStr));

    // Ordenação
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('ordem');
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
    const secoes = await query;

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'secao', null, { filtros: req.query }, req);

    // Enviar resposta
    res.status(200).json({
      status: 'success',
      results: secoes.length,
      data: {
        secoes,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar seções.',
    });
  }
};

// Obter uma seção específica
exports.getSecao = async (req, res) => {
  try {
    const secao = await Secao.findById(req.params.id);

    if (!secao) {
      return res.status(404).json({
        status: 'error',
        message: 'Seção não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'secao', secao._id, {}, req);

    res.status(200).json({
      status: 'success',
      data: {
        secao,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar seção.',
    });
  }
};

// Criar nova seção
exports.createSecao = async (req, res) => {
  try {
    const novaSecao = await Secao.create(req.body);

    // Registrar atividade
    await registrarAtividade(req.user._id, 'create', 'secao', novaSecao._id, { dados: req.body }, req);

    res.status(201).json({
      status: 'success',
      data: {
        secao: novaSecao,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao criar seção.',
      errors: error.errors,
    });
  }
};

// Atualizar seção
exports.updateSecao = async (req, res) => {
  try {
    const secao = await Secao.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!secao) {
      return res.status(404).json({
        status: 'error',
        message: 'Seção não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'update', 'secao', secao._id, { dados: req.body }, req);

    res.status(200).json({
      status: 'success',
      data: {
        secao,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao atualizar seção.',
      errors: error.errors,
    });
  }
};

// Excluir seção
exports.deleteSecao = async (req, res) => {
  try {
    const secao = await Secao.findByIdAndDelete(req.params.id);

    if (!secao) {
      return res.status(404).json({
        status: 'error',
        message: 'Seção não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'delete', 'secao', req.params.id, {}, req);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao excluir seção.',
    });
  }
};
