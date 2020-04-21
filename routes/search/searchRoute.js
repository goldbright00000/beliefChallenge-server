'use strict';

const { searchPost } = require('../../controllers/search/seach');


let Search = (router) => {
    router
        .get('/search', (req, res) => {
            searchPost(req)
                .then(
                    success => res.status(success.statusCode).send(success),
                    err => res.status(err.statusCode).send(err)
                )
        })

}
module.exports = Search