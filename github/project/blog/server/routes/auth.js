const { Router } = require('express');
const router = Router();
const { 
  isFirstLogin,
  login,
  logout,
  check } = require('../controllers/auth');
const { verifyToken } = require('../middlewares/auth');

router.use('/login', isFirstLogin);
router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.post('/check', verifyToken, check);

module.exports = router;