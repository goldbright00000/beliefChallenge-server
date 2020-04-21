'use strict';

const { fetchComment, postComment, updateComment, removeComment } = require('../../controllers/comment/commentController'),
    { authorizationCheckFN } = require('@middleware/authenticationMiddleware');


    let Comment = (router) => {
        router
            .post('/comment',authorizationCheckFN, (req, res) => {
                postComment(req)
                    .then(
                        success => res.status(success.statusCode).send(success),
                        err => res.send(err)
                    )
            })
            .get('/comment', (req, res) => {
                fetchComment(req)
                    .then(
                        success => res.status(success.statusCode).send(success),
                        err => res.status(err.statusCode).send(err)
                    )
            })

            .put('/comment',authorizationCheckFN, (req, res) => {
                updateComment(req)
                    .then(
                        success => res.status(success.statusCode).send(success),
                        err => res.status(err.statusCode).send(err)
                    )
            })
            .delete('/comment',authorizationCheckFN, (req, res) => {
                removeComment(req)
                    .then(
                        success => res.status(success.statusCode).send(success),
                        err => res.status(err.statusCode).send(err)
                    )
            })
    }
module.exports = Comment