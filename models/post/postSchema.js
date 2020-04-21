'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var postSchema = new Schema({
    categoryId: {
        type: ObjectId,
        required: true,
    },
    postQuestion: {
        type: String,
        required: true,
    },
    options: [],
    createdBy: {
        type: ObjectId,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPinPost: {
        type: Boolean,
        default: false,
    },
    likes:{
        type:Number,
        default:0
    }
}, { runSettersOnQuery: true });

module.exports = mongoose.model('PostSchemas', postSchema);
