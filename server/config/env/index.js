//环境配置
var path = require('path');
var _ = require('lodash');
var fs = require('fs');

var params = {
    env: process.env.NODE_ENV,
    root: path.normalize(__dirname + '/../../..'),
    port: process.env.PORT || 4000,
    //mongodb数据库配置
    database: {
        options: {
            db: {
                safe: true
            }
        }
    },
    redis: {
        port: 6379,          // Redis port
        host: '127.0.0.1',   // Redis host
        family: 4,           // 4 (IPv4) or 6 (IPv6)
        db: 0
    },
    session: {
        secret: 'todo-secret'
    },
    passportToken: {
        secret: 'todo-secret'
    }
};

var config = _.merge(params, require('./' + process.env.NODE_ENV + '.js') || {});

module.exports = config;
