/**
 * Created by zain.ahmed on 11/22/2019.
 * @file Comment Controller
 * Comment Function
 */

"use strict";
var mongoose = require('mongoose'),
    GenericProcedure = require("@helpers/util-generic-functions"),
    { _responseWrapper } = require('@helpers/util-response'),
    CommentModel = mongoose.model('CommentSchemas'),
    UserModel = mongoose.model('UserSchemas'),
    ActivityLog = require('../activityLog/activityLogController');

/*
* =======================================================================
* --------------------------- Comment METHODS ---------------------------
* =======================================================================
* */


/**
 * @function @fetchComment
 * @description fetch comments
 * @requires postId(string) skip(string) limit(String)
 * */
exports.fetchComment = async req => {
    // console.log(req.query)
    if (req.query.postId) {
        let matchObj = {
            postId: mongoose.Types.ObjectId(req.query.postId)
        };
        // if (req.query.createdBy) {
        //     matchObj['createdBy'] = mongoose.Types.ObjectId(req.query.createdBy);
        // }

        // let args = {
        //     query: [
        //         { $sort: { createdDate: -1 } },
        //         {
        //             $match: {
        //                 ...matchObj,
        //                 isDeleted: false,
        //             }
        //         },
        //         // { $addFields: { "userId": { $toObjectId: "$createdBy" } } },
        //         {
        //             $lookup: {
        //                 from: "userschemas",
        //                 localField: "createdBy",
        //                 foreignField: "_id",
        //                 as: "output"
        //             }
        //         },
        //         { $skip: Number(req.query.skip) },
        //         { $limit: Number(req.query.limit) },
        //     ],
        //     // sort: {
        //     //     "createdDate": -1
        //     // },
        // };


        let args = {
            query: [
                { $sort: { createdDate: -1 } },
                {
                    $match: { ...matchObj, isDeleted: false }
                },
                { $skip: Number(req.query.skip) },
                { $limit: Number(req.query.limit) },
                {
                    $lookup: {
                        from: "userschemas",
                        localField: "createdBy",
                        foreignField: "_id",
                        as: "user_profile"
                    }
                },

                { $unwind: { path: '$user_profile', preserveNullAndEmptyArrays: true } },

            ],

        };

        let fetch_comment = await GenericProcedure._baseFetch(CommentModel, args, "Aggregate");
        if (!fetch_comment.status)
            return _responseWrapper(false, fetch_comment.error["message"], 400);
        else {
            let cleaned_fetch_comment = await fetch_comment.data.map(post => {
                delete post.user_profile.email
                return post
            })
            if (cleaned_fetch_comment.length == fetch_comment.data.length)
                fetch_comment.data = cleaned_fetch_comment

        }


        let fetchCommentsCount = await GenericProcedure._baseCount(CommentModel,
            { query: args.query[1].$match }
        )


        let resultData = {
            ...fetch_comment,
            count: fetchCommentsCount.data
        }

        return _responseWrapper(true, "fetchSuccess", 200, resultData);

    } else {
        return _responseWrapper(false, "requiredAll", 400);
    }
}

/**
 * @function @postComment
 * @description add comment to post 
 * @requires postId(Number_id) content(string)
 * */
exports.postComment = async req => {
    if (req.body.content && req.body.postId) {
        // console.log(req.userId, 'req.userId')
        // console.log(req.body.createdBy)

        req.body.createdBy = mongoose.Types.ObjectId(req.body.createdBy);

        let new_comment = await GenericProcedure._basePost(CommentModel, req.body);
        if (!new_comment.status) {

            return _responseWrapper(false, new_comment.error['message'], 400)
        }
        req.userId = req.body.createdBy

        ActivityLog.setActivityLogFN(req, "Comment", ActivityLog.schemasName["comment"] + " created",
            { userId: req.userId, commentId: new_comment.data._id }
        );

        return _responseWrapper(true, 'createSuccess', 201)

    } else {
        return _responseWrapper(false, 'requiredAll', 400)
    }

}

/**
 * @function @updateComment
 * @description update comment 
 * @requires comment(Number_id)
 * */
exports.updateComment = async req => {

    if (req.body.commentId) {
        let args = {
            query: {
                _id: req.body.commentId
            },
            updateObject: req.body,
            // parameterToGet
        };
        //Update document for the specific category id
        let update_comment = await GenericProcedure._basePut(
            Comment,
            args,
            "findOneAndUpdate"
        );
        //checking status and through error
        if (!update_comment.status)
            return _responseWrapper(false, update_comment.error["message"], 400);

        req.userId = update_comment.data._id

        // ActivityLog.setActivityLogFN(
        //     req,
        //     "Comment",
        //     ActivityLog.schemasName["comment"] +
        //     " update",
        //     { userId: req.userId, commentId: update_comment.data._id }
        // );

        return _responseWrapper(true, 'updateSuccess', 201)
    } else {
        return _responseWrapper(false, "requiredAll", 400);

    }

}

/**
 * @function @removeComment
 * @description remove comment 
 * @requires commentId(String)
 * */
exports.removeComment = async req => {

    if (req.body.commentId) {

        let args = {
            query: {
                _id: req.body.commentId,
            },
            updateObject: { isDeleted: true }
        }

        if (req.body.role != 'admin') {
            args.query['createdBy'] = req.body.userId;
        }

        let remove_query = await GenericProcedure._basePut(CommentModel, args, 'findOneAndUpdate');
        if (!remove_query.status)
            return _responseWrapper(false, remove_query.error['message'], 400)

        if (remove_query.data === null)
            return _responseWrapper(true, "notFound", 403)

        ActivityLog.setActivityLogFN(
            req,
            "Comment",
            ActivityLog.schemasName["comment"] +
            " remove",
            { userId: req.userId, commentId: remove_query.data._id }
        );

        return _responseWrapper(true, "removeSuccess", 200)

    } else {
        return _responseWrapper(false, "requiredAll", 400)
    }

}