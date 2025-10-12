const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getAllMidias,
  getMidia,
  createMidia,
  updateMidia,
  deleteMidia,
  uploadArquivo
} = require('../controllers/midiaController');

// Todas as rotas de mídia são protegidas
router.use(protect);

// Rotas para mídia
router.route('/')
  .get(getAllMidias)
  .post(uploadArquivo, createMidia);

router.route('/:id')
  .get(getMidia)
  .patch(updateMidia)
  .delete(restrictTo('admin'), deleteMidia);

module.exports = router;
