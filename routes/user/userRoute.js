'use strict';

const { fetchUserFN, fetchUsersFN, updateUserFN } = require('../../controllers/user/userController'),
    { authorizationCheckFN } = require('@middleware/authenticationMiddleware'),
    { upload } = require('@middleware/fileUploadMiddleware'),
    singleUpload = upload.single('profilePic')


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


let User = (router) => {
    router
        .get('/user/profile', authorizationCheckFN, fileCheck, (req, res) => {
            fetchUserFN(req)
                .then(
                    success => res.status(success.statusCode).send(success),
                    err => res.status(err.statusCode).send(err)
                )
        })
        .get('/alluser', authorizationCheckFN, fileCheck, (req, res) => {
            fetchUsersFN(req)
                .then(
                    success => res.status(success.statusCode).send(success),
                    err => res.status(err.statusCode).send(err)
                )
        })
        .put('/user/update', authorizationCheckFN, fileCheck, (req, res) => {
            updateUserFN(req)
                .then(
                    success => res.status(success.statusCode).send(success),
                    err => res.status(err.statusCode).send(err)
                )
        })

}
module.exports = User