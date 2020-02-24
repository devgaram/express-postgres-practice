const app = require('../app');
const request = require('supertest');
const db = require('../models');

// 밑에꺼 쓰면 Async callback was not invoked within the 5000ms timeout specified by jest.setTimeout.에러뜸
// beforeAll(async done => {
//   await db.connectDb();
//   console.log('Jest Starting! DB connection Complete!')
// }, 50000);

// afterAll(async () => {
//   db.disconnectDb();
// });

describe('Login tests', () => {
  it('POST /api/auth/login, First Login, Create User', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        userid: 'testid',
        password: 'testpwd'
      })
      .set('Accept', 'application/json')
      .end((error, response) => {
        if (error) return done(error);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('로그인에 성공했습니다');
        done();
      })

  });

  it('POST /api/auth/login, wrong userid', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        userid: 'testid111',
        password: 'testpwd'
      })
      .set('Accept', 'application/json')
      .end((error, response) => {
        if (error) return done(error);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('이 블로그의 주인이 아니네요.');
        done();
      })
    });

  it('POST /api/auth/login, wrong password', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        userid: 'testid',
        password: 'testpwd111'
      })
      .set('Accept', 'application/json')
      .end((error, response) => {
        if (error) return done(error);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('비밀번호가 틀렸어요.');
        done();
      })
    });

  it('POST /api/auth/login, Login success', done => {
    request(app)
      .post('/api/auth/login')
      .send({
        userid: 'testid',
        password: 'testpwd'
      })
      .set('Accept', 'application/json')
      .end((error, response) => {
        if (error) return done(error);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('로그인에 성공했습니다');
        done();
      })
   
    });

  afterAll(async () => {
    await db.Auth.destroy({
      where: {
        userid: 'testid'
      }
    });
    console.log('testid 삭제');
  });
})