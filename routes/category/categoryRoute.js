'use strict';

const { fetchCategory, createCategory, updateCategory, removeCategory } = require('../../controllers/category/categoryController'),
    { authorizationCheckFN } = require('@middleware/authenticationMiddleware'),
    { upload } = require('@middleware/fileUploadMiddleware'),
    singleUpload = upload.single('catIcon');

function fileCheck(req, res, next) {
    singleUpload(req, res, function (err) {
        if (err)
            res.status(404).json({
                error: true,
                message: err
            });
        else {
            next();
        }
    })
}

let Category = (router) => {
    router
        .post('/category', authorizationCheckFN, fileCheck,  (req, res) => {
            createCategory(req)
                .then(
                    success => res.status(success.statusCode).send(success),
                    err => res.send(err)
                )
        })
        .get('/category', (req, res) => {
            fetchCategory(req)
                .then(
                    success => res.status(success.statusCode).send(success),
                    err => res.status(err.statusCode).send(err)
                )
        })
        .put('/category', authorizationCheckFN, fileCheck, (req, res) => {
            updateCategory(req)
                .then(
                    success => res.status(success.statusCode).send(success),
                    err => res.status(err.statusCode).send(err)
                )
        })
        .delete('/category',authorizationCheckFN, (req, res) => {
            removeCategory(req)
                .then(
                    success => res.status(success.statusCode).send(success),
                    err => res.status(err.statusCode).send(err)
                )
        })
}
module.exports = Category