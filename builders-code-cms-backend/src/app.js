const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const dotenv = require('dotenv');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const projetoRoutes = require('./routes/projetoRoutes');
const logRoutes = require('./routes/logRoutes');
const ideiaRoutes = require('./routes/ideiaRoutes');
const secaoRoutes = require('./routes/secaoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const midiaRoutes = require('./routes/midiaRoutes');
const configuracaoRoutes = require('./routes/configuracaoRoutes');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middleware de segurança
app.use(helmet());
app.use(xss());

// Limitar requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições deste IP, tente novamente após 15 minutos'
});
app.use('/api/auth', limiter);

// Middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// CORS - Multiple origins support
const allowedOrigins = [
  'http://localhost:3000', // Website v3 (Create React App)
  'http://localhost:5173', // CMS Frontend (Vite)
  'http://localhost:3001', // Backup CMS Frontend port
  process.env.FRONTEND_URL,
  // URLs da Vercel (adicione as URLs reais dos seus deploys)
  'https://builders-code-v3.vercel.app',
  'https://builders-code-cms-frontend.vercel.app',
  // Domínio personalizado (com e sem www)
  'https://www.builderscode.com.br',
  'https://builderscode.com.br',
  // Permite qualquer subdomínio da Vercel para este projeto
  /https:\/\/.*\.vercel\.app$/
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowedOrigins array or matches regex patterns
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/projetos', projetoRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/ideias', ideiaRoutes);
app.use('/api/secoes', secaoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/midias', midiaRoutes);
app.use('/api/configuracoes', configuracaoRoutes);

// Health check
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API do Builder\'s Code CMS está funcionando!',
    timestamp: new Date()
  });
});

// 404 handler for API routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Não foi possível encontrar ${req.originalUrl} neste servidor!`
  });
});

// Error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ✅ Exporta para funcionar na Vercel
module.exports = app;
