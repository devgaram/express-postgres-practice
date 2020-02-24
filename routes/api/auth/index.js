const express = require('express');
const router = express.Router();
const authCtrl = require('./auth.controller');
const authware = require('../../../middlewares/auth');

router.get('/', function(req, res) {
  res.send('auth')
    .status(201)
    .json({
      code: 200,
      message: 'pass'
    });
});

// 미들웨어
router.use('/login', authCtrl.isFirstLogin);

router.post('/login', authCtrl.login);

router.post('/logout', authware.verifyToken, authCtrl.logout);

router.post('/check', authware.verifyToken, authCtrl.check)

module.exports = router;