'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    catIcon:{
        type:Object,
        required: true
    },
    isDeleted:{
        type: Boolean,
        default:false
    },
}, { runSettersOnQuery: true });

module.exports = mongoose.model('CategorySchemas', categorySchema);
