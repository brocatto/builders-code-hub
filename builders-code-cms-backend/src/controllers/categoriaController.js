const Categoria = require('../models/categoriaModel');
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

// Obter todas as categorias
exports.getAllCategorias = async (req, res) => {
  try {
    // Verificar se deve retornar hierarquia
    if (req.query.hierarchy === 'true') {
      const categorias = await Categoria.getHierarchy();
      return res.status(200).json({
        status: 'success',
        results: categorias.length,
        data: {
          categorias,
        },
      });
    }

    // Filtros básicos
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'hierarchy'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Filtros avançados
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    // Construir query com população
    let query = Categoria.find(JSON.parse(queryStr))
      .populate('parent', 'nome cor icone')
      .populate('children', 'nome cor icone ordem');

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
    const categorias = await query;

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'categoria', null, { filtros: req.query }, req);

    // Enviar resposta
    res.status(200).json({
      status: 'success',
      results: categorias.length,
      data: {
        categorias,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar categorias.',
    });
  }
};

// Obter uma categoria específica
exports.getCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id)
      .populate('parent', 'nome cor icone')
      .populate('children', 'nome cor icone ordem');

    if (!categoria) {
      return res.status(404).json({
        status: 'error',
        message: 'Categoria não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'categoria', categoria._id, {}, req);

    res.status(200).json({
      status: 'success',
      data: {
        categoria,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar categoria.',
    });
  }
};

// Obter analytics de categorias
exports.getCategoriaAnalytics = async (req, res) => {
  try {
    const analytics = await Categoria.aggregate([
      {
        $group: {
          _id: null,
          totalCategorias: { $sum: 1 },
          categoriasAtivas: { $sum: { $cond: ['$ativo', 1, 0] } },
          totalUso: { $sum: '$usageStats.totalUso' },
          avgUsoPorCategoria: { $avg: '$usageStats.totalUso' }
        }
      },
      {
        $project: {
          _id: 0,
          totalCategorias: 1,
          categoriasAtivas: 1,
          totalUso: 1,
          avgUsoPorCategoria: { $round: ['$avgUsoPorCategoria', 2] }
        }
      }
    ]);

    const categoriasMaisUsadas = await Categoria.find({ ativo: true })
      .sort({ 'usageStats.totalUso': -1 })
      .limit(10)
      .select('nome cor usageStats');

    const categoriasPorCor = await Categoria.aggregate([
      { $match: { ativo: true } },
      { $group: { _id: '$cor', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'categoria', null, { tipo: 'analytics' }, req);

    res.status(200).json({
      status: 'success',
      data: {
        analytics: analytics[0] || {},
        categoriasMaisUsadas,
        categoriasPorCor
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar analytics de categorias.',
    });
  }
};

// Reordenar categorias
exports.reorderCategorias = async (req, res) => {
  try {
    const { categorias } = req.body; // Array de { id, ordem, parent }

    const bulkOps = categorias.map(cat => ({
      updateOne: {
        filter: { _id: cat.id },
        update: { 
          ordem: cat.ordem,
          parent: cat.parent || null
        }
      }
    }));

    await Categoria.bulkWrite(bulkOps);

    // Registrar atividade
    await registrarAtividade(req.user._id, 'reorder', 'categoria', null, { categorias }, req);

    res.status(200).json({
      status: 'success',
      message: 'Categorias reordenadas com sucesso.',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao reordenar categorias.',
    });
  }
};

// Criar nova categoria
exports.createCategoria = async (req, res) => {
  try {
    const novaCategoria = await Categoria.create(req.body);

    // Registrar atividade
    await registrarAtividade(req.user._id, 'create', 'categoria', novaCategoria._id, { dados: req.body }, req);

    res.status(201).json({
      status: 'success',
      data: {
        categoria: novaCategoria,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao criar categoria.',
      errors: error.errors,
    });
  }
};

// Atualizar categoria
exports.updateCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!categoria) {
      return res.status(404).json({
        status: 'error',
        message: 'Categoria não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'update', 'categoria', categoria._id, { dados: req.body }, req);

    res.status(200).json({
      status: 'success',
      data: {
        categoria,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao atualizar categoria.',
      errors: error.errors,
    });
  }
};

// Excluir categoria
exports.deleteCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        status: 'error',
        message: 'Categoria não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'delete', 'categoria', req.params.id, {}, req);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao excluir categoria.',
    });
  }
};
