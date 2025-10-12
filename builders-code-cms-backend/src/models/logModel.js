const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    data: {
      type: String,
      required: [true, 'Data do log é obrigatória'],
      trim: true,
    },
    dataReal: {
      type: Date,
      default: Date.now,
    },
    projeto: {
      type: String,
      required: [true, 'Nome do projeto relacionado é obrigatório'],
      trim: true,
    },
    projetoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Projeto',
    },
    atualizacoes: [
      {
        texto: {
          type: String,
          required: true,
        },
        tipo: {
          type: String,
          enum: ['texto', 'link', 'codigo', 'imagem'],
          default: 'texto',
        },
        link: String,
      },
    ],
    ordem: {
      type: Number,
      default: function() {
        return Date.now();
      },
    },
    tags: [String],
    ativo: {
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

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
