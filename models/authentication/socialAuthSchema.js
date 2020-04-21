/**
 * Created by zain.ahmed on 12/3/2019.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var socialAuthSchema = new Schema({
    socialReferenceId: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    accessToken: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('SocialAuthSchemas', socialAuthSchema);