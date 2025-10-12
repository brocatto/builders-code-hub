#!/usr/bin/env node

/**
 * BUILDERS CODE CMS - PRODUCTION SEED/MIGRATION SCRIPT
 * 
 * This script initializes the production database with:
 * - Initial admin user
 * - Basic categories and sections
 * - Sample data for demonstration
 * 
 * Usage:
 * node src/scripts/seed-production.js
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/userModel');
const Categoria = require('../models/categoriaModel');
const Secao = require('../models/secaoModel');
const Configuracao = require('../models/configuracaoModel');
const Projeto = require('../models/projetoModel');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Create initial admin user
const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      console.log('📝 Creating initial admin user...');

      const hashedPassword = await bcrypt.hash('admin123', 12);

      await User.create({
        username: 'admin',
        email: 'admin@buildershub.com',
        senha: hashedPassword,
        nome: 'Administrador',
        cargo: 'Administrador do Sistema',
        role: 'admin'
      });

      console.log('✅ Admin user created successfully!');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   ⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

// Create initial categories
const createInitialCategories = async () => {
  try {
    const categoriesCount = await Categoria.countDocuments();

    if (categoriesCount === 0) {
      console.log('📝 Creating initial categories...');

      const categories = [
        {
          nome: 'Desenvolvimento Web',
          descricao: 'Projetos relacionados a desenvolvimento web e aplicações',
          cor: '#3B82F6',
          ordem: 1,
          ativo: true
        },
        {
          nome: 'Mobile',
          descricao: 'Aplicações móveis e desenvolvimento mobile',
          cor: '#10B981',
          ordem: 2,
          ativo: true
        },
        {
          nome: 'Open Source',
          descricao: 'Projetos de código aberto e contribuições para a comunidade',
          cor: '#8B5CF6',
          ordem: 3,
          ativo: true
        },
        {
          nome: 'Startup',
          descricao: 'Projetos e ideias de startups',
          cor: '#F59E0B',
          ordem: 4,
          ativo: true
        },
        {
          nome: 'Pesquisa',
          descricao: 'Projetos de pesquisa e experimentação',
          cor: '#EF4444',
          ordem: 5,
          ativo: true
        }
      ];

      await Categoria.insertMany(categories);
      console.log('✅ Initial categories created successfully!');
    } else {
      console.log('ℹ️  Categories already exist');
    }
  } catch (error) {
    console.error('❌ Error creating categories:', error.message);
  }
};

// Create initial sections
const createInitialSections = async () => {
  try {
    const sectionsCount = await Secao.countDocuments();

    if (sectionsCount === 0) {
      console.log('📝 Creating initial sections...');

      const sections = [
        {
          identificador: 'projetos-atuais',
          titulo: 'Projetos Atuais',
          conteudo: 'Esta seção apresenta os projetos em desenvolvimento ativo no Builder\'s Code Hub.',
          ordem: 1,
          visivel: true
        },
        {
          identificador: 'projetos-concluidos',
          titulo: 'Projetos Concluídos',
          conteudo: 'Projetos finalizados e suas contribuições para a comunidade.',
          ordem: 2,
          visivel: true
        },
        {
          identificador: 'ideias-conceitos',
          titulo: 'Ideias e Conceitos',
          conteudo: 'Banco de ideias e conceitos em desenvolvimento para futuros projetos.',
          ordem: 3,
          visivel: true
        },
        {
          identificador: 'open-startup',
          titulo: 'Open Startup',
          conteudo: 'Transparência total sobre métricas, finanças e decisões da startup.',
          ordem: 4,
          visivel: true
        }
      ];

      await Secao.insertMany(sections);
      console.log('✅ Initial sections created successfully!');
    } else {
      console.log('ℹ️  Sections already exist');
    }
  } catch (error) {
    console.error('❌ Error creating sections:', error.message);
  }
};

// Create initial system configuration
const createInitialConfig = async () => {
  try {
    const configCount = await Configuracao.countDocuments();

    if (configCount === 0) {
      console.log('📝 Creating initial system configuration...');

      const configs = [
        {
          chave: 'site_name',
          valor: 'Builder\'s Code Hub',
          categoria: 'general',
          descricao: 'Nome do site',
          tipo: 'string'
        },
        {
          chave: 'site_description',
          valor: 'Plataforma de projetos e desenvolvimento colaborativo',
          categoria: 'general',
          descricao: 'Descrição do site',
          tipo: 'string'
        },
        {
          chave: 'site_url',
          valor: process.env.FRONTEND_URL || 'https://buildershub.com',
          categoria: 'general',
          descricao: 'URL do site',
          tipo: 'string'
        },
        {
          chave: 'maintenance_mode',
          valor: false,
          categoria: 'system',
          descricao: 'Modo de manutenção',
          tipo: 'boolean'
        },
        {
          chave: 'registration_enabled',
          valor: false,
          categoria: 'auth',
          descricao: 'Permitir novos registros',
          tipo: 'boolean'
        },
        {
          chave: 'max_file_size',
          valor: 10485760,
          categoria: 'uploads',
          descricao: 'Tamanho máximo de arquivo (bytes)',
          tipo: 'number'
        },
        {
          chave: 'allowed_file_types',
          valor: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'],
          categoria: 'uploads',
          descricao: 'Tipos de arquivo permitidos',
          tipo: 'json'
        },
        {
          chave: 'social_links',
          valor: {
            github: 'https://github.com/buildershub',
            linkedin: 'https://linkedin.com/company/buildershub',
            twitter: 'https://twitter.com/buildershub'
          },
          categoria: 'social',
          descricao: 'Links das redes sociais',
          tipo: 'json'
        }
      ];

      await Configuracao.insertMany(configs);
      console.log('✅ Initial system configuration created successfully!');
    } else {
      console.log('ℹ️  System configuration already exists');
    }
  } catch (error) {
    console.error('❌ Error creating system configuration:', error.message);
  }
};

// Create sample project
const createSampleProject = async () => {
  try {
    const projectCount = await Projeto.countDocuments();

    if (projectCount === 0) {
      console.log('📝 Creating sample project...');

      const webCategory = await Categoria.findOne({ nome: 'Desenvolvimento Web' });
      const currentSection = await Secao.findOne({ nome: 'Projetos Atuais' });

      if (webCategory && currentSection) {
        const project = {
          titulo: 'Builder\'s Code CMS',
          descricao: 'Sistema de gerenciamento de conteúdo para o Builder\'s Code Hub',
          conteudo: `
# Builder's Code CMS

Este é o sistema de gerenciamento de conteúdo do Builder's Code Hub, desenvolvido para facilitar a administração e organização de projetos, ideias e logs de atividades.

## Características Principais

- **Interface Administrativa Intuitiva**: Dashboard responsivo e moderno
- **Gestão de Projetos**: Controle completo sobre projetos e suas informações
- **Sistema de Logs**: Acompanhamento detalhado de atividades e progresso
- **Banco de Ideias**: Organização e categorização de ideias e conceitos
- **Gestão de Mídia**: Upload e organização de arquivos e imagens
- **Sistema de Autenticação**: Controle de acesso seguro

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js, Vite, Tailwind CSS
- **Autenticação**: JWT (JSON Web Tokens)
- **Deployment**: Vercel

## Status

Em desenvolvimento ativo - Version 1.0.0
          `,
          categoria: webCategory._id,
          secao: currentSection._id,
          status: 'em-andamento',
          prioridade: 'alta',
          dataInicio: new Date(),
          tecnologias: ['Node.js', 'Express.js', 'MongoDB', 'React.js', 'Vite', 'Tailwind CSS'],
          links: {
            repositorio: 'https://github.com/buildershub/cms',
            demo: process.env.FRONTEND_URL || '',
            documentacao: ''
          },
          visibilidade: 'publico',
          destaque: true,
          ativo: true
        };

        await Projeto.create(project);
        console.log('✅ Sample project created successfully!');
      }
    } else {
      console.log('ℹ️  Projects already exist');
    }
  } catch (error) {
    console.error('❌ Error creating sample project:', error.message);
  }
};

// Main seeding function
const seedDatabase = async () => {
  console.log('🌱 Starting production database seeding...');
  console.log('=====================================');

  await connectDB();

  try {
    await createAdminUser();
    await createInitialCategories();
    await createInitialSections();
    await createInitialConfig();
    await createSampleProject();

    console.log('=====================================');
    console.log('✅ Production database seeding completed!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   - Admin user: admin / admin123');
    console.log('   - Categories: 5 created');
    console.log('   - Sections: 4 created');
    console.log('   - System config: initialized');
    console.log('   - Sample project: created');
    console.log('');
    console.log('⚠️  IMPORTANT: Change admin password after first login!');
    console.log('🔗 API Status: /api/status');
    console.log('');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📦 Database connection closed');
    process.exit(0);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };