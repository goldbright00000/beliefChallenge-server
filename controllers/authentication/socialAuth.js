/**
 * Created by zain.ahmed on 1/11/2018.
 * @file Social Auth Controller
 * Social Auth Functions
 */
'use strict';

var mongoose = require('mongoose'),
    RegisterUser = mongoose.model('UserSchemas'),
    socialAuth = mongoose.model('SocialAuthSchemas'),
    ActivityLog = require('../activityLog/activityLogController'),
    { _responseWrapper } = require('@helpers/util-response'),
    GenericProcedure = require('@helpers/util-generic-functions'),
    utilitiesHelper = require('@helpers/util-utilities');

/* *
 * =====================================================================
 * ----------------------- SOCIAL AUTH METHODS -------------------------
 * =====================================================================
 * */

/**
 * @function @socialAuthFN
 * @description login/register user from any social account
 * @requires accessToken(string) socialReferenceId(string) socialReferenceId(string) platform(string)
 * */
exports.socialAuthFN = async (req) => {
    if (req.body.accessToken && req.body.email && req.body.name && req.body.socialReferenceId && req.body.platform) {
        req.body.fullName = req.body.name
        req.body.profilePic = 'https://api.beliefchallenge.com/uploads/profile-default.png'

        let new_user = await GenericProcedure._basePost(RegisterUser, req.body);

        if (!new_user.status) {
            if (new_user.error['code'] == 11000) {

                // return _responseWrapper(false, 'alreadyExist', 409)
                let query = {
                    email: req.body.email
                };

                let parameterToGet = "_id email fullName profilePic";

                let args = {
                    query,
                    parameterToGet
                };
                let user_ = await GenericProcedure._baseFetch(RegisterUser, args, "FindOne");
                let obj = {
                    ...user_,
                    userId: user_.data._id
                }
                let token = await utilitiesHelper.generateJWTToken(obj);
                // console.log(user_)
                let response_data = {
                    data: {
                        token,
                        userId: user_.data._id,
                        fullName: user_.data.fullName,
                        email: user_.data.email,
                        profilePic: user_.data.profilePic,
                        role: 'user'
                    }
                };

                req.body.userId = user_.data._id
                ActivityLog.setActivityLogFN(
                    req,
                    "User Socail Login",
                    ActivityLog.schemasName["social-login"] + " social login @ belief challenges",
                    {}
                );
                return _responseWrapper(true, 'LoginSuccess', 200, response_data)
            }

        }

        // Creating a social user
        let socialObj = {
            socialReferenceId: req.body.socialReferenceId,
            platform: req.body.platform,
            userId: new_user.data._id,
            accessToken: req.body.accessToken
        };

        let new_social_user = await GenericProcedure._basePost(socialAuth, socialObj);

        if (!new_social_user)
            return _responseWrapper(false, new_social_user.error['message'], 400)

        let obj = {
            ...new_user,
            userId: new_user.data._id
        }

        let token = await utilitiesHelper.generateJWTToken(obj);
        let response_data = {
            data: {
                // token,
                // userId: new_user.data._id,
                // fullName: new_user.data.fullName,
                // email: new_user.data.email

                token,
                userId: new_user.data._id,
                fullName: new_user.data.fullName,
                email: new_user.data.email,
                profilePic: new_user.data.profilePic,
                role: 'user'
            }
        };
        req.userId = new_user.data._id
        ActivityLog.setActivityLogFN(
            req,
            "User Socail Login",
            ActivityLog.schemasName["social-login"] + " social login @ belief challenges",
            {}
        );

        return _responseWrapper(true, 'LoginSuccess', 200, response_data)

    }
    else {
        return _responseWrapper(false, 'requiredAll', 400)
    }
};
