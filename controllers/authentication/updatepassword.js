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
    { generateCode } = require('@helpers/util-utilities'),
    { _responseWrapper } = require("@helpers/util-response"),
    { _sendGenericEmail } = require('@helpers/util-mailer'),
    ActivityLog = require("../activityLog/activityLogController"),
    sendMail = require('../../config/mailerConfig'),
    EmailDomainValidator = require("email-domain-validator"),
    salt = bcrypt.genSaltSync(10);

var mailOptions = {
    to: '', // list of receivers
    subject: '', // Subject line
    html: ''
};
/*
 * ==============================================================================
 * --------------------------- CHANGEPASSWORD METHODS ---------------------------
 * ==============================================================================
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
* @function @changePasswordFN
* @description change password user
* @requires oldpasword(string) newpassword(string) confrimpassword(string)
* */

exports.changePasswordFN = async (req, res) => {
    if (req.body.oldPassword && req.body.newPassword) {
        let args = {
            query: {
                userId: req.body.userId
            },
            parameterToGet: 'password'
        }
        let auth = await GenericProcedure._baseFetch(LoginUser, args, 'FindOne')
        if (!auth.status) {
            req['error'] = true;
            req['object'] = _responseWrapper(false, auth.error['message'], 400)
        }

        if (bcrypt.compareSync(req.body.oldPassword, auth.data.password)) {
            req.body.password = bcrypt.hashSync(req.body.newPassword, salt)

            let args_ = {
                query: {
                    userId: req.body.userId
                },
                updateObject: req.body,
                // parameterToGet
            };
            let update_user = await GenericProcedure._basePut(
                LoginUser,
                args_,
                "findOneAndUpdate"
            );
            if (update_user) {
                req.userId = update_user.data.userId
                ActivityLog.setActivityLogFN(
                    req,
                    "Password Change",
                    ActivityLog.schemasName["login"] + " login @ belief challenges",
                    {}
                );
            }
            return _responseWrapper(true, "PasswordUpdate", 200);

        } else {
            return _responseWrapper(false, "Incorrect old password", 400);
        }
    } else {
        return _responseWrapper(false, "requiredAll", 400);

    }
}

/**
 * @function @forgotPasswordFN
 * @description forgot your password
 * @requires email(string)
 * */
exports.forgotPasswordFN = async (req, res) => {
    if (req.body.email) {
        let args = {
            query: {
                email: req.body.email
            }
        }
        //look for email is exist or not
        let auth_user = await GenericProcedure._baseFetch(LoginUser, args, 'FindOne')
        if (!auth_user.status)
            return _responseWrapper(false, auth_user.error['message'], 400)

        if (!auth_user.data)
            return _responseWrapper(true, "This email is not registered!", 400)
        req.body.userId = auth_user.data.userId;
        let obj = {
            ...req.body
        }
        //generate code
        let code = await generateCode(obj, 'alphanumeric', 10, 'account-verification-cache')
        obj['slug'] = 'forgot-password';
        obj['region'] = 'UK';

        let email_status = await sendFotgetPasswordFN(code, req, res)

        if (!email_status)
            return _responseWrapper(false, email_status.error['message'], 400)

        if (email_status) {
            var hash = bcrypt.hashSync(code, salt);
            req.body.password = hash;
            let args_ = {
                query: {
                    email: req.body.email
                },
                updateObject: req.body
                // parameterToGet
            };
            let update_user = await GenericProcedure._basePut(
                LoginUser,
                args_,
                "findOneAndUpdate"
            );
            return _responseWrapper(true, "Please check your email inbox.", 200);
        }
    } else
        return _responseWrapper(false, "requiredAll", 400);
};


/**
 * @function @sendVerificationEmailFN
 * @description send email for email verification. Link returned in email will be expired within 1 hour
 * @requires  email(string) user(Number_id)
 * */


const sendFotgetPasswordFN = async (code, req, res) => {
    if (code) {
        let email_verified = await VerifyDomain(req.body.email);
        if (email_verified.isValidDomain) {
            mailOptions.to = req.body.email;
            mailOptions.subject = 'Reset Password';
            mailOptions.html = "<p style='margin: 1px 0px 0px 20px;'>You password has been reset. Please login with credentials below. These are temporary credentials change them after you login.</p>" +
                "<p style='margin: 1px 0px 0px 20px;'>Email: " + req.body.email + "</p>" +
                "<p style='margin: 1px 0px 0px 20px;'>New Password: " + code + "</p>" +
                "<p>This is an auto generated email. Dont reply to this.</p>";

            let sendMailresult = await sendMail.sendMailFN(res, mailOptions)
            if (sendMailresult.rejected.length > 0) {
                return false;

            } else {
                return true;
            }
        }
        else {
            return false
        }
    } else {
        return _responseWrapper(false, "requiredAll", 400);
    }

}
