
// Requiring uuid configuration
const jwt = require('jsonwebtoken'),
    secret = require('../config/jwtConfig').secret;

// create JWT
let generateToken = (JWT_object, expiry) => {
    return jwt.sign(
        JWT_object
        ,
        secret,
        {
            expiresIn: expiry,
            issuer: 'BeliefChallenge'
        });
}

let verifyToken = (token) => {
    return jwt.verify(token, secret, {}, function (err, decoded) {
        if (err) {
            return false
        } else {
            return decoded;
        }
    });
}

module.exports = {
    generateToken,
    verifyToken
};