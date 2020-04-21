#!/usr/bin/env node

/**
 * Module dependencies.
 */
/*--------------------INCLUDE PACKAGES--------------------*/

var 
  http = require("http"),
  app = require("../app");

/*--------------------PORT & LISTENING--------------------*/

var port = normalizePort(process.env.PORT || "3001");

/**
 * Listen on provided port, on all network interfaces.
 */
let httpServer = http.createServer(app).listen(port);

console.log("Http Server is listening on port:", 3001);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
