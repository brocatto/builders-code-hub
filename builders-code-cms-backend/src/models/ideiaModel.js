const mongoose = require('mongoose');

const ideiaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'Título da ideia é obrigatório'],
      trim: true,
    },
    descricao: {
      type: String,
      required: [true, 'Descrição da ideia é obrigatória'],
      trim: true,
    },
    detalhes: [
      {
        texto: {
          type: String,
          required: true,
        },
        nivel: {
          type: Number,
          default: 0,
          min: 0,
          max: 2,
        },
        tipo: {
          type: String,
          enum: ['texto', 'bullet', 'numbered'],
          default: 'texto',
        },
      },
    ],
    conteudoRich: {
      type: String,
    },
    status: {
      type: String,
      enum: ['rascunho', 'em_analise', 'validada'],
      default: 'rascunho',
    },
    categoria: {
      type: String,
    },
    tags: [String],
    ordem: {
      type: Number,
      default: function() {
        return Date.now();
      },
    },
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

const Ideia = mongoose.model('Ideia', ideiaSchema);

module.exports = Ideia;
