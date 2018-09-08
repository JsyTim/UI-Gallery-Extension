const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');

// mongoDB
const mongoose = require('mongoose');
//const mongoDB = process.env.MLAB_API_LINK;
const mongoDB = 'mongodb://tony970412:qq649114807@ds243212.mlab.com:43212/mygallery';
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
require('./models/widget');
require('./models/count');

const homeRouter = require('./routes/home');
//const indexRouter = require('./routes/index');
const searchRouter = require('./routes/search');
const aboutRouter = require('./routes/about');
const contactRouter = require('./routes/contact');
const detailRouter = require('./routes/detail');  // test
const compareRouter = require('./routes/compare');
const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

//app.use('/', indexRouter);
app.use('/',homeRouter);
app.use('/search', searchRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/detail', detailRouter);
app.use('/compare',compareRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    let msg = req.app.get('env') ? 'ERROR:' + err.message : '';
    console.log(err);

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
