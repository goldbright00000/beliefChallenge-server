/**
 * Created by zain.ahmed on 11/22/2019.
 * @file Login Controller
 * Login Function
 */
"use strict";

const mongoose = require("mongoose"),
    bcrypt = require('bcryptjs'),
    LoginUser = mongoose.model("LoginSchemas"),
    cacheHelper = require("@helpers/util-Cache"),
    utilitiesHelper = require("@helpers/util-utilities"),
    JWTHelper = require("@helpers/util-jwt"),
    RegisterUser = mongoose.model('UserSchemas'),
    GenericProcedure = require("@helpers/util-generic-functions"),
    { _responseWrapper } = require("@helpers/util-response"),
    ActivityLog = require("../activityLog/activityLogController");

/*
 * =====================================================================
 * --------------------------- LOGIN METHODS ---------------------------
 * =====================================================================
 * */

/**
 * @function @loginUserFN
 * @description login for belives challanges.
 * @requires email(string) password(string)
 * */

exports.loginFN = async (req, res) => {

    if (req.body.email && req.body.password) {
        let query = {
            email: req.body.email
        };

        let parameterToGet = "userId password email role";

        let args = {
            query,
            parameterToGet
        };

        let auth = await GenericProcedure._baseFetch(LoginUser, args, "FindOne");

        if (!auth.data)
            return _responseWrapper(
                false,
                "You have entered an invalid email or password",
                400
            );

        if (bcrypt.compareSync(req.body.password, auth.data.password)) {
            let query = {
                email: auth.data.email
            };

            let parameterToGet = "fullName profilePic email ";

            let args_ = {
                query,
                parameterToGet
            };

            let user_ = await GenericProcedure._baseFetch(RegisterUser, args_, "FindOne");
            let obj = {
                ...user_,
                userId: user_.data._id
            }

            // console.log(obj, 'userrrrrrrrrrrr');
            // console.log(auth, 'userrrrrrrrrrrr auth');

            let token = await utilitiesHelper.generateJWTToken(obj);
            let response_data = {
                data: {
                    token,
                    userId: auth.data.userId,
                    role: auth.data.role,
                    fullName: user_.data.fullName,
                    // _id: auth.data._id,
                    email: auth.data.email,
                    profilePic: user_.data.profilePic
                }
            };
            req.userId = auth.data.userId;

            // console.log(req.userId, 'req.userId')
            ActivityLog.setActivityLogFN(
                req,
                "User Login",
                ActivityLog.schemasName["login"] + " login @ belief challenges",
                {}
            );

            return _responseWrapper(
                true,
                "User logged in successfully",
                200,
                response_data
            );
        } else {
            return _responseWrapper(
                false,
                "You have entered an invalid email or password",
                400
            );
        }
    } else {
        return _responseWrapper(false, "requiredAll", 400);
    }
};


/**
 * @function @logoutUserFN
 * @description logout for belives challanges.
 * */

exports.logoutFN = async (req, res) => {
    let apiToken = req.headers["authorization"];
    if (apiToken) {
        await cacheHelper.removeSession(
            cacheHelper.cacheInstance["session-cache"],
            apiToken
        );
        req.userId = req.body.userId
        ActivityLog.setActivityLogFN(
            req,
            "Logout",
            "[" + req.method + "]: logout @ lemostre",
            {}
        );
        return _responseWrapper(true, "Logout successfully", 200);
    } else return _responseWrapper(false, "Authorization token is required", 401);

}


