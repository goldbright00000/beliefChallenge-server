'use strict';

const { postVisitorCountFN, fetchVisitoCountFN } = require('../../controllers/visitorcount/visitorCountController');


let visitorCount = (router) => {
    router
        .post('/visitorcount', (req, res) => {
            postVisitorCountFN(req)
                .then(
                    success => res.status(success.statusCode).send(success),
                    err => res.status(err.statusCode).send(err)
                )
        })
        .get('/visitorcount', (req, res) => {
            fetchVisitoCountFN(req)
                .then(
                    success => res.status(success.statusCode).send(success),
                    err => res.status(err.statusCode).send(err)
                )
        })


}
module.exports = visitorCount