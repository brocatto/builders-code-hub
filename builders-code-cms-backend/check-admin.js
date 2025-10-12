const mongoose = require('mongoose');
const User = require('./src/models/userModel');
require('dotenv').config();

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
    
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log('✅ Usuário admin encontrado:');
      console.log(`Username: ${admin.username}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Nome: ${admin.nome}`);
      console.log(`Role: ${admin.role}`);
      console.log(`Ativo: ${admin.ativo}`);
    } else {
      console.log('❌ Usuário admin não encontrado');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

checkAdmin();