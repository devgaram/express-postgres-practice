const { Auth, Token } = require('../../../models');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Promise: crypto.pbkdf2 -> 인코딩된 패스워드 반환
const pbkdf2Promise = (password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 123456, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('base64'));
    });
  });    
}

const jwtSignPromise = (userid, expiresIn, issuer) => {
  return new Promise((resolve, reject) => {
    jwt.sign({userid}, process.env.JWT_SECRET, { expiresIn, issuer }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  })

}

// 처음 로그인한거면 계정 생성하기
module.exports.isFirstLogin = async (req, res, next) => {
  const { userid, password } = req.body;
  let authCount = 0;
  try {
    authCount = await Auth.count();
    if (authCount === 0) {
      let salt = await crypto.randomBytes(64);
      salt = salt.toString('base64');
      let encodedPassword = await pbkdf2Promise(password, salt);  //express await 내부 에러 못잡음 reject catch 처리해야함
      await Auth.create({
        userid, 
        'password': encodedPassword,
        salt   
      });
    }
    next('route');
  } catch (error) {
    next(error);
  }
}

// 로그인 처리
module.exports.login = async (req, res, next) => {
  const { userid, password } = req.body;
  let auth = null;
  try {
    auth = await Auth.findOne({
      attributes: ['salt'],
      where: {
        userid,
      },
    });
    if (auth !== null) {
      let encodedPassword = await pbkdf2Promise(password, auth.salt);
      auth = await Auth.findOne({
        attributes: ['userid'],
        where: {
          userid,
          'password': encodedPassword,
        },        
      });
      if (auth !== null) {
        let accessToken = await jwtSignPromise(userid, '1h', 'react-blog-server');
        let refreshToken = await jwtSignPromise(userid, '14 days', 'react-blog-server')
        await Token.create({ 
          userid, 
          refreshToken,
        });

        // jwtSignPromise(userid, '1h', 'react-blog-server')
        //   .then(token => {
        //     accessToken = token;
        //   })
        //   .catch(err => {
        //     next(err);
        //   })
        // jwtSignPromise(userid, '14 days', 'react-blog-server')
        //   .then(token => {
        //     
        //   })
        //   .catch(err => {
        //     next(err);
        //   })       

        return res
                .status(200)
                .json({
                  code: 200,
                  message: '로그인에 성공했습니다',
                  accessToken
                });
      } else {
        return res.status(401).json({
          code: 401,
          message: '비밀번호가 틀렸어요.'
        });
      }
    } else {
      return res.status(401).json({
        code: 401,
        message: '이 블로그의 주인이 아니네요.'
      });
    }    
  } catch (error) {
    next(error);
  }
}

module.exports.logout = async (req, res, next) => {
  if (req.decoded != null) {
    let nRemoved = await Token.destory({
      where: { userid: req.decoded.userid },
    });
    if (nRemoved > 0)
      return res.status(200).json({
        code: 200,
        message: 'success'
      })
  }
}

module.exports.check = (req, res, next) => {
  if (req.decoded != null) 
    return res.status(200).json({
      code: 200,
      message: 'success'
    });
  else
    return res.status(401).json({
      code: 401,
      message: 'fail'
    });
}