'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var verificationSchema = new Schema({
    userId:{
        type:ObjectId,
        required:true
    },
    verificationCode:{
        type:Number,
        required:true
    },
    createdDate: {
        type: Date,
        default: Date.now + 10
    },
    tokenStatus:{
        type:Boolean,
        default:true
    }
},
    { runSettersOnQuery: true });

module.exports = mongoose.model('verificationSchemas', verificationSchema);