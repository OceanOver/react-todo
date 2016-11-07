var express = require('express');
var router = express.Router();
var login  = require('./login').login;
var logout = require('./login').logout;

require('./login').setup();

router.post('/',login);

module.exports = router;