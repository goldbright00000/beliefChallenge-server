/**
 * Created by saad.sami on 2/26/2019.
 */
const cacheHelper = require('./util-Cache'),
    globalVariables = require('../config/globalVariables'),
    randomstring = require("randomstring"),
    jwtHelper = require('./util-jwt');
/**
* @function @emailAttributerFormatter
* @description return regex pattern of email attribute
* @requires emailAttribute(String)
* */
exports.emailAttributerFormatter = (emailAttribute) => {
    let regexVariable = '\\$\\$' + emailAttribute + '\\$\\$';
    return new RegExp(regexVariable, 'g');
}

/**
* @function @generateJWTToken
* @description return jwt token
* @requires auth(Object)
* */

exports.generateJWTToken = async (auth) => {
    // console.log(auth)
    var JWT_object = {
        email: auth.data.email,
        userId: auth.data._id,
        _id: auth.data._id
    };
    var token = jwtHelper.generateToken(JWT_object, globalVariables._globals.JWT_EXPIRATION_TIME);
    var temp_obj = {
        _id: auth.userId
    };

    await cacheHelper.initSession(cacheHelper.cacheInstance['session-cache'], token, temp_obj);

    return token;
}


/**
 * @function @queryMulti
 * @params fieldName,obj(body)
 * @description to update nested document, it merge all the body with $set
 * @requires fieldName,obj(body)
 * */
exports.queryMulti = (fieldName, obj) => {
    var updateObj = {
        '$set': {}
    };
    for (var param in obj) {
        updateObj.$set[fieldName + '.$.' + param] = obj[param];
    }
    return updateObj;
};

//generate 6 digit numeric code.
exports.generateCode = async (obj, type, length, session) => {
    //generate token
    // var token = jwtHelper.generateToken(obj, '60');
    // get code of 6 numeric
    let code = randomstring.generate({
        length: length,
        charset: type
    });
    //cacheSession Created in db and node cache.
    // await cacheHelper.initSession(cacheHelper.cacheInstance[session], code, token);

    return code;
}