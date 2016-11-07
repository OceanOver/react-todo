var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var auth = require('./auth');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Redis = require('ioredis');
var redis = new Redis();

exports.setup = function () {
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function (username, password, done) {
        User.findOneAsync({username: username}).then(function (user) {
            if (!user) {
                return done(null, false, '用户名不存在');
            }
            if (!user.verifyPassword(password)) {
                return done(null, false, '密码错误');
            }
            return done(null, user);
        }).catch(function (err) {
            if (err) {
                return done(err);
            }
        });
    }));
}

exports.login = function (req, res) {
    passport.authenticate('local', function (err, user, message) {
            if (err) {
                return res.json({state: 1001, message: message});
            }
            if (!user) {
                return res.json({state: 1002, message: message});
            }
            var expire = 24 * 60 * 60;
            var token = auth.generateToken(user._id);
            redis.set(user._id, token, 'ex', expire);
            res.cookie('token', token);
            return res.json({state: 1000,user:user});
        }
    )(req, res);
}
