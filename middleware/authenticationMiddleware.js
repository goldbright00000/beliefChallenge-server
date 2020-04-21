/**
 *  Created by imad.arif on 08/01/2018.
 */

"use strict";

const LoginUser = require("@models/authentication/loginSchema"),
  CacheDB = require("@controllers/dbControllers/cacheController"),
  GenericProcedure = require("@helpers/util-generic-functions"),
  globalVariables = require("@config/globalVariables"),
  jwt_decode = require("jwt-decode"),
  { _responseWrapper } = require("@helpers/util-response"),
  helperCache = require("@helpers/util-Cache"),
  utilitiesHelper = require("@helpers/util-utilities"),
  JWTHelper = require("@helpers/util-jwt"),
  RegisterUser = require("@models/authentication/userSchema"),
  SocialAuthModel = require("@models/authentication/socialAuthSchema");

exports.authorizationCheckFN = async (req, res, next) => {
  let apiToken = req.headers["authorization"];

  if (apiToken) {
    var isJWT = await verifyJwtToken(apiToken);
    if (isJWT.status) {
      let auth;

      let args = {
        query: { userId: isJWT.data.userId }
      };

      let social_login = await GenericProcedure._baseFetch(SocialAuthModel, args, "FindOne");
      if (!social_login.status) {
        let response = _responseWrapper(false, auth.error["message"], 400);
        res.status(response.statusCode).json(response);
      }
      if (social_login.data) {
        auth = await GenericProcedure._baseFetch(RegisterUser, { _id: isJWT.data._id }, "FindOne");
        req.userId = auth.data._id;
      }
      if (!social_login.data) {
        auth = await GenericProcedure._baseFetch(LoginUser, { userId: isJWT.data._id }, "FindOne");

        req.userId = auth.data.userId
      }


      if (!auth.status) {
        let response = _responseWrapper(false, auth.error["message"], 400);
        res.status(response.statusCode).json(response);
      }
      req.role = auth.data.role;
      next();
    } else {
      let response = _responseWrapper(false, isJWT.message, 401);
      res.status(response.statusCode).json(response);
    }
  } else {
    let response = _responseWrapper(
      false,
      "Authorization token is required",
      401
    );
    res.status(response.statusCode).json(response);
  }
};

let verifyJwtToken = async apiToken => {
  // console.log(apiToken,"apiToken-1")
  var token = await helperCache.getSession(helperCache.cacheInstance['session-cache'], apiToken);

  if (token) {
    var jwt = JWTHelper.verifyToken(apiToken);
    if (jwt) {
      return {
        status: true,
        data: jwt
      };
    } else {
      var user = jwt_decode(apiToken);
      // console.log(user)
      let token = await utilitiesHelper.generateJWTToken(user);

      //remove last expired token
      let cache_removed = await CacheDB.removeCacheFN(apiToken);

      //here fire socket event for client
      for (const [client, sequenceNumber] of global.clientRef.entries()) {
        if (sequenceNumber === apiToken) {
          console.log("token updated:", sequenceNumber);

          client.emit("updatedAccessToken", token);
        }
      }

      return {
        status: true,
        data: jwt_decode(token)
        // message: 'Authorization Failed: Token Expired'
      };
    }
  } else {
    return {
      status: false,
      message: "Authorization failed invalid token"
    };
  }
};
