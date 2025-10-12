const Midia = require('../models/midiaModel');
const LogAtividade = require('../models/logAtividadeModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../public/uploads');
    // Criar diretório se não existir
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtro para tipos de arquivos permitidos
const fileFilter = (req, file, cb) => {
  // Aceitar imagens e documentos comuns
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|md/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens e documentos são permitidos!'), false);
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter
});

// Middleware para upload de arquivo único
exports.uploadArquivo = upload.single('arquivo');

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

// Obter todas as mídias
exports.getAllMidias = async (req, res) => {
  try {
    // Filtros básicos
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Filtros avançados
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    // Construir query
    let query = Midia.find(JSON.parse(queryStr));

    // Ordenação
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-dataCriacao');
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
    const midias = await query;

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'midia', null, { filtros: req.query }, req);

    // Enviar resposta
    res.status(200).json({
      status: 'success',
      results: midias.length,
      data: {
        midias,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar mídias.',
    });
  }
};

// Obter uma mídia específica
exports.getMidia = async (req, res) => {
  try {
    const midia = await Midia.findById(req.params.id);

    if (!midia) {
      return res.status(404).json({
        status: 'error',
        message: 'Mídia não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'view', 'midia', midia._id, {}, req);

    res.status(200).json({
      status: 'success',
      data: {
        midia,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar mídia.',
    });
  }
};

// Criar nova mídia (upload de arquivo)
exports.createMidia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Nenhum arquivo enviado.',
      });
    }

    // Preparar dados da mídia
    const midiaDados = {
      nome: req.body.nome || req.file.originalname,
      descricao: req.body.descricao || '',
      tipo: req.file.mimetype,
      url: `/uploads/${req.file.filename}`,
      tamanho: req.file.size,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      usuarioId: req.user._id,
    };

    // Adicionar dimensões para imagens
    if (req.file.mimetype.startsWith('image/')) {
      // Em uma implementação real, usaríamos uma biblioteca como sharp para obter dimensões
      // Por simplicidade, estamos apenas simulando isso aqui
      midiaDados.dimensoes = {
        largura: req.body.largura || 0,
        altura: req.body.altura || 0,
      };
    }

    // Criar registro no banco de dados
    const novaMidia = await Midia.create(midiaDados);

    // Registrar atividade
    await registrarAtividade(req.user._id, 'create', 'midia', novaMidia._id, { dados: midiaDados }, req);

    res.status(201).json({
      status: 'success',
      data: {
        midia: novaMidia,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao criar mídia.',
      errors: error.errors,
    });
  }
};

// Atualizar mídia
exports.updateMidia = async (req, res) => {
  try {
    const midia = await Midia.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!midia) {
      return res.status(404).json({
        status: 'error',
        message: 'Mídia não encontrada.',
      });
    }

    // Registrar atividade
    await registrarAtividade(req.user._id, 'update', 'midia', midia._id, { dados: req.body }, req);

    res.status(200).json({
      status: 'success',
      data: {
        midia,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao atualizar mídia.',
      errors: error.errors,
    });
  }
};

// Excluir mídia
exports.deleteMidia = async (req, res) => {
  try {
    const midia = await Midia.findById(req.params.id);

    if (!midia) {
      return res.status(404).json({
        status: 'error',
        message: 'Mídia não encontrada.',
      });
    }

    // Remover arquivo físico
    const filePath = path.join(__dirname, '../../public', midia.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remover registro do banco de dados
    await Midia.findByIdAndDelete(req.params.id);

    // Registrar atividade
    await registrarAtividade(req.user._id, 'delete', 'midia', req.params.id, {}, req);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao excluir mídia.',
    });
  }
};
