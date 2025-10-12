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
router.route('/')
  .get(protect, getAllIdeias)
  .post(protect, createIdeia);

router.route('/:id')
  .get(protect, getIdeia)
  .patch(protect, updateIdeia)
  .delete(protect, restrictTo('admin'), deleteIdeia);

module.exports = router;
