const mongoose = require('mongoose');
const Projeto = require('../models/projetoModel');
require('dotenv').config();

// Dados extraídos de ProjetosAtuais.js
const projetosData = [
  {
    nome: "Adverse: Aceleradora de Performance para eCom",
    descricao: "Aceleradora de Performance focada em escalar operações de e-commerces DTC (Direct To Costumer) com uma abordagem completa de Aquisição e Retenção de Clientes.",
    link: "https://adverse.com.br/",
    fase: [
      "Foco em aquisição de contratos com %rev share",
      "Construção de cases de sucesso",
      "Aquisição de talentos"
    ],
    categoria: "aceleradora",
    ativo: true,
    destaque: true,
    ordem: 1
  },
  {
    nome: "Dmais: Marca DTC de Produtos de Limpeza Biodegradáveis",
    descricao: "Marca DNVB (Digital Nativa Vertical Brand) focada em entregar soluções de limpeza sustentáveis",
    fase: [
      "Desenvolvimento da fórmula",
      "Testes iniciais",
      "Estruturação do Funil de Aquisição"
    ],
    categoria: "dtc-brand",
    ativo: true,
    destaque: true,
    ordem: 2
  },
  {
    nome: "ReportBot: Bot de automação de dados no Slack com Python+ IA",
    descricao: "Criar um agente IA treinado com base em uma metodologia de análise de dados focado em aquisição de clientes para e-commerce que como base KPIs de Tráfego para acompanhar a performance de mídia macro e micro do e-commerce.",
    detalhes: "Testando e aprendendo python com ia e aproveitando pra automatizar o envio de relatórios da empresa com bots",
    fase: ["Escalando bot para múltiplos canais de mídia"],
    links: [
      { url: "https://github.com/brocatto/report-bot-meta", texto: "GitHub: report-bot-meta" },
      { url: "#", texto: "Escalando Para o Google Ads…" },
      { url: "#", texto: "Report Bott MVP" }
    ],
    categoria: "automation",
    ativo: true,
    destaque: true,
    ordem: 3
  },
  {
    nome: "ScaleX: Framework de Escala Para Marcas DTC",
    descricao: "Metodologia de Escala de E-commerces DTC Desenvolvida e Criada na Prática",
    categoria: "framework",
    ativo: true,
    destaque: false,
    ordem: 4
  },
  {
    nome: "Adverse Ventures Studio",
    descricao: "Criar marcas DTC do zero internamente ou em parceria com empreendedores. Aproveitando o know-how de mercado e as capacidades de marketing, a empresa pode identificar nichos promissores e incubar suas próprias marcas, nas quais já deteria grande participação de equity. Esse movimento transforma a aceleradora quase em uma empresa de produtos apoiada por sua máquina de marketing",
    categoria: "ventures",
    ativo: true,
    destaque: false,
    ordem: 5
  }
];

const seedProjetos = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/builders-code-cms');
    console.log('Conectado ao MongoDB');

    // Limpar dados existentes
    console.log('Limpando projetos existentes...');
    await Projeto.deleteMany({});

    // Inserir novos dados
    console.log('Inserindo projetos...');
    const projetos = await Projeto.insertMany(projetosData);
    
    console.log(`✅ ${projetos.length} projetos inseridos com sucesso!`);
    
    // Listar projetos inseridos
    projetos.forEach((projeto, index) => {
      console.log(`${index + 1}. ${projeto.nome}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed dos projetos:', error);
    process.exit(1);
  }
};

// Executar se o script for chamado diretamente
if (require.main === module) {
  seedProjetos();
}

module.exports = seedProjetos;