'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var userLikeSchema = new Schema({

    userId: {
        type: ObjectId,
        required: true,
        unique: true
    },
    postId: [],
    createdDate: {
        type: Date,
        default: Date.now
    },

}, { runSettersOnQuery: true });

module.exports = mongoose.model('UserLikeSchemas', userLikeSchema);
