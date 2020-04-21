'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var visitorCountSchema = new Schema({
    visitorIp: {
        type: String,
        required: true,
        unique: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },

}, { runSettersOnQuery: true });

module.exports = mongoose.model('visitorCountSchemas', visitorCountSchema);
