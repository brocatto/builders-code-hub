const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getAllIdeias,
  getIdeia,
  createIdeia,
  updateIdeia,
  deleteIdeia,
  getAllIdeiasPublic,
  getIdeiaPublic
} = require('../controllers/ideiaController');

// Rotas públicas (para o website)
router.route('/public')
  .get(getAllIdeiasPublic);

router.route('/public/:id')
  .get(getIdeiaPublic);

// Rotas protegidas (para o CMS admin)
router.use(protect);

// Rotas para ideias
router.route('/')
  .get(getAllIdeias)
  .post(createIdeia);

router.route('/:id')
  .get(getIdeia)
  .patch(updateIdeia)
  .delete(restrictTo('admin'), deleteIdeia);

module.exports = router;
