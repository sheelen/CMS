var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

require('./models/models.js');
var passport= require('passport');
var authenticate=require('./routes/authenticate')(passport);
var index = require('./routes/index');
var privilege = require('./routes/privilege');
var profile = require('./routes/profile');
var conference = require('./routes/conference');
var submission = require('./routes/submission');
var editConferenceChair = require('./routes/editConferenceChair');
var review = require('./routes/review');


var app = express();
var sessionOptions = {
  secret: "secret",
  resave: true,
  saveUninitialized: false
};

app.use(session(sessionOptions));

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/MyCMS");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

//// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);
//app.use('/', routes);
//app.use('/users', users);

app.get('/uploads/*', function(req, res){
  var filename = __dirname+req.url;
  var readStream = fs.createReadStream(filename);

  readStream.on('open', function () {
    readStream.pipe(res);
  });
  readStream.on('error', function(err) {
    res.status(500).send("<html><body><h1>No submission made by this user</h1></body></html>");
  });
});

app.use('/',index);
app.use('/users', authenticate);
app.use('/priv',privilege);
app.use('/profile',profile);
app.use('/conf',conference);
app.use('/submission',submission);
app.use('/editConf',editConferenceChair);
app.use('/review',review);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
