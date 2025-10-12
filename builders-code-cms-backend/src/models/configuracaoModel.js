const mongoose = require('mongoose');

const configuracaoSchema = new mongoose.Schema(
  {
    chave: {
      type: String,
      required: [true, 'Chave da configuração é obrigatória'],
      unique: true,
      trim: true,
    },
    valor: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Valor da configuração é obrigatório'],
    },
    categoria: {
      type: String,
      required: [true, 'Categoria da configuração é obrigatória'],
      trim: true,
    },
    descricao: {
      type: String,
      trim: true,
    },
    tipo: {
      type: String,
      enum: ['string', 'number', 'boolean', 'json'],
      default: 'string',
    },
  },
  {
    timestamps: {
      createdAt: 'dataCriacao',
      updatedAt: 'dataAtualizacao',
    },
  }
);

const Configuracao = mongoose.model('Configuracao', configuracaoSchema);

module.exports = Configuracao;
