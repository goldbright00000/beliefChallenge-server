
/*
 * Created by zain.ahmed on 11/22/2019.
*/

'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var activityLogSchema = new Schema({
    userId: {
        type: ObjectId,
        required: true
    },
    ipAddress: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: ''
    },
    description: {
        type: String,
        default: ''
    },
    ref: {}
});

module.exports = mongoose.model('ActivityLogSchemas', activityLogSchema);