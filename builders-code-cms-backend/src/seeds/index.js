const mongoose = require('mongoose');
const Projeto = require('../models/projetoModel');
const Log = require('../models/logModel');
const Ideia = require('../models/ideiaModel');
require('dotenv').config();

// Dados dos projetos
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

// Dados dos logs
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

// Dados das ideias
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
    descricao: "Explorar modelos de negócio sustentáveis para tornar a adoção de pets financeiramente viável",
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
    descricao: "Implementação de modelos estatísticos para otimizar mix de mídia e atribuição de investimentos em marketing",
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

const runAllSeeds = async () => {
  try {
    console.log('🚀 Iniciando migração de dados...\n');
    
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/builders-code-cms');
    console.log('✅ Conectado ao MongoDB\n');

    console.log('📋 Executando seeds...\n');

    // 1. Migrar Projetos
    console.log('1️⃣ Migrando Projetos...');
    await Projeto.deleteMany({});
    const projetos = await Projeto.insertMany(projetosData);
    console.log(`✅ ${projetos.length} projetos inseridos com sucesso!`);
    projetos.forEach((projeto, index) => {
      console.log(`   ${index + 1}. ${projeto.nome}`);
    });
    console.log('');

    // 2. Migrar Logs
    console.log('2️⃣ Migrando Logs...');
    await Log.deleteMany({});
    const logs = await Log.insertMany(logsData);
    console.log(`✅ ${logs.length} logs inseridos com sucesso!`);
    logs.forEach((log, index) => {
      console.log(`   ${index + 1}. ${log.data} - ${log.projeto} (${log.atualizacoes.length} updates)`);
    });
    console.log('');

    // 3. Migrar Ideias
    console.log('3️⃣ Migrando Ideias...');
    await Ideia.deleteMany({});
    const ideias = await Ideia.insertMany(ideiasData);
    console.log(`✅ ${ideias.length} ideias inseridas com sucesso!`);
    ideias.forEach((ideia, index) => {
      console.log(`   ${index + 1}. ${ideia.titulo} - Status: ${ideia.status}`);
    });
    console.log('');

    console.log('🎉 Migração de dados concluída com sucesso!');
    console.log('\nResumo da migração:');
    console.log('- ✅ 5 Projetos (Adverse, Dmais, ReportBot, ScaleX, Adverse Ventures)');
    console.log('- ✅ 6 Logs de atividade (com datas e updates)');
    console.log('- ✅ 6 Ideias (Life OS SaaS, Creator-led DTC, etc.)');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    throw error;
  } finally {
    // Fechar conexão com MongoDB
    await mongoose.connection.close();
    console.log('\n🔌 Conexão com MongoDB fechada.');
  }
};

// Executar se o script for chamado diretamente
if (require.main === module) {
  runAllSeeds();
}

module.exports = runAllSeeds;