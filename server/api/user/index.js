var express = require('express');
var router = express.Router();
var controller = require('./user.controller');
var auth = require('../../auth&login/auth');

router.post('/register',controller.register);
router.post('/logout',auth.authenticate(),controller.logout);
router.post('/modifyPassword',auth.authenticate(),controller.modifyPassword);
router.post('/getUptoken',auth.authenticate(),controller.getUptoken);
router.post('/saveHeadIcon',auth.authenticate(),controller.saveHeadIcon);

module.exports = router;