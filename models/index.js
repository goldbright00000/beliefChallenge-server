
/* ----------------------------- REQUIRE MODEL JS FILES HERE --------------------------------- */

//***You have to define each new model in this file like below example.***//

let loginModel = require("./authentication/loginSchema"),
  userModel = require("./authentication/userSchema"),
  activityLogModel =  require('./activityLog/activityLogSchema'),
  categoryModel = require('./category/categorySchema'),
  postModel =  require('./post/postSchema'),
  verificationModel =  require('./authentication/verificationSchema'),
  commentModel = require('./comment/commentSchema'),
  visitorCountModel = require('./visitorcount/visitorCountSchema'),
  userLikeModel = require('./userlikes/userLikesSchema'),
  socialAuthModel = require('./authentication/socialAuthSchema');

