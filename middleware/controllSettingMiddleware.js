/**
 *  Created by zain.ahmed on 11/22/2019.
 */

'use strict';

var mongoose = require('mongoose'),
    ControlSettings = mongoose.model('ControlSettingSchemas'),
    LoginUser = mongoose.model('LoginSchemas'),
    GenericProcedure = require('@helpers/util-generic-functions'),
    { _responseWrapper } = require('@helpers/util-response');

/*
 * =====================================================================
 * --------------------- CONTROL SETTINGS MIDDLEWARE ----------------------
 * =====================================================================
 * */

/**
 * @function @checkUserControllSettingFN
 * @description check user controll setting
 * @requires 
 * */
exports.checkUserControllSettingFN = async (req, res, next) => {
    if (req.body.email) {
        let response = null;
        let args = {
            query: {
                email: req.body.email
            },
            parameterToGet: "userId"
        }
        let user = await GenericProcedure._baseFetch(LoginUser, args, 'FindOne')
        if (!user.status || !user.data) {
            next();
        } else {
            args.query = {
                userId: user.data.userId
            }
            args.parameterToGet = '-__v'

            let user_control_setting = await GenericProcedure._baseFetch(ControlSettings, args, 'FindOne')

            if (!user_control_setting.status) {
                response = _responseWrapper(false, 'Your account have problem please contact belief challenges.com', 400)
                res.status(response.statusCode).json(response)
            } else if (user_control_setting.data.isUserDeactivated) {
                response = _responseWrapper(false, 'Your account is deactivated by Lemostre.com', 400)
                res.status(response.statusCode).json(response)
            }
            else if (user_control_setting.data.isUserBlocked) {
                response = _responseWrapper(false, 'Your account is temporary blocked by Lemostre.com', 400)
                res.status(response.statusCode).json(response)
            }
            else {
                next();
            }
        }


    } else {
        next();
    }
    // return _responseWrapper(false, 'requiredAll', 400);
};