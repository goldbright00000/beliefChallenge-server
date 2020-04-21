"use strict";

//** You have to define each new route in this file like below given example **//

const routes = {
  AuthRoute: require('./authentication/autehnticationRoute'),
  CategoryRoute : require('./category/categoryRoute'),
  PostRoute: require('./post/postRoute'),
  CommentRoute : require('./comment/commentRoute'),
  SearchRoute : require('./search/searchRoute'),
  VisitorCountRoute : require('./visitorcount/visitorcountRoute'),
  UserRoute : require('./user/userRoute'),
  UserLikeRoute : require('./like/likeRoute')
  // ControlSettingRoute: require('./authentication/controlSettingRoute')
};
module.exports = function(app) {
  for (let i in routes) {
    routes[i](app);
  }
};
