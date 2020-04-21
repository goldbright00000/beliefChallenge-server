'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    profilePic:{
        type:Object,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
   
},
    { runSettersOnQuery: true });

module.exports = mongoose.model('UserSchemas', userSchema);