//设置环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// process.env.NODE_ENV = process.env.NODE_ENV || 'production';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var bodyParser = require('body-parser');
var cors = require('cors');
var errorhandler = require('errorhandler');
var fs = require('fs');
var config = require('./config/env');
var Redis = require('ioredis');
var mongoose = require('mongoose');
mongoose.connect(config.database.uri, config.database.options);
var db = mongoose.connection;
db.once("open", function (cb) {
    console.log("connect success!")
});

//redis
new Redis(config.redis);

// require models
var modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.enable('trust proxy');
var options = {
    origin: true,
    credentials: true
};
app.use(cors(options));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
var sessionOption = {
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: true, maxAge: 24 * 60 * 60 * 1000}
};
if (process.env.NODE_ENV === 'production') {
    Object.assign(sessionOption, {
        store: new MongoStore({
            url: 'mongodb://***:****@127.0.0.1/todo',
            ttl: 14 * 24 * 60 * 60, //14天,
        })
    });
}
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public/dist')));
app.get("/main",function (req, res) {
	res.redirect("/")
});

require('./routes/router')(app);

// error handlers
if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler());
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        // res.render('error', {
        //     message: err.message,
        //     error: err
        // });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    // res.render('error', {
    //     message: err.message,
    //     error: {}
    // });
});

// Start server
app.listen(config.port, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    console.log('http://localhost:%d/', config.port);
});

module.exports = app;
