var express = require('express');
var router = express.Router();
var controller = require('./item.controller');
var auth = require('../../auth&login/auth');

router.post('/list',auth.authenticate(),controller.list);
router.post('/addItem',auth.authenticate(),controller.addItem);
router.post('/modifyItem',auth.authenticate(),controller.modifyItem);
router.post('/deleteComplete',auth.authenticate(),controller.deleteComplete);
router.post('/deleteItems',auth.authenticate(),controller.deleteItems);
router.post('/deleteItem',auth.authenticate(),controller.deleteItem);
router.post('/clearItem',auth.authenticate(),controller.clearItem);
router.post('/clearAll',auth.authenticate(),controller.clearAll);
router.post('/completeItem',auth.authenticate(),controller.completeItem);
router.post('/itemLeft',auth.authenticate(),controller.itemLeft);
router.post('/deleteExpire',auth.authenticate(),controller.deleteExpire);
router.post('/completedList',auth.authenticate(),controller.completedList);

module.exports = router;