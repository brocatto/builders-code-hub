const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getAllCategorias,
  getCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getCategoriaAnalytics,
  reorderCategorias
} = require('../controllers/categoriaController');

// Todas as rotas de categorias são protegidas
router.use(protect);

// Rotas para categorias
router.route('/')
  .get(getAllCategorias)
  .post(createCategoria);

// Rota para analytics
router.get('/analytics', getCategoriaAnalytics);

// Rota para reordenação
router.patch('/reorder', reorderCategorias);

router.route('/:id')
  .get(getCategoria)
  .patch(updateCategoria)
  .delete(restrictTo('admin'), deleteCategoria);

module.exports = router;
