/**
 * Created by zain.ahmed on 11/22/2019.
 * @file post Controller
 * post  Function
 */

"use strict";
var mongoose = require('mongoose'),
    GenericProcedure = require("@helpers/util-generic-functions"),
    { _responseWrapper } = require('@helpers/util-response'),
    Post = mongoose.model('PostSchemas'),
    JWTHelper = require("@helpers/util-jwt"),
    LoginUser = mongoose.model('LoginSchemas'),
    ActivityLog = require('../activityLog/activityLogController');

/*
* =======================================================================
* --------------------------- Posts  METHODS ---------------------------
* =======================================================================
* */

/**
 * @function @fetchPosts
 * @description fetch post lists
 * @requires skip(string) limit(string)
 * @optionals search(word) categoryId(number) postId(number) userId(number)
 * */
exports.fetchPosts = async req => {
    let matchObj = {
        isPinPost: false
    };


    if (req.query.categoryId) {
        matchObj['categoryId'] = mongoose.Types.ObjectId(req.query.categoryId);
    }

    if (req.query.userId) {
        matchObj['createdBy'] = mongoose.Types.ObjectId(req.query.userId);
    }

    if (req.query.postId) {
        // used only for social share post 
        matchObj['_id'] = mongoose.Types.ObjectId(req.query.postId)
        delete matchObj['isPinPost']
    }

    if (req.query.search) {
        // let searchVariable = {req.query.search, $options : 'i'}
        matchObj['postQuestion'] = { $regex: new RegExp(req.query.search, 'i') }
    }


    let args = {
        query: [
            { $sort: { createdDate: -1 } },
            {
                $match: { ...matchObj, isDeleted: false }
            },
            {
                $lookup: {
                    from: "userschemas",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "output",
                }
            },
            { $skip: Number(req.query.skip) },
            { $limit: Number(req.query.limit) },
        ],

    };
    let fetch_post = await GenericProcedure._baseFetch(Post, args, "Aggregate");
    if (!fetch_post.status)
        return _responseWrapper(false, fetch_post.error["message"], 400);

    else {
        let cleaned_fetch_post = await fetch_post.data.map(post => {
            delete post.output[0].email
            return post
        })
        if (cleaned_fetch_post.length == fetch_post.data.length)
            fetch_post.data = cleaned_fetch_post

    }
    let fetchPostCount = await GenericProcedure._baseCount(Post,
        { query: args.query[1].$match }
    )


    if (!fetchPostCount.status)
        return _responseWrapper(false, fetch_post.error["message"], 400);




    let resultData = {
        ...fetch_post,
        count: fetchPostCount.data
    }
    return _responseWrapper(true, "fetchSuccess", 200, resultData);

}

/**
 * @function @addPost
 * @description add post 
 * @requires categoryId(string) postQuestion(string) userId(string) userId(array)
 * */
exports.addPosts = async req => {
    if (req.body.categoryId && req.body.postQuestion && req.body.userId) {

        req.body.createdBy = mongoose.Types.ObjectId(req.body.userId)


        let new_post = await GenericProcedure._basePost(Post, req.body);
        req.userId = req.body.userId
        ActivityLog.setActivityLogFN(req, "Post", ActivityLog.schemasName["post"] + " created",
            { userId: req.userId, postId: new_post.data._id }
        );

        return _responseWrapper(true, 'createSuccess', 201, new_post)

    }
    else {
        return _responseWrapper(false, "requiredAll", 400);
    }
}

/**
 * @function @updatePosts
 * @description update post 
 * @requires postId(string) 
 * */
exports.updatePosts = async req => {

    if (req.body.postId) {

        req.body.lastUpdated = new Date().toISOString();

        let args = {
            query: { _id: req.body.postId, createdBy: req.userId },
            updateObject: req.body,
            parameterToGet: '-__v -isDeleted'
        };

        let update_post = await GenericProcedure._basePut(Post, args, "findOneAndUpdate");

        if (!update_post.status)
            return _responseWrapper(false, update_post.error["message"], 400);

        if (update_post.data == null)
            return _responseWrapper(false, 'notFound', 403);

        ActivityLog.setActivityLogFN(req, "Post", ActivityLog.schemasName["post"] + " updated",
            { postId: req.body.postId }
        );

        return _responseWrapper(true, 'updateSuccess', 200, update_post)

    } else {
        return _responseWrapper(false, "requiredAll", 400);
    }

}

/**
 * @function @removePosts
 * @description remove post 
 * @requires postId(string) 
 * */
exports.removePosts = async req => {
    if (req.body.postId) {
        let args = {
            query: {
                _id: req.body.postId
            },
            updateObject: { isDeleted: true }
        }

        if (req.body.role != 'admin') {
            args.query['createdBy'] = req.body.userId;
        }


        //Remove specific message query
        let remove_query = await GenericProcedure._basePut(Post, args, 'findOneAndUpdate');
        if (!remove_query.status)
            return _responseWrapper(false, remove_query.error['message'], 400)

        if (remove_query.data === null)
            return _responseWrapper(true, "notFound", 403)

        req.userId = req.body.userId
        ActivityLog.setActivityLogFN(req, "Post", ActivityLog.schemasName["post"] + " removed",
            { postId: req.body.postId }
        );

        return _responseWrapper(true, "removeSuccess", 200)
    }
    else {
        return _responseWrapper(false, "requiredAll", 400)
    }

}

/**
 * @function @fetchPinPost
 * @description fetched pinned post
 * @requires postId(string) 
 * */
exports.fetchPinPost = async req => {
    let args = {
        query: [
            {
                $match: {
                    isPinPost: true,
                }

            },
            // { $addFields: { "userId": { $toObjectId: "$createdBy" } } },
            {
                $lookup: {
                    from: "userschemas",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "output"
                }
            },
            { $skip: 0 },
            { $limit: 5 },

        ],
        sort: {
            "createdDate": -1
        },
    };
    let fetch_pinpost = await GenericProcedure._baseFetch(
        Post,
        args,
        "Aggregate"
    );
    //checking status and through error
    if (!fetch_pinpost.status)
        return _responseWrapper(false, fetch_pinpost.error["message"], 400);

    return _responseWrapper(true, 'fetchSuccess', 200, fetch_pinpost)

}


/**
 * @function @makePinPost
 * @description pin the post 
 * @requires postId(string)
 * */
exports.makePinPost = async req => {
    let apiToken = req.headers["authorization"]
    var jwt = JWTHelper.verifyToken(apiToken);

    let args = {
        query: { userId: mongoose.Types.ObjectId(jwt._id) },
    }
    let fetch_role = await GenericProcedure._baseFetch(
        LoginUser,
        args,
    );
    if (req.body.postId) {
        if (fetch_role.data[0].role == "admin") {

            let removeArgs = {
                query: { isPinPost: true },
                updateObject: { $set: { isPinPost: false } }
            }

            if (req.body.isPin) {

                let remove_pin = await GenericProcedure._basePut(Post, removeArgs);
                if (!remove_pin.status)
                    return _responseWrapper(false, remove_pin.error["message"], 400);
                return _responseWrapper(true, 'updateSuccess', 200)
            }

            let remove_pin = await GenericProcedure._basePut(Post, removeArgs);
            if (!remove_pin.status)
                return _responseWrapper(false, remove_pin.error["message"], 400);

            let args = {
                query: {
                    _id: req.body.postId
                },
                updateObject: { isPinPost: true }
            };
            let update_post = await GenericProcedure._basePut(Post, args, "findOneAndUpdate");
            if (!update_post.status)
                return _responseWrapper(false, update_post.error["message"], 400);

            return _responseWrapper(true, 'updateSuccess', 200)
        } else {
            return _responseWrapper(false, 'Authorization failed invalid token', 400)
        }
    } else {
        return _responseWrapper(false, "requiredAll", 400)
    }

}