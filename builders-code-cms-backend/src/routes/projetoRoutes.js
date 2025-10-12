const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getAllProjetos,
  getProjeto,
  createProjeto,
  updateProjeto,
  deleteProjeto,
  getAllProjetosPublic,
  getProjetoPublic
} = require('../controllers/projetoController');

// Rotas públicas (para o website)
router.route('/public')
  .get(getAllProjetosPublic);

router.route('/public/:id')
  .get(getProjetoPublic);

// Rotas protegidas (para o CMS admin)
router.route('/')
  .get(protect, getAllProjetos)
  .post(protect, createProjeto);

router.route('/:id')
  .get(protect, getProjeto)
  .patch(protect, updateProjeto)
  .delete(protect, restrictTo('admin'), deleteProjeto);

module.exports = router;
