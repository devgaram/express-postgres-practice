const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
//const api = require('./routes/api');
//const db = require('./models');

// if (process.env.NODE_ENV !== 'test') {
//   db.connectDb();
// }

const app = express();

const whitelist = ['http://192.168.99.100:3000', 'http://127.0.0.1:3000','http://localhost:3000', 'https://react-project-blog.herokuapp.com']; 
app.use(cors({
  origin: (origin, callback) => {
    console.log(origin);
    // 나중에 origin == null 지우기
    if (origin == null || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log('err', err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.sendStatus(err.status);
});


module.exports = app;
