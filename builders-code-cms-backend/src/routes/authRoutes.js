const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  login,
  logout,
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

// Rotas públicas
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Rotas protegidas
router.use(protect);
router.get('/me', getMe);
router.post('/logout', logout);
router.patch('/update-password', updatePassword);

module.exports = router;
