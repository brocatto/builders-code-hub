const Configuracao = require('../models/configuracaoModel');
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

// Obter todas as configurações
exports.getAllConfiguracoes = async (req, res) => {
  try {
    // Filtros básicos
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Filtros avançados
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    // Construir query
    let query = Configuracao.find(JSON.parse(queryStr));

    // Ordenação
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('categoria chave');
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
    const configuracoes = await query;

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'configuracao', null, { filtros: req.query }, req);

    // Enviar resposta
    res.status(200).json({
      status: 'success',
      results: configuracoes.length,
      data: {
        configuracoes,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar configurações.',
    });
  }
};

// Obter uma configuração específica
exports.getConfiguracao = async (req, res) => {
  try {
    const configuracao = await Configuracao.findById(req.params.id);

    if (!configuracao) {
      return res.status(404).json({
        status: 'error',
        message: 'Configuração não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'configuracao', configuracao._id, {}, req);

    res.status(200).json({
      status: 'success',
      data: {
        configuracao,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar configuração.',
    });
  }
};

// Obter configuração por chave
exports.getConfiguracaoPorChave = async (req, res) => {
  try {
    const { chave } = req.params;
    const configuracao = await Configuracao.findOne({ chave });

    if (!configuracao) {
      return res.status(404).json({
        status: 'error',
        message: 'Configuração não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'configuracao', configuracao._id, { chave }, req);

    res.status(200).json({
      status: 'success',
      data: {
        configuracao,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar configuração.',
    });
  }
};

// Criar nova configuração
exports.createConfiguracao = async (req, res) => {
  try {
    // Verificar se já existe configuração com a mesma chave
    const existente = await Configuracao.findOne({ chave: req.body.chave });
    if (existente) {
      return res.status(400).json({
        status: 'error',
        message: 'Já existe uma configuração com esta chave.',
      });
    }

    // Processar valor conforme o tipo
    if (req.body.tipo === 'json' && typeof req.body.valor === 'string') {
      try {
        req.body.valor = JSON.parse(req.body.valor);
      } catch (e) {
        return res.status(400).json({
          status: 'error',
          message: 'Valor JSON inválido.',
        });
      }
    } else if (req.body.tipo === 'number' && typeof req.body.valor === 'string') {
      req.body.valor = Number(req.body.valor);
    } else if (req.body.tipo === 'boolean' && typeof req.body.valor === 'string') {
      req.body.valor = req.body.valor.toLowerCase() === 'true';
    }

    const novaConfiguracao = await Configuracao.create(req.body);

    // Registrar atividade
    await registrarAtividade(req.user._id, 'create', 'configuracao', novaConfiguracao._id, { dados: req.body }, req);

    res.status(201).json({
      status: 'success',
      data: {
        configuracao: novaConfiguracao,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao criar configuração.',
      errors: error.errors,
    });
  }
};

// Atualizar configuração
exports.updateConfiguracao = async (req, res) => {
  try {
    // Processar valor conforme o tipo
    if (req.body.tipo === 'json' && typeof req.body.valor === 'string') {
      try {
        req.body.valor = JSON.parse(req.body.valor);
      } catch (e) {
        return res.status(400).json({
          status: 'error',
          message: 'Valor JSON inválido.',
        });
      }
    } else if (req.body.tipo === 'number' && typeof req.body.valor === 'string') {
      req.body.valor = Number(req.body.valor);
    } else if (req.body.tipo === 'boolean' && typeof req.body.valor === 'string') {
      req.body.valor = req.body.valor.toLowerCase() === 'true';
    }

    const configuracao = await Configuracao.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!configuracao) {
      return res.status(404).json({
        status: 'error',
        message: 'Configuração não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'update', 'configuracao', configuracao._id, { dados: req.body }, req);

    res.status(200).json({
      status: 'success',
      data: {
        configuracao,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao atualizar configuração.',
      errors: error.errors,
    });
  }
};

// Excluir configuração
exports.deleteConfiguracao = async (req, res) => {
  try {
    const configuracao = await Configuracao.findByIdAndDelete(req.params.id);

    if (!configuracao) {
      return res.status(404).json({
        status: 'error',
        message: 'Configuração não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'delete', 'configuracao', req.params.id, {}, req);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao excluir configuração.',
    });
  }
};
