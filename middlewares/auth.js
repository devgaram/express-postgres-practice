const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const auth = req.headers.authorization.split(' ');
    if (auth[1] != 'undefined') {
      req.decoded = jwt.verify(auth[1], process.env.JWT_SECRET);
    } else {
      return res.status(401).json({
        code: 401,
        message: '토큰이 없습니다.'
      });
    }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // 재생성 프로세스 만들기..
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.'
      });      
    }
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다'
    });
  }
};

module.exports = {
  verifyToken
};