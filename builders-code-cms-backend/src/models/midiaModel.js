const mongoose = require('mongoose');

const midiaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Nome do arquivo é obrigatório'],
      trim: true,
    },
    descricao: {
      type: String,
      trim: true,
    },
    tipo: {
      type: String,
      required: [true, 'Tipo MIME é obrigatório'],
    },
    url: {
      type: String,
      required: [true, 'URL do arquivo é obrigatória'],
    },
    tamanho: {
      type: Number,
      required: [true, 'Tamanho do arquivo é obrigatório'],
    },
    dimensoes: {
      largura: Number,
      altura: Number,
    },
    tags: [String],
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: {
      createdAt: 'dataCriacao',
      updatedAt: 'dataAtualizacao',
    },
  }
);

const Midia = mongoose.model('Midia', midiaSchema);

module.exports = Midia;
