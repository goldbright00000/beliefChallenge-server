/**
 * Created by zain.ahmed on 11/2/2019.
 * @file post Controller
 * post  Function
 */

"use strict";
var mongoose = require('mongoose'),
    GenericProcedure = require("@helpers/util-generic-functions"),
    { _responseWrapper } = require('@helpers/util-response'),
    PostModel = mongoose.model('PostSchemas'),
    ActivityLog = require('../activityLog/activityLogController');

/*
* =======================================================================
* --------------------------- Posts  METHODS ---------------------------
* =======================================================================
* */

/**
 * @function @searchPost
 * @description seach post list 
 * @optional word(string) skip(string) limit(string)
 * */
exports.searchPost = async req => {
    if (req.query.word) {
        let args = {
            query: [
                { $sort: { createdDate: -1 } },
                {
                    $match: {
                        isDeleted: false,
                        postQuestion: {
                            $regex: new RegExp(req.query.word)
                        },
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
                { $skip: Number(req.query.skip) },
                { $limit: Number(req.query.limit) },
            ]
        }

        let result = await GenericProcedure._baseFetch(
            PostModel,
            args,
            "Aggregate"
        );
        return _responseWrapper(true, "fetchSuccess", 200, result);

    } else {
        return _responseWrapper(false, "requiredAll", 400);

    }

}

