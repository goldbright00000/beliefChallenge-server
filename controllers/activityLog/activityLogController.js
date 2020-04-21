/**
 *  Created by zain.ahmed on 11/22/2019.
 */

'use strict';

const mongoose = require('mongoose'),
    ActivityLogModel = mongoose.model('ActivityLogSchemas'),
    GenericProcedure = require('@helpers/util-generic-functions'),
    { _responseWrapper } = require('@helpers/util-response');

exports.schemasName = {
    'login': '[LoginSchemas]',
    'category': '[CategorySchemas]',
    'user': '[UserSchemas]',
    'comment': '[CommentSchemas]',
    'social-login': '[SocialAuthSchemas]',
    'post': '[PostSchemas]'
};



/*
 * =====================================================================
 * ---------------------- ACTIVITY LOG METHODS -------------------------
 * =====================================================================
 * */

exports.setActivityLogFN = async (req, title, description, ref) => {
    var object = {
        ipAddress: req.userIp,
        userId: req.userId ? req.userId : req.userIp,
        // userId: req.body.userId ? req.body.userId : req.userIp,
        title: title,
        description: '[' + req.method + ']:' + description,
        ref: ref
    };
    
    if (title) {
        let new_activity_log = await GenericProcedure._basePost(ActivityLogModel, object)
        if (!new_activity_log.status)
            console.log("Activity log not created!")
        console.log("Activity log created successfully.");
    } else {
        console.log('Activity Log @ Please fill all the required fields')
    }
};

exports.getActivityLogsFN = async (req, res) => {

    var query = {

    };

    req.query.skip = Number(req.query.skip);
    req.query.limit = Number(req.query.limit);

    if (req.query.skip >= 0 && req.query.limit > 0) {
        if (req.query.id) {
            query.userId = req.query.id
        } else {
            query = {}
        }

        let parameterToGet = "-__v"

        let args = {
            query,
            parameterToGet,
            extra: {
                skip: req.query.skip,
                limit: req.query.limit
            }
        }

        let activity_logs = await GenericProcedure._baseFetch(ActivityLogModel, args, 'FindWithCount')

        if (!activity_logs.status)
            return _responseWrapper(false, activity_logs.error['message'], 400);
        return _responseWrapper(true, "fetchSuccess", 200, activity_logs)

    } else
        return _responseWrapper(false, "requiredAll", 400)

};

