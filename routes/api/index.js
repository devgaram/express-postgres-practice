const express = require('express');
const router  = express.Router();

const auth = require('./auth');
const blog = require('./blog');
const memo = require('./memo');

router.use('/auth', auth);
router.use('/blog', blog);
router.use('/memo', memo);

module.exports = router;