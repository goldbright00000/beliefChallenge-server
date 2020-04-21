/**
 * Created by zain.ahmed on 01/09/2020.
 * @file visitorCount Controller
 * visitorCount Function
 */

"use strict";
var mongoose = require('mongoose'),
    GenericProcedure = require("@helpers/util-generic-functions"),
    { _responseWrapper } = require('@helpers/util-response'),
    visitorCountSchema = mongoose.model('visitorCountSchemas'),
    ActivityLog = require('../activityLog/activityLogController');

/*
* ============================================================================
* --------------------------- VisitorCount METHODS ---------------------------
* ============================================================================
* */


/**
 * @function @postVisitorCountFN
 * @description post visitor ip
 * @requires userid(Number_id) 
 * */


exports.postVisitorCountFN = async req => {
    if (req.userIp) {
        // console.log(req.userIp)
        // console.log(req.headers)
        req.body.visitorIp = req.userIp
        let new_visitor = await GenericProcedure._basePost(visitorCountSchema, req.body);
        if (!new_visitor.status) {
            if (new_visitor.error['code'] == 11000)
                return _responseWrapper(true, 'alreadyExist', 200)
            return _responseWrapper(false, new_user.error['message'], 400)
        }
        return _responseWrapper(true, 'createSuccess', 201)
    }
    else {
        return _responseWrapper(false, "requiredAll", 400);
    }
}



/**
 * @function @fetchVisitoCountFN
 * @description fetch visitors
 * */


exports.fetchVisitoCountFN = async req => {
    let fetchVisitorCount = await GenericProcedure._baseCount(visitorCountSchema, {})
    return _responseWrapper(true, "fetchSuccess", 200, fetchVisitorCount);
}






