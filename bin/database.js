/**
 * Created by imad.arif on 04/03/2019.
 */

/*--------------------INCLUDE PACKAGES--------------------*/
const mongoose = require("mongoose"),
  dbURI = require("../config/db");

mongoose.set("useFindAndModify", false);

mongoose.Promise = global.Promise;

mongoose.connect(dbURI.url, {
  user: dbURI.user,
  pass: dbURI.password,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

//connection events
mongoose.connection.on("connected", function() {
  console.log("Mongoose default connection open to " + dbURI.url);
});
// If the connection throws an error
mongoose.connection.on("error", function(err) {
  console.log("Mongoose default connection error: " + err);
});
// When the connection is disconnected
mongoose.connection.on("disconnected", function() {
  console.log("Mongoose default connection disconnected");
});
// If the Node process ends, close the Mongoose connection
process.on("SIGINT", function() {
  mongoose.connection.close(function() {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});
