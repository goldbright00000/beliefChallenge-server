/**
 * Created by zain.ahmed on 11/22/2019.
 * @file User Controller
 * Signup Function
 */
'use strict';

var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    LoginUser = mongoose.model('LoginSchemas'),
    RegisterUser = mongoose.model('UserSchemas'),
    utilitiesHelper = require('@helpers/util-utilities'),
    { _responseWrapper } = require('@helpers/util-response'),
    salt = bcrypt.genSaltSync(10),
    ActivityLog = require('../activityLog/activityLogController'),
    EmailDomainValidator = require("email-domain-validator"),
    GenericProcedure = require('@helpers/util-generic-functions');

/*
 * =====================================================================
 * ------------------------- REGISTER METHODS --------------------------
 * =====================================================================
 * */

 /**
* @function @VerifyDomain
* @description verify email domin
* @requires email(string) code(number)
**/

let VerifyDomain = async (email) => {
    try {
        let resu = await EmailDomainValidator.validate(email)
        return resu
    } catch (error) {
        return error
    }
}

/**
 * @function @registerUserFN
 * @description register new user
 * @requires fullName(string) email(string) password(string)
 * */
exports.signupFN = async (req) => {

    if (req.body.fullName && req.body.email && req.body.password) {

        let email_verified = await VerifyDomain(req.body.email);
        if (email_verified.isValidDomain) {
            !req.body.role ? req.body.role = 'user' : req.body.role;
            // req.body.profilePic = 'http://apibc.cexpert.co.uk/uploads/profile-default.png'
            req.body.profilePic = 'https://api.beliefchallenge.com/uploads/profile-default.png'
            var hash = bcrypt.hashSync(req.body.password, salt);
    
            req.body.password = hash;
    
            //Register new user
            let new_user = await GenericProcedure._basePost(RegisterUser, req.body);
            if (!new_user.status) {
                if (new_user.error['code'] == 11000)
                    return _responseWrapper(false, 'alreadyExist', 409)
                return _responseWrapper(false, new_user.error['message'], 400)
            }
            req.userId = new_user._id;
    
    
            let authObject = {
                userId: new_user._id,
                ...req.body
            }
    
            // Create user auth
            let new_user_auth = await GenericProcedure._basePost(LoginUser, authObject);
            let obj = {
                ...new_user,
                userId: new_user.data._id
            }
    
            if (!new_user_auth.status)
                return _responseWrapper(false, new_user_auth.error['message'], 400)
    
            let token = await utilitiesHelper.generateJWTToken(obj);
    
            ActivityLog.setActivityLogFN(
                req,
                'User ' + req.body.role !== 'admin' ? "Created And Login" : "Admin Created",
                ActivityLog.schemasName['user'] + req.body.role !== 'admin' ? " Created And Login" : " Admin Created", +  ' @ BeliefChallenge', {}
            );
            let response_data = {
                data: {
                    token,
                    userId: new_user.data._id,
                    fullName: new_user.data.fullName,
                    email: new_user.data.email,
                    profilePic: new_user.data.profilePic,
                    role: 'user'
                }
            };
    
            return _responseWrapper(true, 'User successfully', 201, response_data)
        } else {
            return _responseWrapper(false, 'inValidEmail', 400)
        }

    } else {
        return _responseWrapper(false, 'requiredAll', 400)
    }

};
