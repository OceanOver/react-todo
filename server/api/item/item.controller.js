var mongoose = require('mongoose');
var Item = mongoose.model('Item');
var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');

/*
 * items of user
 */
function itemsOfUser(userId, callback) {
    return Item.findAsync({'owner_id': userId}).then(function (items) {
        callback(null, items);
    }).catch(function (err) {
        callback(err);
    });
}
var itemsOfUserAsync = Promise.promisify(itemsOfUser);

/*
 * item list
 */
exports.list = function (req, res, next) {
    var userId = req.user._id;
    Item.countAsync({'owner_id': userId}).then(function (count) {
        if (count == 0) {
            var result = {'state': 1001, 'message': '暂无内容'};
            return res.status(200).json(result);
        } else {
            // 0:all 1:active 2:completed
            var type = req.body.type;
            var condition = {};
            if (type === '1') {
                condition = {'owner_id': userId, 'completed': false};
            } else if (type === '2') {
                condition = {'owner_id': userId, 'completed': true};
            }
            // _id 生成算法中已经包含了创建的时间，按时间倒序
            Item.findAsync(condition, null, {sort: [{_id: -1}]}).then(function (items) {
                var result = {'state': 1000, 'message': '成功获取列表', 'list': items};
                return res.status(200).json(result);
            }).catch(function (err) {
                return next(err);
            });
        }
    });
}

/*
 * add item
 */
exports.addItem = function (req, res, next) {
    var owner_id = req.user._id;
    var content = req.body.content;
    var note = req.body.note ? req.body.note : '';
    var createTime = moment().utc().format('YYYYMMDDHHmmss');
    var expireTime = moment().add(1, 'days').utc().format('YYYYMMDDHHmmss');
    var error_message;
    if (!content) {
        error_message = '内容不能为空.';
    }
    if (error_message) {
        return res.send({state:1001,message: error_message});
    }
    var item = new Item({
        owner_id: owner_id,
        content: content,
        createTime: createTime,
        expireTime: expireTime,
        note: note
    });
    Item.createAsync(item).then(function (item) {
        var result = {'state': 1000, 'message': '添加成功', 'item': item};
        return res.json(result);
    }).catch(function (err) {
        return next(err);
    });
}

/*
 * modify item
 */
exports.modifyItem = function (req, res, next) {
    var itemId = req.body.id;
    var content = req.body.content;
    var expireTime = req.body.expireTime;
    var modifyItem = {};
    if (content && content != '') {
        _.assign(modifyItem, {content: content});
    }
    if (expireTime && expireTime != '') {
        _.assign(modifyItem, {expireTime: expireTime});
    }
    Item.findByIdAndUpdateAsync(itemId, modifyItem).then(function (item) {
        if (modifyItem.content) {
            item.content = content;
        }
        if (modifyItem.expireTime) {
            item.expireTime = expireTime;
        }
        var result = {'state': 1000, 'message': '修改成功！', 'item': item};
        return res.status(200).json(result);
    }).catch(function (err) {
        return next(err);
    });
}

/*
 * complete items(item)
 */
exports.completeItem = function (req, res, next) {
    var id = req.body.id;
    var completeTime = moment().utc().format('YYYYMMDDHHmmss');
    //update
    Item.findByIdAndUpdateAsync(id, {$set: {completed: true, completeTime: completeTime}}).then(function (item) {
        var result = {'state': 1000, 'message': '完成任务！', completeTime: completeTime};
        return res.status(200).json(result);
    }).catch(function (err) {
        return next(err);
    });
}

/**
 * clear item
 */
exports.clearItem = function (req, res, next) {
    var itemId = req.body.id;
    var completed = req.body.completed;
    Item.update({'_id': itemId}, {completed: completed}, {multi: true}).then(function (raw) {
        var result = {'state': 1000, 'message': '完成任务！'};
        return res.status(200).json(result);
    }).catch(function (err) {
        return next(err);
    });
}

/**
 * clear all item
 */
exports.clearAll = function (req, res, next) {
    var userId = req.user._id;
    var completed = req.body.completed;
    if (!completed) {
        return res.status(400).json({state: 1002, message: '请求参数格式有误'});
    }
    //batch update
    Item.updateAsync({owner_id: userId}, {$set: {completed: completed}}, {multi: true}).then(function (raw) {
        var result = {'state': 1000, 'message': '完成任务！', list: raw};
        return res.status(200).json(result);
    }).catch(function (err) {
        return next(err);
    });
}

/*
 * delete items(item)
 */
exports.deleteItems = function (req, res, next) {
    var itemIds = req.body.ids; //id数组
    Item.removeAsync({_id: {$in: itemIds}}).then(function () {
        var result = {'state': 1000, 'message': '删除任务成功！'};
        return res.status(200).json(result);
    }).catch(function (err) {
        return next(err);
    });
}

/*
 * delete item
 */
exports.deleteItem = function (req, res, next) {
    var itemId = req.body.id;
    Item.findByIdAndRemoveAsync(itemId).then(function () {
        var result = {'state': 1000, 'message': '删除任务成功！'};
        return res.status(200).json(result);
    }).catch(function (err) {
        return next(err);
    });
}

function countList(condition, callback) {
    Item.countAsync(condition).then(function (count) {
        if (count > 0) {
            callback(null, count);
        } else {
            var err = new Error('noData');
            callback(err);
        }
    })
}

var countListAsync = Promise.promisify(countList);

/*
 * delete complete item
 */
exports.deleteComplete = function (req, res, next) {
    var userId = req.user._id;
    var condition = {owner_id: userId, completed: true};
    countListAsync(condition).then(function (count) {
        return Item.removeAsync(condition);
    }).then(function () {
        return itemsOfUserAsync(userId);
    }).then(function (list) {
        var result = {'state': 1000, 'list': list};
        return res.json(result);
    }).catch(function (err) {
        if (err.message == 'noData') {
            return res.json({state: 1001, message: '暂无已完成数据'});
        }
        return next(err);
    });
}

exports.deleteExpire = function (req, res, next) {
    var userId = req.user._id;
    var current = moment.utc().format('YYYYMMDDHHmmss');
    var condition = {owner_id: userId, expireTime: {$lt:current}}
    countListAsync(condition).then(function (count) {
        return Item.removeAsync(condition);
    }).then(function () {
        return itemsOfUserAsync(userId);
    }).then(function (list) {
        var result = {'state': 1000, 'list': list};
        return res.json(result);
    }).catch(function (err) {
        if (err.message == 'noData') {
            return res.json({state: 1001, message: '暂无逾期数据'});
        }
        return next(err);
    });
}

/*
 * item left
 */
exports.itemLeft = function (req, res, next) {
    var userId = req.user._id;
    Item.countAsync({owner_id: userId, completed: false}).then(function (count) {
        var result = {'state': 1000, 'message': '请求成功！', 'count': count};
        return res.status(200).json(result);
    }).catch(function (err) {
        return next(err);
    });
}

/**
 * completed items list
 */
exports.completedList = function (req, res, next) {
    var id = req.user._id;
    var currentPage = parseInt(req.body.page);
    currentPage = (currentPage > 0) ? currentPage : 1;
    var itemsPerPage = parseInt(req.body.items)
    itemsPerPage = (itemsPerPage > 0) ? itemsPerPage : 10;
    var startRow = (currentPage - 1) * itemsPerPage;

    const condition = {owner_id: id, completed: true}
    Item.find(condition)
        .skip(startRow)
        .limit(itemsPerPage)
        .exec().then(function (list) {
        return Item.countAsync(condition).then(function (count) {
            return res.status(200).json({state: 1000, list: list, count: count});
        });
    }).then(null, function (err) {
        return next(err);
    });
}

