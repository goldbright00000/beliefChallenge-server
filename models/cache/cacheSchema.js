
'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var cacheSchema = new Schema({
    instance: String,
    key: String,
    value: {},
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CacheSchemas', cacheSchema);