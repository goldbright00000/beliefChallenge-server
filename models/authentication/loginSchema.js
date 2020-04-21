'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var loginSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    userId: {
        type: ObjectId,
        required: true
    }
}, { runSettersOnQuery: true });

module.exports = mongoose.model('LoginSchemas', loginSchema);
