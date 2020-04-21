/**
 * Created by zain.ahmed on 11/22/2019.
 * @file Comment Controller
 * Comment Function
 */

"use strict";
var mongoose = require('mongoose'),
    GenericProcedure = require("@helpers/util-generic-functions"),
    { _responseWrapper } = require('@helpers/util-response'),
    userModel = mongoose.model('UserSchemas'),
    LoginUser = mongoose.model("LoginSchemas"),
    fileUpload = require('@middleware/fileUploadMiddleware'),
    ActivityLog = require('../activityLog/activityLogController');

/*
* =======================================================================
* --------------------------- User METHODS ---------------------------
* =======================================================================
* */


/**
 * @function @fetchUserFN
 * @description fetch user list
 * @requires userid(Number_id) 
 * */


exports.fetchUserFN = async req => {
    if (req.query.userId) {

        let arg = {
            query: {
                _id: req.query.userId
            }
        }
        let fetch_user = await GenericProcedure._baseFetch(
            userModel,
            arg,
            "FindOne"
        );

        if (fetch_user.status) {
            return _responseWrapper(true, "fetchSuccess", 200, fetch_user);
        }
        else {
            return _responseWrapper(false, "notFound", 400);
        }

    }

}


/**
 * @function @fetchUsersFN
 * @description fetch users
 * @requires none
 * */


exports.fetchUsersFN = async req => {

    let arg = {
        query: {}
    }
    let fetch_users = await GenericProcedure._baseCount(
        userModel,
        arg
    );

    if (fetch_users.status) {
        return _responseWrapper(true, "fetchSuccess", 200, fetch_users);
    }
    else {
        return _responseWrapper(false, "notFound", 400);
    }

}


/**
 * @function @updateUserFN
 * @description update user 
 * @requires userId(Number_id)
 * */


exports.updateUserFN = async req => {
    if (req.body.fullName && req.body.email) {
        if (!req.body.profilePic)
            req.body.profilePic = fileUpload.baseUrlGenerator(req);

        let updateObject = {
            ...req.body,
            profilePic: req.body.profilePic
        }
        let args = {
            query: {
                _id: req.body.userId
            },
            updateObject
        }

        let user_profile_udpdate = await GenericProcedure._basePut(userModel, args, 'findOneAndUpdate')
        if (user_profile_udpdate.status) {
            let updateObject = {
                ...req.body
            }
            let args = {
                query: {
                    userId: req.body.userId
                },
                updateObject
            }
            let user_profile_udpdate_ = await GenericProcedure._basePut(LoginUser, args, 'findOneAndUpdate')
            if (user_profile_udpdate_.status) {
                return _responseWrapper(true, "updateSuccess", 200, user_profile_udpdate);
            }
        }


    } else {
        return _responseWrapper(false, "requiredAll", 400);
    }

}

