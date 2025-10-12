const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getAllSecoes,
  getSecao,
  createSecao,
  updateSecao,
  deleteSecao
} = require('../controllers/secaoController');

// Todas as rotas de seções são protegidas
router.use(protect);

// Rotas para seções
router.route('/')
  .get(getAllSecoes)
  .post(createSecao);

router.route('/:id')
  .get(getSecao)
  .patch(updateSecao)
  .delete(restrictTo('admin'), deleteSecao);

module.exports = router;
