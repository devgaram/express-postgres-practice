const express = require('express');
const createError = require('http-errors');
const helmet = require('helmet');
const cors = require('cors');

const routes = require('../routes');
const whitelist = ['http://192.168.99.100:3000', 'http://127.0.0.1:3000','http://localhost:3000', 'https://react-project-blog.herokuapp.com']; 

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    console.log(origin);
    if (origin == null || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', routes);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res) {
  console.log('err', err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.sendStatus(err.status);
});

module.exports = app;