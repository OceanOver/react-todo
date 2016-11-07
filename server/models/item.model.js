var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var itemSchema = new Schema({
    owner_id:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    content: String,
    createTime: String,
    expireTime:String,
    completeTime: String,
    completed: {
        type: Boolean,
        default: false
    },
    note: String
});

itemSchema.virtual('expired')
    .get(function () {
        var currentString = moment().utc().format('YYYYMMDDHHmmss');
        return currentString > this.expireTime
    })

var Item = mongoose.model('Item', itemSchema);
var promise = require('bluebird');
promise.promisifyAll(Item);
promise.promisifyAll(Item.prototype);

module.exports = Item;

