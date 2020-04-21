'use strict';

const { likeFN,fetchLikeFN } = require('../../controllers/like/likeController'),
    { authorizationCheckFN } = require('@middleware/authenticationMiddleware');



let UserLike = (router) => {
    router
        .post('/likepost', authorizationCheckFN, (req, res) => {
            likeFN(req)
                .then(
                    success => res.status(success.statusCode).send(success),
                    err => res.send(err)
                )
        })
    .get('/likepost',authorizationCheckFN, (req, res) => {
        fetchLikeFN(req)
            .then(
                success => res.status(success.statusCode).send(success),
                err => res.status(err.statusCode).send(err)
            )
    })

}
module.exports = UserLike