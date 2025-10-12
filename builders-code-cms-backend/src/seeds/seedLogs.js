const mongoose = require('mongoose');
const Log = require('../models/logModel');
require('dotenv').config();

// Dados extraídos de ProjectLogs.js
const logsData = [
  {
    data: "11/05/2024",
    dataReal: new Date("2024-05-11"),
    projeto: "Random New Creations",
    atualizacoes: [
      {
        texto: "Apple-like minimalist design funnel kit",
        tipo: "texto"
      },
      {
        texto: "Acho o design da apple ótimo. É fluido, simples, direto, clean, sofisticado. Queria criar uma forma prática de replicar esse design em projetos mvps",
        tipo: "texto"
      },
      {
        texto: "Simplesmente falei com meu amigo GPTAO",
        tipo: "texto"
      },
      {
        texto: "Aproveite e acompanhe 🤣",
        tipo: "link",
        link: "https://chatgpt.com/share/68212882-cf4c-800d"
      }
    ],
    tags: ["design", "mvp", "apple", "funnel"],
    ativo: true,
    ordem: 1
  },
  {
    data: "11/05/2024",
    dataReal: new Date("2024-05-11"),
    projeto: "Adverse Ventures",
    atualizacoes: [
      {
        texto: "Design da LP das Ventures",
        tipo: "texto"
      },
      {
        texto: "3 marcas ativas no ecossistema (rev share deals based on scalable performance)",
        tipo: "texto"
      },
      {
        texto: "Rodando primeiro teste do protocolo de CRO na Woom nesse mês",
        tipo: "texto"
      }
    ],
    tags: ["ventures", "landing-page", "cro", "rev-share"],
    ativo: true,
    ordem: 2
  },
  {
    data: "11/05/2024",
    dataReal: new Date("2024-05-11"),
    projeto: "DTC eCom Brand (DMAIS)",
    atualizacoes: [
      {
        texto: "Primeiros feedbacks positivos dos testes realizados",
        tipo: "texto"
      },
      {
        texto: "Principal argumento: rende muito (\"300ml e eu lavei a cozinha toda sem esforço\")",
        tipo: "texto"
      },
      {
        texto: "Next Steps: Start Pesquisa de Copywriting (Produto, Persona e Mercado)",
        tipo: "texto"
      }
    ],
    tags: ["dmais", "dtc", "feedback", "copywriting"],
    ativo: true,
    ordem: 3
  },
  {
    data: "11/05/2024",
    dataReal: new Date("2024-05-11"),
    projeto: "Advese",
    atualizacoes: [
      {
        texto: "Deploy mvp programa de aceleração para infoprodutos",
        tipo: "texto"
      },
      {
        texto: "Novos contratos com % de rev share (3 novas marcas no ecossistema)",
        tipo: "texto"
      }
    ],
    tags: ["adverse", "mvp", "infoprodutos", "contratos"],
    ativo: true,
    ordem: 4
  },
  {
    data: "19/04/25",
    dataReal: new Date("2025-04-19"),
    projeto: "report-bot",
    atualizacoes: [
      {
        texto: "Start replicar script do bot do meta para o google ads",
        tipo: "texto"
      },
      {
        texto: "Media mix modeling como base teoria para bot analytics + ai",
        tipo: "texto"
      }
    ],
    tags: ["report-bot", "google-ads", "meta", "mmm", "ai"],
    ativo: true,
    ordem: 5
  },
  {
    data: "18/04/25",
    dataReal: new Date("2025-04-18"),
    projeto: "report-bot",
    atualizacoes: [
      {
        texto: "Deploy bot report do Meta 100% automatizado",
        tipo: "texto"
      },
      {
        texto: "Corrigido problema que não deixava o cloud ler o credentials.json (gc.ignore estava com o arquivo inserido)",
        tipo: "texto"
      },
      {
        texto: "Criado as automações de exec. do script com GC Jobs",
        tipo: "texto"
      },
      {
        texto: "Criado os agendamentos das automações para report semanal e 3 dias",
        tipo: "texto"
      }
    ],
    tags: ["report-bot", "deploy", "automation", "meta", "gcp"],
    ativo: true,
    ordem: 6
  }
];

const seedLogs = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/builders-code-cms');
    console.log('Conectado ao MongoDB');

    // Limpar dados existentes
    console.log('Limpando logs existentes...');
    await Log.deleteMany({});

    // Inserir novos dados
    console.log('Inserindo logs...');
    const logs = await Log.insertMany(logsData);
    
    console.log(`✅ ${logs.length} logs inseridos com sucesso!`);
    
    // Listar logs inseridos
    logs.forEach((log, index) => {
      console.log(`${index + 1}. ${log.data} - ${log.projeto} (${log.atualizacoes.length} updates)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed dos logs:', error);
    process.exit(1);
  }
};

// Executar se o script for chamado diretamente
if (require.main === module) {
  seedLogs();
}

module.exports = seedLogs;