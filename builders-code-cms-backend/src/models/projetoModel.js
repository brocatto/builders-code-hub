const mongoose = require('mongoose');

const projetoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Nome do projeto é obrigatório'],
      trim: true,
    },
    descricao: {
      type: String,
      required: [true, 'Descrição do projeto é obrigatória'],
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    fase: [{
      nome: { type: String, required: true },
      concluida: { type: Boolean, default: false },
      dataConclusao: { type: Date, default: null },
    }],
    detalhes: {
      type: String,
    },
    links: [
      {
        url: {
          type: String,
          required: true,
        },
        texto: {
          type: String,
          required: true,
        },
      },
    ],
    imagens: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: '',
        },
      },
    ],
    categoria: {
      type: String,
    },
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
    destaque: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'dataCriacao',
      updatedAt: 'dataAtualizacao',
    },
  }
);

const Projeto = mongoose.model('Projeto', projetoSchema);

module.exports = Projeto;
