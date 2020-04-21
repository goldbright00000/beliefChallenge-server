
'use strict';

const nodeCache = require('node-cache'),

    globalVariables = require('../config/globalVariables'),
    sessionCache = new nodeCache({ stdTTL: 0, checkperiod: 0 }),
    accountVerificationCache = new nodeCache({ stdTTL: 3600, checkperiod: 60 }),
    CacheDB = require('@controllers/dbControllers/cacheController'),
    jwtHelper = require('./util-jwt');

global.sessionCache = sessionCache;



var cacheInstance = {
    'session-cache': {
        title: 'session-cache',
        instance: sessionCache
    },
    'account-verification-cache': {
        title: 'account-verification-cache',
        instance: accountVerificationCache
    }
};


/*
 * =====================================================================
 * ------------------------ UTIL CACHE METHODS -------------------------
 * =====================================================================
 * */

let getSession = async (cache, key) => {
    // console.log(cache['instance'])
    let cache_response = await cache['instance'].get(key);
    if (!cache_response) {
        console.log(cache.title + ": Key not Found!");
        return null;
    }
    return cache_response
}

let removeSession = async (cache, key) => {
    // console.log(key, "key")
    let remove_response = await cache['instance'].del(key);
    // console.log(remove_response, "remove_response")
    if (remove_response) {
        await CacheDB.removeCacheFN(key);
        console.log(cache.title + ": Session Expire Successfully.");
        return true
    } else {
        console.log(cache + ": Operation failed, cache not exists." + remove_response);
        return false
    }
}

let addSession = async (cache, token, object) => {
    let cache_added = cache['instance'].set(token, object);
    if (cache_added) {
        let cache_created = await CacheDB.addCacheFN(cache.title, token, object);
        if (cache_created.response.status)
            console.log(cache.title + ": " + cache_created.response.message)
        else
            console.log(cache.title + ": " + cache_created.response.message)
    }
}

let sessionKeys = () => {
    sessionCache.keys((err, mykeys) => {
        if (!err) {
            console.log('cache Keys: ', mykeys);
        }
    });
}

//refresh token cache socket
let refreshTokenCache = (data, root_callback) => {
    var isExpired = jwtHelper.verifyToken(data.accessToken);
    if (!isExpired) {
        var new_token = jwtHelper.generateToken({ registerId: data.userId }, globalVariables._globals.JWT_EXPIRATION_TIME);
        addSession(cacheInstance['session-cache'], new_token, data.userId);
        data.accessToken = new_token;
        root_callback(data)
    }
}

//restoreCache
let restoreCache = async () => {
    let cached = await CacheDB.getCacheFN();
    if (cached.response.status) {
        let data = cached.response.data;
        for (var i in data) {
            let jwt = await jwtHelper.verifyToken(data[i].key);
            if (!jwt)
                await CacheDB.removeCacheFN(data[i].key);
            await cacheInstance[data[i].instance].instance.set(data[i].key, data[i].value)
        }
        console.log('Cache Restored Successfully')
    }
}

//DIRECT CACHE FUNCTIONS
let removeFromSession = (key, callback) => {
    sessionCache.del(key, (err, res) => {
        if (!err) {
            callback(null, res)
        } else {
            callback(err, null)
        }
    })
}


/*
 * =====================================================================
 * ------------------------- UTIL CACHE EVENTS -------------------------
 * =====================================================================
 * */

/**
 * @event expired - accountVerificationCache
 * @description Fired when a key expires. Will return the key and value as callback argument.
 * */
accountVerificationCache.on("expired", (key, value) => {
    CacheDB.removeCacheFN(key, () => {
        // success
    })
});

/**
 * @event expired - sessionCache
 * @description Fired when a key expires. Will return the key and value as callback argument.
 * */
sessionCache.on("expired", (key, value) => {
    CacheDB.removeCacheFN(key, () => {
        // success
    })
});

module.exports = {
    cacheInstance,
    initSession: addSession,
    getSession,
    removeSession,
    sessionKeys,
    restoreCache,
    refreshTokenCache,
    removeFromSessionCache: removeFromSession
};

