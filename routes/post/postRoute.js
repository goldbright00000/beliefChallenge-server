'use strict';

const { fetchPosts, addPosts, updatePosts, removePosts, makePinPost, fetchPinPost } = require('../../controllers/post/postController'),
    { authorizationCheckFN } = require('@middleware/authenticationMiddleware');



    let Post = (router) => {
        router
            .post('/post',authorizationCheckFN, (req, res) => {
                addPosts(req)
                    .then(
                        success => res.status(success.statusCode).send(success),
                        err => res.send(err)
                    )
            })
            .get('/post', (req, res) => {
                fetchPosts(req)
                    .then(
                        success => res.status(success.statusCode).send(success),
                        err => res.status(err.statusCode).send(err)
                    )
            })
            .put('/post', authorizationCheckFN,(req, res) => {
                updatePosts(req)
                    .then(
                        success => res.status(success.statusCode).send(success),
                        err => res.status(err.statusCode).send(err)
                    )
            })
            .delete('/post',authorizationCheckFN, (req, res) => {
                removePosts(req)
                    .then(
                        success => res.status(success.statusCode).send(success),
                        err => res.status(err.statusCode).send(err)
                    )
            })
            .get('/post/pinpost', (req, res) => {
                fetchPinPost(req)
                    .then(
                        success => res.status(success.statusCode).send(success),
                        err => res.status(err.statusCode).send(err)
                    )
            })
            .put('/post/pinpost',authorizationCheckFN, (req, res) => {
                makePinPost(req)
                    .then(
                        success => res.status(success.statusCode).send(success),
                        err => res.status(err.statusCode).send(err)
                    )
            })
    }
module.exports = Post