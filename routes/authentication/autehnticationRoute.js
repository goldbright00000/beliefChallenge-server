'use strict';
const { signupFN } = require('@controllers/authentication/signup');
const { loginFN, logoutFN } = require('@controllers/authentication/login');
const { sendVerificationEmailFN, verifyCodeFN } = require('@controllers/authentication/verification')
const { socialAuthFN } = require('@controllers/authentication/socialAuth')
const { changePasswordFN,forgotPasswordFN } = require('../../controllers/authentication/updatepassword')
const { authorizationCheckFN } = require('@middleware/authenticationMiddleware')

let AuthenticationRoute = (router) => {

    router
        .post('/auth/login', (req, res) => {
            loginFN(req, res)
                .then(
                    (success) => res.status(success.statusCode).send(success),
                    (err) => res.status(err.statusCode).send(err)
                );
        })

        //user email verification route
        .post('/auth/verify', (req, res) => {
            verifyCodeFN(req)
                .then(
                    (success) => res.status(success.statusCode).send(success),
                    (err) => res.status(err.statusCode).send(err)
                );
        })

        //code generate for user email verification
        .post('/auth/verifycode', (req, res) => {
            sendVerificationEmailFN(req)
                .then(
                    (success) => res.status(success.statusCode).send(success),
                    (err) => res.status(err.statusCode).send(err)
                );
        })

        .post('/auth/signup', (req, res) => {
            signupFN(req)
                .then(
                    (success) => res.status(success.statusCode).send(success),
                    (err) => res.status(err.statusCode).send(err)
                );
        })

        //social login route
        .post('/loginSocial', (req, res) => {
            socialAuthFN(req)
                .then(
                    (success) => { res.status(success.statusCode).send(success) },
                    (err) => res.status(err.statusCode).send(err)
                );
        })

        .post('/auth/logout', (req, res) => {
            logoutFN(req, res)
                .then(
                    (success) => res.status(success.statusCode).send(success),
                    (err) => res.status(err.statusCode).send(err)
                );
        })


        .put('/password/update', authorizationCheckFN, (req, res) => {
            changePasswordFN(req)
                .then(
                    (success) => res.status(success.statusCode).send(success),
                    (err) => res.status(err.statusCode).send(err)
                );
        })

        .put('/password/reset', (req, res) => {
            forgotPasswordFN(req)
                .then(
                    (success) => res.status(success.statusCode).send(success),
                    (err) => res.status(err.statusCode).send(err)
                );
        })

}
module.exports = AuthenticationRoute;