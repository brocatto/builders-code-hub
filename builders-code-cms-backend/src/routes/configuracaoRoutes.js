const express = require('express');
const router = express.Router();

const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getAllConfiguracoes,
  getConfiguracao,
  getConfiguracaoPorChave,
  createConfiguracao,
  updateConfiguracao,
  deleteConfiguracao
} = require('../controllers/configuracaoController');

// 🔒 Todas as rotas de configurações são protegidas
router.use(protect);

// 🔑 Rota para buscar configuração por chave (tem que vir antes do /:id)
router.get('/chave/:chave', getConfiguracaoPorChave);

// 📦 Rotas principais
router
  .route('/')
  .get(getAllConfiguracoes)
  .post(restrictTo('admin'), createConfiguracao);

router
  .route('/:id')
  .get(getConfiguracao)
  .patch(restrictTo('admin'), updateConfiguracao)
  .delete(restrictTo('admin'), deleteConfiguracao);

module.exports = router;
