const mongoose = require('mongoose');

const secaoSchema = new mongoose.Schema(
  {
    identificador: {
      type: String,
      required: [true, 'Identificador da seção é obrigatório'],
      unique: true,
      trim: true,
    },
    titulo: {
      type: String,
      required: [true, 'Título da seção é obrigatório'],
      trim: true,
    },
    prefixo: {
      type: String,
      trim: true,
    },
    conteudo: {
      type: String,
      required: [true, 'Conteúdo da seção é obrigatório'],
    },
    ordem: {
      type: Number,
      required: [true, 'Ordem de exibição é obrigatória'],
    },
    visivel: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: 'dataCriacao',
      updatedAt: 'dataAtualizacao',
    },
  }
);

const Secao = mongoose.model('Secao', secaoSchema);

module.exports = Secao;
