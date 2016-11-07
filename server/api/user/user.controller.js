var mongoose = require('mongoose');
var User = mongoose.model('User');
var Redis = require('ioredis');
var redis = new Redis();
var qiniu = require('qiniu');
var config = require('../../config');

/*
 user register
 */
exports.register = function (req, res, next) {
    //替换全部空格为空
    var username = req.body.username ? req.body.username.replace(/(^\s+)|(\s+$)/g, '') : '';
    var password = req.body.password ? req.body.password.replace(/(^\s+)|(\s+$)/g, '') : '';
    var message;
    if (username === '') {
        message = '用户名不能为空';
    } else if (password === '') {
        message = '密码不能为空';
    }
    if (message) {
        return res.status(422).json({state: 1001, message: message});
    }
    var newUser = new User();
    newUser.username = username;
    newUser.password = password;
    newUser.saveAsync().then(function (user) {
        return res.status(200).json({state: 1000, user: user});
    }).catch(function (err) {
        var message = err.message;
        if (message.indexOf('duplicate')) {
            return res.status(200).json({state: 1002, message: '用户名已存在'});
        }
        return next(err);
    });
}

/*
 logout
 */
exports.logout = function (req, res) {
    var id = req.user._id;
    var pipeline = redis.pipeline();
    pipeline.del(id);
    pipeline.exec(function (err, results) {
        if (results[0][1] == 1) {
            return res.json({state: 1000})
        }
        return res.json({state: 1001, message: '未能成功注销'})
    });
}

/*
 modify password
 */
exports.modifyPassword = function (req, res, next) {
    var password = req.body.password;
    var newPassword = req.body.newPassword;
    var user = req.user;
    if (!user.verifyPassword(password)) {
        return json({state: 1001, message: '输入的旧密码有误'});
    }
    user.password = newPassword;
    User.findByIdAndUpdateAsync(user._id, user).then(function (user) {
            return res.json({state: 1000, user: user});
        }
    ).catch(function (err) {
        if (err) {
            return next(err);
        }
    });
}

qiniu.conf.ACCESS_KEY = config.qiniuAccessKey;
qiniu.conf.SECRET_KEY = config.qiniuSecretKey;

/**
 * 构建上传策略函数
 * @param bucket 要上传的空间
 * @param key 上传到七牛后保存的文件名
 */
function uptoken(bucket) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket);
    // putPolicy.mimeLimit = 'image/jpeg;image/png';
    //设置回调的url以及需要回调给业务服务器的数据
    // putPolicy.callbackUrl = 'http://your.domain.com/callback';
    // putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
    return putPolicy.token();
}

exports.getUptoken = function (req, res) {
    var token = uptoken(config.qiniuBucket);
    if (token.includes('<PLEASE APPLY YOUR ACCESS KEY>')) {
        return res.json({state: 1001, message: '获取上传凭证失败'});
    }
    return res.json({uptoken: token, state: 1000});
}

/**
 * save headIcon url
 */
exports.saveHeadIcon = function (req, res, next) {
    var headIcon = req.body.headIcon;
    var user = req.user;
    user.headIcon = headIcon;
    User.findByIdAndUpdateAsync(user._id, user).then(function (user) {
            return res.json({state: 1000, user: user});
        }
    ).catch(function (err) {
        if (err) {
            return next(err);
        }
    });
}
