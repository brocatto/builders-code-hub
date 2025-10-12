const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Nome da categoria é obrigatório'],
      trim: true,
    },
    descricao: {
      type: String,
      trim: true,
    },
    icone: {
      type: String,
    },
    cor: {
      type: String,
      default: '#6366F1',
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Cor deve estar no formato hexadecimal válido'
      }
    },
    ordem: {
      type: Number,
      required: [true, 'Ordem de exibição é obrigatória'],
    },
    ativo: {
      type: Boolean,
      default: true,
    },
    // Hierarquia parent/child
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      default: null
    },
    children: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria'
    }],
    // Estatísticas de uso
    usageStats: {
      projetos: { type: Number, default: 0 },
      ideias: { type: Number, default: 0 },
      logs: { type: Number, default: 0 },
      totalUso: { type: Number, default: 0 }
    },
    // Metadados visuais
    visualConfig: {
      gradientEnabled: { type: Boolean, default: false },
      gradientColors: [String],
      opacity: { type: Number, default: 1, min: 0, max: 1 },
      borderStyle: { type: String, enum: ['solid', 'dashed', 'dotted'], default: 'solid' }
    }
  },
  {
    timestamps: {
      createdAt: 'dataCriacao',
      updatedAt: 'dataAtualizacao',
    },
  }
);

// Índices para otimização
categoriaSchema.index({ parent: 1, ordem: 1 });
categoriaSchema.index({ 'usageStats.totalUso': -1 });

// Virtual para verificar se é categoria raiz
categoriaSchema.virtual('isRoot').get(function() {
  return !this.parent;
});

// Virtual para calcular profundidade na hierarquia
categoriaSchema.virtual('depth').get(function() {
  // Esta seria calculada dinamicamente via população
  return this.parent ? 1 : 0;
});

// Middleware para atualizar children quando parent é definido
categoriaSchema.pre('save', async function(next) {
  if (this.isModified('parent') && this.parent) {
    // Adicionar este item aos children do parent
    await this.constructor.findByIdAndUpdate(
      this.parent,
      { $addToSet: { children: this._id } }
    );
  }
  next();
});

// Middleware para remover dos children quando categoria é removida
categoriaSchema.pre('findOneAndDelete', async function(next) {
  const categoria = await this.getQuery();
  if (categoria && categoria.parent) {
    await this.model.findByIdAndUpdate(
      categoria.parent,
      { $pull: { children: categoria._id } }
    );
  }
  next();
});

// Método estático para obter hierarquia completa
categoriaSchema.statics.getHierarchy = function() {
  return this.find({ parent: null })
    .populate({
      path: 'children',
      populate: {
        path: 'children',
        model: 'Categoria'
      }
    })
    .sort('ordem');
};

// Método para atualizar estatísticas de uso
categoriaSchema.methods.updateUsageStats = function(tipo, incremento = 1) {
  if (this.usageStats[tipo] !== undefined) {
    this.usageStats[tipo] += incremento;
    this.usageStats.totalUso += incremento;
    return this.save();
  }
  return Promise.resolve(this);
};

const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = Categoria;
