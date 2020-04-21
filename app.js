

/*--------------------INCLUDE PACKAGES--------------------*/

require("module-alias/register");

let 
  bodyParser = require("body-parser"),
  path = require("path"),
  cookieParser = require("cookie-parser"),
  logger = require("morgan"),
  globalVariables = require("./config/globalVariables"),
  express = globalVariables.express,
  cache = require("./helpers/util-Cache"),
  app = globalVariables.app;


/*--------------------MODELS REGISTER--------------------*/

const models = require("./models/index");

/*--------------------GENERAL MIDDLEWARE--------------------*/

//To prevent attackers from reading this header (which is enabled by default) to detect apps running express
app.disable("x-powered-by");

// view engine setup
global.base = path.join(__dirname + "/");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res, next) {
  global.env = req.app.get("env");
  res.send("Server is started");
});

/*--------------------MONGOOSE CONNECTION--------------------*/

require("./bin/database");

/*-----------------------RESTORE CACHE------------------*/

cache.restoreCache();

/*--------------------ROUTES CONFIG--------------------*/

var router = express.Router();
app.use("/v1", router);
// res.header("Access-Control-Allow-Origin", "*");
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST,OPTIONS, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept, Cache-Control"
  );

  var ip = req.headers["x-forwarded-for"]
    ? req.headers["x-forwarded-for"]
    : req.socket.remoteAddress;
  req.userIp = ip.substr(ip.lastIndexOf(":") + 1);
  req.userIp = req.userIp === (1 || "127.0.0.1") ? "" : req.userIp;

  next();
});

setTimeout(() => {
  require("./routes/index")(router); //importing route
}, 1000);

module.exports = app;