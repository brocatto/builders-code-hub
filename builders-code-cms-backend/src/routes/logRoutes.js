const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getAllLogs,
  getLog,
  createLog,
  updateLog,
  deleteLog,
  getAllLogsPublic,
  getLogPublic
} = require('../controllers/logController');

// Rotas públicas (para o website)
router.route('/public')
  .get(getAllLogsPublic);

router.route('/public/:id')
  .get(getLogPublic);

// Rotas protegidas (para o CMS admin)
router.use(protect);

// Rotas para logs
router.route('/')
  .get(getAllLogs)
  .post(createLog);

router.route('/:id')
  .get(getLog)
  .patch(updateLog)
  .delete(restrictTo('admin'), deleteLog);

module.exports = router;
