var createError = require('http-errors');
var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var dotenv = require('dotenv').config() // ← hier raus

const { getSettings } = require("./utils/settings");

var indexRouter = require('./routes/index');
var moviesRouter = require('./routes/movie');
var gamesRouter = require('./routes/game');
var booksRouter = require('./routes/book');
var seriesRouter = require('./routes/series');

var app = express();

var list = require("./routes/listmanager.js");
var t = require("./routes/database.js");
t.setup_database();

app.use((req, res, next) => {
    res.locals.settings = getSettings();
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({}));

app.use('/', indexRouter);
app.use('/movie', moviesRouter);
app.use('/game', gamesRouter);
app.use('/book', booksRouter);
app.use('/series', seriesRouter);
app.use('/api', list);

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
