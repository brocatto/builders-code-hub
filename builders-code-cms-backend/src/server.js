const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco
connectDB();

// Função para criar usuário admin inicial
const createInitialAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      console.log('Criando usuário admin inicial...');

      const senha = await bcrypt.hash('admin123', 12);

      await User.create({
        username: 'admin',
        email: 'admin@builderhub.com',
        senha,
        nome: 'Administrador',
        cargo: 'Administrador do Sistema',
        role: 'admin'
      });

      console.log('Usuário admin criado com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  }
};

// Executar função de criação do admin
createInitialAdmin();

// ✅ Iniciar servidor
const PORT = process.env.PORT || 5000;

// Sempre iniciar servidor em desenvolvimento local
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`🌐 API: http://localhost:${PORT}/api/status`);
});

// ✅ Exportar app para funcionar na Vercel
module.exports = app;
