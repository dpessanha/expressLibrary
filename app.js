const createError   = require('http-errors');
const express       = require('express');
const mtdOvrrd      = require('method-override');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const mongoose      = require('mongoose');

const indexRouter   = require('./routes/index');
const usersRouter   = require('./routes/users');
const catalogRouter = require('./routes/catalog');

const app = express();

// Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1/expressLibrary';
mongoose.connect(mongoDB, { useNewUrlParser: true });
// Get mongoose to use the global promise library
mongoose.Promise = global.Promise;
// Get the default connection
var db = mongoose.connection;
// Bind connection to error event
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(mtdOvrrd('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
