/**
 * Created by zain.ahmed on 11/26/2019.
 * @file user verification Controller
 * user verification Function
 */

"use strict";
var mongoose = require('mongoose'),
    GenericProcedure = require("@helpers/util-generic-functions"),
    { _responseWrapper } = require('@helpers/util-response'),
    Category = mongoose.model('CategorySchemas'),
    ActivityLog = require('../activityLog/activityLogController'),
    EmailDomainValidator = require("email-domain-validator"),
    { generateCode } = require('@helpers/util-utilities'),
    cacheHelper = require('@helpers/util-Cache'),
    User = mongoose.model('UserSchemas'),
    jwtHelper = require('@helpers/util-jwt'),
    EmailDomainValidator = require("email-domain-validator"),
    sendMail = require('../../config/mailerConfig');
var mailOptions = {
    to: '', // list of receivers
    subject: '', // Subject line
    html: ''
};

/*
* =========================================================================================
* --------------------------- userprofile verification  METHODS ---------------------------
* =========================================================================================
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
 * @function @sendVerificationEmailFN
 * @description send email for email verification. Link returned in email will be expired within 1 hour
 * @requires  email(string) user(Number_id)
 * */

exports.sendVerificationEmailFN = async (req, res) => {
    if (req.body.userId && req.body.email) {
        //generate code 
        let code = await generateCode(req.body, 'alphanumeric', 10, 'account-verification-cache')

        if (code) {
            let email_verified = await VerifyDomain(req.body.email);
            if (email_verified.isValidDomain) {
                // console.log(email_verified)
                mailOptions.to = req.body.email;
                mailOptions.subject = 'Email Verification';
                mailOptions.html = `<div style='background-color: #e5f8ff;'>
                                    <h2 style='text-align: center;
                                    font-family: sans-serif;'>Wellcome (Email Verification)</h2>
                                    <p style='margin: 1px 0px 0px 20px;'>Name: ${req.body.email}</p> 
                                    <p style='margin: 1px 0px 0px 20px;'>code: ${code}</p> 
                                    <div>`;
                let sendMailresult = await sendMail.sendMailFN(res, mailOptions)
                if (sendMailresult.rejected.length > 0) {
                    return _responseWrapper(false, "EmailNotSend", 400);

                } else {

                    return _responseWrapper(true, "Email as been send", 200);
                }
            } else {
                return _responseWrapper(false, "EmailNotSend", 400);
            }
        } else {
            return _responseWrapper(false, "requiredAll", 400);
        }
    } else {
        return _responseWrapper(false, "requiredAll", 400);
    }

}


/**
 * @function @verifyCodeFN
 * @description verify user provided code
 * @requires code(string)
 * */

exports.verifyCodeFN = async (req) => {


    if (req.body.code && req.body.type === 'email-verification') {
        let args = {};
        let instance = cacheHelper.cacheInstance['account-verification-cache']
        let cacheValue = await cacheHelper.getSession(instance, req.body.code);
        if (!cacheValue)
            return _responseWrapper(false, 'Invalid verification code.', 400)

        let jwtVerify = await jwtHelper.verifyToken(cacheValue)

        await cacheHelper.removeSession(instance, req.body.code);

        if (!jwtVerify)
            return _responseWrapper(false, 'Verification code is expired', 400)

        args['query'] = { email: jwtVerify.email }
        args['updateObject'] = { isVerified: true }

        let user_verified = await GenericProcedure._basePut(User, args, 'findOneAndUpdate')
        if (!user_verified.status)
            return _responseWrapper(false, user_verified.error['message'], 400)
        return _responseWrapper(true, "createSuccess", 200);

    } else {
        return _responseWrapper(false, "requiredAll", 400);

    }
}




