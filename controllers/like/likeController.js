/**
 * Created by zain ahmed on 1/16/2020.
 * @file like Controller
 * Like CURD Functions
 */

"use strict";

var mongoose = require('mongoose'),
    GenericProcedure = require("@helpers/util-generic-functions"),
    { _responseWrapper } = require('@helpers/util-response'),
    LikeModel = mongoose.model('UserLikeSchemas'),
    Post = mongoose.model('PostSchemas'),
    ActivityLog = require('../activityLog/activityLogController');

/*
* =======================================================================
* --------------------------- LIKES  METHODS ---------------------------
* =======================================================================
* */


/**
 * @function @likeFN
 * @description  add/remove likes
 * @requires params  
 * postId(object id) likeflage (string)
 * */

exports.likeFN = async (req, res) => {

    if (req.body.postId) {

        let updateObjectLike = {}
        let updateObjectPost = {}

        if (req.body.likeFlag == "add") {
            updateObjectLike['$push'] = { "postId": req.body.postId }
            updateObjectPost['$inc'] = { "likes": 1 }
        }

        if (req.body.likeFlag == "remove") {
            updateObjectLike['$pull'] = { "postId": req.body.postId }
            updateObjectPost['$inc'] = { "likes": -1 }
        }
        req.body.userId = mongoose.Types.ObjectId(req.userId)


        let args = {
            query: { _id: req.body.postId },
            updateObject: {
                ...updateObjectPost
            },
        };

        let update_post = await GenericProcedure._basePut(Post, args, "findOneAndUpdate");

        if (!update_post.status) {
            return _responseWrapper(false, update_post.error["message"], 400);
        }

        let args_ = {
            query:
            {
                userId: req.body.userId
            },

            updateObject: {
                ...updateObjectLike
            }
        }

        let update_userLike = await GenericProcedure._basePut(LikeModel, args_, "findOneAndUpdate");

        if (!update_userLike.status) {
            return _responseWrapper(false, update_userLike.error["message"], 400);
        }

        if (update_userLike.data == null) {
            req.body.userId = req.userId
            let new_user_like = await GenericProcedure._basePost(LikeModel, req.body);


            if (!new_user_like.status) {
                return _responseWrapper(false, update_post.error["message"], 400);
            }
            return _responseWrapper(true, "post", 200);
        }

        return _responseWrapper(true, "post", 200);

    } else {
        return _responseWrapper(false, "requiredAll", 400);

    }

}



exports.fetchLikeFN = async (req, res) => {

    if (req.userId) {
        let parameterToGet = "postId _id userId";

        let query = {
            userId: req.userId,
        };


        let args_ = {
            query,
            parameterToGet

        };

        let user_like = await GenericProcedure._baseFetch(LikeModel, args_, "FindOne")
        if (!user_like.status)
            return _responseWrapper(false, new_user.error['message'], 400)
        return _responseWrapper(true, 'fetchSuccessfully', 200, user_like)
    } else {
        return _responseWrapper(false, 'please fill all the fields', 400)

    }
}


