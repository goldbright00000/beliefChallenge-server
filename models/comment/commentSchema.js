'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    postId:{
        type:ObjectId,
        required: true,
    },
    createdBy:{
        type:ObjectId,
        required:true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { runSettersOnQuery: true });

module.exports = mongoose.model('CommentSchemas', commentSchema);
