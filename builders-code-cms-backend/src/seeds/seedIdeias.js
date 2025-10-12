const mongoose = require('mongoose');
const Ideia = require('../models/ideiaModel');
require('dotenv').config();

// Dados extraídos de IdeasLogs.js
const ideiasData = [
  {
    titulo: "Life OS SaaS",
    descricao: "Um sistema simplificado que integra de ponta a ponta, quem você é, o que você quer e o que você tem que fazer no dia a dia",
    detalhes: [
      {
        texto: "Um sistema de planejamento de vida que faz desde a concepção do que você valoriza, a definição de um propósito, quem você é, quem você quer ser e como chegar lá.",
        tipo: "texto",
        nivel: 0
      },
      {
        texto: "Defina Sua Visão, Missão, Princípios, Valores e Propósito",
        tipo: "bullet",
        nivel: 1
      },
      {
        texto: "Defina seus medos",
        tipo: "bullet",
        nivel: 1
      },
      {
        texto: "Autoimagem",
        tipo: "bullet",
        nivel: 1
      },
      {
        texto: "Dream Life I Want To Build",
        tipo: "bullet",
        nivel: 1
      },
      {
        texto: "Dream Life Roadmap",
        tipo: "bullet",
        nivel: 1
      },
      {
        texto: "GamePlan",
        tipo: "bullet",
        nivel: 1
      },
      {
        texto: "GTD - Getting Things Done: TAREFAS E PROJETOS",
        tipo: "bullet",
        nivel: 1
      },
      {
        texto: "Top Goal: Meta do Momento",
        tipo: "bullet",
        nivel: 1
      },
      {
        texto: "Hábitos",
        tipo: "bullet",
        nivel: 1
      },
      {
        texto: "Autosugestão Induzida",
        tipo: "bullet",
        nivel: 1
      },
      {
        texto: "Estabeleça uma Rotina",
        tipo: "bullet",
        nivel: 1
      }
    ],
    status: "em_analise",
    categoria: "saas",
    tags: ["produtividade", "planejamento", "vida", "sistema"],
    ativo: true,
    ordem: 1
  },
  {
    titulo: "Creator-led DTC Brand",
    descricao: "Conectar Aceleradora + Produto + Influencer",
    detalhes: [
      {
        texto: "Adverse + Lab + Creator",
        tipo: "bullet",
        nivel: 0
      },
      {
        texto: "Buildar marca ao redor do ecossistema da solução do nosso produto",
        tipo: "bullet",
        nivel: 0
      },
      {
        texto: "Marcas lideradas por criadores (creator-led brands): Uma das tendências mais interessantes é o surgimento de marcas DTC criadas e impulsionadas por influenciadores e criadores de conteúdo.",
        tipo: "texto",
        nivel: 0
      }
    ],
    status: "validada",
    categoria: "dtc",
    tags: ["creator", "influencer", "marca", "dtc"],
    ativo: true,
    ordem: 2
  },
  {
    titulo: "Como tornar a adoção de cachorros lucrativa",
    descricao: "",
    status: "rascunho",
    categoria: "business",
    tags: ["pets", "adoção", "business-model"],
    ativo: true,
    ordem: 3
  },
  {
    titulo: "AI Agent With Media Mix Modeling Knowledge for Performance Decision Making",
    descricao: "Agente AI que faz análise de dados usando mmm como base racional",
    status: "em_analise",
    categoria: "ai",
    tags: ["ai", "mmm", "performance", "analytics"],
    ativo: true,
    ordem: 4
  },
  {
    titulo: "Media Mix Modeling",
    descricao: "",
    status: "rascunho",
    categoria: "analytics",
    tags: ["mmm", "marketing", "attribution"],
    ativo: true,
    ordem: 5
  },
  {
    titulo: "Subscription Model for Local Business",
    descricao: "Programa de Aceleração de Performance Para Implantar um Funil de Recorrência Para NLs",
    detalhes: [
      {
        texto: "Desenvolvemos todo o produto",
        tipo: "bullet",
        nivel: 0
      },
      {
        texto: "Implantamos todo o setup (server, hosp. landing pages, assinaturas, etc)",
        tipo: "bullet",
        nivel: 0
      },
      {
        texto: "Cuidados de Aquisição e Retenção",
        tipo: "bullet",
        nivel: 0
      },
      {
        texto: "Ganhamos % do rev das assinaturas recorrentes.",
        tipo: "bullet",
        nivel: 0
      }
    ],
    status: "validada",
    categoria: "subscription",
    tags: ["subscription", "local-business", "saas", "revenue-share"],
    ativo: true,
    ordem: 6
  }
];

const seedIdeias = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/builders-code-cms');
    console.log('Conectado ao MongoDB');

    // Limpar dados existentes
    console.log('Limpando ideias existentes...');
    await Ideia.deleteMany({});

    // Inserir novos dados
    console.log('Inserindo ideias...');
    const ideias = await Ideia.insertMany(ideiasData);
    
    console.log(`✅ ${ideias.length} ideias inseridas com sucesso!`);
    
    // Listar ideias inseridas
    ideias.forEach((ideia, index) => {
      console.log(`${index + 1}. ${ideia.titulo} - Status: ${ideia.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed das ideias:', error);
    process.exit(1);
  }
};

// Executar se o script for chamado diretamente
if (require.main === module) {
  seedIdeias();
}

module.exports = seedIdeias;