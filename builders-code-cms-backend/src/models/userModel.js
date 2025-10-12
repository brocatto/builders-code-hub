const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Nome de usuário é obrigatório'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor, forneça um email válido'],
    },
    senha: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: [8, 'A senha deve ter pelo menos 8 caracteres'],
      select: false,
    },
    nome: {
      type: String,
      required: [true, 'Nome completo é obrigatório'],
      trim: true,
    },
    cargo: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'editor'],
      default: 'editor',
    },
    ativo: {
      type: Boolean,
      default: true,
    },
    ultimoLogin: {
      type: Date,
    },
    tentativasLogin: {
      type: Number,
      default: 0,
    },
    bloqueadoAte: {
      type: Date,
    },
    tokenReset: String,
    tokenResetExpira: Date,
  },
  {
    timestamps: {
      createdAt: 'dataCriacao',
      updatedAt: 'dataAtualizacao',
    },
  }
);

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function (next) {
  // Só executa se a senha foi modificada
  if (!this.isModified('senha')) return next();

  // Hash da senha com custo 12
  this.senha = await bcrypt.hash(this.senha, 12);
  next();
});

// Método para verificar se a senha está correta
userSchema.methods.verificarSenha = async function (senhaFornecida, senhaArmazenada) {
  return await bcrypt.compare(senhaFornecida, senhaArmazenada);
};

// Método para verificar se o usuário está bloqueado
userSchema.methods.estaBloqueado = function () {
  if (!this.bloqueadoAte) return false;
  return new Date() < this.bloqueadoAte;
};

// Método para incrementar tentativas de login
userSchema.methods.incrementarTentativasLogin = async function () {
  this.tentativasLogin += 1;
  
  // Bloqueia a conta por 30 minutos após 5 tentativas
  if (this.tentativasLogin >= 5) {
    const trintaMinutos = 30 * 60 * 1000;
    this.bloqueadoAte = new Date(Date.now() + trintaMinutos);
  }
  
  await this.save();
};

// Método para resetar tentativas de login
userSchema.methods.resetarTentativasLogin = async function () {
  this.tentativasLogin = 0;
  this.bloqueadoAte = undefined;
  await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
