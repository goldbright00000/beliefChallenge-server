/**
 * Created by zain.ahmed on 11/22/2019.
 * @file category Controller
 * category Function
 */

"use strict";
var mongoose = require('mongoose'),
    GenericProcedure = require("@helpers/util-generic-functions"),
    { _responseWrapper } = require('@helpers/util-response'),
    CategoryModel = mongoose.model('CategorySchemas'),
    fileUpload = require('@middleware/fileUploadMiddleware'),
    JWTHelper = require("@helpers/util-jwt"),
    LoginUser = require("@models/authentication/loginSchema"),
    ActivityLog = require('../activityLog/activityLogController');



/*
* =======================================================================
* --------------------------- Category METHODS ---------------------------
* =======================================================================
* */


/**
 * @function @fetchCategory
 * @description fetch category list
 * @requires none
 * */

exports.fetchCategory = async req => {

    let args = {
        query: {
            isDeleted: false
        },
        parameterToGet: '_id title catIcon'
    };

    let fetch_category = await GenericProcedure._baseFetch(CategoryModel, args);
    // console.log(fetch_category)
    if (!fetch_category.status)
        return _responseWrapper(false, fetch_dealers.error["message"], 400);

    return _responseWrapper(true, "fetchSuccess", 200, fetch_category);
}

/**
 * @function @addCategory
 * @description create category
 * @requires title(String) catIcon(file)
 * */

exports.createCategory = async req => {

    var jwt = await JWTHelper.verifyToken(req.headers["authorization"]);
    let args = {
        query: {
            userId: mongoose.Types.ObjectId(jwt._id)
        },
    };
    let auth = await GenericProcedure._baseFetch(LoginUser, args, "FindOne");
    if (req.body.title && req.file && auth.data && auth.data.role == 'admin') {
        req.body.catIcon = fileUpload.baseUrlGenerator(req);
        let new_category = await GenericProcedure._basePost(CategoryModel, req.body);
        if (!new_category.status)
            return _responseWrapper(false, new_category.error['message'], 400)
        return _responseWrapper(true, 'createSuccess', 201)
    } else {
        return _responseWrapper(false, 'requiredAll', 400)
    }
}

/**
 * @function @updateaCategory
 * @description update category 
 * @requires catId(String)
 * */

exports.updateCategory = async req => {
    if (req.body.catId) {

        let args = {
            query: {
                _id: req.body.catId
            },
            updateObject: req.body,
            parameterToGet: '-__v -isDeleted'
        };

        if (req.file)
            req.body.catIcon = fileUpload.baseUrlGenerator(req);

        let update_category = await GenericProcedure._basePut(CategoryModel, args, "findOneAndUpdate");

        if (!update_category.status)
            return _responseWrapper(false, update_category.error["message"], 400);

        return _responseWrapper(true, 'updateSuccess', 200, update_category)

    } else {
        return _responseWrapper(false, "requiredAll", 400);
    }
}

/**
 * @function @removeCategory
 * @description remove category 
 * @requires catId(String)
**/
exports.removeCategory = async req => {
    if (req.query.catId) {
        let args = {
            query: {
                _id: req.body.catId
            },
            updateObject: { isDeleted: true }
        };

        let update_category = await GenericProcedure._basePut(CategoryModel, args, "findOneAndUpdate");

        if (!update_category.status)
            return _responseWrapper(false, update_category.error["message"], 400);

        return _responseWrapper(true, "removeSuccess", 204)
    }
    else {
        return _responseWrapper(false, "requiredAll", 400)
    }
}