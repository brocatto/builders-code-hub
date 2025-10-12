const mongoose = require('mongoose');

const logAtividadeSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    acao: {
      type: String,
      required: [true, 'Tipo de ação é obrigatório'],
      enum: ['create', 'update', 'delete', 'login', 'logout', 'view'],
    },
    entidade: {
      type: String,
      required: [true, 'Entidade afetada é obrigatória'],
      enum: ['projeto', 'log', 'ideia', 'secao', 'categoria', 'usuario', 'configuracao', 'midia'],
    },
    entidadeId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    detalhes: {
      type: Object,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    data: {
      type: Date,
      default: Date.now,
    },
  }
);

const LogAtividade = mongoose.model('LogAtividade', logAtividadeSchema);

module.exports = LogAtividade;
